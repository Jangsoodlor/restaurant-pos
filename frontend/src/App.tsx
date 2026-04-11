// src/App.tsx
import { useEffect } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import { TableStatus } from '@/pages/tableStatus';
import { Home } from '@/pages/Home'
import { ui } from "beercss";

export function App() {
  const [location] = useLocation();

  useEffect(() => {
    ui();
  }, [location]);

  return (
    <>
      <header>
        <nav>
          <h5 className="max">Restaurant POS</h5>
          <Link className={`button transparent ${location === "/" ? "active" : ""}`} href="/">
            Home
          </Link>
          <Link className={`button transparent ${location === "/tables" ? "active" : ""}`} href="/tables">
            Table Status
          </Link>
        </nav>
      </header>

      <main className="responsive">
        <article className="round border">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/tables" component={TableStatus} />

            <Route>
              <h5>404 - Page Not Found</h5>
            </Route>
          </Switch>
        </article>
      </main>
    </>
  );
}