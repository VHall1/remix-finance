import { $Enums } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Shell } from "~/components/shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { requireUser } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";

export default function Dashboard() {
  const { transactions } = useLoaderData<typeof loader>();

  return (
    <Shell>
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg md:text-xl">Dashboard</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:gap-2">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center">
                {transaction.direction ===
                $Enums.TransactionDirection.INBOUND ? (
                  <ArrowUpIcon className="w-6 h-6 text-green-500" />
                ) : null}
                {transaction.direction ===
                $Enums.TransactionDirection.OUTBOUND ? (
                  <ArrowDownIcon className="w-6 h-6 text-red-500" />
                ) : null}
                <div className="ml-2">
                  <h3 className="font-semibold">Income</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Description of the transaction
                  </p>
                </div>
                <div className="ml-auto font-semibold">
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: "GBP",
                  }).format(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Shell>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const recentTransactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return { transactions: recentTransactions };
}
