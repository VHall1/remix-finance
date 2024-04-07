import { Link } from "@remix-run/react";
import { BarChartHorizontal, Terminal } from "lucide-react";
import { type PropsWithChildren } from "react";
import { Navbar } from "~/components/navbar";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { useRootData } from "~/hooks/useRootData";
import { handle as transactionsHandle } from "~/routes/transactions._index";

export function Shell({ children }: PropsWithChildren) {
  const { flash } = useRootData();

  return (
    <div className="lg:grid h-screen [grid-template-columns:minmax(max-content,12.8125rem)_1fr] [grid-template-rows:max-content_max-content_1fr] [grid-template-areas:'logo_header''aside_flash''aside_main']">
      <Link
        to="/"
        className="[grid-area:logo] hidden lg:flex items-center border-b border-r bg-muted/40 px-6 font-semibold"
      >
        <BarChartHorizontal className="h-6 w-6 mr-2" />
        Remix Finance
      </Link>
      <Navbar />
      <nav className="hidden lg:grid items-start px-4 text-sm font-medium border-r bg-muted/40 [grid-area:aside]">
        <div className="flex-1 overflow-auto py-2">
          <Link
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            to={transactionsHandle.path()}
          >
            <BarChartHorizontal className="h-4 w-4" />
            Transactions
          </Link>
        </div>
      </nav>
      {flash ? (
        <div className="pt-6 container [grid-area:flash]">
          <Alert variant={flash.error ? "destructive" : "default"}>
            <Terminal className="h-4 w-4" />
            <AlertTitle>{flash.title}</AlertTitle>
            <AlertDescription>{flash.description}</AlertDescription>
          </Alert>
        </div>
      ) : null}
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 [grid-area:main]">
        {children}
      </main>
    </div>
  );
}
