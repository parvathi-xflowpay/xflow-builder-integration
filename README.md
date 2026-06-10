# xflow-builder-repro

Minimal reproduction of the xflow-web Builder.io integration.

## Purpose

Reproduces the full integration layer (proxy, transform pipeline, preview mode, content fetching) with minimal components, for debugging preview/draft mode issues.

## Setup

```bash
cp .env.local.example .env.local
# edit .env.local and set NEXT_PUBLIC_BUILDERIO to your Builder space API key
yarn
yarn dev
```

## Integration layers (copied verbatim from xflow-web)

| File | Role |
|---|---|
| `src/utils/builderRequestWrapper.ts` | Server-side content fetch with cache/preview flags |
| `src/utils/transformBuilderContent.ts` | Resolves `{{ state.x }}` bindings in content blocks |
| `src/utils/transformBuilderQueryResponse.ts` | Applies transform to multi-content API responses |
| `src/utils/builderProxyHost.ts` | Sets `Builder.overrideHost` to `/api/builder-proxy` in preview |
| `src/components/Builderio/RenderBuilderContent.tsx` | Client component wrapping `BuilderComponent` |
| `src/app/api/builder-proxy/[...path]/route.ts` | Proxies Builder SDK requests through the transform pipeline |

## Registered components (tools model)

- **SimpleHero** — title, subtitle, CTA link
- **CardList** — section title + list of cards (title + description)
- **FaqBlock** — section title + FAQ accordion (question + answer)

## Testing preview/draft mode

1. Open the Builder.io visual editor and set the preview URL to `http://localhost:3000`
2. Navigate to a page that uses the `tools` model
3. Make a draft change — it should appear immediately via the proxy
4. Check Network tab: in preview mode, Builder SDK requests go through `/api/builder-proxy/*`; in production they go directly to `cdn.builder.io`
