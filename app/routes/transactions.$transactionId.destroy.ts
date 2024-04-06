import { ActionFunction } from "@remix-run/node";
import { requireUser } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  const transaction = await prisma.transaction.findUnique({
    where: { id: Number(params.transactionId), userId: user.id },
  });
  if (!transaction) {
    throw new Response("Not Found", { status: 404 });
  }

  await prisma.transaction.delete({
    where: { id: transaction.id },
  });

  return new Response(null, { status: 204 });
};
