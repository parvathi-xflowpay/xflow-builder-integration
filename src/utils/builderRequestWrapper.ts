import { GetContentOptions } from '@builder.io/sdk';
import http from './http';
import { transformBuilderQueryResponse } from './transformBuilderQueryResponse';

type IBuilderFetchOptionsProps = GetContentOptions & {
  /**
   * Boolean to decide whether to return the fetch from the Builder content as a list
   * or only the first object from the list.
   */
  fetchAsList?: boolean;
  customData?: Record<string, any>;
  replaceFallback?: string;
};
const apiKey = process.env.NEXT_PUBLIC_BUILDERIO;
const isDevelopment = process.env.NODE_ENV === 'development';
const isPreviewEnabled = process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true';

export const builderFetch = async (
  model,
  options: IBuilderFetchOptionsProps = {}
) => {
  const { fetchAsList, customData, replaceFallback, ...restOptions } = options;
  const finalOptions = {
    cachebust: isPreviewEnabled || isDevelopment,
    includeUnpublished: isPreviewEnabled || isDevelopment,
    preview: isPreviewEnabled,
    cacheSeconds: 0,
    enrich: true,
    apiKey,
    ...restOptions,
  };

  //recursive function to build query useful for values in object
  const buildQuery = (obj, constructedKey = '') => {
    return Object.keys(obj).reduce((queryString, key) => {
      const value = obj[key];
      const fullKey = constructedKey ? `${constructedKey}.${key}` : key;

      if (typeof value === 'object' && value !== null) {
        return queryString + buildQuery(value, fullKey);
      }

      return queryString + `${fullKey}=${value}&`;
    }, '');
  };

  const query = buildQuery(finalOptions);
  const content: Record<string, any> = await http.get(
    `${process.env.NEXT_BUILDER_API}${model}?${query}`,
    !(isPreviewEnabled || isDevelopment)
      ? {
          cache: 'default',
          next: {
            revalidate: 300,
          },
        }
      : { cache: 'no-cache' }
  );
  const transformedContent = transformBuilderQueryResponse(
    content,
    customData,
    replaceFallback
  );
  return fetchAsList
    ? transformedContent
    : (transformedContent as { results: any[] })?.results?.[0];
};
