import { createRootRouteWithContext } from "@tanstack/react-router";
import { RootLayout } from "../features/landing/pages/root-layout";

interface RouterContext {
  auth: {
    isAuthenticated: boolean;
    user: { id: string; username: string; email: string } | null;
  };
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-black text-primary">404</h1>
      <p className="text-muted-foreground">This page doesn't exist.</p>
      <a href="/" className="text-primary underline text-sm">
        Go Home
      </a>
    </div>
  ),
});
