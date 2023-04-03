import LoaderPageFallback from 'components/elements/Loader/LoaderPageFallback';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import NotFoundPage from 'pages/404';
import { Doppler, getEnvBool } from 'utils/env';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const Collection = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.Collection), { loading: () => <LoaderPageFallback /> }); // Adds fallback while loading Collection
const CollectionBanner = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.CollectionBanner));
const CollectionBody = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.CollectionBody));
const CollectionDescription = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.CollectionDescription));
const CollectionDetails = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.CollectionDetails));
const CollectionHeader = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.CollectionHeader));

export default function CollectionPage() {
  const router = useRouter();
  const { slug: slugQuery } = router.query;
  const slug = slugQuery && slugQuery.toString();
  const defaultChainId = useDefaultChainId();
  const { data: collectionData, loading, error } = useCollectionQuery(
    {
      chainId: defaultChainId,
      slug: slug,
    });
  const isPageDisabled = !getEnvBool(Doppler.NEXT_PUBLIC_COLLECTION_PAGE_ENABLED);

  const pageNotFound = useMemo(() => ([
    (!loading && Boolean(error)),
    isPageDisabled
  ].includes(true)), [loading, error, isPageDisabled]);

  const pageLoading = useMemo(() => loading || !slug, [loading, slug]);

  if (pageLoading) {
    return (
      <LoaderPageFallback />
    );
  }

  if (pageNotFound) return (<NotFoundPage />);

  if (!loading && collectionData?.collection?.contract) {
    return (
      <Collection slug={slug} contract={collectionData.collection.contract}>
        <CollectionBanner />
        <CollectionHeader>
          <CollectionDescription />
          <CollectionDetails />
        </CollectionHeader>
        <CollectionBody />
      </Collection>
    );
  }
}

CollectionPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  );
};
