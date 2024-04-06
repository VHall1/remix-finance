import { Link } from "@remix-run/react";
import { ArrowLeftIcon } from "lucide-react";
import { PropsWithChildren } from "react";
import { Button } from "~/components/ui/button";

export function TransactionsHeader({
  path,
  title,
  children,
}: PropsWithChildren<TransactonsHeaderProps>) {
  return (
    <div className="flex items-center gap-4">
      <Button size="icon" variant="outline" asChild>
        <Link to={path}>
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Link>
      </Button>
      <h1 className="font-semibold text-lg md:text-xl">{title}</h1>
      {children}
    </div>
  );
}

interface TransactonsHeaderProps {
  path: string;
  title: string;
}
