import { useForm } from "@conform-to/react";
import { $Enums } from "@prisma/client";
import { Form } from "@remix-run/react";
import { output } from "zod";
import { FormField } from "~/components/form-field";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { transactionSchema } from "~/schemas/transaction";

export function TransactionsForm({
  useFormHookResult: [form, fields],
  submitText,
}: TransactionsForm) {
  return (
    <Form method="post" id={form.id} onSubmit={form.onSubmit}>
      <div>
        <FormField field={fields.amount} label="Amount" required />
        <FormField field={fields.reference} label="Reference" />

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor={fields.direction.id}>Transaction Type</Label>
          <Select
            // id={fields.direction.id}
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
      <Button>{submitText}</Button>
    </Form>
  );
}

type Schema = output<typeof transactionSchema>;

interface TransactionsForm {
  useFormHookResult: ReturnType<typeof useForm<Schema, Schema, string[]>>;
  submitText: string;
}
