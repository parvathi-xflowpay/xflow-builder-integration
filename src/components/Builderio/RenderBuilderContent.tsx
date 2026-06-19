'use client';
import { ComponentProps } from 'react';
import dynamic from 'next/dynamic';
import { useIsPreviewing } from '@builder.io/react';
import DefaultErrorPage from 'next/error';
import './builder-registry';

// Render BuilderComponent client-only to avoid SSR/hydration mismatches caused
// by Builder's gen1 SDK generating non-deterministic element IDs (builder-pixel-*)
// on each render pass.
const BuilderComponent = dynamic(
  () => import('@builder.io/react').then((m) => m.BuilderComponent),
  { ssr: false }
);

export type BuilderPageProps = ComponentProps<typeof import('@builder.io/react').BuilderComponent>;

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
