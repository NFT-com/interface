import DefaultLayout from 'components/layouts/DefaultLayout';
import { OfferCheckout } from 'components/modules/Checkout/OfferCheckout';
import { tw } from 'utils/tw';

/**
 * Renders the entire cart for Offer.
 * with configuration options for the Offer side.
 */
export default function BidPage() {
  return <div className={tw(
    'w-full minmd:pt-20 flex flex-col items-center text-primary-txt dark:text-primary-txt-dk',
    'bg-white dark:bg-footer-bg-dk font-grotesk px-6 minlg:px-0'
  )}>
    <OfferCheckout />
  </div>;
}

BidPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      { page }
    </DefaultLayout>
  );
};