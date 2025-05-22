export function addStore(storeId: string, something: unknown) {
  globalThis.stores = globalThis.stores ?? {};
  globalThis.stores[storeId] = something;
}
export function getStore<R>(storeId: string & R): R {
  return globalThis.stores?.[storeId] as R;
}

export function registerStore(storeSlug: string, storeFactory: (...args: any[]) => any) {
  globalThis.storeFactories = globalThis.storeFactories ?? {};
  globalThis.storeFactories[storeSlug] = storeFactory;
  executeWhenReady();
}

export function getStoreFactory(storeSlug: string) {
  return globalThis.storeFactories?.[storeSlug];
}

const withStoreFactory = (storeSlug: string, handler: (manager: StoreManagerType, storeFactory: Function) => void) => {
  const actualStoreFactory = getStoreFactory(storeSlug);
  if (actualStoreFactory) {
    handler(manager, actualStoreFactory);
  }
}

const manager = {
  addStore,
  getStore,
  registerStore,
  getStoreFactory,
  withStoreFactory,
}

interface StoreManagerType {
  addStore: typeof addStore;
  getStore: typeof getStore;
  registerStore: typeof registerStore;
  getStoreFactory: typeof getStoreFactory;
  withStoreFactory: typeof withStoreFactory;
}
 
interface StoreManagerTypeHooks {
  whenStoreFactoryReady?: [string, (manager: StoreManagerType, storeFactory: Function) => void][];
}


declare global {
  var StoreManager: StoreManagerType & StoreManagerTypeHooks | undefined;
  var storeFactories: Record<string, Function> | undefined;
  var stores: Record<string, unknown> | undefined;
}


function executeWhenReady() {
  if (globalThis.StoreManager && Array.isArray(globalThis.StoreManager.whenStoreFactoryReady)) {
    const includeFilter = ([storeSlug, _]: [string, (manager: StoreManagerType, storeFactory: Function) => void]) => !!globalThis.storeFactories?.[storeSlug];
    const whenReadyAndSlugIsHere = globalThis.StoreManager.whenStoreFactoryReady.filter(includeFilter);

    whenReadyAndSlugIsHere.forEach(([storeSlug, handler]) => {
      withStoreFactory(storeSlug, handler);
    });

    globalThis.StoreManager.whenStoreFactoryReady = globalThis.StoreManager.whenStoreFactoryReady.filter(
      (whenReadyPartialArgs: [string, (manager: StoreManagerType, storeFactory: Function) => void]) => !includeFilter(whenReadyPartialArgs)
    );
  }
}

executeWhenReady();

globalThis.StoreManager = {
  ...globalThis.StoreManager,
  ...manager,
};