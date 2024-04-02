import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { $Enums } from "@prisma/client";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { requireUser } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import { handle as showTransactionHandle } from "./transactions.$transactionId.show";

export default function NewTransaction() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onBlur",
  });

  return (
    <Form method="post" id={form.id} onSubmit={form.onSubmit}>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor={fields.amount.id}>Amount</Label>
          <Input
            id={fields.amount.id}
            name={fields.amount.name}
            placeholder="100.00"
            required
          />
          <small className="text-destructive">{fields.amount.errors}</small>
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor={fields.reference.id}>Reference</Label>
          <Input
            id={fields.reference.id}
            name={fields.reference.name}
            placeholder="Groceries"
          />
          <small className="text-destructive">{fields.reference.errors}</small>
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor={fields.direction.id}>Transaction Type</Label>
          <Select
            id={fields.direction.id}
            name={fields.direction.name}
            defaultValue={$Enums.TransactionDirection.INBOUND}
            required
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={$Enums.TransactionDirection.INBOUND}>
                {$Enums.TransactionDirection.INBOUND}
              </SelectItem>
              <SelectItem value={$Enums.TransactionDirection.OUTBOUND}>
                {$Enums.TransactionDirection.OUTBOUND}
              </SelectItem>
            </SelectContent>
          </Select>
          <small className="text-destructive">{fields.direction.errors}</small>
        </div>
      </div>
      <Button>Submit</Button>
    </Form>
  );
}

export const handle = { path: () => "/transactions/new" };

const schema = z.object({
  amount: z.number().positive(),
  reference: z.string().optional(),
  direction: z.nativeEnum($Enums.TransactionDirection),
});

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const transaction = await prisma.transaction.create({
    data: {
      amount: submission.value.amount,
      direction: submission.value.direction,
      reference: submission.value.reference,
      userId: user.id,
    },
  });

  return redirect(showTransactionHandle.path(transaction.id));
}
