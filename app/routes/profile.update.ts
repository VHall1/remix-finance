import { parseWithZod } from "@conform-to/zod";
import { $Enums } from "@prisma/client";
import { json, redirect, type ActionFunction } from "@remix-run/node";
import { z } from "zod";
import { handle as logoutHandle } from "~/routes/logout";
import { getUserSession, requireUser } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";

export const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  defaultCurrency: z.nativeEnum($Enums.Currency),
  avatar: z.string().url().optional(),
});

export const action: ActionFunction = async ({ request }) => {
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
};

export const handle = {
  path: () => "/profile/update",
};
