import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // don't try to get window if running on server
    if (typeof window === "undefined") return;

    const matchQueryList = window.matchMedia(query);
    function handleChange(e: MediaQueryListEvent) {
      setMatches(e.matches);
    }

    setMatches(matchQueryList.matches);
    matchQueryList.addEventListener("change", handleChange);
    return () => {
      matchQueryList.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 768px)");
}
