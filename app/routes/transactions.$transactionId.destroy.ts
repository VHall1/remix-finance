import { ActionFunction } from "@remix-run/node";
import { requireUser } from "~/services/auth.server";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  const transaction = await db.transaction.findUnique({
    where: { id: Number(params.transactionId), userId: user.id },
  });
  if (!transaction) {
    throw new Response("Not Found", { status: 404 });
  }

  await db.transaction.delete({
    where: { id: transaction.id },
  });

  return new Response(null, { status: 204 });
};
