import { PageWrapper } from 'components/layouts/PageWrapper';
import { ListingCheckout } from 'components/modules/Checkout/ListingCheckout';
import NotFoundPage from 'pages/404';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

/**
 * Renders the entire cart for listing.
 * with configuration options for the listing side.
 */
export default function ListPage() {
  if (!getEnv(Doppler.NEXT_PUBLIC_ROUTER_ENABLED)) {
    return <NotFoundPage />;
  }

  return <PageWrapper>
    <div className={tw(
      'w-full h-full pt-20 flex flex-col items-center text-primary-txt dark:text-primary-txt-dk',
      getEnvBool(Doppler.NEXT_PUBLIC_FORCE_DARK_MODE) ? 'bg-white' : 'bg-white dark:bg-black'
    )}>
      <div className='max-w-xl w-full flex flex-col items-center my-8'>
        <div className='w-full flex px-8'>
          <h1 className='text-xl font-bold underline'>Configure Listings</h1>
        </div>
        <ListingCheckout />
      </div>
    </div>
  </PageWrapper>;
}