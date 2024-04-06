import type { ActionFunction, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getUserSession } from "~/services/auth.server";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const session = await getUserSession(request);
  session.logout();
  return json(
    {},
    {
      headers: { "Set-Cookie": await session.commit() },
    }
  );
};

export const handle = {
  path: () => "/logout",
};
