# Builder.io Integration — Issue Brief & Fix Guide

This document covers the root causes behind the reported editor freeze, Live Draft persistence issues, and console warnings, along with the exact code changes needed to resolve them.

---

## Issue 1: 30-second editor freeze on new/draft pages

**Root cause:** When the Builder editor iframes a preview URL for a page that has no saved content yet, the server returns a 404 before `BuilderComponent` ever mounts. The Builder SDK never initializes its `postMessage` listener, so the editor waits up to 30 seconds for a handshake that never comes. This also explains why Live Draft changes don't appear — the iframe is a dead 404 page.

**Fix — `src/app/[[...slug]]/page.tsx`**

```diff
- if (!content) {
-   return notFound();
- }
- return <RenderBuilderContent content={content} model="tools" />;

+ const isPreview = process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true';
+ if (!content && !isPreview) {
+   return notFound();
+ }
+ return <RenderBuilderContent content={content ?? null} model="tools" />;
```

In preview mode, render `RenderBuilderContent` even when content is null. The component already handles the empty state — `BuilderComponent` mounts, the SDK handshake completes, and the editor can push live draft data normally.

---

## Issue 2: `Codebase API key(s): null` warning in editor

**Root cause:** `Builder.init(apiKey)` was never called explicitly. The SDK was only initialized as a side effect of `BuilderComponent` rendering via the `apiKey` prop. If the component hadn't mounted yet (e.g. during the 404 case above), the editor's probe found no active SDK instance.

**Fix — `src/components/Builderio/builder-registry.ts`**

```diff
- import { Builder } from '@builder.io/react';
+ import { Builder, builder } from '@builder.io/react';

+ builder.init(process.env.NEXT_PUBLIC_BUILDERIO!);

  Builder.registerComponent(SimpleHero, { ... });
  // rest of registrations unchanged
```

Call `builder.init()` at the top of the registry file so the SDK is ready as soon as the module loads, before any component renders.

---

## Issue 3: Hydration mismatch errors in console

**Root cause:** Builder's gen1 SDK (`@builder.io/react`) generates random element IDs (e.g. `builder-pixel-*`) on each render. The server generates one ID, the client generates a different one — React flags this as a hydration mismatch. This is a fundamental incompatibility between the gen1 SDK and Next.js App Router SSR.

**Fix — `src/components/Builderio/RenderBuilderContent.tsx`**

```diff
- import { BuilderComponent, useIsPreviewing } from '@builder.io/react';
+ import dynamic from 'next/dynamic';
+ import { useIsPreviewing } from '@builder.io/react';

+ const BuilderComponent = dynamic(
+   () => import('@builder.io/react').then((m) => m.BuilderComponent),
+   { ssr: false }
+ );
```

Loading `BuilderComponent` via `next/dynamic` with `ssr: false` means Next.js won't server-render the Builder tree at all — no SSR HTML is emitted, so there's nothing to mismatch on the client.

> **Long-term recommendation:** Migrate to Builder's gen2 SDK (`@builder.io/sdk-react`) which was purpose-built for Next.js App Router and produces deterministic output. The gen1 SDK predates App Router and has this incompatibility by design.

---

## Issue 4: URL values not encoded in API requests (latent bug)

**Root cause:** The function that builds Builder CDN query strings concatenated raw values without `encodeURIComponent()`. URL paths like `/tools/payments` happen to work, but values containing `&`, `#`, `+`, or spaces silently corrupt the query string and can return zero results for certain page paths.

**Fix — `src/utils/builderRequestWrapper.ts`**

```diff
- return queryString + `${fullKey}=${value}&`;
+ return queryString + `${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}&`;
```

---

## Issue 5: `enrich: true` always on (performance)

**Root cause:** The `enrich` flag was hardcoded to `true`, causing Builder's CDN to join all referenced content entries into every API response. For pages with linked references, this multiplies payload size and latency by 2–5×.

**Fix — `src/utils/builderRequestWrapper.ts`**

```diff
- enrich: true,
+ enrich: false,
```

Opt in per-call when enriched references are actually needed by passing `{ enrich: true }` as an option to `builderFetch`.

---

## Issue 6: Outdated SDK versions

| Package | Was | Now |
|---|---|---|
| `@builder.io/react` | `^3.2.9` | `^9.4.0` |
| `@builder.io/sdk` | `^2.2.4` | `^6.3.0` |

Notable improvements in newer versions: better visual editor state inspector reliability (directly relevant to the reported freeze), `sizes="auto"` on images to prevent oversized downloads, and `enrichOptions` for fine-grained reference enrichment control.

**Fix — `package.json`**

```diff
- "@builder.io/react": "^3.2.9",
- "@builder.io/sdk": "^2.2.4",
+ "@builder.io/react": "^9.4.0",
+ "@builder.io/sdk": "^6.3.0",
```

Then run:

```bash
yarn install
# or
npm install
```

> **Node version requirement:** `@builder.io/react` v9+ requires Node 22+. Versions 18 and 20 are not supported.

---

## Summary of files changed

| File | Changes |
|---|---|
| `src/app/[[...slug]]/page.tsx` | Don't 404 in preview mode when content is null |
| `src/components/Builderio/builder-registry.ts` | Add `builder.init()` before component registration |
| `src/components/Builderio/RenderBuilderContent.tsx` | Load `BuilderComponent` via `dynamic` with `ssr: false` |
| `src/utils/builderRequestWrapper.ts` | URL-encode query values; default `enrich` to `false` |
| `package.json` | Upgrade Builder.io SDK packages to latest |
