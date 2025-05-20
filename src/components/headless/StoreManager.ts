export function addStore(storeId: string, something: unknown) {
  console.log('adding store', storeId, something);
  (globalThis as any).stores = (globalThis as any).stores ?? {};
  (globalThis as any).stores[storeId] = something;
}
export function getStore<R>(storeId: string & R): R {
  console.log('getting store', storeId, (globalThis as any).stores?.[storeId]);
  return (globalThis as any).stores?.[storeId];
}
