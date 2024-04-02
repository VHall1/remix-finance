import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Outlet />
    </div>
  );
}
