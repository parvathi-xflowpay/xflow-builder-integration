'use client';
import { ComponentProps } from 'react';
import { BuilderComponent, useIsPreviewing } from '@builder.io/react';
import DefaultErrorPage from 'next/error';
import './builder-registry';

export type BuilderPageProps = ComponentProps<typeof BuilderComponent>;

export function RenderBuilderContent({
  content,
  model,
  ...rest
}: BuilderPageProps) {
  const isPreviewing =
    process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true' || useIsPreviewing();

  if (content || isPreviewing) {
    return (
      <BuilderComponent
        content={content}
        model={model}
        apiKey={process.env.NEXT_PUBLIC_BUILDERIO}
        {...rest}
      />
    );
  }
  return <DefaultErrorPage statusCode={404} />;
}
