# xflow-builder-integration

Minimal reproduction of the xflow-web Builder.io integration — basic setup only.

## Purpose

Reproduces the core Builder.io integration (content fetching, preview mode, component registration) with minimal moving parts, for isolating issues.

## Setup

```bash
cp .env.local.example .env.local
# edit .env.local and set NEXT_PUBLIC_BUILDERIO to your Builder space API key
yarn
yarn dev
```

## Integration layers

| File | Role |
|---|---|
| `src/utils/builderRequestWrapper.ts` | Server-side content fetch with cache/preview flags |
| `src/components/Builderio/RenderBuilderContent.tsx` | Client component wrapping `BuilderComponent` |

## Registered components (tools model)

- **SimpleHero** — title, subtitle, CTA link
- **CardList** — section title + list of cards (title + description)
- **FaqBlock** — section title + FAQ accordion (question + answer)

## Testing preview mode

1. Open the Builder.io visual editor and set the preview URL to `http://localhost:3000`
2. Navigate to a page that uses the `tools` model
3. Make a draft change — it should appear immediately via `useIsPreviewing`
