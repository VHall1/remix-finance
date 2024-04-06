import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { handle as logoutHandle } from "~/routes/logout";
import { TransactionsForm } from "~/routes/transactions/form";
import { transactionSchema } from "~/schemas/transaction";
import { requireUser } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import { handle as showTransactionHandle } from "./transactions.$transactionId";
import { handle as indexTransactionHandle } from "./transactions._index";
import { TransactionsHeader } from "./transactions/header";

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
    <>
      <TransactionsHeader
        path={indexTransactionHandle.path()}
        title="New transaction"
      />
      <TransactionsForm
        useFormHookResult={useFormHookResult}
        submitText="Submit transaction"
      />
    </>
  );
}

export const handle = { path: () => "/transactions/new" };

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: transactionSchema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!fullUser) {
    throw redirect(logoutHandle.path());
  }

  const transaction = await prisma.transaction.create({
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
