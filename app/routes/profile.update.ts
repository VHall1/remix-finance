import { parseWithZod } from "@conform-to/zod";
import { $Enums } from "@prisma/client";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { getUserSession, requireUser } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";

export const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  defaultCurrency: z.nativeEnum($Enums.Currency),
  avatar: z.string().url().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const [session, updatedUser] = await Promise.all([
    getUserSession(request),
    prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: submission.value.firstName,
        lastName: submission.value.lastName,
        defaultCurrency: submission.value.defaultCurrency,
        avatar: submission.value.avatar,
      },
    }),
  ]);

  session.setUser({
    id: updatedUser.id,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    avatar: updatedUser.avatar,
  });

  return json(submission.reply(), {
    headers: { "Set-Cookie": await session.commit() },
  });
}

export const handle = {
  path: () => "/profile/update",
};
