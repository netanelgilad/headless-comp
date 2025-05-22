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
  executeWhenReady();
}

export function getStoreFactory(storeSlug: string) {
  return (globalThis as any).storeFactories?.[storeSlug];
}

const withStoreFactory = (storeSlug: string, handler: (manager: any, storeFactory: any) => void) => {
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


executeWhenReady();

function executeWhenReady() {
  if ((globalThis as any).StoreManager && Array.isArray((globalThis as any).StoreManager.whenStoreFactoryReady)) {
    const includeFilter = ([storeSlug]: [string]) => !!(globalThis as any).storeFactories?.[storeSlug];
    const whenReadyAndSlugIsHere = (globalThis as any).StoreManager.whenStoreFactoryReady.filter(includeFilter);

    whenReadyAndSlugIsHere.forEach(([storeSlug, handler]: [string, (manager: any, storeFactory: any) => void]) => {
      withStoreFactory(storeSlug, handler);
    });

    (globalThis as any).StoreManager.whenStoreFactoryReady = (globalThis as any).StoreManager.whenStoreFactoryReady.filter( (whenReadyPartialArgs: [string]) => !includeFilter(whenReadyPartialArgs) );
  }
}


(globalThis as any).StoreManager = {
  ...(globalThis as any).StoreManager,
  ...manager,
};