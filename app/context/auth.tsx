import { useFetcher } from "@remix-run/react";
import {
  createContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import type { AuthUser } from "~/services/auth.server";

interface AuthContextType {
  user: AuthUser | undefined;
  setUser: Dispatch<SetStateAction<AuthUser | undefined>>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
  user = undefined,
}: PropsWithChildren<{
  user: AuthContextType["user"];
}>) {
  const fetcher = useFetcher();
  const [userInState, setUserInState] = useState<AuthContextType["user"]>(user);

  const handleLogout = () => {
    fetcher.submit({}, { action: "logout", method: "post" });
    setUserInState(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        user: userInState,
        setUser: setUserInState,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
