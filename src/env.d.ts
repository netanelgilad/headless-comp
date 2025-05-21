/// <reference path="../.astro/types.d.ts" />

import 'astro'

declare module 'astro' {
  interface AstroClientDirectives {
    'client:wait-for-store'?: string
  }
}