/// <reference path="../.astro/types.d.ts" />

import 'astro'

declare module 'astro' {
  interface AstroClientDirectives {
    'client:wait-for-store'?: string
  }
}

import type { Host } from '@wix/sdk-types';
import type { IStoreManager, IStoreManagerHooks } from './components/headless/StoreManager';

declare global {
  interface ContextualClient {
    host: Host;
  }

  var StoreManager: (IStoreManager & IStoreManagerHooks) | undefined;
  var storeFactories: Record<string, Function> | undefined;
  var stores: Record<string, unknown> | undefined;
}