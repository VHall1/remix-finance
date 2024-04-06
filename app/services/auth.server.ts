import { User } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { sessionStorage } from "~/services/session.server";
import * as bcrypt from "@node-rs/bcrypt";

export type AuthUser = Pick<
  User,
  "id" | "firstName" | "lastName" | "email" | "avatar"
>;

export async function getUserSession(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  return {
    getUser: (): AuthUser | undefined => session.get("user"),
    setUser: (user: AuthUser) => session.set("user", user),
    logout: () => session.unset("user"),
    commit: () => sessionStorage.commitSession(session),
  };
}

export async function requireUser(request: Request): Promise<AuthUser> {
  const session = await getUserSession(request);
  const user = session.getUser();

  // TODO: Add flash message if when they get logged out
  if (!user) {
    session.logout();
    throw redirect("/login", {
      headers: { "Set-Cookie": await session.commit() },
    });
  }

  return user;
}

const SALT_ROUNDS = 10;
export function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
