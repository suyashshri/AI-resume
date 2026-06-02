import { createFileRoute, redirect } from "@tanstack/react-router";
import Dashboard from "../features/dashboard/pages/Dashboard";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: Dashboard,
});
