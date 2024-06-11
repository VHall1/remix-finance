import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { db } from "~/utils/db.server";
import { requireUser } from "~/utils/session.server";
import { columns } from "./columns";

export default function Accounts() {
  const { accounts } = useLoaderData<typeof loader>();

  return (
    <div className="grid gap-4 py-6">
      <DataTable columns={columns} data={accounts} />
    </div>
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUser(request);
  const accounts = await db.account.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      balance: true,
    },
  });

  return { accounts };
};

export const handle: Handle = {
  pageHeader: () => (
    <PageHeader path="/" title="Accounts">
      <div className="flex flex-1 items-center">
        <Button className="ml-auto" asChild>
          <Link to="/accounts/new">New account</Link>
        </Button>
      </div>
    </PageHeader>
  ),
};
