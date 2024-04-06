import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { FormField } from "~/components/form-field";
import { Button } from "~/components/ui/button";
import { CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { loginSchema } from "~/schemas/user";
import { getUserSession } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import { AuthCard } from "./_auth/auth-card";

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
    <AuthCard>
      <CardHeader>
        <h1 className="text-3xl font-bold text-center">Log in</h1>
      </CardHeader>
      <CardContent>
        <Form method="post" id={form.id} onSubmit={form.onSubmit}>
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
    </AuthCard>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: loginSchema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const user = await prisma.user.login({
    email: submission.value.email,
    password: submission.value.password,
  });

  if (!user) {
    return json(
      submission.reply({
        formErrors: ["Email or password invalid"],
      })
    );
  }

  const session = await getUserSession(request);
  session.setUser({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar,
  });

  return redirect("/", {
    headers: { "Set-Cookie": await session.commit() },
  });
}
