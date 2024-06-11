import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { FormField } from "~/components/form-field";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { loginSchema } from "~/schemas/user";
import { login } from "~/utils/auth.server";
import { getSession, sessionStorage } from "~/utils/session.server";
import { AuthTitle } from "./_auth/auth-title";

export default function Login() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
    },
    shouldValidate: "onBlur",
  });

  return (
    <>
      <AuthTitle>Log in</AuthTitle>
      <Card>
        <CardContent className="pt-6">
          <Form method="post" id={form.id} onSubmit={form.onSubmit} noValidate>
            <div className="grid gap-4 w-full items-center">
              <FormField
                field={fields.email}
                label="Email"
                placeholder="hello@example.com"
                type="email"
                required
              />

              <FormField
                field={fields.password}
                label="Password"
                type="password"
                required
              />

              <Button size="lg">Log in</Button>
              <div className="text-destructive text-center">{form.errors}</div>
            </div>
          </Form>
        </CardContent>
        <Separator />
        <CardContent className="py-4">
          <div className="text-center">
            Don&apos;t have an account?{" "}
            <Button variant="link" className="p-0" asChild>
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: loginSchema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const user = await login({
    email: submission.value.email,
    password: submission.value.password,
  });

  if (!user) {
    return json(
      submission.reply({
        formErrors: ["Invalid email or password"],
      })
    );
  }

  const session = await getSession(request);
  session.set("userId", user.id);
  return redirect("/", {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}
