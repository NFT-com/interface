import DefaultLayout from 'components/layouts/DefaultLayout';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import NotFoundPage from 'pages/404';
import { Doppler, getEnvBool } from 'utils/env';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
const Collection = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.Collection));
const CollectionBanner = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.CollectionBanner));
const CollectionBody = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.CollectionBody));
const CollectionDescription = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.CollectionDescription));
const CollectionDetails = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.CollectionDetails));
const CollectionHeader = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.CollectionHeader));

export type CollectionPageRouteParams = {
  /**
   * A container component that displays a loading animation until the content is loaded.
   * @param {LoadedContainerProps} children - The child components to be displayed.
   * @param {number} durationSec - The duration of the animation in seconds.
   * @param {boolean} fitToParent - Whether or not the container should fit to the size of its parent.
   * @param {boolean} loaded - Whether or not the content has been loaded.
   * @param {boolean} showLoader - Whether or not to show the loading animation.
   * @param {boolean} newLoader - Whether or not to use the new loading animation.
   * @returns A container component that displays a loading animation until the content is loaded.
   */
  address: string;
}

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

  const pageNotFound = useMemo(() => [
    (!loading && Boolean(error)),
    !getEnvBool(Doppler.NEXT_PUBLIC_COLLECTION_PAGE_ENABLED)
  ].includes(true), [loading, error]);

  const pageLoading = loading || !slug;

  // TODO: Add proper loading state fallback & fix page scroll jacking/overflow issue.
  if (pageLoading) {
    return (
      <NotFoundPage />
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
