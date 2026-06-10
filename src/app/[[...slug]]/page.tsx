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

  if (!content) {
    return notFound();
  }

  return <RenderBuilderContent content={content} model="tools" />;
}
