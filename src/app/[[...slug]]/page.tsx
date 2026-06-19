import { RenderBuilderContent } from '@components/Builderio/RenderBuilderContent';
import { builderFetch } from '@utils/builderRequestWrapper';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const slug = params.slug;
  const urlPath = '/' + (slug?.join('/') || '');

  const content = await builderFetch('tools', {
    userAttributes: { urlPath },
  });

  const isPreview = process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true';
  if (!content && !isPreview) {
    return notFound();
  }

  return <RenderBuilderContent content={content ?? null} model="tools" />;
}
