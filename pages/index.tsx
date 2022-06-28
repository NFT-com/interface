import { Footer } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import { Sidebar } from 'components/elements/Sidebar';
import HomeLayout from 'components/layouts/HomeLayout';
import { HeroPage } from 'components/modules/Hero/HeroPage';
import { HomePage } from 'components/modules/HomePage';
import ClientOnly from 'utils/ClientOnly';
import { Doppler, getEnvBool } from 'utils/env';

import { NextPageWithLayout } from './_app';

import { getCollection } from 'lib/contentful/api';
import { HOME_PAGE_FIELDS } from 'lib/contentful/schemas';

type IndexProps = {
  props: ({ preview }: { preview?: boolean; }) => Promise<{ props: { preview: boolean; data: any; }; }>
}
const Index: NextPageWithLayout = () => {
  async function getServerSideProps({ preview = false }) {
    const homeData = await getCollection(preview, 1, 'homePageCollection', HOME_PAGE_FIELDS);
    console.log('homeData', homeData);
    return {
      props: {
        preview,
        data: homeData ?? null,
      }
    };
  }

  if (getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V2_ENABLED)) {
    return (
      <>
        <ClientOnly>
          <Header />
          <Sidebar />
        </ClientOnly>
        <HomePage {...getServerSideProps} />
        <Footer />
      </>
    );
  } else {
    return <HeroPage />;
  }
};

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

export default Index;