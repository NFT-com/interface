import { PageWrapper } from 'components/layouts/PageWrapper';
import { PurchaseCheckout } from 'components/modules/Checkout/PurchaseCheckout';
import NotFoundPage from 'pages/404';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

/**
 * Renders the entire cart for purchasing NFTs.
 */
export default function BuyPage() {
  if (!getEnv(Doppler.NEXT_PUBLIC_ROUTER_ENABLED)) {
    return <NotFoundPage />;
  }

  return <PageWrapper>
    <div className={tw(
      'w-full h-full pt-20 flex flex-col items-center text-primary-txt dark:text-primary-txt-dk',
      getEnvBool(Doppler.NEXT_PUBLIC_FORCE_DARK_MODE) ? 'bg-white' : 'bg-white dark:bg-footer-bg-dk'
    )}>
      <div className='max-w-nftcom w-full flex flex-col items-center my-8'>
        <div className='w-full flex px-8'>
          <h1 className='text-xl font-bold underline'>Buy Summary</h1>
        </div>
        <PurchaseCheckout />
      </div>
    </div>
  </PageWrapper>;
}