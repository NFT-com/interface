import DefaultLayout from 'components/layouts/DefaultLayout';
import { ListingCheckout } from 'components/modules/Checkout/ListingCheckout';
import { tw } from 'utils/tw';

/**
 * Renders the entire cart for listing.
 * with configuration options for the listing side.
 */
export default function ListPage() {
  return (
    <div
      className={tw(
        'flex w-full flex-col items-center text-primary-txt dark:text-primary-txt-dk minmd:pt-20',
        'bg-white px-6 font-noi-grotesk dark:bg-footer-bg-dk minlg:px-0'
      )}
    >
      <ListingCheckout />
    </div>
  );
}

ListPage.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
