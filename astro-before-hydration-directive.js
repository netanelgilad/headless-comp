/** @type {import('astro').AstroIntegration} */
export default function beforeHydrationDirective() {
  return {
    name: "before-hydration-directive",
    hooks: {
      "astro:config:setup": ({ addClientDirective }) => {
        addClientDirective({
          name: "before-hydration",
          entrypoint: "./src/directives/before-hydration.js",
        });
      },
    },
  };
}
