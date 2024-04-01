import { useContext } from "react";
import { AuthContext } from "~/context/auth";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth hook must be used within a AuthProvider");
  }
  return ctx;
}
