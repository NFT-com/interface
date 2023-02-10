import { Footer as StaticFooter } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import { MobileSidebar } from 'components/elements/MobileSidebar';
import { SignOutModal } from 'components/elements/SignOutModal';
import ProfileSelectModal from 'components/modules/ProfileFactory/ProfileSelectModal';
import { SearchModal } from 'components/modules/Search/SearchModal';
import { useChangeWallet } from 'hooks/state/useChangeWallet';
import { useProfileSelectModal } from 'hooks/state/useProfileSelectModal';
import { useSignOutDialog } from 'hooks/state/useSignOutDialog';
import { useUser } from 'hooks/state/useUser';
import ClientOnly from 'utils/ClientOnly';
import { tw } from 'utils/tw';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import dynamic from 'next/dynamic';

type HomeLayoutProps = {
  children: React.ReactNode;
  hideFooter?: boolean;
  hideHeader?: boolean;
};

const DynamicFooter = dynamic<React.ComponentProps<typeof StaticFooter>>(() => import('components/elements/Footer').then(mod => mod.Footer));
const DynamicProfileSelectModal = dynamic<React.ComponentProps<typeof ProfileSelectModal>>(() => import('components/modules/ProfileFactory/ProfileSelectModal').then(mod => mod.default));

export default function HomeLayout({ children, hideFooter, hideHeader }: HomeLayoutProps) {
  const { setCurrentProfileUrl } = useUser();
  const { openConnectModal } = useConnectModal();
  const { signOutDialogOpen, setSignOutDialogOpen } = useSignOutDialog();
  const { changeWallet, setChangeWallet } = useChangeWallet();
  const { setProfileSelectModalOpen } = useProfileSelectModal();
  return (
    <div className={tw('flex flex-col',
      'w-full min-w-screen min-h-screen overflow-hidden',
    )}>
      <div
        className='flex-1 w-full'
        style={{ minHeight: '100vh' }}
      >
        {!hideHeader &&
        <ClientOnly>
          <Header homepageHeader />
          <MobileSidebar/>
          <SearchModal />
        </ClientOnly>
        }

        {children}

        <DynamicProfileSelectModal />
        <SignOutModal
          visible={signOutDialogOpen}
          onClose={() => {
            setSignOutDialogOpen(false);
            changeWallet && openConnectModal();
            setChangeWallet(false);
            setProfileSelectModalOpen(false);
            setCurrentProfileUrl('');
          }}
        />
        {!hideFooter && <DynamicFooter />}
      </div>
    </div>
  );
}
