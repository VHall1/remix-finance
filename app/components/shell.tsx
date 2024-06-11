import { Link, useMatches } from "@remix-run/react";
import { BellIcon } from "lucide-react";
import { type PropsWithChildren } from "react";
import { Aside } from "~/components/aside";
import { Home } from "~/components/home";
import { Navbar } from "~/components/navbar";
import { Button } from "~/components/ui/button";

export function Shell({ children }: PropsWithChildren) {
  const matches = useMatches();
  const match = matches.at(-1);
  const handle: Handle = match?.handle ?? {};

  return (
    <div className="lg:grid h-screen [grid-template-columns:minmax(max-content,16rem)_1fr] [grid-template-rows:max-content_max-content_1fr] [grid-template-areas:'logo_header''aside_flash''aside_main']">
      <div className="[grid-area:logo] hidden lg:flex items-center px-4 border-b border-r bg-muted/40">
        <Link to="/" className="pl-3">
          <Home />
        </Link>
        <Button size="icon" variant="outline" className="h-8 w-8 ml-auto">
          <BellIcon className="w-4 h-4" />
        </Button>
      </div>
      <Navbar />
      <Aside />
      {/* {flash ? (
        <div className="pt-6 container [grid-area:flash]">
          <Alert variant={flash.error ? "destructive" : "default"}>
            <Terminal className="h-4 w-4" />
            <AlertTitle>{flash.title}</AlertTitle>
            <AlertDescription>{flash.description}</AlertDescription>
          </Alert>
        </div>
      ) : null} */}
      <main className="container pt-6 [grid-area:main]">
        {handle.pageHeader ? handle.pageHeader() : null}
        {children}
      </main>
    </div>
  );
}
