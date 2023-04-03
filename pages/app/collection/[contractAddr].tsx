import LoaderPageFallback from 'components/elements/Loader/LoaderPageFallback';
import DefaultLayout from 'components/layouts/DefaultLayout';
import NotFoundPage from 'pages/404';
import { Doppler, getEnvBool } from 'utils/env';

import { ethers } from 'ethers';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const Collection = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.Collection), { loading: () => <LoaderPageFallback /> }); // Adds fallback while loading Collection
const CollectionBanner = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.CollectionBanner));
const CollectionBody = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.CollectionBody));
const CollectionDescription = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.CollectionDescription));
const CollectionDetails = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.CollectionDetails));
const CollectionHeader = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.CollectionHeader));

export default function CollectionPage() {
  const router = useRouter();
  const { contractAddr } = router.query;
  const caseInsensitiveAddr = contractAddr?.toString().toLowerCase();
  if (!ethers.utils.isAddress(caseInsensitiveAddr) || !getEnvBool(Doppler.NEXT_PUBLIC_COLLECTION_PAGE_ENABLED)) {
    return <NotFoundPage />;
  }

  return (
    <Collection contract={contractAddr as string} >
      <CollectionBanner />
      <CollectionHeader>
        <CollectionDescription />
        <CollectionDetails />
      </CollectionHeader>
      <CollectionBody />
    </Collection >
  );
}

CollectionPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  );
};
