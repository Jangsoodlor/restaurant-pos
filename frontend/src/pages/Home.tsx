import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';

function parseJwt(token: string | null) {
  if (!token) return null;
  try {
    const payload = token.split('.')[1] || "";
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(decodeURIComponent(Array.prototype.map.call(atob(base64), function (c: string) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')));
    return json;
  } catch (e) {
    return null;
  }
}

export function Home() {
  const { token } = useAuth();

  const user = useMemo(() => parseJwt(token), [token]);

  const name = user?.name || user?.sub || 'Guest';
  const role = user?.role || (user?.roles && user.roles[0]) || '—';

  return (
    <section>
      <h4>Welcome</h4>
      <div style={{ marginTop: 8 }}>
        <strong>User:</strong> {name} {' '}
        <strong style={{ marginLeft: 12 }}>Role:</strong> {role}
      </div>
    </section>
  )
}
