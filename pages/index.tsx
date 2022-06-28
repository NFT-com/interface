import { Footer } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import { Sidebar } from 'components/elements/Sidebar';
import HomeLayout from 'components/layouts/HomeLayout';
import { HeroPage } from 'components/modules/Hero/HeroPage';
import HomePage from 'components/modules/HomePage/HomePage';
import ClientOnly from 'utils/ClientOnly';
import { Doppler, getEnvBool } from 'utils/env';

export default function Index() {
  if (getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V2_ENABLED)) {
    return (
      <>
        <ClientOnly>
          <Header />
          <Sidebar />
        </ClientOnly>
        <HomePage />
        <Footer />
      </>
    );
  } else {
    return <HeroPage />;
  }
}

Index.getLayout = function getLayout(page) {
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