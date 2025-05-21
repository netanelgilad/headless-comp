import type { ClientDirective } from "astro";

export default <ClientDirective>(async (load, { value: storeId }) => {
  const [hydrate] = await Promise.all([load(), waitForStore(storeId)]);
  await hydrate();
});

export function waitForStore(
    storeId: string,
    { interval = 50, timeout = 5000 } = {}
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      function check() {
        const store = (globalThis as any).stores?.[storeId];
        if (store) {
          resolve(store);
        } else if (Date.now() - start > timeout) {
          reject(
            new Error(`Store with id ${storeId} was not initialized in time`)
          );
        } else {
          setTimeout(check, interval);
        }
      }
      check();
    });
  }