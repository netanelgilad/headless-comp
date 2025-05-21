// StoreManager.ts

// --- START TYPE DEFINITIONS ---

// Renamed interface to IStoreManager to avoid potential naming conflicts
export interface IStoreManager {
  addStore: (storeId: string, something: unknown) => void;
  getStore: <R>(storeId: string & R) => R;
  registerStore: (storeSlug: string, storeFactory: (...args: any[]) => any) => void;
  getStoreFactory: (storeSlug: string) => Function | undefined;
  executeWhenReady: () => void;
}

export interface IStoreManagerHooks {
  whenStoreFactoryReady: Array<HydrationTask>;
}

export interface HydrationTask {
  storeId: string;
  storeSlug: string;
  initialState: {
      dependantStoreIds?: Record<string, string>;
      [key: string]: any;
  };
  handler: (manager: IStoreManager, storeFactory: Function) => void;
}

type StoreManagerType = IStoreManager & IStoreManagerHooks;
// --- END TYPE DEFINITIONS ---


// --- START FUNCTION IMPLEMENTATIONS ---

const MAX_HYDRATION_CYCLES = 100;

function executeWhenReady(): void {
  const currentGlobalManager = globalThis.StoreManager as StoreManagerType;
  // After this check, currentGlobalManager is narrowed to (IStoreManager & IStoreManagerHooks)
  if (!currentGlobalManager || currentGlobalManager.whenStoreFactoryReady.length === 0) {
      return;
  }

  console.log('StoreManager: executeWhenReady triggered. Queue size:', currentGlobalManager.whenStoreFactoryReady.length);

  let itemsToProcess = currentGlobalManager.whenStoreFactoryReady;
  let madeProgressThisCycle = true;
  let cycleCount = 0;

  while (itemsToProcess.length > 0 && madeProgressThisCycle && cycleCount < MAX_HYDRATION_CYCLES) {
      madeProgressThisCycle = false;
      cycleCount++;
      const remainingItemsForNextCycle: HydrationTask[] = [];
      console.log(`StoreManager: Hydration cycle ${cycleCount}. Tasks remaining: ${itemsToProcess.length}`);

      for (const task of itemsToProcess) {
          // currentGlobalManager is now known to be IStoreManager & IStoreManagerHooks
          const storeFactory = currentGlobalManager.getStoreFactory(task.storeSlug);

          if (!storeFactory) {
              remainingItemsForNextCycle.push(task);
              continue;
          }

          let dependenciesMet = true;
          const depIdRecord = task.initialState?.dependantStoreIds;
          const dependentStoreIds: string[] = depIdRecord ? Object.values(depIdRecord) : [];

          if (dependentStoreIds.length > 0) {
              for (const depStoreId of dependentStoreIds) {
                  const currentStores = globalThis.stores;
                  if (!currentStores || !currentStores[depStoreId]) {
                      dependenciesMet = false;
                      console.log(`StoreManager: Store ${task.storeId} (slug: ${task.storeSlug}) waiting for dependency: ${depStoreId}`);
                      break;
                  }
              }
          }

          if (dependenciesMet) {
              console.log(`StoreManager: Dependencies met for ${task.storeId} (slug: ${task.storeSlug}). Hydrating.`);
              try {
                  task.handler(currentGlobalManager, storeFactory); // Pass the correctly typed manager
                  if (globalThis.stores?.[task.storeId]) {
                      console.log(`StoreManager: Successfully hydrated store ${task.storeId}`);
                      madeProgressThisCycle = true;
                  } else {
                      console.warn(`StoreManager: Handler for ${task.storeId} ran, but store not found in globalThis.stores. Re-queuing.`);
                      remainingItemsForNextCycle.push(task);
                  }
              } catch (error) {
                  console.error(`StoreManager: Error hydrating store ${task.storeId} (slug: ${task.storeSlug}):`, error);
                  remainingItemsForNextCycle.push(task);
              }
          } else {
              remainingItemsForNextCycle.push(task);
          }
      }

      itemsToProcess = remainingItemsForNextCycle;
      currentGlobalManager.whenStoreFactoryReady = itemsToProcess;

      if (itemsToProcess.length > 0 && !madeProgressThisCycle) {
          console.warn(
              `StoreManager: No progress in hydration cycle ${cycleCount}, but ${itemsToProcess.length} tasks remain. ` +
              `This may indicate missing factories, circular dependencies, or unresolvable missing dependent stores.`
          );
          itemsToProcess.forEach((t: HydrationTask) => {
               const depIdRecordForWarning = t.initialState?.dependantStoreIds;
               const dependentStoreIdsForWarning : string[] = depIdRecordForWarning ? Object.values(depIdRecordForWarning) : [];
               const currentStores = globalThis.stores;
               const missingDeps = dependentStoreIdsForWarning.filter(id => currentStores ? !currentStores[id] : true);
               const factoryMissing = !currentGlobalManager.getStoreFactory(t.storeSlug);
               console.warn(`  - Task for storeId: ${t.storeId}, slug: ${t.storeSlug}. Factory Missing: ${factoryMissing}. Missing Dependencies: ${missingDeps.join(', ') || '(none)'}`);
          });
          break;
      }
  }

  if (cycleCount >= MAX_HYDRATION_CYCLES && itemsToProcess.length > 0) {
      console.error("StoreManager: Exceeded max hydration cycles. Aborting. Remaining tasks:", itemsToProcess);
  }
  console.log('StoreManager: executeWhenReady finished.');
}

export function addStore(storeId: string, something: unknown): void {
  console.log('StoreManager: addStore', storeId);
  globalThis.stores = globalThis.stores ?? {};
  if (globalThis.stores[storeId] && globalThis.stores[storeId] !== something) {
      console.warn(`StoreManager: Overwriting existing store for ID ${storeId}.`);
  }
  globalThis.stores[storeId] = something;

  const sm = globalThis.StoreManager as StoreManagerType;
  if (sm) { // Check if StoreManager exists
      queueMicrotask(() => sm.executeWhenReady());
  }
}

export function getStore<R>(storeId: string & R): R {
  console.log('StoreManager: getStore', storeId, globalThis.stores?.[storeId]);
  return globalThis.stores?.[storeId as string] as R;
}

export function registerStore(storeSlug: string, storeFactoryFunc: (...args: any[]) => any): void {
  console.log('StoreManager: registerStore', storeSlug);
  globalThis.storeFactories = globalThis.storeFactories ?? {};
  globalThis.storeFactories[storeSlug] = storeFactoryFunc;

  const sm = globalThis.StoreManager as StoreManagerType;
  if (sm) { // Check if StoreManager exists
      queueMicrotask(() => sm.executeWhenReady());
  }
}

export function getStoreFactory(storeSlug: string): Function | undefined {
  return globalThis.storeFactories?.[storeSlug];
}

const managerImplementation: IStoreManager = {
  addStore,
  getStore,
  registerStore,
  getStoreFactory,
  executeWhenReady,
};
// --- END FUNCTION IMPLEMENTATIONS ---


// --- START GLOBAL INITIALIZATION ---
const initialHooks: IStoreManagerHooks = {
  whenStoreFactoryReady: (globalThis.StoreManager as StoreManagerType)?.whenStoreFactoryReady || []
};

const newStoreManager: IStoreManager & IStoreManagerHooks = {
  ...managerImplementation, // Methods
  ...initialHooks,          // Hooks (especially whenStoreFactoryReady)
};
globalThis.StoreManager = newStoreManager;

queueMicrotask(() => {
  // StoreManager should be defined at this point since we just assigned it
  (globalThis.StoreManager as IStoreManager & IStoreManagerHooks).executeWhenReady();
});
// --- END GLOBAL INITIALIZATION ---