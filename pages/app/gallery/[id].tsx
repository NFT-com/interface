import { Footer } from 'components/elements/Footer';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { GenesisKeyDetailContent } from 'components/modules/Gallery/GenesisKeyDetailContent';
import NotFoundPage from 'pages/404';

import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';

/**
 * Renders a detailed view of a single Genesis Key
 */
export default function GalleryDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  if (id === null || id === undefined || !BigNumber.isBigNumber(id) || !BigNumber.from(id).isZero || BigNumber.from(id).isNegative || BigNumber.from(id).gt(10000)) {
    return <NotFoundPage />;
  }
  
  return (
    <PageWrapper headerOptions={{
      walletOnly: true,
      removeSummaryBanner: true,
      walletPopupMenu: true,
    }}>
      <div className='w-full mt-24 flex flex-col items-center'>
        <GenesisKeyDetailContent id={id} />
        <div className='w-full'>
          <Footer />
        </div>
      </div>
    </PageWrapper>
  );
}