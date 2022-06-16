import { NullState } from 'components/elements/NullState';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { MintedProfile } from 'components/modules/Profile/MintedProfile';
import { ProfileEditContextProvider } from 'components/modules/Profile/ProfileEditContext';
import { UnmintedOrUnavailableProfile } from 'components/modules/Profile/UnmintedOrUnavailableProfile';
import { PROFILE_URI_LENGTH_LIMIT } from 'constants/misc';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useProfileBlocked } from 'hooks/useProfileBlocked';
import { useProfileTokenOwner } from 'hooks/userProfileTokenOwner';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { Loader } from 'react-feather';

export interface ProfilePageProps {
  uri: string | string[];
}

/**
 * Shows a public profile e.g. nft.com/satoshi
 */
export function ProfilePage(props: ProfilePageProps) {
  const processedProfileURI = props?.uri?.toString().toLowerCase();
  const router = useRouter();

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

  const getPageContent = useCallback(() => {
    const validReg = /^[a-z0-9_]*$/;
    if(
      processedProfileURI === null ||
      processedProfileURI === undefined ||
      !validReg.test(processedProfileURI as string ?? '-') ||
      processedProfileURI.length > PROFILE_URI_LENGTH_LIMIT
    ) {
      return <div className="flex flex-col h-full w-full items-center justify-center">
        <NullState
          showImage={true}
          primaryMessage='Looking for a NFT.com profile?'
          secondaryMessage={ 'Return to NFT.com'}
          buttonLabel={'Go to NFT.com'}
          onClick={() => {
            router.replace('/');
          }}/>
      </div>;
    } else if (loadingId || loadingOwner) {
      return <div className={tw(
        'text-primary-txt dark:text-primary-txt-dk flex flex-col',
        'items-center justify-center h-screen'
      )}>
        <div className="mb-2">Loading...</div>
        <Loader />
      </div>;
    } else if (currentURIBlocked || profileTokenId == null) {
      return <UnmintedOrUnavailableProfile
        notAvailable={currentURIBlocked}
        profileURI={processedProfileURI}
      />;
    } else {
      return (
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
      );
    }
  }, [
    currentURIBlocked,
    loadingId,
    loadingOwner,
    processedProfileURI,
    profileOwner,
    profileTokenId,
    router
  ]);
  
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
      {getPageContent()}
    </PageWrapper>
  );
}