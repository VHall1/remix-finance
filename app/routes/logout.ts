import type { ActionFunction, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getUserSession } from "~/services/auth.server";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const userSession = await getUserSession(request);
  userSession.setUser(undefined);
  return json(undefined, {
    headers: { "Set-Cookie": await userSession.commit() },
  });
};
