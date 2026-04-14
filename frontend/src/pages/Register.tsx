import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { userApiClient } from '@/api/client';
import type { Role } from '@/api/stub/models';

export function Register() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('waiter');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Register user
      await userApiClient.registerUserUserRegisterPost({
        userCreate: { name, password, role },
      });

      // Log in immediately after registration
      const loginResponse = await userApiClient.loginUserUserLoginPost({
        userLogin: { name, password },
      });

      // Save token and update auth context
      login(loginResponse.accessToken);

      // Redirect to home
      navigate('/');
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        err?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="round border">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Username</label>
          <input
            id="name"
            type="text"
            placeholder="Choose a username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            maxLength={50}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            disabled={loading}
          >
            <option value="waiter">Waiter</option>
            <option value="cook">Cook</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        {error && (
          <p style={{ color: 'var(--form-element-invalid-border-color)' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p>
        Already have an account?{' '}
        <a href="/login" style={{ cursor: 'pointer' }}>
          Login here
        </a>
      </p>
    </article>
  );
}
