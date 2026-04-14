import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import 'happy-dom';
import { Window } from 'happy-dom';

const __window = new Window({ url: 'http://localhost/' });
globalThis.window = __window as any;
globalThis.document = __window.document as any;
globalThis.HTMLElement = __window.HTMLElement as any;
globalThis.localStorage = __window.localStorage as any;
globalThis.location = __window.location as any;
globalThis.history = __window.history as any;
globalThis.getComputedStyle = __window.getComputedStyle as any;
globalThis.requestAnimationFrame = __window.requestAnimationFrame as any;
(__window as any).SyntaxError = SyntaxError;
globalThis.SyntaxError = SyntaxError;

if (!globalThis.document.body) {
  const body = globalThis.document.createElement('body');
  globalThis.document.appendChild(body);
}

import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';

mock.module('beercss', () => ({
  ui: () => {},
}));

mock.module('@/pages/User', () => ({
  __esModule: true,
  default: () => <div>User Management Page</div>,
}));

mock.module('@/pages/viewOrder', () => ({
  __esModule: true,
  default: () => <div>Orders Page</div>,
}));

mock.module('@/pages/createOrder', () => ({
  __esModule: true,
  default: () => <div>Create Order Page</div>,
}));

mock.module('@/pages/Login', () => ({
  Login: () => <div>Login Page</div>,
}));

mock.module('@/pages/Register', () => ({
  Register: () => <div>Register Page</div>,
}));

function createTestToken(role: 'manager' | 'waiter' | 'cook'): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: '1', name: 'test', role }));
  return `${header}.${payload}.sig`;
}

async function renderAt(pathname: string, role: 'manager' | 'waiter' | 'cook') {
  localStorage.clear();
  localStorage.setItem('auth_token', createTestToken(role));
  window.history.pushState({}, '', pathname);

  const { App } = await import('@/App');

  return render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

describe('App RBAC Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  afterEach(() => {
    cleanup();
  });

  it('shows User Management nav link for manager', async () => {
    const utils = await renderAt('/', 'manager');
    expect(utils.getByText('User Management')).toBeTruthy();
  });

  it('hides User Management nav link for waiter', async () => {
    const utils = await renderAt('/', 'waiter');
    expect(utils.queryByText('User Management')).toBeNull();
  });

  it('shows access denied for waiter visiting /user directly', async () => {
    const utils = await renderAt('/user', 'waiter');
    expect(utils.getByText('Access Denied')).toBeTruthy();
  });

  it('renders User Management page for manager visiting /user', async () => {
    const utils = await renderAt('/user', 'manager');
    expect(utils.getByText('User Management Page')).toBeTruthy();
  });
});
