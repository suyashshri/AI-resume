import { createFileRoute, redirect } from "@tanstack/react-router";
import VerifyOtp from "../features/auth/pages/VerifyOtp";

export const Route = createFileRoute("/verify-otp")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: (search.email as string) ?? "",
  }),
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: VerifyOtp,
});
