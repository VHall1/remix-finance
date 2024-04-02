import { User } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { sessionStorage } from "~/services/session.server";
import * as bcrypt from "bcrypt";

export type AuthUser = Pick<User, "id" | "firstName" | "lastName" | "email">;

export async function getUserSession(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  return {
    getUser: (): AuthUser | undefined => session.get("user"),
    setUser: (user: AuthUser | undefined) => session.set("user", user),
    commit: () => sessionStorage.commitSession(session),
  };
}

export async function requireUser(request: Request): Promise<AuthUser> {
  const session = await getUserSession(request);
  const user = session.getUser();

  if (!user) {
    // const session = await getSession(request);
    // await session.signOut();
    throw redirect(
      "/login"
      // { headers: await session.getHeaders() }
    );
  }

  return user;
}

const SALT_ROUNDS = 10;
export function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}
