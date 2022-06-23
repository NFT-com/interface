import AddFundsDialog from 'components/elements/AddFundsDialog';
import { Footer } from 'components/elements/Footer';
import Header from 'components/elements/Header';
import { SignOutModal } from 'components/elements/SignOutModal';
import { Subscription } from 'components/elements/Subscription';
import { SummaryBanner } from 'components/elements/SummaryBanner';
import HeroSidebar from 'components/modules/HeroSidebar/HeroSidebar';
import { useSignOutDialog } from 'hooks/state/useSignOutDialog';
import { useMaybeCreateUser } from 'hooks/useMaybeCreateUser';
import { tw } from 'utils/tw';

import Head from 'next/head';
import { PropsWithChildren, useEffect, useState } from 'react';
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
  
  const { data: account } = useAccount();

  const [clientOnly, setClientOnly] = useState(false);

  useMaybeCreateUser();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientOnly(true);
    }
  }, []);
  
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
          bgColorClasses ?? 'bg-black'
        )}
        style={{
          minHeight: '100vh',
          overflow: 'scroll',
        }}
      >
        <AddFundsDialog key={account?.address} account={account?.address} />
        {headerOptions?.omit !== true &&
        <div className="fixed z-[99] top-0 w-full">
          {props.headerOptions?.removeSummaryBanner && ( // TODO: Remove this temporary hidding after fixing proper behavior and zIndex stack for buttons on the left
            props.headerOptions?.removeSummaryBanner !== true &&
              <SummaryBanner
                walletPopup={headerOptions?.walletPopupMenu}
                removeBackground={headerOptions?.removeBackground}
                hideAnalytics={headerOptions?.hideAnalytics}
              />
          )}
          {clientOnly &&
          <Header
            walletPopup={headerOptions?.walletPopupMenu}
            walletOnly={headerOptions?.walletOnly}
            removeBackground={headerOptions?.removeBackground}
            heroHeader={headerOptions?.heroHeader}
            heroHeaderBlack={headerOptions?.heroHeaderBlack}
            profileHeader={headerOptions?.profileHeader}
          />
          }
        </div>}
        
        <HeroSidebar />

        <SignOutModal
          visible={signOutDialogOpen}
          onClose={() => {
            setSignOutDialogOpen(false);
          }}
        />
        
        {props.children}
        
        {headerOptions?.omit !== true && props.headerOptions?.removeSummaryBanner !== true &&
          <>
            <Footer />
          </>
        }
      </main>
    </div>
  );
};