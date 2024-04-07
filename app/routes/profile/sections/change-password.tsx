import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFetcher } from "@remix-run/react";
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
  const fetcher = useFetcher<typeof action>();
  const lastResult = fetcher.data;
  // const isSubmitting = fetcher.state !== "idle";
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      currentPassword: "",
      password: "",
    },
  });

  return (
    <Card asChild>
      <section>
        <CustomCardHeader>
          <Lock className="h-4 w-4" />
          <h2 className="text-lg font-semibold">Change password</h2>
        </CustomCardHeader>
        <fetcher.Form
          method="POST"
          action={changePasswordHandle.path()}
          id={form.id}
          onSubmit={form.onSubmit}
        >
          <CardContent className="py-6">
            <div className="grid gap-4">
              <FormField
                field={fields.currentPassword}
                defaultValue={fields.currentPassword.initialValue}
                label="Current password"
                type="password"
              />

              <FormField
                field={fields.password}
                defaultValue={fields.password.initialValue}
                label="New password"
                type="password"
              />

              <div className="flex">
                <Button type="submit">Change password</Button>
              </div>

              {form.errors ? (
                <div className="text-destructive text-center">
                  {form.errors}
                </div>
              ) : null}
            </div>
          </CardContent>
        </fetcher.Form>
      </section>
    </Card>
  );
}
