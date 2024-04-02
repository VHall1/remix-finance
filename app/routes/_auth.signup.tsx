import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Prisma, User } from "@prisma/client";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { getUserSession, hashPassword } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import { AuthCard } from "./_auth/auth-card";

export default function SignUp() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onBlur",
  });

  return (
    <AuthCard>
      <CardHeader>
        <h1 className="text-3xl font-bold text-center">Sign Up</h1>
      </CardHeader>
      <CardContent>
        <Form method="post" id={form.id} onSubmit={form.onSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={fields.email.id}>Email</Label>
              <Input
                id={fields.email.id}
                name={fields.email.name}
                placeholder="hello@example.com"
                type="email"
                required
              />
              <small className="text-destructive">{fields.email.errors}</small>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor={fields.firstName.id}>First Name</Label>
                <Input
                  id={fields.firstName.id}
                  name={fields.firstName.name}
                  placeholder="John"
                  required
                />
                <small className="text-destructive">
                  {fields.firstName.errors}
                </small>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor={fields.lastName.id}>Last Name</Label>
                <Input
                  id={fields.lastName.id}
                  name={fields.lastName.name}
                  placeholder="Doe"
                  required
                />
                <small className="text-destructive">
                  {fields.lastName.errors}
                </small>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={fields.password.id}>Password</Label>
              <Input
                id={fields.password.id}
                name={fields.password.name}
                type="password"
                required
              />
              <small className="text-destructive">
                {fields.password.errors}
              </small>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={fields.password2.id}>Confirm password</Label>
              <Input
                id={fields.password2.id}
                name={fields.password2.name}
                type="password"
                required
              />
              <small className="text-destructive">
                {fields.password2.errors}
              </small>
            </div>

            <Button>Sign up</Button>
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
    </AuthCard>
  );
}

const schema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  password2: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  if (submission.value.password !== submission.value.password2) {
    return json(
      submission.reply({
        formErrors: ["Passwords do not match"],
      })
    );
  }

  let user: User;
  try {
    user = await prisma.user.create({
      data: {
        firstName: submission.value.firstName,
        lastName: submission.value.lastName,
        email: submission.value.email,
        passwordHash: await hashPassword(submission.value.password),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
      // (Unique constraint failed)
      // https://www.prisma.io/docs/orm/reference/error-reference#p2002
    ) {
      return json(
        submission.reply({
          formErrors: ["This email address is not available"],
        })
      );
    }

    throw error;
  }

  const session = await getUserSession(request);
  // don't send down password
  session.setUser({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  });

  return redirect("/", {
    headers: { "Set-Cookie": await session.commit() },
  });
}
