import Loader from 'components/elements/Loader/Loader';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { GenesisKeyDetailContent } from 'components/modules/Gallery/GenesisKeyDetailContent';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';

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
    </div>;
  }

  return (
    <div className='w-full mt-24 flex flex-col items-center'>
      <GenesisKeyDetailContent id={id} />
    </div>
  );
}

GalleryDetailPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  );
};
