import { Link, useFetcher } from "@remix-run/react";
import { LogOut, MoonIcon, User } from "lucide-react";
import { MobileAside } from "~/components/aside";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useOptionalUser } from "~/hooks/useRootData";
import { handle as logoutHandle } from "~/routes/logout";
import { handle as profileHandle } from "~/routes/profile/route";

export function Navbar() {
  const user = useOptionalUser();
  const fetcher = useFetcher();

  const logout = () => {
    fetcher.submit({}, { action: logoutHandle.path(), method: "post" });
  };

  return (
    <header className="border-b bg-muted/40 [grid-area:header]">
      <div className="container flex h-14 max-w-screen-2xl lg:max-w-full items-center">
        <MobileAside />

        <div className="ml-auto flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar ?? ""} />
                  <AvatarFallback>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="leading-6">
                    {user.firstName} {user.lastName[0]}.
                  </div>
                  <div className="text-muted-foreground font-normal">
                    {user.email}
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={profileHandle.path()}>
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <MoonIcon className="h-4 w-4 mr-3" />
                  Colour scheme
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </header>
  );
}
