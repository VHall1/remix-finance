import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { Toaster } from "~/components/ui/toaster";
import { getUserSession } from "~/services/auth.server";
import "./globals.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="dark">
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { getUser, getSession, commit } = await getUserSession(request);
  return json(
    {
      user: getUser() || null,
      flash: getSession().get("flash"),
      toast: getSession().get("toast"),
    },
    // Clear flash after reading
    { headers: { "Set-Cookie": await commit() } }
  );
}

export const meta: MetaFunction = () => {
  return [{ title: "Remix Finance" }];
};

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  }

  return (
    <>
      <h1>Error!</h1>
      <p>{error?.message ?? "Unknown error"}</p>
    </>
  );
}
