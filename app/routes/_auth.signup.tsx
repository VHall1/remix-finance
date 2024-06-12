import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Prisma, User } from "@prisma/client";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { FormField } from "~/components/form-field";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { signUpSchema } from "~/schemas/user";
import { signUp } from "~/utils/auth.server";
import { getSession, sessionStorage } from "~/utils/session.server";
import { AuthTitle } from "./_auth/auth-title";

export default function SignUp() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signUpSchema });
    },
    shouldValidate: "onBlur",
  });

  return (
    <>
      <AuthTitle>Sign up</AuthTitle>
      <Card>
        <CardContent className="pt-6">
          <Form method="post" id={form.id} onSubmit={form.onSubmit} noValidate>
            <div className="grid gap-4 w-full items-center">
              <FormField
                field={fields.email}
                label="Email"
                placeholder="hello@example.com"
                type="email"
                autoComplete="email"
                required
              />

              <div className="flex gap-4">
                <FormField
                  field={fields.firstName}
                  label="First name"
                  placeholder="John"
                  className="flex-1"
                  required
                />
                <FormField
                  field={fields.lastName}
                  label="Last name"
                  placeholder="Doe"
                  className="flex-1"
                  required
                />
              </div>

              <FormField
                field={fields.password}
                label="Password"
                type="password"
                autoComplete="new-password"
                required
              />

              <Button size="lg">Sign up</Button>
              <div className="text-destructive text-center">{form.errors}</div>
            </div>
          </Form>
        </CardContent>
        <Separator />
        <CardContent className="py-4">
          <div className="text-center">
            Already have an account?{" "}
            <Button variant="link" className="p-0" asChild>
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: signUpSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  let user: User;
  try {
    user = await signUp({
      email: submission.value.email,
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      password: submission.value.lastName,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
      // (Unique constraint failed)
      // https://www.prisma.io/docs/orm/reference/error-reference#p2002
    ) {
      return submission.reply({
        formErrors: ["This email address is not available"],
      });
    }

    throw error;
  }

  const session = await getSession(request);
  session.set("userId", user.id);
  return redirect("/", {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}
