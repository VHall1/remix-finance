import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import { useMemo } from "react";
import { z } from "zod";
import { RequiredAsterisk } from "~/components/required-asterisk";
import { Shell } from "~/components/shell";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  comparePassword,
  getUserSession,
  hashPassword,
  requireUser,
} from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import { handle as logoutHandle } from "./logout";
import { Prisma } from "@prisma/client";

export default function Profile() {
  const { user, joined } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onBlur",
    defaultValue: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
  const joinedDate = useMemo(() => {
    if (!joined) return null;

    const date = new Date(joined.createdAt);
    const day = date.getDate();
    const month = date.toLocaleString("default", {
      month: "long",
    });
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  }, [joined]);

  return (
    <Shell>
      <Card className="max-w-screen-lg w-full mx-auto">
        <CardHeader>
          {/* <Avatar className="w-[100px] h-[100px]" /> */}
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold">{user.firstName}</h1>
            {joinedDate ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Joined on {joinedDate}
              </p>
            ) : null}
          </div>
        </CardHeader>
        <Form method="post" {...getFormProps(form)}>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor={fields.firstName.id}>
                    First Name
                    <RequiredAsterisk />
                  </Label>
                  <Input
                    {...getInputProps(fields.firstName, { type: "text" })}
                    required
                  />
                  <small className="text-destructive">
                    {fields.firstName.errors}
                  </small>
                </div>

                <div className="flex-1 space-y-1.5">
                  <Label htmlFor={fields.lastName.id}>
                    Last Name
                    <RequiredAsterisk />
                  </Label>
                  <Input
                    {...getInputProps(fields.lastName, { type: "text" })}
                    required
                  />
                  <small className="text-destructive">
                    {fields.lastName.errors}
                  </small>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={fields.email.id}>
                  Email
                  <RequiredAsterisk />
                </Label>
                <Input
                  {...getInputProps(fields.email, { type: "text" })}
                  required
                />
                <small className="text-destructive">
                  {fields.email.errors}
                </small>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor={fields.password.id}>New Password</Label>
                  <Input
                    {...getInputProps(fields.password, { type: "password" })}
                  />
                  <small className="text-destructive">
                    {fields.password.errors}
                  </small>
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor={fields.password2.id}>Confirm Password</Label>
                  <Input
                    {...getInputProps(fields.password2, { type: "password" })}
                  />
                  <small className="text-destructive">
                    {fields.password2.errors}
                  </small>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={fields.currentPassword.id}>
                  Current Password
                  <RequiredAsterisk />
                </Label>
                <Input
                  {...getInputProps(fields.currentPassword, {
                    type: "password",
                  })}
                  required
                />
                <small className="text-destructive">
                  {fields.currentPassword.errors}
                </small>
              </div>

              <div className="flex gap-4">
                <Button disabled={!form.dirty}>Save</Button>
                <Button
                  disabled={!form.dirty}
                  onClick={() => form.reset()}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
              <div className="text-destructive text-center">{form.errors}</div>
            </div>
          </CardContent>
        </Form>
      </Card>
    </Shell>
  );
}

const schema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  currentPassword: z.string(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .optional(),
  password2: z.string().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
  // shouldn't happen since we're requiring the user above, but still good to check
  if (!fullUser) {
    throw redirect(logoutHandle.path());
  }

  const isPasswordCorrect = await comparePassword(
    submission.value.currentPassword,
    fullUser.passwordHash
  );
  if (!isPasswordCorrect) {
    return json(
      submission.reply({
        fieldErrors: {
          currentPassword: ["Invalid password"],
        },
      }),
      { status: 400 }
    );
  }

  let data: Prisma.UserUpdateArgs["data"] = {
    firstName: submission.value.firstName,
    lastName: submission.value.lastName,
    // TODO: do some validation before they change email?
    // also handle unique constraint
    email: submission.value.email,
  };
  if (submission.value.password !== submission.value.password2) {
    return json(
      submission.reply({
        formErrors: ["New passwords do not match"],
      })
    );
  } else if (submission.value.password) {
    // TODO: notify that password has been changed?
    data = {
      ...data,
      passwordHash: await hashPassword(submission.value.password),
    };
  }

  const [session, updatedUser] = await Promise.all([
    getUserSession(request),
    prisma.user.update({
      where: { id: user.id },
      data,
    }),
  ]);

  session.setUser({
    id: updatedUser.id,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
  });

  return json(submission.reply(), {
    headers: { "Set-Cookie": await session.commit() },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const joined = await prisma.user.findUnique({
    where: { id: user.id },
    select: { createdAt: true },
  });
  return { user, joined };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.user.firstName }];
};

export const handle = {
  path: () => "/profile",
};
