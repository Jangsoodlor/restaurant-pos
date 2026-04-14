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
(__window as any).SyntaxError = SyntaxError;
globalThis.SyntaxError = SyntaxError;

if (!globalThis.document.body) {
  const body = globalThis.document.createElement('body');
  globalThis.document.appendChild(body);
}

import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';
import { TableStatus } from '../tableStatus';

mock.module('@/hooks/useTable', () => ({
  useTables: () => ({
    data: [{ id: 1, tableName: 'A1', capacity: 4, status: 'available' }],
    isPending: false,
    error: null,
  }),
  useCreateTable: () => ({ mutateAsync: async () => ({}), isPending: false, error: null }),
  useUpdateTable: () => ({ mutateAsync: async () => ({}), isPending: false, error: null }),
  useDeleteTable: () => ({ mutateAsync: async () => ({}), isPending: false, error: null }),
}));

function createTestToken(role: 'manager' | 'waiter' | 'cook'): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: '1', name: 'test', role }));
  return `${header}.${payload}.sig`;
}

describe('TableStatus RBAC', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('manager sees create button and action menu', () => {
    localStorage.setItem('auth_token', createTestToken('manager'));

    const { getByText, getByLabelText } = render(
      <AuthProvider>
        <TableStatus />
      </AuthProvider>
    );

    expect(getByText('+ Create Table')).toBeTruthy();
    expect(getByLabelText('Table actions for A1')).toBeTruthy();
  });

  it('waiter cannot create and cannot see delete action', () => {
    localStorage.setItem('auth_token', createTestToken('waiter'));

    const { queryByText, getByLabelText } = render(
      <AuthProvider>
        <TableStatus />
      </AuthProvider>
    );

    expect(queryByText('+ Create Table')).toBeNull();

    const actionButton = getByLabelText('Table actions for A1') as HTMLButtonElement;
    fireEvent.click(actionButton);

    const details = actionButton.closest('details');
    const menuButtons = details?.querySelectorAll('menu button') ?? [];
    expect(menuButtons.length).toBe(1);
    expect((menuButtons[0] as HTMLButtonElement).textContent).toContain('edit');
  });

  it('cook sees read-only table with no action menu and no create button', () => {
    localStorage.setItem('auth_token', createTestToken('cook'));

    const { queryByText, queryByLabelText, getByText } = render(
      <AuthProvider>
        <TableStatus />
      </AuthProvider>
    );

    expect(queryByText('+ Create Table')).toBeNull();
    expect(queryByLabelText('Table actions for A1')).toBeNull();
    expect(getByText(/Table A1/)).toBeTruthy();
  });
});
