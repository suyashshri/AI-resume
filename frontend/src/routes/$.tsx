import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
  component: () => (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-foreground">
      <h1 className="text-6xl font-black text-primary">404</h1>
      <p className="text-muted-foreground">This page doesn't exist.</p>
      <a href="/" className="btn-primary px-6 py-2 rounded-full text-sm w-auto">
        Go Home
      </a>
    </div>
  ),
});
