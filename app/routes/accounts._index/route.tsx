import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { PageHeader } from "~/components/page-header";
import { DataTable } from "~/components/ui/data-table";
import { requireUser } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import { columns } from "./columns";
import { Button } from "~/components/ui/button";

export default function Accounts() {
  const { accounts } = useLoaderData<typeof loader>();

  return (
    <div className="grid gap-4 py-6">
      <DataTable columns={columns} data={accounts} />
    </div>
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      name: true,
      balance: true,
    },
  });

  return json({ accounts });
};

export const handle = {
  header: () => (
    <PageHeader path="/" title="Accounts">
      <div className="flex flex-1 items-center">
        <Button className="ml-auto" asChild>
          <Link to="/accounts/new">New account</Link>
        </Button>
      </div>
    </PageHeader>
  ),
};
