import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { requireUser } from "~/utils/session.server";

export default function Transaction() {
  const { transaction } = useLoaderData<typeof loader>();

  return <pre>{JSON.stringify(transaction, undefined, 2)}</pre>;
}

export const handle = {
  path: (transactionId: number) => `/transactions/${transactionId}`,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const transaction = await db.transaction.findUnique({
    where: { id: Number(params.transactionId), userId: user.id },
  });
  if (!transaction) {
    throw new Response("Not Found", { status: 404 });
  }

  return { transaction };
}
