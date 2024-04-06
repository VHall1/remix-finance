import { Outlet, useMatches } from "@remix-run/react";
import { Shell } from "~/components/shell";

export default function Transactions() {
  const matches = useMatches();
  const match = matches[matches.length - 1];
  const header =
    match.handle && typeof match.handle === "object" && "header" in match.handle
      ? match.handle.header
      : null;

  return (
    <Shell>
      {typeof header === "function" ? header() : null}
      <Outlet />
    </Shell>
  );
}
