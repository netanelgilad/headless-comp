export function addStore(storeId: string, something: unknown) {
  globalThis.stores = globalThis.stores ?? {};
  globalThis.stores[storeId] = something;
}
export function getStore<R>(storeId: string & R): R {
  console.log('getStore', storeId, globalThis.stores?.[storeId]);
  return globalThis.stores?.[storeId] as R;
}

export function registerStore(storeSlug: string, storeFactory: (...args: any[]) => any) {
  console.log('registerStore', storeSlug, storeFactory);
  globalThis.storeFactories = globalThis.storeFactories ?? {};
  globalThis.storeFactories[storeSlug] = storeFactory;
  executeWhenReady();
}

export function getStoreFactory(storeSlug: string) {
  return globalThis.storeFactories?.[storeSlug];
}

const withStoreFactory = (storeSlug: string, handler: (manager: StoreManagerType, storeFactory: Function) => void) => {
  console.log('withStoreFactory', storeSlug, handler);
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

type StoreFactoryReadyItem = [string, (manager: StoreManagerType, storeFactory: Function) => void];
interface StoreManagerTypeHooks {
  whenStoreFactoryReady?: Array<StoreFactoryReadyItem>;
}


declare global {
  var StoreManager: StoreManagerType & StoreManagerTypeHooks | undefined;
  var storeFactories: Record<string, Function> | undefined;
  var stores: Record<string, unknown> | undefined;
}


function executeWhenReady() {
  if (globalThis.StoreManager && Array.isArray(globalThis.StoreManager.whenStoreFactoryReady)) {
    const includeFilter = (item: StoreFactoryReadyItem): boolean => {
      const [storeSlug] = item;
      return !!globalThis.storeFactories?.[storeSlug];
    };
    
    const whenReadyAndSlugIsHere = globalThis.StoreManager.whenStoreFactoryReady.filter(
      (item): item is StoreFactoryReadyItem => includeFilter(item as StoreFactoryReadyItem)
    );

    whenReadyAndSlugIsHere.forEach(([storeSlug, handler]) => {
      withStoreFactory(storeSlug, handler);
    });

    globalThis.StoreManager.whenStoreFactoryReady = globalThis.StoreManager.whenStoreFactoryReady.filter(
      item => !includeFilter(item as StoreFactoryReadyItem) // wtf? why I need the cast?
    );
  }
}

executeWhenReady();

globalThis.StoreManager = {
  ...globalThis.StoreManager,
  ...manager,
};