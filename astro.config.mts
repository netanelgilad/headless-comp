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
});