import { Button, ButtonType } from 'components/elements/Button';
import { FeaturedProfile } from 'components/elements/FeaturedProfile';
import { Footer } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import HomePageTicker from 'components/elements/HomePageTicker';
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
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { TickerStat } from 'types';

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
    featuredProfile: any;
    entryTitle: string;
  }
};

const Index: NextPageWithLayout = ({ preview, data }: HomePageProps) => {
  const [tickerStats, setTickerStats] = useState<TickerStat[]>([]);
  const { profileData: featuredProfile } = useProfileQuery(data?.featuredProfile['profileURI']);

  useEffect(() => {
    if (data?.tickerStats) {
      setTickerStats(data?.tickerStats);
    }
  }, [data?.tickerStats]);

  if (getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V2_ENABLED)) {
    return (
      <>
        <ClientOnly>
          <Header />
          <Sidebar />
        </ClientOnly>
        <main className='flex flex-col mt-20'>
          <div className={tw('flex flex-row flex-wrap items-center justify-center sm:p-6 px-6 py-12 w-screen h-full bg-secondary-dk break-after-all')}>
            <div className='break-after-all space-y-2 md:w-full'>
              <div className={tw(
                'font-rubik text-always-white text-header leading-header sm:font-header md:font-header-bold ',
                'break-after-all space-y-2',
                'md: mb-6'
              )}>
                <p>
                  {data?.subheroTitle}
                </p>
                <p>
                  {data?.subheroDescription}
                </p>
                <p className='sm:hidden md:block text-body leading-body font-body w-[44%]'>
                Learn, discover, and own digital items. We’re building the hub that is all things Web3. Do more with your NFT.
                </p>
              </div>
              <div className='w-full h-full inline-flex grow space-x-2'>
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
            </div>
            <div className='sm:w-full h-full flex sm:flex-row flex-col-reverse justify-right space-x-2'>
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
                <div className='flex flex-row justify-center sm:w-full ...'>
                  <Button
                    bgColor={'#222222'}
                    color={'#ffffff'}
                    label='Discover'
                    stretch={isMobile}
                    onClick={() => {
                      console.log('Discover clicked');
                    }}
                    type={ButtonType.SECONDARY}
                  />
                </div>

              </div>
            </div>
            <div className='h-full w-screen -ml-6 bg-always-black py-6 drop-shadow-lg ...'>
              {tickerStats && (
                <HomePageTicker tickerStats={data.tickerStats} />
              )}
            </div>
            <div className='h-full ...'>
              <p className='text-header leading-header font-header justify-center mb-6 mt-14 ...'>
                {data?.leaderboardTitle}
              </p>
              <LeaderBoard />
            </div>
            <div className='flex flex-row flex-wrap w-full h-full justify-center ...'>
              <div className='h-full w-full p-2 ...'>
                <p className='px-6 text-header leading-header font-header justify-center ...'>
                  {data?.threeCardTitle}
                  <p className='text-body leading-body font-body py-2 whitespace-nowrap ...'>
                    {data?.threeCardDescription}
                  </p>
                </p>
              </div>
              <div className='h-full w-[33%] sm:w-full ...'>
                <div
                  className={tw(
                    'drop-shadow-md rounded-xl flex flex-col',
                    'w-full h-full',
                    'justify-center',
                    'cursor-pointer',
                    'overflow-hidden',
                    'my-6',
                    'p-6'
                  )}>
                  <RoundedCornerMedia
                    src={'/checker.svg'}
                    variant={RoundedCornerVariant.All}
                  />
                </div>
                <p className='px-6 text-header leading-header font-header justify-center ...'>
                  {data?.threeCardTitle2}
                  <p className='text-body leading-body font-body py-2 ...'>
                    {data?.threeCardDescription2}
                  </p>
                </p>
              </div>
              <div className='h-full w-[33%] sm:w-full ...'>
                <div
                  className={tw(
                    'drop-shadow-md rounded-xl flex flex-col',
                    'w-full h-full',
                    'cursor-pointer',
                    'overflow-hidden',
                    'my-6',
                    'p-6'
                  )}>
                  <RoundedCornerMedia
                    src={'/checker.svg'}
                    variant={RoundedCornerVariant.All}
                  />
                </div>
                <p className='px-6 text-header leading-header font-header justify-center ...'>
                  {data?.threeCardTitle3}
                  <p className='text-body leading-body font-body py-2 ...'>
                    {data?.threeCardDescription3}
                  </p>
                </p>
              </div>
              <div className='h-full w-[33%] sm:w-full ...'>
                <div
                  className={tw(
                    'drop-shadow-md rounded-xl flex flex-col',
                    'w-full h-full',
                    'cursor-pointer',
                    'overflow-hidden',
                    'my-6',
                    'p-6'
                  )}>
                  <RoundedCornerMedia
                    src={'/checker.svg'}
                    variant={RoundedCornerVariant.All}
                  />
                </div>
                <p className='px-6 text-header leading-header font-header justify-center ...'>
                  {data?.communityCtaTitle}
                  <p className='text-body leading-body font-body py-2 ...'>
                    {data?.communityCtaDescription}
                  </p>
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