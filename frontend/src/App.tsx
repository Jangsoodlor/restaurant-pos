// src/App.tsx
import { Link, Route, Switch } from 'wouter';
import { TableStatus } from '@/pages/tableStatus';
import { Home } from '@/pages/Home'

export function App() {
  return (
    <div>
      {/* A simple navigation menu */}
      <nav>
        {/* Note: Wouter uses 'href' instead of 'to' */}
        <Link href="/">
          Home (API Tester)
        </Link>
        <Link href="/tables">
          Table Status
        </Link>
      </nav>

      {/* The Switch ensures only the first matching route is rendered */}
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/tables" component={TableStatus} />

          {/* Default fallback route if nothing matches (404) */}
          <Route>
            <h2>404 - Page Not Found</h2>
          </Route>
        </Switch>
      </main>
    </div>
  );
}