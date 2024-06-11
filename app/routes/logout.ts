import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { handle as loginHandle } from "~/routes/_auth.login";
import { getSession } from "~/utils/session.server";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const session = await getSession(request);
  session.logout();
  return json(
    {},
    {
      headers: { "Set-Cookie": await session.commit() },
    }
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  await fetch(request.url, { method: "POST" });
  return redirect(loginHandle.path());
};

export const handle = {
  path: () => "/logout",
};
