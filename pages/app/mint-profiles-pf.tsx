import { Header } from 'components/elements/Header';
import { ProfileMinter } from 'components/elements/ProfileMinter';
import { Sidebar } from 'components/elements/Sidebar';
import HomeLayout from 'components/layouts/HomeLayout';
import { NextPageWithLayout } from 'pages/_app';
import ClientOnly from 'utils/ClientOnly';
import { Doppler,getEnvBool } from 'utils/env';

import { useRouter } from 'next/router';

const MintProfiles_ProfileFactory: NextPageWithLayout = () => {
  const router = useRouter();
  if(!getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_FACTORY_ENABLED)) {
    router.push('/404');
  }

  return (
    <>
      <ClientOnly>
        <Header />
        <Sidebar />
      </ClientOnly>
      <main className="bg-pagebg-dk text-white rubik vault-lp">
        <ProfileMinter />
      </main>
    </>
  );
};

MintProfiles_ProfileFactory.getLayout = function getLayout(page) {
  if (getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V2_ENABLED)) {
    return (
      <HomeLayout>
        { page }
      </HomeLayout>
    );
  } else {
    return page;
  }
};

export default MintProfiles_ProfileFactory;