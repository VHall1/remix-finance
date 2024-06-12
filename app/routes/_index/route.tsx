import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { InboxIcon, PlusIcon } from "lucide-react";
import { Shell } from "~/components/shell";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { db } from "~/utils/db.server";
import { formatMoney } from "~/utils/money";
import { requireUser } from "~/utils/session.server";
import { AccountsCard } from "./accounts-card";
import { parseWithZod } from "@conform-to/zod";
import { addAccountSchema } from "~/schemas/account";
import { addAccount } from "~/services/account.server";

export default function Dashboard() {
  const { recentTransactions } = useLoaderData<typeof loader>();

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <AccountsCard />
        <Card>
          <CardHeader className="pb-0">
            <div className="flex justify-between">
              <div className="grid gap-1.5">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  <Button variant="link" size="sm" className="p-0 h-4">
                    All Transactions
                  </Button>
                </CardDescription>
              </div>
              <Button size="sm">
                <PlusIcon />
                Transaction
              </Button>
            </div>
          </CardHeader>
          {recentTransactions.length > 0 ? (
            <>
              <hr className="mt-5" />
              <CardContent className="px-0 pb-3">
                <div className="grid">
                  {recentTransactions.map((transaction) => (
                    <Button
                      variant="ghost"
                      className="h-14 py-0 px-6 rounded-none flex justify-between"
                      key={transaction.id}
                    >
                      <div className="font-semibold">
                        {transaction.reference}
                      </div>
                      <p>{formatMoney(transaction.amount / 100)}</p>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <hr className="my-5" />
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <InboxIcon className="h-12 w-12 text-muted-foreground" />
                  <h2 className="text-2xl text-center font-semibold text-muted-foreground">
                    You don&apos;t have any transactions yet!
                  </h2>
                  <Button>Add a transaction</Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </Shell>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent")?.toString();

  switch (intent) {
    case "add-account": {
      const submission = parseWithZod(formData, { schema: addAccountSchema });
      if (submission.status !== "success") {
        return submission.reply();
      }
      await addAccount(userId, {
        name: submission.value.name,
        balance: submission.value.balance,
      });
      break;
    }
  }

  return null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUser(request);
  const accounts = await db.account.findMany({
    where: { userId },
    select: { id: true, name: true, balance: true },
  });
  const recentTransactions = await db.transaction.findMany({
    where: { account: { userId } },
    select: {
      id: true,
      direction: true,
      amount: true,
      reference: true,
      createdAt: true,
      account: { select: { name: true } },
    },
    take: 4,
  });
  return {
    accounts,
    recentTransactions,
    totalBalance: accounts.reduce((accum, { balance }) => accum + balance, 0),
  };
}