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

import { BigNumber } from 'ethers';
import { getCollection } from 'lib/contentful/api';
import { HOME_PAGE_FIELDS } from 'lib/contentful/schemas';
import { useRouter } from 'next/router';
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
    learnCards: any;
    learnCardImagesCollection: any;
    communityCtaTitle: string;
    communityCtaDescription: string;
    featuredProfile: any;
    entryTitle: string;
  }
};

const Index: NextPageWithLayout = ({ preview, data }: HomePageProps) => {
  const router = useRouter();
  const [tickerStats, setTickerStats] = useState<TickerStat[]>([]);
  const [learnCards, setLearnCards] = useState<any[]>([]);
  const [learnCardImages, setLearnCardImages] = useState<any[]>([]);
  const [featuredProfileNfts, setFeaturedProfileNfts] = useState<any[]>([]);

  const { profileData: featuredProfile } = useProfileQuery(data?.featuredProfile['profileURI']);
  const { data: featuredProfileNFT1 } = useNftQuery(
    data?.featuredProfile['featuredProfileNft1'].collection,
    BigNumber.from(data?.featuredProfile['featuredProfileNft1'].tokenId)
  );
  const { data: featuredProfileNFT2 } = useNftQuery(
    data?.featuredProfile['featuredProfileNft2'].collection,
    BigNumber.from(data?.featuredProfile['featuredProfileNft2'].tokenId)
  );
  const { data: featuredProfileNFT3 } = useNftQuery(
    data?.featuredProfile['featuredProfileNft3'].collection,
    BigNumber.from(data?.featuredProfile['featuredProfileNft3'].tokenId)
  );
  const { profileData: profileFeed1 } = useProfileQuery(data?.feedCollections['profile1']['url']);
  const { profileData: profileFeed2 } = useProfileQuery(data?.feedCollections['profile2']['url']);
  const { profileData: profileFeed3 } = useProfileQuery(data?.feedCollections['profile3']['url']);
  const { profileData: profileFeed4 } = useProfileQuery(data?.feedCollections['profile4']['url']);
  const { profileData: profileFeed5 } = useProfileQuery(data?.feedCollections['profile5']['url']);
  const { profileData: profileFeed6 } = useProfileQuery(data?.feedCollections['profile6']['url']);
  const { profileData: profileFeed7 } = useProfileQuery(data?.feedCollections['profile7']['url']);
  const { profileData: profileFeed8 } = useProfileQuery(data?.feedCollections['profile8']['url']);

  const { data: leaderboardData } = useLeaderboardQuery({ pageInput: { first: 10 } });

  useEffect(() => {
    if (data?.tickerStats) {
      setTickerStats(data.tickerStats);
    }
    if (data?.featuredProfile) {
      setFeaturedProfileNfts([featuredProfileNFT1, featuredProfileNFT2, featuredProfileNFT3]);
    }
    if(data?.learnCards) {
      setLearnCards([data.learnCards['card1'], data.learnCards['card2']]);
    }
    if(data?.learnCardImagesCollection) {
      setLearnCardImages([data.learnCardImagesCollection.items[0], data.learnCardImagesCollection.items[1]]);
    }
  }, [data?.featuredProfile, data.learnCards, data.tickerStats, featuredProfileNFT1, featuredProfileNFT2, featuredProfileNFT3, data.learnCardImagesCollection.items, data.learnCardImagesCollection, data.subheroTitle]);
  
  if (getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V2_ENABLED)) {
    return (
      <>
        <ClientOnly>
          <Header />
          <Sidebar />
        </ClientOnly>
        <main className='flex flex-col mt-20 font-grotesk not-italic'>
          <div className={tw('flex flex-row sm:flex-wrap items-center justify-between sm:p-6 sm:space-x-0 space-x-10 lg:w-screen px-20 max-w-screen mx-auto h-full',
            'break-after-all ',
          )}
          style={{
            backgroundImage: 'url(\'/home-banner-bg.png\')',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}>
            <div className='break-after-all space-y-2 w-full ...'>
              <div className={tw(
                'font-header text-black sm:text-5xl text-header leading-header',
                'break-after-all space-y-2',
                'md:mb-6'
              )}>
                <div>
                  {data?.subheroTitle}
                </div>
                <div>
                  {data?.subheroDescription.substring(0, data?.subheroDescription.lastIndexOf(' '))} <span className='text-[#F9D963]'>{data?.subheroDescription.split(' ').pop()}</span>
                </div>
                <div style={{ fontSize: '18px' }} className='py-5 sm:hidden md:block text-body text-[#A09E9E] leading-10 tracking-wide font-body w-[53%]'>
                  Learn, discover, and own digital items. We’re building the hub that is all things Web3. Do more with your NFT.
                </div>
              </div>
              <div className='w-full pt-1 h-full inline-flex grow space-x-4'>
                <WalletRainbowKitButton signInButton showWhenConnected={false} />
                <button
                  onClick={() => {
                    router.push('/articles');
                  }}
                  className={tw(
                    'w-max',
                    'block',
                    'font-semibold bg-transparent rounded-xl text-[#4D4412]',
                    'flex flex-row items-center cursor-pointer opacity-80 hover:opacity-100',
                    'font-grotesk font-body',
                    'py-2'
                  )}
                  type="button">
                  Learn More
                </button>
              </div>
            </div>
            <div className='flex sm:flex-row sm:justify-center justify-end sm:py-10 md:py-20 sm:w-full w-[70%]'>
              <FeaturedProfile
                profileOwner={featuredProfile}
                gkId={1}
                featuredNfts={featuredProfileNfts}
              />
            </div>
          </div>
          <div className='space-y-12 lg:w-full max-w-[100rem] mx-auto px-4 items-center ...'>
            <div className='h-full py-12 ...'>
              <div className='text-section leading-header font-header justify-center ...'>
                {data?.feedTitle}
                <div className='text-[#7F7F7F] text-body leading-body font-body py-2 whitespace-nowrap ...'>
                  {data?.feedDescription}
                </div>
                <ProfileFeed
                  profiles={[
                    profileFeed1,
                    profileFeed2,
                    profileFeed3,
                    profileFeed4,
                    profileFeed5,
                    profileFeed6,
                    profileFeed7,
                    profileFeed8,
                  ]}
                />
                <div className='flex flex-row justify-center sm:w-full items-center pt-6 -mb-12 ...'>
                  <Button
                    bgColor={'#F9D963'}
                    color={'#4D4412'}
                    label='Discover More NFT Profiles'
                    stretch={isMobile}
                    onClick={() => {
                      router.push('/app/gallery');
                    }}
                    type={ButtonType.SECONDARY}
                  />
                </div>
              </div>
            </div>
            <div className='h-full rounded-xl w-screen bg-always-black py-6 drop-shadow-lg lg:w-full max-w-[100rem] mx-auto ...'>
              {tickerStats && (
                <HomePageTicker tickerStats={data.tickerStats} />
              )}
            </div>
            <div className='h-full ...'>
              <div className='text-section leading-header font-header justify-center mb-6 mt-14 ...'>
                {data?.leaderboardTitle}
              </div>
              <LeaderBoard data={leaderboardData} />
            </div>
            <div className='flex flex-row flex-wrap w-full h-full justify-center px-2 ...'>
              <div className='h-full w-full ...'>
                <div className='text-section font-header justify-center py-6 ...'>
                  {data?.threeCardTitle}
                </div>
              </div>
              <div className='h-full w-[33%] sm:w-full ...'>
                <div
                  className={tw(
                    'drop-shadow-md rounded-xl flex flex-col',
                    'w-full h-full',
                    'justify-center',
                    'overflow-hidden',
                    'mb-3',
                    'p-2'
                  )}>
                  <RoundedCornerMedia
                    src={data?.threeCardImage1['url']}
                    variant={RoundedCornerVariant.All}
                  />
                </div>
                <div className='text-section font-header justify-center px-4 ...'>
                  {data?.threeCardTitle2}
                  <div className='text-[#6F6F6F] text-body leading-body font-body mr-6 py-2 ...'>
                    {data?.threeCardDescription2}
                  </div>
                </div>
              </div>
              <div className='h-full w-[33%] sm:w-full ...'>
                <div
                  className={tw(
                    'drop-shadow-md rounded-xl flex flex-col',
                    'w-full h-full',
                    'overflow-hidden',
                    'mb-3',
                    'p-2'
                  )}>
                  <RoundedCornerMedia
                    src={data?.threeCardImage2['url']}
                    variant={RoundedCornerVariant.All}
                  />
                </div>
                <div className='text-section font-header justify-center px-4 ...'>
                  {data?.threeCardTitle3}
                  <div className='text-[#6F6F6F] text-body leading-body font-body mr-6 py-2 ...'>
                    {data?.threeCardDescription3}
                  </div>
                </div>
              </div>
              <div className='h-full w-[33%] sm:w-full ...'>
                <div
                  className={tw(
                    'drop-shadow-md rounded-xl flex flex-col',
                    'w-full h-full',
                    'overflow-hidden',
                    'mb-3',
                    'p-2'
                  )}>
                  <RoundedCornerMedia
                    src={data?.threeCardImage3['url']}
                    variant={RoundedCornerVariant.All}
                  />
                </div>
                <div className='text-section font-header justify-center px-4 ...'>
                  {data?.communityCtaTitle}
                  <div className='text-[#6F6F6F] text-body leading-body font-body mr-6 py-2 ...'>
                    {data?.communityCtaDescription}
                  </div>
                </div>
              </div>
              <div className='flex flex-row justify-center sm:w-full items-center py-6 -mb-12 ...'>
                <Button
                  bgColor={'#F9D963'}
                  color={'#4D4412'}
                  label='Learn more'
                  stretch={isMobile}
                  onClick={() => {
                    router.push('/articles');
                  }}
                  type={ButtonType.SECONDARY}
                />
              </div>
            </div>
            <div className='h-full w-full py-10 px-2'>
              <div className='text-section leading-header font-header justify-center ...'>
                {data?.learnTitle}
                <div className='text=[#555555] text-body leading-body font-body py-2 md:whitespace-nowrap sm:whitespace-normal ...'>
                  {data?.learnDescription}
                </div>
                <div className='w-full items-center ...'>
                  <div className='h-full w-full ...'>
                    <LearnCards
                      cards={learnCards}
                      cardImages={learnCardImages}
                    />
                  </div>
                  <div className='flex flex-row justify-center sm:w-full items-center pt-6 ...'>
                    <Button
                      bgColor={'#F9D963'}
                      color={'#4D4412'}
                      label='Read more'
                      stretch={isMobile}
                      onClick={() => {
                        router.push('/articles');
                      }}
                      type={ButtonType.SECONDARY}
                    />
                  </div>
                </div>
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