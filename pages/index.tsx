import { Button, ButtonType } from 'components/elements/Button';
import { FeaturedProfile } from 'components/elements/FeaturedProfile';
import { Footer } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import { LearnCards } from 'components/elements/LearnCards';
import PreviewBanner from 'components/elements/PreviewBanner';
import { ProfileFeed } from 'components/elements/ProfileFeed';
import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Sidebar } from 'components/elements/Sidebar';
import { WalletRainbowKitButton } from 'components/elements/WalletRainbowKitButton';
import HomeLayout from 'components/layouts/HomeLayout';
import { HeroPage } from 'components/modules/Hero/HeroPage';
import { LeaderBoard } from 'components/modules/Profile/LeaderBoard';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import ClientOnly from 'utils/ClientOnly';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { NextPageWithLayout } from './_app';

import { getCollection } from 'lib/contentful/api';
import { HOME_PAGE_FIELDS } from 'lib/contentful/schemas';
import Ticker from 'react-ticker';

type TickerStat = {
  stat: {
    value: string;
    sub: string;
  }
};

type HomePageProps = {
  preview: boolean;
  data?: {
    subheroTitle: string;
    subheroDescription: string;
    feedTitle: string;
    feedDescription: string;
    tickerStats: TickerStat[];
    leaderboardTitle: string;
    leaderboardDescription: string;
    threeCardTitle: string;
    threeCardDescription: string;
    threeCardTitle2: string;
    threeCardDescription2: string;
    threeCardTitle3: string;
    threeCardDescription3: string;
    learnTitle: string;
    learnDescription: string;
    communityCtaTitle: string;
    communityCtaDescription: string;
    featuredProfile: string;
    entryTitle: string;
  }
};

const Index: NextPageWithLayout = ({ preview, data }: HomePageProps) => {
  const { profileData: featuredProfile } = useProfileQuery(data?.featuredProfile);

  if (getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V2_ENABLED)) {
    return (
      <>
        <ClientOnly>
          <Header />
          <Sidebar />
        </ClientOnly>
        <main className='flex flex-col'>
          <div className={tw('flex flex-row items-center justify-left mt-20 p-6 w-screen h-full bg-secondary-dk break-after-all')}>
            <div className='break-after-all space-y-2 md:w-full'>
              <div className={tw(
                'font-rubik text-always-white text-header leading-header font-header',
                'break-after-all space-y-2'
              )}>
                <p>
                  {data?.subheroTitle}
                </p>
                <p>
                  {data?.subheroDescription}
                </p>
              </div>
              <div className='w-full h-full inline-flex grow space-x-2 ...'>
                <WalletRainbowKitButton signInButton showWhenConnected={false} />
                <button
                  onClick={() => {
                    console.log('clicked');
                  }}
                  className={tw(
                    'w-max',
                    'block',
                    'font-medium bg-transparent rounded-xl text-secondary-txt-light',
                    'flex flex-row items-center cursor-pointer opacity-80 hover:opacity-100',
                    'font-rubik font-body',
                    'py-2 px-5'
                  )}
                  type="button">
                  Learn More
                </button>
              </div>
              <FeaturedProfile
                profileOwner={featuredProfile}
                gkId={1}
                pfpUrl={'https://cdn.nft.com/profiles/1653690187501-ghoool.webp'}
              />
            </div>
          </div>
          <div className='space-y-6 p-6 ...'>
            <div className='h-full ...'>
              <div className='text-header leading-header font-header justify-center ...'>
                {data?.feedTitle}
                <p className='text-body leading-body font-body py-2 whitespace-nowrap ...'>
                  {data?.feedDescription}
                </p>
                {/*TODO: @anthony use contentful for these images */}
                <ProfileFeed
                  profiles={[
                    'https://cdn.nft.com/profiles/1653690187501-ghoool.webp',
                    'https://cdn.nft.com/profiles/1656228209273-1.PNG']}
                />
                <Button
                  bgColor={'#222222'}
                  color={'#ffffff'}
                  label='Discover'
                  stretch
                  onClick={() => {
                    console.log('Discover clicked');
                  }}
                  type={ButtonType.SECONDARY}
                />
              </div>
            </div>
            <div className='h-full w-screen -ml-6 bg-always-black py-6 ...'>
              {data?.tickerStats && (
                <Ticker offset="run-in">
                  {({ index }) => (
                    <div className=' text-always-white text-header leading-header font-header justify-center px-12 ...'>
                      Hello world {index}
                    </div>
                  )}
                </Ticker>
              )}
            </div>
            <div className='h-full ...'>
              <p className='text-header leading-header font-header justify-center mb-6 mt-14 ...'>
                {data?.leaderboardTitle}
              </p>
              <LeaderBoard />
            </div>
            <div className='h-full ...'>
              <div className='text-header leading-header font-header justify-center ...'>
                {data?.threeCardTitle}
                <div className='text-body leading-body font-body py-2 whitespace-nowrap ...'>
                  {data?.threeCardDescription}
                </div>
                <RoundedCornerMedia
                  src={'/checker.svg'}
                  variant={RoundedCornerVariant.All}
                />
              </div>
            </div>
            <div className='h-full ...'>
              <div className='text-header leading-header font-header justify-center ...'>
                {data?.threeCardTitle2}
                <p className='text-body leading-body font-body py-2 ...'>
                  {data?.threeCardDescription2}
                </p>
                <RoundedCornerMedia
                  src={'/checker.svg'}
                  variant={RoundedCornerVariant.All}
                />
              </div>
            </div>
            <div className='h-full ...'>
              <div className='text-header leading-header font-header justify-center ...'>
                {data?.threeCardTitle3}
                <p className='text-body leading-body font-body py-2 ...'>
                  {data?.threeCardDescription3}
                </p>
                <RoundedCornerMedia
                  src={'/checker.svg'}
                  variant={RoundedCornerVariant.All}
                />
              </div>
            </div>
            <div className='h-full ...'>
              <div className='text-header leading-header font-header justify-center ...'>
                {data?.communityCtaTitle}
                <p className='text-body leading-body font-body py-2 ...'>
                  {data?.communityCtaDescription}
                </p>
              </div>
            </div>
            <div className='h-full w-full'>
              <div className='text-header leading-header font-header justify-center ...'>
                {data?.learnTitle}
                <p className='text-body leading-body font-body py-2 whitespace-nowrap ...'>
                  {data?.learnDescription}
                </p>
                <LearnCards
                  cardTitles={['What is an NFT?', 'What is a Blockchain?']}
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
        {preview && <PreviewBanner />}
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

export async function getServerSideProps({ preview = false }) {
  const homeData = await getCollection(preview, 1, 'homePageCollection', HOME_PAGE_FIELDS);
  return {
    props: {
      preview,
      data: homeData[0] ?? null,
    }
  };
}

export default Index;