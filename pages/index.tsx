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
import { useLeaderboardQuery } from 'graphql/hooks/useLeaderboardQuery';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
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
    feedCollections: any;
    tickerStats: TickerStat[];
    leaderboardTitle: string;
    leaderboardDescription: string;
    threeCardTitle: string;
    threeCardDescription: string;
    threeCardImage1: any;
    threeCardTitle2: string;
    threeCardDescription2: string;
    threeCardImage2: any;
    threeCardTitle3: string;
    threeCardDescription3: string;
    threeCardImage3: any;
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
  const [featuredProfileNfts, setFeaturedProfileNfts] = useState<any[]>([]);

  const { profileData: featuredProfile } = useProfileQuery(data?.featuredProfile['profileURI']);
  const { data: featuredProfileNFT1 } = useNftQuery(
    data?.featuredProfile['featuredProfileNft1'].collection,
    data?.featuredProfile['featuredProfileNft1'].tokenId
  );
  const { data: featuredProfileNFT2 } = useNftQuery(
    data?.featuredProfile['featuredProfileNft2'].collection,
    data?.featuredProfile['featuredProfileNft2'].tokenId
  );
  const { data: featuredProfileNFT3 } = useNftQuery(
    data?.featuredProfile['featuredProfileNft3'].collection,
    data?.featuredProfile['featuredProfileNft3'].tokenId
  );
  const { profileData: profileFeed1 } = useProfileQuery(data?.feedCollections['profile1']['url']);
  const { profileData: profileFeed2 } = useProfileQuery(data?.feedCollections['profile2']['url']);
  const { profileData: profileFeed3 } = useProfileQuery(data?.feedCollections['profile3']['url']);
  const { profileData: profileFeed4 } = useProfileQuery(data?.feedCollections['profile4']['url']);
  const { data: leaderboardData } = useLeaderboardQuery({ pageInput: { first: 10 } });

  useEffect(() => {
    if (data?.tickerStats) {
      setTickerStats(data?.tickerStats);
    }
    if (data?.featuredProfile) {
      setFeaturedProfileNfts([featuredProfileNFT1, featuredProfileNFT2, featuredProfileNFT3]);
    }
  }, [data?.featuredProfile, data?.tickerStats, featuredProfileNFT1, featuredProfileNFT2, featuredProfileNFT3]);

  if (getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V2_ENABLED)) {
    return (
      <>
        <ClientOnly>
          <Header />
          <Sidebar />
        </ClientOnly>
        <main className='flex flex-col mt-20'>
          <div className={tw('flex flex-row sm:flex-wrap items-center justify-between sm:p-6 md:px-20 lg:px-40 xl:px-80 w-screen h-full bg-white break-after-all')}>
            <div className='break-after-all space-y-2 md:w-full'>
              <div className={tw(
                'font-rubik text-[#4D4412] text-header leading-header sm:font-header md:font-header-bold ',
                'break-after-all space-y-2',
                'md:mb-6'
              )}>
                <div>
                  {data?.subheroTitle}
                </div>
                <div>
                  {data?.subheroDescription}
                </div>
                <div className='sm:hidden md:block text-body leading-body font-body w-[44%]'>
                Learn, discover, and own digital items. We’re building the hub that is all things Web3. Do more with your NFT.
                </div>
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
                    'font-medium bg-transparent rounded-xl text-[#4D4412]',
                    'flex flex-row items-center cursor-pointer opacity-80 hover:opacity-100',
                    'font-rubik font-body',
                    'py-2 px-5'
                  )}
                  type="button">
                  Learn More
                </button>
              </div>
            </div>
            <div className='flex sm:flex-row sm:justify-center justify-end sm:py-10 md:py-20'>
              <FeaturedProfile
                profileOwner={featuredProfile}
                gkId={1}
                featuredNfts={featuredProfileNfts}
              />
            </div>
          </div>
          <div className='space-y-12 ...'>
            <div className='h-full p-12 ...'>
              <div className='text-header leading-header font-header justify-center ...'>
                {data?.feedTitle}
                <div className='text-body leading-body font-body py-2 whitespace-nowrap ...'>
                  {data?.feedDescription}
                </div>
                <ProfileFeed
                  profiles={[
                    profileFeed1,
                    profileFeed2,
                    profileFeed3,
                    profileFeed4
                  ]}
                />
                <div className='flex flex-row justify-center sm:w-full items-center pt-6 -mb-12 ...'>
                  <Button
                    bgColor={'#F9D963'}
                    color={'#4D4412'}
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
            <div className='h-full w-screen bg-always-black py-6 drop-shadow-lg ...'>
              {tickerStats && (
                <HomePageTicker tickerStats={data.tickerStats} />
              )}
            </div>
            <div className='h-full px-12 py-10 ...'>
              <div className='text-header leading-header font-header justify-center mb-6 mt-14 ...'>
                {data?.leaderboardTitle}
              </div>
              <LeaderBoard data={leaderboardData} />
            </div>
            <div className='flex flex-row flex-wrap w-full h-full justify-center px-12 py-10 ...'>
              <div className='h-full w-full ...'>
                <div className='text-header leading-header font-header justify-center ...'>
                  {data?.threeCardTitle}
                  <div className='text-body leading-body font-body py-2 whitespace-nowrap ...'>
                    {data?.threeCardDescription}
                  </div>
                </div>
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
                    src={data?.threeCardImage1['url']}
                    variant={RoundedCornerVariant.All}
                  />
                </div>
                <div className='px-6 text-header leading-header font-header justify-center ...'>
                  {data?.threeCardTitle2}
                  <div className='text-body leading-body font-body py-2 ...'>
                    {data?.threeCardDescription2}
                  </div>
                </div>
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
                    src={data?.threeCardImage2['url']}
                    variant={RoundedCornerVariant.All}
                  />
                </div>
                <div className='px-6 text-header leading-header font-header justify-center ...'>
                  {data?.threeCardTitle3}
                  <div className='text-body leading-body font-body py-2 ...'>
                    {data?.threeCardDescription3}
                  </div>
                </div>
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
                    src={data?.threeCardImage3['url']}
                    variant={RoundedCornerVariant.All}
                  />
                </div>
                <div className='px-6 text-header leading-header font-header justify-center ...'>
                  {data?.communityCtaTitle}
                  <div className='text-body leading-body font-body py-2 ...'>
                    {data?.communityCtaDescription}
                  </div>
                </div>
              </div>
            </div>
            <div className='h-full w-full px-12 py-10'>
              <div className='text-header leading-header font-header justify-center ...'>
                {data?.learnTitle}
                <div className='text-body leading-body font-body py-2 whitespace-nowrap ...'>
                  {data?.learnDescription}
                </div>
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