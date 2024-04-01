import { Link } from "@remix-run/react";
import { ArrowLeftIcon, CalendarClockIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export default function Transactions() {
  return (
    <div className="flex items-center gap-4">
      <Button size="icon" variant="outline" asChild>
        <Link to="/">
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Link>
      </Button>
      <h1 className="font-semibold text-lg md:text-xl">Transactions</h1>
      <div className="ml-auto flex items-center gap-2">
        <Button className="hidden sm:flex" variant="outline">
          Today
        </Button>
        <Button className="hidden md:flex" variant="outline">
          This Month
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="w-[280px] justify-start text-left font-normal"
              id="date"
              variant="outline"
            >
              <CalendarClockIcon className="mr-2 h-4 w-4" />
              June 01, 2023 - June 30, 2023
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            {/* <Calendar initialFocus mode="range" numberOfMonths={2} /> */}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
