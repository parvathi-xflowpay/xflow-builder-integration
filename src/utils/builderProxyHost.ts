import { Builder } from '@builder.io/react';

const PROXY_PATH = '/api/builder-proxy';

/**
 * When true, client-side Builder SDK content requests go through the local
 * proxy that applies `transformBuilderQueryResponse` to query responses.
 */
export function setBuilderOverrideHostForPreview(shouldUseProxy: boolean) {
  if (typeof window === 'undefined') return;
  Builder.overrideHost = shouldUseProxy
    ? `${window.location.origin}${PROXY_PATH}`
    : undefined;
}
