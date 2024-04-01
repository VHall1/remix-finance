import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "remix-finance-session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: ["s3cr3t"], // TODO: replace this with an actual secret
    secure: process.env.NODE_ENV === "production",
  },
});
