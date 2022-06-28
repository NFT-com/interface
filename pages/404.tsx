import { NullState } from 'components/elements/NullState';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { Doppler, getEnvBool } from 'utils/env';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

export const NotFoundPage: NextPage = () => {
  const router = useRouter();

  return <PageWrapper
    headerOptions={{
      removeSummaryBanner: true,
      heroHeader: true,
      walletOnly: !getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED),
      walletPopupMenu: !getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED),
      hideAnalytics: true
    }}
    bgColorClasses={'bg-pagebg dark:bg-pagebg-dk'}
  >
    <div className="flex flex-col h-full w-full items-center justify-center">
      <NullState
        showImage={true}
        primaryMessage='Looking for a NFT.com profile?'
        secondaryMessage={'Return to NFT.com'}
        buttonLabel={'Go to NFT.com'}
        onClick={() => {
          router.replace('/');
        }}/>
    </div>
  </PageWrapper>;
};

export default NotFoundPage;
