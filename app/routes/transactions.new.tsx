import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { handle as logoutHandle } from "~/routes/logout";
import { TransactionsForm } from "~/routes/transactions/form";
import { TransactionsHeader } from "~/routes/transactions/header";
import { transactionSchema } from "~/schemas/transaction";
import { db } from "~/utils/db.server";
import { requireUser } from "~/utils/session.server";
import { handle as showTransactionHandle } from "./transactions.$transactionId._show";
import { handle as indexTransactionHandle } from "./transactions._index";

export default function NewTransaction() {
  const lastResult = useActionData<typeof action>();
  const useFormHookResult = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: transactionSchema });
    },
    shouldValidate: "onBlur",
  });

  return (
    <TransactionsForm
      useFormHookResult={useFormHookResult}
      submitText="Submit transaction"
    />
  );
}

export const handle = {
  path: () => "/transactions/new",
  header: () => (
    <TransactionsHeader
      path={indexTransactionHandle.path()}
      title="New transaction"
    />
  ),
};

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
