import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionData, useFetcher } from "@remix-run/react";
import { Lock } from "lucide-react";
import { FormField } from "~/components/form-field";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  action,
  handle as changePasswordHandle,
  schema,
} from "~/routes/profile.change-password";
import { CustomCardHeader } from "../custom-card-header";

export function ChangePasswordSection() {
  const fetcher = useFetcher();
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onBlur",
  });

  return (
    <Card asChild>
      <section>
        <CustomCardHeader>
          <Lock className="h-4 w-4" />
          <h2 className="text-lg font-semibold">Change password</h2>
        </CustomCardHeader>
        <fetcher.Form
          method="post"
          action={changePasswordHandle.path()}
          {...getFormProps(form)}
        >
          <CardContent className="py-6">
            <div className="grid gap-4">
              <FormField
                field={fields.currentPassword}
                label="Current password"
                required
                {...getInputProps(fields.currentPassword, { type: "password" })}
              />

              <FormField
                field={fields.currentPassword}
                label="New password"
                required
                {...getInputProps(fields.password, { type: "password" })}
              />

              <div className="flex gap-4">
                <Button>Change password</Button>
                <Button onClick={() => form.reset()} variant="outline">
                  Cancel
                </Button>
              </div>
              <div className="text-destructive text-center">{form.errors}</div>
            </div>
          </CardContent>
        </fetcher.Form>
      </section>
    </Card>
  );
}
