import { Footer } from 'components/elements/Footer';
import { NetworkErrorTile } from 'components/elements/NetworkErrorTile';
import { NullState } from 'components/elements/NullState';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { GenesisKeyGalleryDetailView } from 'components/modules/Gallery/GenesisKeyGalleryDetailView';
import { useSupportedNetwork } from 'hooks/useSupportedNetwork';

import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';

/**
 * Renders a detailed view of a single Genesis Key
 */
export default function GalleryDetailPage() {
  const { data: account } = useAccount();
  const router = useRouter();
  const { id: urlTokenId } = router.query;

  const { isSupported } = useSupportedNetwork();

  const getGenesisKeyDetailContent = useCallback(() => {
    if (account && !isSupported) {
      return <div className='w-full justify-center flex mt-12'>
        <NetworkErrorTile />
      </div>;
    }
    // Show a 404 for an unminted key.
    if (BigNumber.from(urlTokenId).gt(10000)) {
      return (
        <NullState
          showImage
          primaryMessage='This Genesis Key doesnt exist yet. '
          buttonLabel={'Back to Gallery'}
          onClick={() => {
            router.push('/app/gallery');
          }}/>
      );
    }
    return <div className="flex flex-col h-full w-full items-center justify-center overflow-y-scroll">
      <GenesisKeyGalleryDetailView
        verticalDetail
        hideCloseButton
        id={String(urlTokenId)}
        onClose={() => {
          // nothing
        }}
      />
    </div>;
  }, [account, isSupported, router, urlTokenId]);
  
  return (
    <PageWrapper removePinkSides headerOptions={{
      walletOnly: true,
      sidebar: (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true') ? 'dashboard' : 'hero',
      removeSummaryBanner: true,
      walletPopupMenu: true,
    }}>
      <div className='w-full mt-24 flex flex-col items-center'>
        {getGenesisKeyDetailContent()}
        <div className='w-full'>
          <Footer />
        </div>
      </div>
    </PageWrapper>
  );
}