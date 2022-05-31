import { NullState } from 'components/elements/NullState';
import { PageWrapper } from 'components/layouts/PageWrapper';

import { useRouter } from 'next/router';

export default function NotFoundPage() {
  const whitelistClosed = 1650970800000 <= new Date().getTime();
  const router = useRouter();

  return <PageWrapper
    headerOptions={{
      removeSummaryBanner: true,
      heroHeader: true,
      walletOnly: !(process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'),
      walletPopupMenu: !(process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'),
      sidebar: (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true') ? 'dashboard' : 'hero',
      hideAnalytics: true
    }}
    bgColorClasses={'bg-pagebg dark:bg-pagebg-dk'}
  >
    <div className="flex flex-col h-full w-full items-center justify-center">
      <NullState
        showImage={true}
        primaryMessage='Looking for a NFT.com profile?'
        secondaryMessage={
          whitelistClosed ?
            'Return to NFT.com' :
            'Join the Whitelist for an opportunity to claim early your unique NFT.com profile NFT'
        }
        buttonLabel={whitelistClosed ? 'Go to NFT.com' : 'Join Whitelist'}
        onClick={ whitelistClosed
          ? () => {
            router.replace('/');
          }
          : () => {
            window.open(
              'https://whitelist.nft.com',
              '_blank'
            );
          }}/>
    </div>
  </PageWrapper>;
}
