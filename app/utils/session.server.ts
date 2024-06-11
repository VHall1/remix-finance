import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "remix-finance__session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function logout(request: Request) {
  const session = await getSession(request);
  session.unset("userId");
  return redirect("/login", {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}

export async function requireUser(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");
  if (!userId) {
    throw logout(request);
  }
  return userId;
}

interface SessionData {
  userId: string;
}
