import DefaultLayout from 'components/layouts/DefaultLayout';
import { Collection, CollectionBanner, CollectionBody, CollectionDescription, CollectionDetails, CollectionHeader, CollectionMenu } from 'components/modules/Collection/Collection';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import NotFoundPage from 'pages/404';
import { Doppler, getEnvBool } from 'utils/env';

import { useRouter } from 'next/router';

export type CollectionPageRouteParams = {
  address: string;
}

export default function CollectionPage() {
  const router = useRouter();
  const { officialName: officialNameQuery } = router.query;
  const officialName = (officialNameQuery as string)?.replace(/-/g, ' ');
  const defaultChainId = useDefaultChainId();

  const { data: collectionData, loading } = useCollectionQuery(
    {
      chainId: defaultChainId,
      name: officialName
    });
  console.log('%c Line:21 🧀 collectionData', 'color:#465975', collectionData);

  if ((!loading && !collectionData) || !getEnvBool(Doppler.NEXT_PUBLIC_COLLECTION_PAGE_ENABLED)) {
    return <NotFoundPage />;
  }

  if (!loading && collectionData?.collection?.contract) {
    return (
      <Collection name={officialName} contract={collectionData.collection.contract}>
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
