import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUser } from "~/services/auth.server";

export default function Index() {
  return <p>dashboard</p>;
}

// TODO: maybe extract to a service?
export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);
  return null;
}
