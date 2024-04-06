import { Outlet } from "@remix-run/react";
import { Shell } from "~/components/shell";

export default function Transactions() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}
