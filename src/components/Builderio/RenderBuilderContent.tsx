'use client';
import { ComponentProps, createContext, useContext } from 'react';
import { BuilderComponent, useIsPreviewing } from '@builder.io/react';
import { setBuilderOverrideHostForPreview } from '@utils/builderProxyHost';
import { Builder } from '@builder.io/react';
import DefaultErrorPage from 'next/error';
import './builder-registry';

export type BuilderPageProps = ComponentProps<typeof BuilderComponent> & {
  context?: Record<string, any>;
  replaceFallback?: string;
};

const BuilderPageContext = createContext<Record<string, any>>({});

export function useBuilderPageContext() {
  return useContext(BuilderPageContext);
}

export function RenderBuilderContent({
  content,
  model,
  context,
  data, // custom data to be passed to use for data binding; ensure that it is also passed to the builderFetch call
  replaceFallback, // replace fallback to be used for data binding
  ...rest
}: BuilderPageProps) {
  // Call the useIsPreviewing hook to determine if
  // the page is being previewed in Builder
  const _isBuilderPreviewing = useIsPreviewing();
  const isPreviewing =
    process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true' || _isBuilderPreviewing;

  setBuilderOverrideHostForPreview(isPreviewing || Builder.isEditing);
  // If "content" has a value or the page is being previewed in Builder,
  // render the BuilderComponent with the specified content and model props.
  if (content || isPreviewing) {
    return (
      <BuilderPageContext.Provider value={context}>
        <BuilderComponent
          content={content}
          model={model}
          apiKey={process.env.NEXT_PUBLIC_BUILDERIO}
          context={context}
          data={data}
          {...rest}
          options={{
            noEditorUpdates: false,
            query: {
              ...rest?.options?.query,
              customData: data,
              replaceFallback: replaceFallback,
            },
          }}
        />
      </BuilderPageContext.Provider>
    );
  }
  // If the "content" is falsy and the page is
  // not being previewed in Builder, render the
  // DefaultErrorPage with a 404.
  return <DefaultErrorPage statusCode={404} />;
}
