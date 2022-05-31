import AddFundsDialog from 'components/elements/AddFundsDialog';
import { Footer } from 'components/elements/Footer';
import Header from 'components/elements/Header';
import { Sidebar } from 'components/elements/Sidebar';
import { SignOutModal } from 'components/elements/SignOutModal';
import { Subscription } from 'components/elements/Subscription';
import { SummaryBanner } from 'components/elements/SummaryBanner';
import { useSignOutDialog } from 'hooks/state/useSignOutDialog';
import { useMaybeCreateUser } from 'hooks/useMaybeCreateUser';
import { tw } from 'utils/tw';

import { PropsWithChildren } from 'react';
import { isMobile } from 'react-device-detect';
import ReactTooltip from 'react-tooltip';
import { useAccount } from 'wagmi';

export interface PageWrapperProps {
  bgColorClasses?: string;
  removePinkSides?: boolean;
  onScrollToSchedule?: () => void;
  headerOptions?: {
    omit?: boolean;
    walletOnly?: boolean;
    // todo: this is now the default design. remove this option.
    walletPopupMenu?: boolean;
    removeBackground?: boolean;
    removeSummaryBanner?: boolean;
    hideAnalytics?: boolean;
    sidebar?: 'hero' | 'dashboard'
    heroHeader?: boolean;
    heroHeaderBlack?: boolean;
    profileHeader?: boolean;
  }
}

export const PageWrapper = (props: PropsWithChildren<PageWrapperProps>) => {
  const { headerOptions, bgColorClasses } = props;

  const { signOutDialogOpen, setSignOutDialogOpen } = useSignOutDialog();
  
  const { data: account } = useAccount();

  useMaybeCreateUser();
  
  return (
    <div className={tw(
      'flex flex-col h-screen',
      isMobile ? 'overflow-x-hidden' : ''
    )}>
      {props.headerOptions &&
      props.headerOptions.sidebar === 'hero' &&
      props.removePinkSides !== true &&
      <div
        className={tw('z-[200] absolute left-0 md:w-[23px] w-[26px] h-0',
          'border-t-[100vh] border-t-hero-pink border-l-0',
          'border-l-transparent border-r-[21px] border-r-transparent')}>
      </div>
      }
      <main
        className={tw(
          'absolute w-full h-full',
          isMobile ? 'overflow-x-hidden' : '',
          bgColorClasses ?? 'bg-black'
        )}
        style={{
          minHeight: '100vh',
          overflow: 'scroll',
        }}
      >
        <AddFundsDialog key={account?.address} account={account?.address} />
        <ReactTooltip className="whitespace-pre-wrap" />
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
          <Header
            walletPopup={headerOptions?.walletPopupMenu}
            walletOnly={headerOptions?.walletOnly}
            removeBackground={headerOptions?.removeBackground}
            sidebar={headerOptions?.sidebar ?? 'dashboard'}
            heroHeader={headerOptions?.heroHeader}
            heroHeaderBlack={headerOptions?.heroHeaderBlack}
            profileHeader={headerOptions?.profileHeader}
          />
        </div>}
        
        <Sidebar />

        <SignOutModal
          visible={signOutDialogOpen}
          onClose={() => {
            setSignOutDialogOpen(false);
          }}
        />
        
        {props.children}

        {headerOptions?.omit !== true && props.headerOptions?.removeSummaryBanner !== true &&
          <>
            <Subscription />
            <Footer />
          </>
        }
      </main>
    </div>
  );
};