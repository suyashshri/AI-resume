import { createFileRoute, redirect } from "@tanstack/react-router";
import Landing from "../features/landing/pages/Landing";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: Landing,
});
