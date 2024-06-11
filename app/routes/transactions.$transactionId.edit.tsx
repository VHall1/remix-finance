import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { handle as logoutHandle } from "~/routes/logout";
import { TransactionsForm } from "~/routes/transactions/form";
import { TransactionsHeader } from "~/routes/transactions/header";
import { transactionSchema } from "~/schemas/transaction";
import { requireUser } from "~/services/auth.server";
import { db } from "~/utils/db.server";
import { handle as showTransactionHandle } from "./transactions.$transactionId._show";
import { handle as indexTransactionHandle } from "./transactions._index";

export default function EditTransaction() {
  const { transaction } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const useFormHookResult = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: transactionSchema });
    },
    shouldValidate: "onBlur",
    defaultValue: {
      amount: transaction.amount,
      direction: transaction.direction,
      reference: transaction.reference,
    },
  });

  return (
    <TransactionsForm
      useFormHookResult={useFormHookResult}
      submitText="Submit transaction"
    />
  );
}

export const handle = {
  path: (transactionId: number) => `/transactions/${transactionId}/edit`,
  header: () => (
    <TransactionsHeader
      path={indexTransactionHandle.path()}
      title="Edit transaction"
    />
  ),
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const transaction = await db.transaction.findUnique({
    where: { id: Number(params.transactionId), userId: user.id },
  });
  if (!transaction) {
    throw new Response("Transaction not found", { status: 404 });
  }

  return { transaction };
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: transactionSchema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const fullUser = await db.user.findUnique({ where: { id: user.id } });
  if (!fullUser) {
    throw redirect(logoutHandle.path());
  }

  const transaction = await db.transaction.create({
    data: {
      amount: submission.value.amount,
      direction: submission.value.direction,
      reference: submission.value.reference,
      currency: fullUser.defaultCurrency,
      userId: user.id,
    },
  });

  return redirect(showTransactionHandle.path(transaction.id));
}
