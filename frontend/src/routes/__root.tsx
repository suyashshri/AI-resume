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
});
