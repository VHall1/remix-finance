import { useRouteLoaderData } from "@remix-run/react";
import { handle, loader } from "../root";

export const useRootData = () => useRouteLoaderData<typeof loader>(handle.id);

export function useUser() {
  const user = useRootData();
  if (!user) throw new Error("User is required when using useUser");
  return user;
}

export function useOptionalUser() {
  const user = useRootData();
  return user;
}
