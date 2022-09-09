import DefaultLayout from 'components/layouts/DefaultLayout';
import AssetsPage from 'components/modules/Assets/AssetsPage';
import { ProfileContextProvider } from 'components/modules/Profile/ProfileContext';
import { useUser } from 'hooks/state/useUser';
import { Doppler, getEnvBool } from 'utils/env';

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function Assets() {
  const router = useRouter();
  const { address: currentAddress } = useAccount();
  const { getCurrentProfileUrl }= useUser();
  const selectedProfile = getCurrentProfileUrl();

  useEffect(() => {
    if(!currentAddress || !getEnvBool(Doppler.NEXT_PUBLIC_ROUTER_ENABLED)){
      router.push('/');
    }
  }, [currentAddress, router]);

  return (
    <ProfileContextProvider
      key={selectedProfile}
      profileURI={selectedProfile}
    >
      <AssetsPage />
    </ProfileContextProvider>
  );
}

Assets.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      { page }
    </DefaultLayout>
  );
};