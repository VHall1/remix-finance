import { Link } from "@remix-run/react";
import { BarChartHorizontal } from "lucide-react";
import type { PropsWithChildren } from "react";
import { Navbar } from "./navbar";
import { handle as transactionsHandle } from "~/routes/transactions._index";
import { handle as rootHandle } from "~/root";

export function Shell({ children }: PropsWithChildren) {
  return (
    <div className="grid h-screen [grid-template-columns:minmax(max-content,12.8125rem)_1fr] [grid-template-rows:max-content_max-content_1fr_max-content] [grid-template-areas:'logo_header''aside_main']">
      <Link
        to={rootHandle.path()}
        className="border-b border-r bg-gray-100/40 px-6 dark:bg-gray-800/40 [grid-area:logo] flex items-center gap-2 font-semibold"
      >
        <BarChartHorizontal className="h-6 w-6" />
        Remix Finance
      </Link>
      <Navbar />
      <nav className="grid items-start px-4 text-sm font-medium h-screen border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 [grid-area:aside]">
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
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 [grid-area:main]">
        {children}
      </main>
    </div>
  );
}
