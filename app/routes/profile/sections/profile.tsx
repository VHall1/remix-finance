import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { User } from "lucide-react";
import { useMemo } from "react";
import { FormField } from "~/components/form-field";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  action,
  schema,
  handle as updateHandle,
} from "~/routes/profile.update";
import { CustomCardHeader } from "../custom-card-header";
import { loader } from "../route";

export function ProfileSection() {
  const fetcher = useFetcher();
  const { user, joined } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onBlur",
    defaultValue: {
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
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
    <Card asChild>
      <section>
        <CustomCardHeader>
          <User className="h-4 w-4" />
          <h2 className="text-lg font-semibold">Profile</h2>
        </CustomCardHeader>
        <CardHeader>
          {user.avatar ? (
            <Avatar className="mx-auto w-[100px] h-[100px]">
              <AvatarImage src={user.avatar} />
            </Avatar>
          ) : null}

          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold">{user.firstName}</h1>
            {joinedDate ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Joined on {joinedDate}
              </p>
            ) : null}
          </div>
        </CardHeader>
        <fetcher.Form
          method="post"
          action={updateHandle.path()}
          {...getFormProps(form)}
        >
          <CardContent>
            <div className="grid gap-4">
              <div className="flex gap-4">
                <FormField
                  field={fields.firstName}
                  label="First name"
                  className="flex-1"
                  required
                  {...getInputProps(fields.firstName, { type: "text" })}
                />
                <FormField
                  field={fields.lastName}
                  label="Last name"
                  className="flex-1"
                  required
                  {...getInputProps(fields.lastName, { type: "text" })}
                />
              </div>

              <FormField
                field={fields.avatar}
                label="Avatar"
                {...getInputProps(fields.avatar, { type: "url" })}
              />

              <div className="flex gap-4">
                <Button>Save</Button>
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
