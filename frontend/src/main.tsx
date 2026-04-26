import "./index.css";
import { routeTree } from "./routeTree.gen";
import ReactDOM from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "./features/auth/contexts/auth.provider";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>,
  );
}
