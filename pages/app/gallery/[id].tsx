import { Footer } from 'components/elements/Footer';
import Loader from 'components/elements/Loader';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { GenesisKeyDetailContent } from 'components/modules/Gallery/GenesisKeyDetailContent';

import { useRouter } from 'next/router';
import { tw } from 'utils/tw';

/**
 * Renders a detailed view of a single Genesis Key
 */
export default function GalleryDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  if (id === null || id === undefined) {
    return <div className={tw(
      'text-primary-txt dark:text-primary-txt-dk flex flex-col',
      'items-center justify-center h-screen'
    )}>
      <div className="mb-2">Loading...</div>
      <Loader />
    </div>
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