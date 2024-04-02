import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
  optimizeDeps: {
    // https://github.com/pilcrowOnPaper/oslo/issues/25
    exclude: ["@node-rs/bcrypt"],
  },
});
