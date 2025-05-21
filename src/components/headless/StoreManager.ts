export function addStore(storeId: string, something: unknown) {
  (globalThis as any).stores = (globalThis as any).stores ?? {};
  (globalThis as any).stores[storeId] = something;
}
export function getStore<R>(storeId: string & R): R {
  return (globalThis as any).stores?.[storeId];
}

export function registerStore(storeSlug: string, storeFactory: (...args: any[]) => any) {
  (globalThis as any).storeFactories = (globalThis as any).storeFactories ?? {};
  (globalThis as any).storeFactories[storeSlug] = storeFactory;
}

export function getStoreFactory(storeSlug: string) {
  return (globalThis as any).storeFactories?.[storeSlug];
}

const withStoreFactory = (storeSlug: string, handler: (manager: any, storeFactory: any) => void) => {
  console.log("withStoreFactory", storeSlug, handler);
  const actualStoreFactory = getStoreFactory(storeSlug);
  handler(manager, actualStoreFactory);
}

const manager = {
  addStore,
  getStore,
  registerStore,
  getStoreFactory,
  withStoreFactory,
}

if ((globalThis as any).StoreManager && Array.isArray((globalThis as any).StoreManager.withStoreFactory)) {
  (globalThis as any).StoreManager.withStoreFactory.forEach((args: any[]) => {
    // @ts-expect-error
    withStoreFactory(...args);
  });
}


(globalThis as any).StoreManager = manager;