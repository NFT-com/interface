import DefaultLayout from 'components/layouts/DefaultLayout';
import ActivityPage from 'components/modules/Activity/ActivityPage';
import { ProfileContextProvider } from 'components/modules/Profile/ProfileContext';
import { useUser } from 'hooks/state/useUser';

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function Activity() {
  const router = useRouter();
  const { address: currentAddress } = useAccount();
  const { getCurrentProfileUrl }= useUser();
  const selectedProfile = getCurrentProfileUrl();

  useEffect(() => {
    if(!currentAddress) {
      router.push('/');
    }
  }, [currentAddress, router]);

  return (
    <ProfileContextProvider
      key={selectedProfile}
      profileURI={selectedProfile}
    >
      <ActivityPage />
    </ProfileContextProvider>
  );
}

Activity.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      { page }
    </DefaultLayout>
  );
};