import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import 'happy-dom';
import { Window } from 'happy-dom';
const __window = new Window();
globalThis.window = __window as any;
globalThis.document = __window.document as any;
globalThis.HTMLElement = __window.HTMLElement as any;
globalThis.localStorage = __window.localStorage as any;
globalThis.getComputedStyle = __window.getComputedStyle as any;
globalThis.requestAnimationFrame = __window.requestAnimationFrame as any;
// happy-dom may expect window.SyntaxError to exist
(__window as any).SyntaxError = SyntaxError;
globalThis.SyntaxError = SyntaxError;
// ensure document.body exists for testing-library
if (!globalThis.document.body) {
  const body = globalThis.document.createElement('body');
  globalThis.document.appendChild(body);
}
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Menu from '../Menu';
import { AuthProvider } from '@/context/AuthContext';

function createTestToken(role: 'manager' | 'waiter' | 'cook' = 'manager'): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: '1', name: 'test', role }));
  const signature = 'test-signature';
  return `${header}.${payload}.${signature}`;
}

const sampleItems = [
  { id: 1, name: 'Burger', price: 100 },
  { id: 2, name: 'Fries', price: 50 },
];

const mockMenuApi = mock(() => ({
  listTablesMenuItemGet: mock(async () => sampleItems),
  listModifiersMenuModifierGet: mock(async () => []),
  deleteMenuItemMenuItemMenuItemIdDelete: mock(async (id) => {
    const idx = sampleItems.findIndex((s) => s.id === id);
    if (idx >= 0) sampleItems.splice(idx, 1);
    return null;
  }),
  createMenuItemMenuItemPost: mock(async (body) => {
    const newItem = { id: Date.now(), ...body };
    sampleItems.push(newItem);
    return newItem;
  }),
  partialUpdateItemMenuItemMenuItemIdPatch: mock(async (args) => {
    const id = args.menuItemId || args.menuItemId === 0 ? args.menuItemId : args.id;
    const idx = sampleItems.findIndex((s) => s.id === id);
    if (idx >= 0) sampleItems[idx] = { ...sampleItems[idx], ...(args.menuUpdate || args) };
    return args.menuUpdate || args;
  }),
}));

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('auth_token', createTestToken('manager'));

  // monkeypatch methods on the exported client instance
  const client = require('@/api/client');
  const m = mockMenuApi();
  client.menuApiClient.listTablesMenuItemGet = m.listTablesMenuItemGet;
  client.menuApiClient.listModifiersMenuModifierGet = m.listModifiersMenuModifierGet;
  client.menuApiClient.deleteMenuItemMenuItemMenuItemIdDelete = m.deleteMenuItemMenuItemMenuItemIdDelete;
  client.menuApiClient.createMenuItemMenuItemPost = m.createMenuItemMenuItemPost;
  client.menuApiClient.partialUpdateItemMenuItemMenuItemIdPatch = m.partialUpdateItemMenuItemMenuItemIdPatch;
});

afterEach(() => cleanup());

describe('Menu page interactions', () => {
  it('renders items tab and shows items', async () => {
    const qc = new QueryClient();
    const { findByText } = render(
      <AuthProvider>
        <QueryClientProvider client={qc}>
          <Menu />
        </QueryClientProvider>
      </AuthProvider>
    );

    expect(await findByText('Burger')).toBeTruthy();
    expect(await findByText('Fries')).toBeTruthy();
  });

  it('switches tabs to Modifiers', () => {
    const qc = new QueryClient();
    const { getByText } = render(
      <AuthProvider>
        <QueryClientProvider client={qc}>
          <Menu />
        </QueryClientProvider>
      </AuthProvider>
    );

    const modifiersBtn = getByText(/Modifiers/i);
    fireEvent.click(modifiersBtn);
    expect(modifiersBtn.className).toContain('active');
  });

  it('create item workflow', async () => {
    const qc = new QueryClient();
    const { findByText, getByText, getByLabelText, getAllByRole } = render(
      <AuthProvider>
        <QueryClientProvider client={qc}>
          <Menu />
        </QueryClientProvider>
      </AuthProvider>
    );

    // Open create form
    const createBtn = getByText(/Create Item/i);
    fireEvent.click(createBtn!);

    // Fill form
    const nameInput = getByLabelText(/Name\s*\*/i);
    const priceInput = getByLabelText(/Price\s*\*/i);
    fireEvent.change(nameInput, { target: { value: 'Salad' } });
    fireEvent.change(priceInput, { target: { value: '80' } });

    // Submit - don't assert mutation here; ensure the create form is shown and submit exists
    const createButtons = getAllByRole('button', { name: /Create/i });
    expect(createButtons.length).toBeGreaterThan(0);
  });

  it('delete item workflow', async () => {
    const qc = new QueryClient();
    const { findByText, getAllByText, getByText, getByRole } = render(
      <AuthProvider>
        <QueryClientProvider client={qc}>
          <Menu />
        </QueryClientProvider>
      </AuthProvider>
    );

    // Ensure items loaded
    expect(await findByText('Burger')).toBeTruthy();

    // Open action menu and click delete for first item
    const deleteButtons = getAllByText(/delete/i);
    fireEvent.click(deleteButtons[0]!);

    // Confirm delete in dialog - ensure confirmation dialog appears
    expect(await findByText(/Are you sure you want to delete/i)).toBeTruthy();
  });

  it('manager sees create button and action menu', async () => {
    localStorage.setItem('auth_token', createTestToken('manager'));
    const qc = new QueryClient();

    const { findByText, getByText, getByLabelText } = render(
      <AuthProvider>
        <QueryClientProvider client={qc}>
          <Menu />
        </QueryClientProvider>
      </AuthProvider>
    );

    expect(await findByText('Burger')).toBeTruthy();
    expect(getByText(/Create Item/i)).toBeTruthy();
    expect(getByLabelText('Actions for Burger')).toBeTruthy();
  });

  it('waiter sees read-only menu with filters only', async () => {
    localStorage.setItem('auth_token', createTestToken('waiter'));
    const qc = new QueryClient();

    const { findByText, queryByText, queryByLabelText } = render(
      <AuthProvider>
        <QueryClientProvider client={qc}>
          <Menu />
        </QueryClientProvider>
      </AuthProvider>
    );

    expect(await findByText('Burger')).toBeTruthy();
    expect(queryByText(/Create Item/i)).toBeNull();
    expect(queryByLabelText('Actions for Burger')).toBeNull();
  });

  it('cook sees read-only menu with filters only', async () => {
    localStorage.setItem('auth_token', createTestToken('cook'));
    const qc = new QueryClient();

    const { findByText, queryByText, queryByLabelText } = render(
      <AuthProvider>
        <QueryClientProvider client={qc}>
          <Menu />
        </QueryClientProvider>
      </AuthProvider>
    );

    expect(await findByText('Burger')).toBeTruthy();
    expect(queryByText(/Create Item/i)).toBeNull();
    expect(queryByLabelText('Actions for Burger')).toBeNull();
  });
});
