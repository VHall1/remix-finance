import { Link, useFetcher } from "@remix-run/react";
import { LogOut, Package2Icon, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
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
    <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 [grid-area:header]">
      <Link className="lg:hidden" to="/">
        <Package2Icon className="h-6 w-6" />
        <span className="sr-only">Home</span>
      </Link>
      <div className="ml-auto flex items-center">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="rounded-full border border-gray-200 w-10 h-10 dark:border-gray-800"
                id="menu"
                size="icon"
                variant="ghost"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar ?? ""} />
                  <AvatarFallback>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
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
              <DropdownMenuItem onClick={logout}>
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </header>
  );
}
