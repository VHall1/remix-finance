import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="h-screen flex flex-col justify-center w-full max-w-md mx-auto">
      <Outlet />
    </div>
  );
}
