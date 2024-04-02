import { Link, useFetcher } from "@remix-run/react";
import { LogOut, Package2Icon, User } from "lucide-react";
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
import { handle as profileHandle } from "~/routes/profile";

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
      {/* <div className="w-full flex-1">
    <form>
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950"
          placeholder="Search"
          type="search"
        />
      </div>
    </form>
  </div> */}
      <div className="ml-auto">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                id="menu"
                size="icon"
                variant="ghost"
              >
                <User className="h-4 w-4" />
                {/* <img
                  alt="Avatar"
                  className="rounded-full"
                  height="32"
                  // src="/placeholder.svg"
                  style={{
                    aspectRatio: "32/32",
                    objectFit: "cover",
                  }}
                  width="32"
                /> */}
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
