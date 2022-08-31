import DefaultLayout from 'components/layouts/DefaultLayout';
import { ListingCheckout } from 'components/modules/Checkout/ListingCheckout';
import NotFoundPage from 'pages/404';
import { Doppler, getEnv } from 'utils/env';
import { tw } from 'utils/tw';

/**
 * Renders the entire cart for listing.
 * with configuration options for the listing side.
 */
export default function ListPage() {
  if (!getEnv(Doppler.NEXT_PUBLIC_ROUTER_ENABLED)) {
    return <NotFoundPage />;
  }

  return <div className={tw(
    'w-full h-full pt-20 flex flex-col items-center text-primary-txt dark:text-primary-txt-dk',
    'bg-white dark:bg-footer-bg-dk'
  )}>
    <div className='max-w-nftcom w-full flex flex-col items-center my-8 pt-20'>
      <div className='w-full flex px-8'>
        <h1 className='text-xl font-bold underline'>Configure Listings</h1>
      </div>
      <ListingCheckout />
    </div>
  </div>;
}

ListPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      { page }
    </DefaultLayout>
  );
};