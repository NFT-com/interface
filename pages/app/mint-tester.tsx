import { ProfileMinter } from 'components/elements/ProfileMinter';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { NextPageWithLayout } from 'pages/_app';
import { Doppler,getEnvBool } from 'utils/env';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

const MintTester_ProfileFactory: NextPageWithLayout = () => {
  const router = useRouter();
  useEffect(() => {
    if(!getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_FACTORY_ENABLED)) {
      router.push('/404');
    }
  }, [router]);

  return (
    <main className="bg-pagebg-dk text-white">
      <ProfileMinter />
    </main>
  );
};

MintTester_ProfileFactory.getLayout = function getLayout(page) {
  if (getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_FACTORY_ENABLED)) {
    return (
      <DefaultLayout>
        { page }
      </DefaultLayout>
    );
  } else {
    return page;
  }
};

export default MintTester_ProfileFactory;
	