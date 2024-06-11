import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";
import { FormField } from "~/components/form-field";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { requireUser } from "~/services/auth.server";
import { db } from "~/utils/db.server";

export default function NewAccount() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    defaultValue: { startingBalance: 0 },
    shouldValidate: "onBlur",
  });

  return (
    <div className="grid gap-4">
      <Form method="post" id={form.id} onSubmit={form.onSubmit}>
        <div className="grid gap-4 py-6">
          <FormField field={fields.name} label="Name" />
          <FormField
            field={fields.startingBalance}
            label="Starting balance"
            type="text"
            inputMode="numeric"
          />
          <div>
            <Button type="submit">Create account</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

const schema = z.object({
  name: z.string(),
  startingBalance: z
    .number({ invalid_type_error: "Has to be a number" })
    .optional(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request);

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const fullUser = await db.user.findUnique({ where: { id: user.id } });
  if (!fullUser) {
    throw redirect("/logout");
  }

  const account = await db.account.create({
    data: {
      name: submission.value.name,
      balance: submission.value.startingBalance || 0,
      userId: fullUser.id,
    },
  });

  return redirect(`/accounts/${account.id}`);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request);
  return null;
};

export const handle = {
  header: () => <PageHeader path="/accounts" title="New account" />,
};
