import { createFileRoute, redirect } from "@tanstack/react-router";
import Register from "../features/auth/pages/Register";

export const Route = createFileRoute("/register")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: Register,
});
