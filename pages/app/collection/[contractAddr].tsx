import DefaultLayout from 'components/layouts/DefaultLayout';
import { Collection, CollectionBanner, CollectionBody, CollectionDescription, CollectionDetails, CollectionHeader, CollectionMenu } from 'components/modules/Collection/Collection';
import NotFoundPage from 'pages/404';
import { Doppler, getEnvBool } from 'utils/env';

import { ethers } from 'ethers';
import { useRouter } from 'next/router';

export type CollectionPageRouteParams = {
  address: string;
}

export default function CollectionPage() {
  const router = useRouter();
  const { contractAddr } = router.query;
  console.log('%c Line:16 🥟 contractAddr', 'color:#33a5ff', contractAddr);

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
