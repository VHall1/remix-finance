import { ReactNode } from "react";

declare global {
  // These have to all be optional!
  type Handle = Partial<{
    pageHeader: () => ReactNode;
  }>;
}

export {};
