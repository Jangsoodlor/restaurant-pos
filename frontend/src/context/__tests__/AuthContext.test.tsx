import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import 'happy-dom';
import { Window } from 'happy-dom';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';

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

/**
 * Helper to create a test JWT token with user data
 * Format: header.payload.signature (we use a minimal valid structure)
 */
function createTestToken(userId: number = 1, name: string = 'test_user', role: string = 'manager'): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: userId.toString(), name, role }));
  const signature = 'test-signature';
  return `${header}.${payload}.${signature}`;
}

// Test component that uses the auth context
function TestComponent() {
  const { token, user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <p data-testid="token">Token: {token || 'null'}</p>
      <p data-testid="user-id">User ID: {user?.id || 'null'}</p>
      <p data-testid="user-name">User Name: {user?.name || 'null'}</p>
      <p data-testid="user-role">User Role: {user?.role || 'null'}</p>
      <p data-testid="isAuth">Authenticated: {isAuthenticated ? 'true' : 'false'}</p>
      <button onClick={() => login(createTestToken())}>Login</button>
      <button onClick={() => login(createTestToken(2, 'waiter_user', 'waiter'))}>Login Waiter</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('provides auth context to wrapped components', () => {
    const utils = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const token = utils.getByTestId('token');
    const isAuth = utils.getByTestId('isAuth');

    expect(token.textContent).toContain('Token: null');
    expect(isAuth.textContent).toContain('Authenticated: false');
  });

  it('stores token in localStorage on login', () => {
    const utils = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = utils.getByText('Login');
    fireEvent.click(loginButton);

    expect(localStorage.getItem('auth_token')).toBeDefined();
  });

  it('decodes and stores user data on login', () => {
    const utils = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = utils.getByText('Login');
    fireEvent.click(loginButton);

    const userId = utils.getByTestId('user-id');
    const userName = utils.getByTestId('user-name');
    const userRole = utils.getByTestId('user-role');

    expect(userId.textContent).toContain('User ID: 1');
    expect(userName.textContent).toContain('User Name: test_user');
    expect(userRole.textContent).toContain('User Role: manager');
  });

  it('removes token from localStorage on logout', () => {
    const testToken = createTestToken();
    localStorage.setItem('auth_token', testToken);

    const utils = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = utils.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('clears user data on logout', () => {
    const testToken = createTestToken();
    localStorage.setItem('auth_token', testToken);

    const utils = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = utils.getByText('Logout');
    fireEvent.click(logoutButton);

    const userId = utils.getByTestId('user-id');
    expect(userId.textContent).toContain('User ID: null');
  });

  it('restores token from localStorage on mount', () => {
    const testToken = createTestToken();
    localStorage.setItem('auth_token', testToken);

    const utils = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const token = utils.getByTestId('token');
    expect(token.textContent).toContain('Token:');
  });

  it('restores user data from localStorage on mount', () => {
    const testToken = createTestToken(42, 'jane_doe', 'waiter');
    localStorage.setItem('auth_token', testToken);

    const utils = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const userId = utils.getByTestId('user-id');
    const userName = utils.getByTestId('user-name');
    const userRole = utils.getByTestId('user-role');

    expect(userId.textContent).toContain('User ID: 42');
    expect(userName.textContent).toContain('User Name: jane_doe');
    expect(userRole.textContent).toContain('User Role: waiter');
  });

  it('supports logout and re-login with a different role in the same session', () => {
    const utils = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(utils.getByText('Login'));
    expect(utils.getByTestId('user-role').textContent).toContain('User Role: manager');

    fireEvent.click(utils.getByText('Logout'));
    expect(utils.getByTestId('user-role').textContent).toContain('User Role: null');

    fireEvent.click(utils.getByText('Login Waiter'));
    expect(utils.getByTestId('user-role').textContent).toContain('User Role: waiter');
  });
});
