import AddFundsDialog from 'components/elements/AddFundsDialog';
import { Footer } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import { Sidebar } from 'components/elements/Sidebar';
import { SignOutModal } from 'components/elements/SignOutModal';
import { SummaryBanner } from 'components/elements/SummaryBanner';
import { SearchModal } from 'components/modules/Search/SearchModal';
import { useSignOutDialog } from 'hooks/state/useSignOutDialog';
import ClientOnly from 'utils/ClientOnly';
import { tw } from 'utils/tw';

import Head from 'next/head';
import { PropsWithChildren } from 'react';
import { isMobile } from 'react-device-detect';
import { useAccount } from 'wagmi';

export interface PageWrapperProps {
  bgColorClasses?: string;
  headerOptions?: {
    omit?: boolean;
    walletOnly?: boolean;
    // todo: this is now the default design. remove this option.
    walletPopupMenu?: boolean;
    removeBackground?: boolean;
    removeSummaryBanner?: boolean;
    hideAnalytics?: boolean;
    heroHeader?: boolean;
    heroHeaderBlack?: boolean;
    profileHeader?: boolean;
  }
}

export const PageWrapper = (props: PropsWithChildren<PageWrapperProps>) => {
  const { headerOptions, bgColorClasses } = props;

  const { signOutDialogOpen, setSignOutDialogOpen } = useSignOutDialog();
  
  const { address: currentAddress } = useAccount();

  return (
    <div className={tw(
      'flex flex-col h-screen',
      'min-h-screen',
      isMobile ? 'overflow-x-hidden' : ''
    )}>
      <Head>
        <title>NFT.com</title>
      </Head>
      <main
        className={tw(
          'absolute w-full h-full flex flex-col',
          isMobile ? 'overflow-x-hidden' : '',
          bgColorClasses ?? 'bg-white dark:bg-black',
        )}
        style={{
          minHeight: '100vh',
          overflow: 'scroll',
        }}
      >
        <AddFundsDialog key={currentAddress} currentAddress={currentAddress} />
        {headerOptions?.omit !== true &&
        <div className="fixed z-[104] top-0 w-full">
          {props.headerOptions?.removeSummaryBanner && ( // TODO: Remove this temporary hidding after fixing proper behavior and zIndex stack for buttons on the left
            props.headerOptions?.removeSummaryBanner !== true &&
              <SummaryBanner
                walletPopup={headerOptions?.walletPopupMenu}
                removeBackground={headerOptions?.removeBackground}
                hideAnalytics={headerOptions?.hideAnalytics}
              />
          )}
          <ClientOnly>
            <Header removeBg={headerOptions?.removeBackground} />
          </ClientOnly>
        </div>}
        <ClientOnly>
          <Sidebar />
          <SearchModal />
        </ClientOnly>

        <SignOutModal
          visible={signOutDialogOpen}
          onClose={() => {
            setSignOutDialogOpen(false);
          }}
        />
        
        {props.children}
        <div className='flex grow' />
        {headerOptions?.omit !== true && props.headerOptions?.removeSummaryBanner !== true &&
          <>
            <Footer />
          </>
        }
      </main>
    </div>
  );
};