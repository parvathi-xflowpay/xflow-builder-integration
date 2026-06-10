import { transformBuilderContent } from '@utils/transformBuilderContent';

/**
 * Builder multi-content API returns `{ [requestKey]: BuilderContent[] }`.
 * Only transforms entries that are arrays of content.
 */
export const transformBuilderQueryResponse = (
  body: Record<string, unknown>,
  customData?: Record<string, unknown>,
  replaceFallback?: string
): Record<string, unknown> => {
  for (const key in body) {
    const value = body[key];
    if (Array.isArray(value)) {
      body[key] = value.map((item) =>
        transformBuilderContent(
          item,
          !!item?.meta?.dataSources,
          customData,
          replaceFallback
        )
      );
    }
  }
  return body;
};
