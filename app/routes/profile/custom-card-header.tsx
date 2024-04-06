import type { PropsWithChildren } from "react";

export function CustomCardHeader({ children }: PropsWithChildren) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-muted/50 rounded-t-md">
      {children}
    </div>
  );
}
