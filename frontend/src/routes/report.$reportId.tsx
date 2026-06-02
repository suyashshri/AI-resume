import { createFileRoute, redirect } from "@tanstack/react-router";
import Report from "../features/dashboard/pages/Report";

export const Route = createFileRoute("/report/$reportId")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: Report,
});
