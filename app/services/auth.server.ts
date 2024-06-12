import { Prisma } from "@prisma/client";
import { loginSchema, signUpSchema } from "~/schemas/user";
import { comparePassword, hashPassword } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

export async function signUp({
  email,
  firstName,
  lastName,
  password,
}: typeof signUpSchema._type) {
  const passwordHash = await hashPassword(password);
  try {
    const user = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash,
      },
    });
    return user;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
      // (Unique constraint failed)
      // https://www.prisma.io/docs/orm/reference/error-reference#p2002
    ) {
      return null;
    }

    // rethrow error otherwise
    throw error;
  }
}

export async function login({ email, password }: typeof loginSchema._type) {
  const user = await db.user.findUnique({
    where: { email },
  });
  if (!user) return null;

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) return null;

  return user;
}
