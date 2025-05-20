export function addStore(storeId: string, something: unknown) {
  (globalThis as any).stores = (globalThis as any).stores ?? {};
  (globalThis as any).stores[storeId] = something;
}
export function getStore<R>(storeId: string & R): R {
  return (globalThis as any).stores?.[storeId];
}
