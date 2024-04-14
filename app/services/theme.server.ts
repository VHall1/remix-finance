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

export const sessionStorage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "remix-finance-theme",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});
