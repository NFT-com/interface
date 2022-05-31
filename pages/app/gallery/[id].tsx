import { Footer } from 'components/elements/Footer';
import { NullState } from 'components/elements/NullState';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { GenesisKeyDetailContent } from 'components/modules/Gallery/GenesisKeyDetailContent';

import { useRouter } from 'next/router';

/**
 * Renders a detailed view of a single Genesis Key
 */
export default function GalleryDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  if( id === null ) {
    return <NullState />;
  }
  
  return (
    <PageWrapper removePinkSides headerOptions={{
      walletOnly: true,
      sidebar: (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true') ? 'dashboard' : 'hero',
      removeSummaryBanner: true,
      walletPopupMenu: true,
    }}>
      <div className='w-full mt-24 flex flex-col items-center'>
        <GenesisKeyDetailContent id={id.toString()} />
        <div className='w-full'>
          <Footer />
        </div>
      </div>
    </PageWrapper>
  );
}