import { PageWrapper } from 'components/layouts/PageWrapper';
import { MintedProfile } from 'components/modules/Profile/MintedProfile';
import { ProfileEditContextProvider } from 'components/modules/Profile/ProfileEditContext';
import { UnmintedOrUnavailableProfile } from 'components/modules/Profile/UnmintedOrUnavailableProfile';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useProfileBlocked } from 'hooks/useProfileBlocked';
import { useProfileTokenOwner } from 'hooks/userProfileTokenOwner';
import { tw } from 'utils/tw';

import { Loader } from 'react-feather';

export interface ProfilePageProps {
  uri: string | string[];
}

/**
 * Shows a public profile e.g. nft.com/satoshi
 */
export function ProfilePage(props: ProfilePageProps) {
  const processedProfileURI = props?.uri?.toString().toLowerCase();

  const { profileTokenId, loading: loadingId } = useProfileTokenQuery(
    processedProfileURI,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );
  const { profileOwner, loading: loadingOwner } = useProfileTokenOwner(
    profileTokenId,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );
  const { blocked: currentURIBlocked } = useProfileBlocked(processedProfileURI, false);

  if (loadingId || loadingOwner) {
    return (
      <PageWrapper
        bgColorClasses='dark:bg-black bg-white'
        headerOptions={{
          removeSummaryBanner: true,
          hideAnalytics: true
        }}
      >
        <div className={tw(
          'text-primary-txt dark:text-primary-txt-dk flex flex-col',
          'items-center justify-center h-screen'
        )}>
          <div className="mb-2">Loading...</div>
          <Loader />
        </div>
      </PageWrapper>
    );
  }
  
  return (
    <PageWrapper
      bgColorClasses='dark:bg-pagebg-secondary-dk bg-pagebg'
      headerOptions={{
        removeSummaryBanner: true,
        walletOnly: true,
        walletPopupMenu: true,
        hideAnalytics: true,
        profileHeader: true
      }}
    >
      {currentURIBlocked || ( profileTokenId == null ) ?
        <UnmintedOrUnavailableProfile
          notAvailable={currentURIBlocked}
          profileURI={processedProfileURI}
        /> :
        (
          <ProfileEditContextProvider
            key={processedProfileURI}
            profileURI={processedProfileURI}
          >
            <MintedProfile
              key={processedProfileURI}
              profileURI={processedProfileURI}
              addressOwner={profileOwner}
            />
          </ProfileEditContextProvider>
        )
      }
    </PageWrapper>
  );
}