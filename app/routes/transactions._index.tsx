import { parseWithZod } from "@conform-to/zod";
import { LoaderFunctionArgs, SerializeFrom, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeftIcon, ChevronDownIcon } from "lucide-react";
import { z } from "zod";
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
import { handle as newTransactionHandle } from "~/routes/transactions.new";
import { requireUser } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import { formatMoney } from "~/utils";
import { TransactionsHeader } from "./transactions/header";

const columnHelper =
  createColumnHelper<SerializeFrom<typeof loader>["transactions"][0]>();
const columns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("createdAt", {
    header: "Date",
    cell: (info) => info.getValue().toString(),
  }),
  columnHelper.accessor("reference", { header: () => "Reference" }),
  columnHelper.accessor("amount", {
    header: () => "Amount",
    cell: (info) => formatMoney(info.getValue()),
  }),
];

export default function Transactions() {
  const navigate = useNavigate();
  const { total, take, page, transactions } = useLoaderData<typeof loader>();
  const pagesTotal = Math.ceil(total / take);

  const table = useReactTable({
    columns,
    data: transactions,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,

    // server-side pagination
    manualPagination: true,
    rowCount: total,
    state: {
      pagination: {
        pageIndex: page,
        pageSize: take,
      },
    },
  });

  return (
    <>
      <TransactionsHeader path="/" title="Transactions">
        <div className="ml-auto flex items-center gap-2">
          <Button asChild>
            <Link to={newTransactionHandle.path()}>New transaction</Link>
          </Button>
        </div>
      </TransactionsHeader>

      <div className="w-full">
        <div className="flex items-center py-4">
          <Input placeholder="Filter transactions..." className="max-w-sm" />
          <Button className="ml-auto">Download</Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
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
          <div className="space-x-2">
            <Button
              onClick={() => navigate(`?page=${page - 1}`)}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              onClick={() => navigate(`?page=${page + 1}`)}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="hidden md:inline">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </span>
            <span className="md:hidden">1-20 of 53</span>
          </div>
        </div>
      </div>
    </>
  );
}

const schema = z.object({
  take: z.number().int().positive().catch(10),
  page: z.number().int().nonnegative().catch(0),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const url = new URL(request.url);

  const submission = parseWithZod(url.searchParams, { schema });

  let page = 0;
  let take = 10;
  if (submission.status === "success") {
    page = submission.value.page;
    take = submission.value.take;
  }

  const [total, transactions] = await Promise.all([
    prisma.transaction.count({
      where: { userId: user.id },
    }),
    prisma.transaction.findMany({
      where: { userId: user.id },
      take,
      skip: page * take,
      select: {
        id: true,
        createdAt: true,
        reference: true,
        amount: true,
      },
    }),
  ]);

  return json({
    take,
    page,
    total,
    transactions,
  });
}

export const handle = { path: () => "/transactions" };
