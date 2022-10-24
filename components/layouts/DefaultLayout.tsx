import { Footer as StaticFooter } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import { MobileSidebar } from 'components/elements/MobileSidebar';
import { Sidebar } from 'components/elements/Sidebar';
import { SignOutModal } from 'components/elements/SignOutModal';
import { SearchContent } from 'components/modules/Search/SearchContent';
import { SearchModal } from 'components/modules/Search/SearchModal';
import { useChangeWallet } from 'hooks/state/useChangeWallet';
import { useSignOutDialog } from 'hooks/state/useSignOutDialog';
import ClientOnly from 'utils/ClientOnly';
import { tw } from 'utils/tw';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import dynamic from 'next/dynamic';

type DefaultLayoutProps = {
  children: React.ReactNode;
  hideFooter?: boolean;
  hideHeader?: boolean;
  hideSearch?: boolean;
};

const DynamicFooter = dynamic<React.ComponentProps<typeof StaticFooter>>(() => import('components/elements/Footer').then(mod => mod.Footer));

export default function DefaultLayout({ children, hideFooter, hideHeader, hideSearch = false }: DefaultLayoutProps) {
  const { openConnectModal } = useConnectModal();
  const { signOutDialogOpen, setSignOutDialogOpen } = useSignOutDialog();
  const { changeWallet, setChangeWallet } = useChangeWallet();
  return (
    <div className={tw('flex flex-col',
      'h-screen w-full min-w-screen min-h-screen',
    )}>
      <div
        className='flex-1 w-full'
        style={{ minHeight: '100vh' }}
      >
        {!hideHeader &&
        <ClientOnly>
          <Header />
          <Sidebar />
          <MobileSidebar/>
          <SearchModal />
        </ClientOnly>
        }
        {!hideSearch &&
          <div className='mt-24  mb-8 block minlg:hidden'>
            <SearchContent isHeader mobileSearch />
          </div>
        }
        {children}
        <SignOutModal
          visible={signOutDialogOpen}
          onClose={() => {
            setSignOutDialogOpen(false);
            changeWallet && openConnectModal();
            setChangeWallet(false);
          }}
        />
        {!hideFooter && <DynamicFooter />}
      </div>
    </div>
  );
}
