import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const RootLayout = () => (
  <>
    {/* <div className="p-2 flex gap-2">
      <Link to="/login" className="[&.active]:font-bold">
        Login
      </Link>
      <Link to="/register" className="[&.active]:font-bold">
        Register
      </Link>
    </div>
    <hr /> */}
    <Outlet />
    <TanStackRouterDevtools />
  </>
);
