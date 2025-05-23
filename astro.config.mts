// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import wix from "@wix/astro";

import react from "@astrojs/react";
import type { AstroIntegration } from "astro";

function waitForStoreDirective() {
  return {
    name: "wait-for-store-directive",
    hooks: {
      "astro:config:setup": ({ addClientDirective }) => {
        addClientDirective({
          name: "wait-for-store",
          entrypoint: "./src/directives/wait-for-store.js",
        });
      },
    },
  } as AstroIntegration;
}

export default defineConfig({
  output: "server",
  integrations: [tailwind(), react(), waitForStoreDirective()],
  adapter: wix(),
  image: {
    domains: ["static.wixstatic.com"],
  },
  vite: {
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD ? {
        "react-dom/server": "react-dom/server.edge",
      } : {},
    },
  },
});