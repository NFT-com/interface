import { Footer } from 'components/elements/Footer';
import { NullState } from 'components/elements/NullState';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { GenesisKeyDetailContent } from 'components/modules/Gallery/GenesisKeyDetailContent';
import { Doppler, getEnvBool } from 'utils/env';

import { useRouter } from 'next/router';

/**
 * Renders a detailed view of a single Genesis Key
 */
export default function GalleryDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  if( id === null || id === undefined ) {
    return <NullState />;
  }
  
  return (
    <PageWrapper removePinkSides headerOptions={{
      walletOnly: true,
      sidebar: getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED) ? 'dashboard' : 'hero',
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