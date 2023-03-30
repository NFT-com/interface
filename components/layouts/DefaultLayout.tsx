import Alert, { AlertPosition, AlertType } from 'components/elements/Alert';
import ClientOnly from 'components/elements/ClientOnly';
import { Footer } from 'components/elements/Footer/Footer';
import { Header } from 'components/elements/Header';
import { MobileSidebar } from 'components/elements/MobileSidebar';
import { NonAuthLikeModal } from 'components/elements/nonAuthLikeModal';
import { SignOutModal } from 'components/elements/SignOutModal';
import { DiscoveryNavigation } from 'components/modules/DiscoveryNavigation/DiscoveryNavigation';
import EmailCaptureModal from 'components/modules/ProfileFactory/EmailCaptureModal';
import ProfileSelectModal from 'components/modules/ProfileFactory/ProfileSelectModal';
import { SearchContent } from 'components/modules/Search/SearchContent';
import { SearchModal } from 'components/modules/Search/SearchModal';
import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useChangeWallet } from 'hooks/state/useChangeWallet';
import { useEmailCaptureModal } from 'hooks/state/useEmailCaptureModal';
import { useNonProfileModal } from 'hooks/state/useNonProfileModal';
import { useProfileSelectModal } from 'hooks/state/useProfileSelectModal';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { useSignOutDialog } from 'hooks/state/useSignOutDialog';
import { useUser } from 'hooks/state/useUser';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';

type DefaultLayoutProps = {
  children: React.ReactNode;
  hideFooter?: boolean;
  hideHeader?: boolean;
  hideSearch?: boolean;
  showDNavigation?: boolean;
};

const DynamicProfileSelectModal = dynamic<React.ComponentProps<typeof ProfileSelectModal>>(() => import('components/modules/ProfileFactory/ProfileSelectModal').then(mod => mod.default));
const DynamicEmailCaptureModal = dynamic<React.ComponentProps<typeof EmailCaptureModal>>(() => import('components/modules/ProfileFactory/EmailCaptureModal').then(mod => mod.default));

export default function DefaultLayout({ children, hideFooter, hideHeader, hideSearch, showDNavigation }: DefaultLayoutProps) {
  const { setCurrentProfileUrl } = useUser();
  const { openConnectModal } = useConnectModal();
  const { signOutDialogOpen, setSignOutDialogOpen } = useSignOutDialog();
  const { changeWallet, setChangeWallet } = useChangeWallet();
  const { setProfileSelectModalOpen, profileSelectModal } = useProfileSelectModal();
  const { emailCaptureModal } = useEmailCaptureModal();
  const { signed } = useContext(GraphQLContext);
  const { searchModalOpen } = useSearchModal();
  const { likeType } = useNonProfileModal();
  const [alertIsVisible, setVisibleAlert] = useState(false);

  const checkSuccessMessage = () => {
    switch (likeType?.toLowerCase()) {
    case 'nft':
      return 'You liked NFT!';
    case 'collection':
      return 'You liked Collection!';
    case 'profile':
      return 'You liked Profile!';
    default:
      return '';
    }
  };
  useEffect(() => {
    if (likeType) {
      setVisibleAlert(true);
    }
  }, [likeType]);
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
          <MobileSidebar/>
          {searchModalOpen && <SearchModal />}
        </ClientOnly>
        }
        {!hideSearch &&
          <div className='mt-24  mb-8 block minlg:hidden'>
            <SearchContent isHeader mobileSearch mobileSidebar={false} />
          </div>
        }
        {showDNavigation && <DiscoveryNavigation/>}

        {children}

        {profileSelectModal && signed && <DynamicProfileSelectModal />}

        {emailCaptureModal && <DynamicEmailCaptureModal />}
        {signOutDialogOpen &&
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
        }

        {!hideFooter && <Footer />}
      </div>
      {getEnvBool(Doppler.NEXT_PUBLIC_SOCIAL_ENABLED) && <NonAuthLikeModal/>}
      {getEnvBool(Doppler.NEXT_PUBLIC_SOCIAL_ENABLED) && alertIsVisible && <Alert
        heading={checkSuccessMessage()}
        description={''}
        onClose={() => setVisibleAlert(false)}
        autoClose={true}
        position={AlertPosition.FIXED}
        type={AlertType.SUCCESS}/>}
    </div>
  );
}
