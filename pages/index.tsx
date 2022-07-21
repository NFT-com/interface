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
import Link from 'next/link';
import { useRouter } from 'next/router';
import Vector from 'public/Vector.svg';
import { useEffect, useState } from 'react';
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
          <Header bgLight />
          <Sidebar />
        </ClientOnly>
        <main className='flex flex-col mt-20 font-grotesk not-italic'>
          <Link href='/app/auctions' passHref>
            <a>
              <div className='mx-auto flex flex-row items-center justify-center w-screen h-[55px] font-grotesk text-lg sm:text-base leading-6 text-white font-[500] bg-[#111111] whitespace-pre-wrap py-2'>
                <span>Unlock the NFT Platform Beta with a Genesis Key</span>
                <div className='flex flex-col rounded items-center p-[1px] ml-2'>
                  <Vector />
                </div>
              </div>
            </a>
          </Link>
          <div className={tw('flex flex-row sm:flex-wrap items-center justify-between sm:p-6 sm:space-x-0 space-x-10 md:max-w-screen md:px-5 w-full max-w-[1100px] mx-auto h-full',
            'break-after-all ',
          )}
          style={{
            backgroundImage: 'url(\'/home-banner-bg.png\')',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}>
            <div className='break-after-all space-y-2 w-full ...'>
              <div className={tw(
                'font-header text-black sm:text-5xl md:text-5xl xl:text-7xl text-header leading-header',
                'break-after-all space-y-2'
              )}>
                <div>
                  {data?.subheroTitle}
                </div>
                <div>
                  {data?.subheroDescription.substring(0, data?.subheroDescription.lastIndexOf(' '))} <span className='text-[#F9D963]'>{data?.subheroDescription.split(' ').pop()}</span>
                </div>
                <div className='py-5 sm:hidden md:text-base text-xl md:block md:w-[100%] text-body text-[#A09E9E] leading-10 tracking-wide font-body w-[70%]'>
                  Collect, Display, and Trade your NFTs. We&apos;re building the hub for all things Web3. Get started by building your NFT Profile.
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
                    'font-bold bg-transparent rounded-xl text-[#4D4412]',
                    'flex flex-row items-center text cursor-pointer tracking-wide opacity-80 hover:opacity-100',
                    'font-grotesk font-body',
                    'py-2'
                  )}
                  type="button">
                  Learn More
                </button>
              </div>
            </div>
            <div className='flex sm:flex-row sm:justify-center md:ml-0 lg:pl-0 pl-20 justify-end sm:py-10 md:py-0 w-full'>
              <FeaturedProfile
                profileOwner={featuredProfile}
                gkId={1}
                featuredNfts={featuredProfileNfts}
              />
            </div>
          </div>
          <div className='space-y-12 md:px-0 w-full items-center max-w-[1100px] mx-auto ...'>
            <div className='h-full md:px-6 px-2 py-12 ...'>
              <div className='text-section leading-header font-header justify-center ...'>
                {data?.feedTitle}
                <div className='text-[#7F7F7F] text-body leading-body font-normal tracking-wide py-2 whitespace-nowrap sm:whitespace-normal ...'>
                  {data?.feedDescription}
                </div>
                <ProfileFeed profiles={[profileFeed1, profileFeed2, profileFeed3, profileFeed4, profileFeed5, profileFeed6, profileFeed7, profileFeed8]} />
                <div className='flex flex-row justify-center sm:w-full items-center pt-6 -mb-12 ...'>
                  <Link href={'/app/gallery?type=profile'}>
                    <button
                      className={tw(
                        'font-grotesk font-bold text-base bg-[#F9D963] rounded-lg text-[#4D4412] block',
                        'flex flex-row items-center cursor-pointer hover:opacity-80 w-max ',
                        'py-2 px-5'
                      )}
                      type="button">
                      Discover more NFT Profiles
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className='h-full px-2 sm:rounded-none md:rounded-none lg:rounded-none rounded-xl bg-always-black py-6 drop-shadow-lg w-full mx-auto ...'>
              {tickerStats && (
                <HomePageTicker tickerStats={data.tickerStats} />
              )}
            </div>
            <div className='h-full lg:px-6 px-2 ...'>
              <div className='text-section leading-header font-header justify-center mb-6 mt-14 ...'>
                {data?.leaderboardTitle}
              </div>
              <LeaderBoard data={leaderboardData} />
            </div>
            <div className='flex md:px-6 flex-row flex-wrap w-full h-full justify-center px-2 ...'>
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
                <div className='text-section font-header text-3xl justify-center px-4 ...'>
                  {data?.threeCardTitle2}
                  <div className='text-[#6F6F6F] leading-body text-base font-normal tracking-wide mr-6 py-2 ...'>
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
                <div className='text-section font-header text-3xl justify-center px-4 ...'>
                  {data?.threeCardTitle3}
                  <div className='text-[#6F6F6F] leading-body text-base font-normal tracking-wide mr-6 py-2 ...'>
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
                <div className='text-section font-header text-3xl justify-center px-4 ...'>
                  {data?.communityCtaTitle}
                  <div className='text-[#6F6F6F] leading-body text-base font-normal tracking-wide mr-6 py-2 ...'>
                    {data?.communityCtaDescription}
                  </div>
                </div>
              </div>
              <div className='flex flex-row justify-center sm:w-full items-center py-6 -mb-12 ...'>
                <button
                  onClick={() => window.open('https://docs.nft.com')}
                  className={tw(
                    'font-grotesk font-bold text-base bg-[#F9D963] rounded-lg text-[#4D4412] block',
                    'flex flex-row items-center cursor-pointer hover:opacity-80 w-max',
                    'py-2 px-5'
                  )}
                  type="button">
                    Learn more
                </button>
              </div>
            </div>
            <div className='h-full md:px-6 w-full pb-10 pt-3 px-2'>
              <div className='text-section leading-header font-header justify-center ...'>
                {data?.learnTitle}
                <div className='text-[#7F7F7F] text-body leading-body font-normal tracking-wide py-2 md:whitespace-nowrap sm:whitespace-normal ...'>
                  {data?.learnDescription}
                </div>
                <div className='w-full items-center ...'>
                  <div className='h-full w-full cursor-pointer ...'>
                    <LearnCards
                      cards={learnCards}
                      cardImages={learnCardImages}
                    />
                  </div>
                  <div className='flex flex-row justify-center sm:w-full items-center pt-6 ...'>
                    <Link href={'/articles'}>
                      <button
                        className={tw(
                          'font-grotesk font-bold text-base bg-[#F9D963] rounded-lg text-[#4D4412] block',
                          'flex flex-row items-center cursor-pointer hover:opacity-80 w-max',
                          'py-2 px-5'
                        )}
                        type="button">
                      Read more
                      </button>
                    </Link>
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