// src/App.tsx
import { useEffect } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import { TableStatus } from '@/pages/tableStatus';
import { Home } from '@/pages/Home'
import UserManagementPage from '@/pages/User';
import ViewOrder from '@/pages/viewOrder';
import CreateOrder from '@/pages/createOrder';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { useAuth } from '@/hooks/useAuth';
import { canAccessPage } from '@/utils/permissions';
import { ui } from "beercss";

function AccessDenied() {
  return (
    <>
      <h5>Access Denied</h5>
      <p>Please <Link href="/login">Login</Link> or <Link href="/register">Register</Link> to continue.</p>
    </>
  );
}

export function App() {
  const [location, navigate] = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    ui();
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header>
        <nav>
          <h5 className="max">Restaurant POS</h5>
          {isAuthenticated ? (
            <>
              <Link className={`button transparent ${location === "/" ? "active" : ""}`} href="/">
                Home
              </Link>
              <Link className={`button transparent ${location === "/tables" ? "active" : ""}`} href="/tables">
                Table Status
              </Link>
              {canAccessPage('user', user?.role ?? null) && (
                <Link className={`button transparent ${location === "/user" ? "active" : ""}`} href="/user">
                  User Management
                </Link>
              )}
              <Link className={`button transparent ${location === "/menu" ? "active" : ""}`} href="/menu">
                Menu
              </Link>
              <Link className={`button transparent ${location === "/orders" ? "active" : ""}`} href="/orders">
                Orders
              </Link>
              <button className="button transparent" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className={`button transparent ${location === "/login" ? "active" : ""}`} href="/login">
                Login
              </Link>
              <Link className={`button transparent ${location === "/register" ? "active" : ""}`} href="/register">
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="responsive">
        <article className="round border">
          <Switch>
            {/* Public routes */}
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />

            {/* Protected routes */}
            <Route path="/" component={isAuthenticated ? Home : AccessDenied} />
            <Route path="/tables" component={isAuthenticated ? TableStatus : AccessDenied} />
            <Route path="/user" component={isAuthenticated && canAccessPage('user', user?.role ?? null) ? UserManagementPage : AccessDenied} />
            <Route path="/menu" component={isAuthenticated ? require('./pages/Menu').default : AccessDenied} />
            <Route path="/orders/create" component={isAuthenticated ? CreateOrder : AccessDenied} />
            <Route path="/orders" component={isAuthenticated ? ViewOrder : AccessDenied} />

            <Route>
              <h5>404 - Page Not Found</h5>
            </Route>
          </Switch>
        </article>
      </main>
    </>
  );
}