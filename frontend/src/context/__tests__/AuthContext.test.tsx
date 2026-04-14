import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ReactNode } from 'react';

// Test component that uses the auth context
function TestComponent() {
  const { token, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <p data-testid="token">Token: {token || 'null'}</p>
      <p data-testid="isAuth">Authenticated: {isAuthenticated ? 'true' : 'false'}</p>
      <button onClick={() => login('test-token-123')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('provides auth context to wrapped components', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const token = screen.getByTestId('token');
    const isAuth = screen.getByTestId('isAuth');

    expect(token.textContent).toContain('Token: null');
    expect(isAuth.textContent).toContain('Authenticated: false');
  });

  it('stores token in localStorage on login', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    expect(localStorage.getItem('auth_token')).toBe('test-token-123');
  });

  it('removes token from localStorage on logout', () => {
    localStorage.setItem('auth_token', 'existing-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('restores token from localStorage on mount', () => {
    localStorage.setItem('auth_token', 'persisted-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const token = screen.getByTestId('token');
    expect(token.textContent).toContain('persisted-token');
  });
});
