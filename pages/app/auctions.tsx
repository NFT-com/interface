import { PageWrapper } from 'components/layouts/PageWrapper';
import { GenesisKeyAuction } from 'components/modules/GenesisKeyAuction/GenesisKeyAuction';
import { tw } from 'utils/tw';

export default function GenesisKeyAuctionsPage() {
  return (
    <PageWrapper
      headerOptions={{
        walletOnly: true,
        removeBackground: true,
        walletPopupMenu: true,
        removeSummaryBanner: true,
      }}>
      <div className={tw(
        'relative flex flex-col overflow-y-scroll',
        'overflow-x-hidden bg-black w-screen h-screen',
      )}>
        <GenesisKeyAuction />
      </div>
    </PageWrapper>
  );
}