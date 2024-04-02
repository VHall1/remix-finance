import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "~/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { requireUser } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import { formatMoney } from "~/utils";

export default function Transactions() {
  const { total, take, page, transactions } = useLoaderData<typeof loader>();
  const pagesTotal = Math.ceil(total / take);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input placeholder="Filter transactions..." className="max-w-sm" />
        <Button className="ml-auto">Download</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.createdAt}</TableCell>
                <TableCell>{transaction.reference}</TableCell>
                <TableCell>{formatMoney(transaction.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between w-full p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-8 w-auto rounded-full px-3.5 flex-1 justify-between font-semibold text-left gap-1.5"
              size="sm"
              variant="outline"
            >
              20
              <ChevronDownIcon className="w-4 h-4 shrink-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-24 origin-top-left top-10">
            <DropdownMenuRadioGroup defaultValue="20">
              <DropdownMenuRadioItem value="10">10</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="20">20</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="50">50</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Pagination>
          <PaginationContent className="flex gap-1">
            {[...new Array(pagesTotal)].map((_, idx) => (
              <PaginationItem key={`pagination-page-${idx + 1}`}>
                <PaginationLink
                  to={`?page=${idx + 1}`}
                  isActive={idx + 1 === page}
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="hidden md:inline">
            Showing {transactions.length} of {total} entries
          </span>
          <span className="md:hidden">1-20 of 53</span>
        </div>
      </div>
    </div>
  );
}

export const handle = { path: () => "/transactions" };

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const url = new URL(request.url);
  const take = Number(url.searchParams.get("take")) || 10;
  const page = Number(url.searchParams.get("page")) || 1;

  const [total, transactions] = await Promise.all([
    prisma.transaction.count({
      where: { userId: user.id },
    }),
    prisma.transaction.findMany({
      where: { userId: user.id },
      take,
      skip: (page - 1) * take,
    }),
  ]);

  return {
    take,
    page,
    total,
    transactions,
  };
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
