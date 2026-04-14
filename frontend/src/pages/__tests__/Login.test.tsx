import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from '@/pages/Login';
import { AuthProvider } from '@/context/AuthContext';
import { LocationProvider } from 'wouter';

// Mock the API client
mock.module('@/api/client', () => ({
  userApiClient: {
    loginUserUserLoginPost: mock(),
  },
}));

describe('Login Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders login form with username and password fields', () => {
    render(
      <AuthProvider>
        <LocationProvider>
          <Login />
        </LocationProvider>
      </AuthProvider>
    );

    expect(screen.getByText('Login')).toBeDefined();
    expect(screen.getByLabelText('Username')).toBeDefined();
    expect(screen.getByLabelText('Password')).toBeDefined();
    expect(screen.getByText('Login')).toBeDefined();
  });

  it('displays register link', () => {
    render(
      <AuthProvider>
        <LocationProvider>
          <Login />
        </LocationProvider>
      </AuthProvider>
    );

    const registerLink = screen.getByText('Register here');
    expect(registerLink.getAttribute('href')).toBe('/register');
  });

  it('updates input values on user input', () => {
    render(
      <AuthProvider>
        <LocationProvider>
          <Login />
        </LocationProvider>
      </AuthProvider>
    );

    const usernameInput = screen.getByDisplayValue('') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  it('disables submit button while loading', async () => {
    render(
      <AuthProvider>
        <LocationProvider>
          <Login />
        </LocationProvider>
      </AuthProvider>
    );

    const submitButton = screen.getByText('Login') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton.textContent).toContain('Logging in');
    });
  });
});
