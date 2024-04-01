import { User } from "@prisma/client";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";

export const authenticator = new Authenticator<
  Pick<User, "id" | "firstName" | "lastName" | "email">
>(sessionStorage);
