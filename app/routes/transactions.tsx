import { Link, Outlet } from "@remix-run/react";
import { ArrowLeftIcon } from "lucide-react";
import { Shell } from "~/components/shell";
import { Button } from "~/components/ui/button";
import { handle as newTransactionHandle } from "./transactions_.new";

export default function Transactions() {
  return (
    <Shell>
      <div className="flex items-center gap-4">
        <Button size="icon" variant="outline" asChild>
          <Link to="/">
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="font-semibold text-lg md:text-xl">Transactions</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild>
            <Link to={newTransactionHandle.path()}>New transaction</Link>
          </Button>
        </div>
      </div>
      <Outlet />
    </Shell>
  );
}

// <Button className="hidden sm:flex" variant="outline">
//   Today
// </Button>
// <Button className="hidden md:flex" variant="outline">
//   This Month
// </Button>
// <Popover>
//   <PopoverTrigger asChild>
//     <Button
//       className="w-[280px] justify-start text-left font-normal"
//       id="date"
//       variant="outline"
//     >
//       <CalendarClockIcon className="mr-2 h-4 w-4" />
//       June 01, 2023 - June 30, 2023
//     </Button>
//   </PopoverTrigger>
//   <PopoverContent align="end" className="w-auto p-0">
//     {/* <Calendar initialFocus mode="range" numberOfMonths={2} /> */}
//   </PopoverContent>
// </Popover>
