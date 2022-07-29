import { ProfileMinter } from 'components/elements/ProfileMinter';
import HomeLayout from 'components/layouts/HomeLayout';
import { NextPageWithLayout } from 'pages/_app';
import { Doppler,getEnvBool } from 'utils/env';

import { useRouter } from 'next/router';

const MintTester_ProfileFactory: NextPageWithLayout = () => {
  const router = useRouter();
  if(!getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_FACTORY_ENABLED)) {
    router.push('/404');
  }

  return (
    <main className="bg-pagebg-dk text-white rubik vault-lp">
      <ProfileMinter />
    </main>
  );
};

MintTester_ProfileFactory.getLayout = function getLayout(page) {
  if (getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_FACTORY_ENABLED)) {
    return (
      <HomeLayout>
        { page }
      </HomeLayout>
    );
  } else {
    return page;
  }
};

export default MintTester_ProfileFactory;
	