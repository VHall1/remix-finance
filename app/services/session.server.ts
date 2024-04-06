import { User } from "@prisma/client";
import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export type AuthUser = Pick<
  User,
  "id" | "firstName" | "lastName" | "email" | "avatar"
>;

type SessionData = {
  user: AuthUser;
};

type SessionFlashData = {
  flash: {
    title?: string;
    description?: string;
  };
};

export const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "remix-finance-session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});
