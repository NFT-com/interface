import DefaultLayout from 'components/layouts/DefaultLayout';
import { GenesisKeyAuction } from 'components/modules/GenesisKeyAuction/GenesisKeyAuction';
import { tw } from 'utils/tw';

export default function GenesisKeyAuctionsPage() {
  return (
    <div className={tw(
      'relative flex flex-col overflow-y-auto',
      'overflow-x-hidden bg-black w-screen h-screen',
    )}>
      <GenesisKeyAuction />
    </div>
  );
}

GenesisKeyAuctionsPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      { page }
    </DefaultLayout>
  );
};