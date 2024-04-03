import type { PropsWithChildren } from "react";

export function CustomCardHeader({ children }: PropsWithChildren) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-accent rounded-t-md">
      {children}
    </div>
  );
}
