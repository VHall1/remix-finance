import { ComponentProps } from "react";
import { Card } from "~/components/ui/card";
import { cn } from "~/utils";

export function AuthCard({
  children,
  className,
  ...props
}: ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn("w-[28rem] max-w-[calc(100%-2rem)]", className)}
      {...props}
    >
      {children}
    </Card>
  );
}
