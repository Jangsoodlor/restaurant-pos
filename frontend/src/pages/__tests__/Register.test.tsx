import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Register } from '@/pages/Register';
import { AuthProvider } from '@/context/AuthContext';

// Mock the API client
mock.module('@/api/client', () => ({
  userApiClient: {
    registerUserUserRegisterPost: mock(),
    loginUserUserLoginPost: mock(),
  },
}));

describe('Register Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders registration form with all fields', () => {
    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );

    expect(screen.getByText('Create Account')).toBeDefined();
    expect(screen.getByLabelText('Username')).toBeDefined();
    expect(screen.getByLabelText('Password')).toBeDefined();
    expect(screen.getByLabelText('Role')).toBeDefined();
    expect(screen.getByText('Register')).toBeDefined();
  });

  it('displays login link', () => {
    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );

    const loginLink = screen.getByText('Login here');
    expect(loginLink.getAttribute('href')).toBe('/login');
  });

  it('provides role options', () => {
    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );

    const roleSelect = screen.getByLabelText('Role') as HTMLSelectElement;
    expect(roleSelect.options.length).toBe(3);
    expect(roleSelect.options.item(0)?.text).toBe('Waiter');
    expect(roleSelect.options.item(1)?.text).toBe('Cook');
    expect(roleSelect.options.item(2)?.text).toBe('Manager');
  });

  it('updates input values on user input', () => {
    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );

    const usernameInput = screen.getByDisplayValue('') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const roleSelect = screen.getByLabelText('Role') as HTMLSelectElement;

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(roleSelect, { target: { value: 'cook' } });

    expect(usernameInput.value).toBe('newuser');
    expect(passwordInput.value).toBe('password123');
    expect(roleSelect.value).toBe('cook');
  });

  it('disables submit button while loading', async () => {
    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );

    const submitButton = screen.getByText('Register') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton.textContent).toContain('Creating Account');
    });
  });

  it('enforces username max length', () => {
    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );

    const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
    expect(usernameInput.maxLength).toBe(50);
  });
});
