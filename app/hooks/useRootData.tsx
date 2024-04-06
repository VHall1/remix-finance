import { useRouteLoaderData } from "@remix-run/react";
import { loader } from "~/root";

export const useRootData = () => useRouteLoaderData<typeof loader>("root")!;

export function useUser() {
  const { user } = useRootData();
  if (!user) throw new Error("User is required when using useUser");
  return user;
}

export function useOptionalUser() {
  const { user } = useRootData();
  return user;
}
