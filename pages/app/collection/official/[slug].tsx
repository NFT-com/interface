import { useMemo } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { SWRConfig } from 'swr';

import LoaderPageFallback from 'components/elements/Loader/LoaderPageFallback';
import DefaultLayout from 'components/layouts/DefaultLayout';
import DefaultSEO from 'config/next-seo.config';
import { CollectionResponse, useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { getCollectionPage } from 'lib/graphql-ssr/collection';
import NotFoundPage from 'pages/404';
import { Doppler, getEnvBool } from 'utils/env';

const Collection = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.Collection), {
  loading: () => <LoaderPageFallback />
}); // Adds fallback while loading Collection
const CollectionBanner = dynamic(() =>
  import('components/modules/Collection/Collection').then(mod => mod.CollectionBanner)
);
const CollectionBody = dynamic(() =>
  import('components/modules/Collection/Collection').then(mod => mod.CollectionBody)
);
const CollectionDescription = dynamic(() =>
  import('components/modules/Collection/Collection').then(mod => mod.CollectionDescription)
);
const CollectionDetails = dynamic(() =>
  import('components/modules/Collection/Collection').then(mod => mod.CollectionDetails)
);
const CollectionHeader = dynamic(() =>
  import('components/modules/Collection/Collection').then(mod => mod.CollectionHeader)
);

export default function OfficialCollectionSlugPage({
  fallback
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { collection: preCollection } = Object.values(fallback)[0] ?? {};
  const router = useRouter();
  const { slug: slugQuery } = router.query;
  const slug = slugQuery && slugQuery.toString();
  const defaultChainId = useDefaultChainId();

  const seoTitle = `NFT Collection: ${preCollection?.name}`;
  const seoConfig = {
    ...DefaultSEO,
    title: seoTitle,
    description: preCollection?.description,
    openGraph: {
      url: `https://www.nft.com/app/collection/official/${slug}`,
      title: seoTitle,
      description: preCollection?.description,
      images: [
        {
          url: preCollection?.logoUrl,
          alt: `${preCollection?.name} Logo`
        }
      ],
      site_name: 'NFT.com'
    }
  };

  const {
    data: collectionData,
    loading,
    error
  } = useCollectionQuery({
    chainId: defaultChainId,
    slug
  });

  const isPageDisabled = !getEnvBool(Doppler.NEXT_PUBLIC_COLLECTION_PAGE_ENABLED);

  const pageNotFound = useMemo(
    () => [!loading && Boolean(error), isPageDisabled].includes(true),
    [loading, error, isPageDisabled]
  );
  const pageLoading = useMemo(() => loading || !slug, [loading, slug]);

  if (pageLoading) {
    return <LoaderPageFallback />;
  }

  if (pageNotFound) return <NotFoundPage />;

  if (!loading && collectionData?.collection?.contract) {
    return (
      <SWRConfig value={{ fallback }}>
        <NextSeo {...seoConfig} />
        <Collection slug={slug} contract={collectionData.collection.contract}>
          <CollectionBanner />
          <CollectionHeader>
            <CollectionDescription />
            <CollectionDetails />
          </CollectionHeader>
          <CollectionBody />
        </Collection>
      </SWRConfig>
    );
  }
}

OfficialCollectionSlugPage.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export const getServerSideProps: GetServerSideProps<{
  fallback: {
    [x: string]: CollectionResponse;
  };
}> = async ({ params }) => {
  return getCollectionPage(params);
};
