import DefaultLayout from 'components/layouts/DefaultLayout';
import { ListingCheckout } from 'components/modules/Checkout/ListingCheckout';
import { Doppler,getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import { ArrowLeft } from 'phosphor-react';

/**
 * Renders the entire cart for listing.
 * with configuration options for the listing side.
 */
export default function ListPage() {
  const router = useRouter();

  return !getEnvBool(Doppler.NEXT_PUBLIC_TX_ROUTER_RESKIN_ENABLED) ?
    <div className={tw(
      'w-full pt-20 flex flex-col items-center text-primary-txt dark:text-primary-txt-dk',
      'bg-white dark:bg-footer-bg-dk font-grotesk'
    )}>
      <div className='max-w-nftcom w-full flex flex-col items-center my-8'>
        <div className='w-full flex px-8 items-center'>
          <div
            className='flex items-center justify-center h-full aspect-square cursor-pointer'
            onClick={() => {
              router.back();
            }}
          >
            <ArrowLeft size={24} color="black" className='ListingPageBackButton' />
          </div>
          <h1 className='text-3xl font-normal ml-4'>Create Listings</h1>
        </div>
        <ListingCheckout />
      </div>
    </div> :
    <div className={tw(
      'w-full pt-20 flex flex-col items-center text-primary-txt dark:text-primary-txt-dk',
      'bg-white dark:bg-footer-bg-dk font-grotesk'
    )}>
      <div className='w-full'>
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