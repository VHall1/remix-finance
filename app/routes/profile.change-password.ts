import { parseWithZod } from "@conform-to/zod";
import { json, redirect, type ActionFunction } from "@remix-run/node";
import { z } from "zod";
import { handle as logoutHandle } from "~/routes/logout";
import {
  comparePassword,
  hashPassword,
  requireUser,
} from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";

export const schema = z.object({
  currentPassword: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
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

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(submission.value.password),
    },
  });

  return json(submission.reply());
};

export const handle = {
  path: () => "/profile/change-password",
};
