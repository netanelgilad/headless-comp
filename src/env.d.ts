/// <reference path="../.astro/types.d.ts" />

import 'astro'

declare module 'astro' {
  interface AstroClientDirectives {
    'client:wait-for-store'?: string
  }
}

import type { Host } from '@wix/sdk-types';

declare global {
  interface ContextualClient {
    host: Host;
  }
}