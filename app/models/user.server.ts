import { Prisma } from "@prisma/client";
import { loginSchema, signUpSchema } from "~/schemas/user";
import { comparePassword, hashPassword } from "~/services/auth.server";

export const userModel = Prisma.defineExtension({
  name: "UserModel",
  model: {
    user: {
      async signUp({
        email,
        firstName,
        lastName,
        password,
      }: typeof signUpSchema._type) {
        const passwordHash = await hashPassword(password);
        return Prisma.getExtensionContext(this).create({
          data: {
            email,
            firstName,
            lastName,
            passwordHash,
          },
        });
      },

      async login({ email, password }: typeof loginSchema._type) {
        const user = await Prisma.getExtensionContext(this).findUnique({
          where: { email },
        });
        if (!user) return null;

        const isPasswordValid = await comparePassword(
          password,
          user.passwordHash
        );
        if (!isPasswordValid) return null;

        return user;
      },
    },
  },
});
