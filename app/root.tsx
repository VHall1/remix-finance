import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { Navbar } from "./components/navbar";
import "./globals.css";
import { getUserSession } from "./services/auth.server";
import { CustomHandle } from "./types";

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
        {/* Move somewhere else */}
        <div className="grid h-screen [grid-template-columns:minmax(max-content,12.8125rem)_1fr] [grid-template-rows:max-content_max-content_1fr_max-content] [grid-template-areas:'logo_header''aside_main']">
          <Link
            to="/"
            className="border-b border-r bg-gray-100/40 px-6 dark:bg-gray-800/40 [grid-area:logo]"
          >
            home
          </Link>
          <Navbar />
          <nav className="h-screen border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 [grid-area:aside]">
            <div className="flex h-[60px] items-center px-6">
              {/* <Link
                  className="flex items-center gap-2 font-semibold"
                  href="#"
                >
                  <Package2Icon className="h-6 w-6" />
                  <span className="">Acme Inc</span>
                </Link>
                <Button
                  className="ml-auto h-8 w-8"
                  size="icon"
                  variant="outline"
                >
                  <BellIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle notifications</span>
                </Button>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                  <Link
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                    href="#"
                  >
                    <HomeIcon className="h-4 w-4" />
                    Home
                  </Link>
                  <Link
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                    href="#"
                  >
                    <CreditCardIcon className="h-4 w-4" />
                    Accounts
                  </Link>
                  <Link
                    className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
                    href="#"
                  >
                    <TrendingUpIcon className="h-4 w-4" />
                    Income
                  </Link>
                  <Link
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                    href="#"
                  >
                    <TrendingDownIcon className="h-4 w-4" />
                    Debt
                  </Link> */}
            </div>
          </nav>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 [grid-area:main]">
            {children}
          </main>
          <ScrollRestoration />
          <Scripts />
        </div>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export const handle: CustomHandle & { id: string } = {
  id: "root",
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { getUser } = await getUserSession(request);
  return getUser() || null;
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
