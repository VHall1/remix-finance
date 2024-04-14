import { Link, useLocation } from "@remix-run/react";
import {
  CreditCardIcon,
  HomeIcon,
  LineChartIcon,
  MenuIcon,
  TrendingUpIcon,
} from "lucide-react";
import { Home } from "~/components/home";
import { cn } from "~/utils";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function Aside() {
  const location = useLocation();

  return (
    <nav className="hidden lg:grid items-start px-4 text-sm font-medium border-r bg-muted/40 [grid-area:aside]">
      <div className="flex-1 overflow-auto py-2">
        {links.map((link) => (
          <Link
            to={link.path}
            key={link.path}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-accent-foreground",
              {
                "bg-muted": location.pathname === link.path,
                "text-muted-foreground": location.pathname !== link.path,
              }
            )}
          >
            <link.Icon className="h-4 w-4" />
            {link.text}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function MobileAside() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden">
        <MenuIcon className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>
      <SheetContent side="left">
        <Link to="/">
          <Home />
        </Link>
        <div>
          {links.map((link) => (
            <Link to={link.path} key={link.path}>
              {link.text}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

const links = [
  {
    text: "Home",
    path: "/",
    Icon: HomeIcon,
  },
  {
    text: "Accounts",
    path: "/accounts",
    Icon: CreditCardIcon,
  },
  {
    text: "Transactions",
    path: "/transactions",
    Icon: LineChartIcon,
  },
  {
    text: "Income",
    path: "/income",
    Icon: TrendingUpIcon,
  },
];
