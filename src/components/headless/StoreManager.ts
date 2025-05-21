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

(globalThis as any).StorageManager = {
  addStore,
  getStore,
  registerStore,
  getStoreFactory,
};
