import { ReactNode } from "react";

export function AuthTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-2xl text-center font-semibold leading-none tracking-tight mb-6">
      {children}
    </h1>
  );
}
