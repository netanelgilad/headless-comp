// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import wix from "@wix/astro";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [tailwind(), react()],
  adapter: wix(),
  image: {
    domains: ["static.wixstatic.com"],
  },
});