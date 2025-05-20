import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import wix from "@wix/astro";
import react from "@astrojs/react";

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
  };
}

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [tailwind(), react(), waitForStoreDirective()],
  adapter: wix(),
  image: {
    domains: ["static.wixstatic.com"],
  },
});
