// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import wix from "@wix/astro";
import react from "@astrojs/react";
import beforeHydrationDirective from "./astro-before-hydration-directive.js";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [tailwind(), react(), beforeHydrationDirective()],
  adapter: wix(),
  image: {
    domains: ["static.wixstatic.com"],
  },
});
