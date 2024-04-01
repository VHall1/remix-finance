import { User } from "@prisma/client";
import { sessionStorage } from "~/services/session.server";

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
