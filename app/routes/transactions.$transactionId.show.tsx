import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUser } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";

export default function Transaction() {
  const { transaction } = useLoaderData<typeof loader>();

  return <pre>{JSON.stringify(transaction, undefined, 2)}</pre>;
}

export const handle = {
  path: (transactionId: number) => `/transactions/${transactionId}/show`,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const transaction = await prisma.transaction.findUnique({
    where: { id: Number(params.transactionId), userId: user.id },
  });

  return { transaction };
}
