export function addStore(storeId: string, something: unknown) {
  console.log("adding store", storeId, something);
  (globalThis as any).stores = (globalThis as any).stores ?? {};
  (globalThis as any).stores[storeId] = something;
}
export function getStore<R>(storeId: string & R): R {
  console.log("getting store", storeId, (globalThis as any).stores?.[storeId]);
  return (globalThis as any).stores?.[storeId];
}
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
