import { ReactNode } from "react";

export function AuthTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-2xl font-semibold leading-none tracking-tight mb-4">
      {children}
    </h1>
  );
}
