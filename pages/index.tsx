/* eslint-disable @next/next/no-img-element */
import { FeaturedProfile } from 'components/elements/FeaturedProfile';
import HomePageTicker from 'components/elements/HomePageTicker';
import { LearnCards } from 'components/elements/LearnCards';
import PreviewBanner from 'components/elements/PreviewBanner';
import { ProfileFeed } from 'components/elements/ProfileFeed';
import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { WalletRainbowKitButton } from 'components/elements/WalletRainbowKitButton';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { LeaderBoard } from 'components/modules/Profile/LeaderBoard';
import { useLeaderboardQuery } from 'graphql/hooks/useLeaderboardQuery';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { TickerStat } from 'types';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';
import { Player, Controls } from '@lottiefiles/react-lottie-player';

import { NextPageWithLayout } from './_app';

import { BigNumber } from 'ethers';
import { getCollection } from 'lib/contentful/api';
import { HOME_PAGE_FIELDS } from 'lib/contentful/schemas';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Vector from 'public/Vector.svg';
import { useEffect, useState } from 'react';

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
    if (data?.learnCards) {
      setLearnCards([data.learnCards['card1'], data.learnCards['card2']]);
    }
    if (data?.learnCardImagesCollection) {
      setLearnCardImages([data.learnCardImagesCollection.items[0], data.learnCardImagesCollection.items[1]]);
    }
  }, [data?.featuredProfile, data.learnCards, data.tickerStats, featuredProfileNFT1, featuredProfileNFT2, featuredProfileNFT3, data.learnCardImagesCollection.items, data.learnCardImagesCollection, data.subheroTitle]);
  if (getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V3_ENABLED)) {
    return (
      <>
        <main className='flex flex-col font-grotesk not-italic'>
          {/* Block: Intro */}
          <div className='bg-white'>
            <div className='max-w-[90%] mx-auto h-screen'>
              {/* Block Text */}
              <div className='py-32 h-full flex flex-col justify-center items-start'>
                <h2 className='text-5xl text-[82px] font-medium text-black leading-none mb-14'>
                  Own your <img className={tw(
                    'drop-shadow-md inline-block max-w-[6rem] minlg:max-w-none',
                    'mr-[1.25rem] ml-[1rem] mt-[-1rem] mb-[-1rem]'
                  )} src="ico-discover.png" alt="" />
                  <br className='hidden minlg:block' />
                  NFT <img className={tw(
                    'drop-shadow-md inline-block max-w-[6rem] minlg:max-w-none',
                    'mr-[1.25rem] ml-[1rem] mt-[-1rem] mb-[-1rem]'
                  )}
                    src="ico-discover.png" alt="" />
                  <span className='text-secondary-yellow'>identity</span></h2>

                <a href="" className={tw(
                  'bg-[#121212] drop-shadow-lg',
                  'inline-flex items-center justify-center text-center h-[4.1875rem] px-6',
                  'rounded-full text-xl text-white font-medium uppercase'
                )}>create a Profile</a>
              </div>

              {/* Block Anim */}
              <div className='bg-[#F9D54C] overflow-hidden w-2/5 absolute right-0 top-0 z-[105] h-full'>
                <Player
                  autoplay
                  loop
                  src="/anim/cycle.json"
                  style={{ height: '100vh', width: '100%', transform: 'skew(-34deg, 18deg) scale(1.6)' }}
                >
                </Player>
                <div className={tw(
                  'absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 scale-75',
                  'bg-[#121212] drop-shadow-lg max-w-[21rem] minmd:max-w-lg minlg:max-w-4xl h-[74px] minlg:h-[182px]',
                  'flex items-center justify-center text-center px-7',
                  'rounded-full text-[42px] minmd:text-[60px] minlg:text-[105px] font-medium leading-none tracking-tight'
                )}>
                  <span className='text-white/40'>NFT.COM</span><span className='text-[.75em] -mt-4 font-bold text-secondary-yellow'>/</span><span className='text-white'>IDEAS</span>
                </div>
                <span className='absolute w-full h-[460px] -bottom-[122px] left-0 z-10 bg-img-shadow pointer-events-none'></span>
              </div>
            </div>
          </div>

          {/* Block: NFT profile */}
          <div className="px-24">
            <div className='bg-black minlg:rounded-3xl w-full mx-auto pt-10 px-9 mb-44 relative z-10'>
              <h2 className='text-5xl text-[82px] text-white leading-[1.0854] mb-14'>
                What you can do <br className='hidden minlg:block' />
                with an
                <img className={tw(
                  'drop-shadow-md inline-block max-w-[6rem] minlg:max-w-none',
                  'mr-[1.25rem] ml-[1rem] mt-[-1rem] mb-[-1rem]'
                )}
                  src="ico-discover.png" alt="" />
                <span className='text-secondary-yellow'>NFT Profile</span></h2>

              <div className='minlg:grid grid-cols-2 gap-2 minlg:gap-4 -mb-24'>
                <div className='bg-white mb-[18px] minlg:mb-0 rounded-3xl rounded-tr-none px-9 pt-12 pb-3 border-black border-2 relative z-0 overflow-hidden'>
                  <svg className='absolute -z-10 -top-[271px] -right-28' width="287" height="386" viewBox="0 0 287 386" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_d_114_76)">
                      <path d="M167.421 0H119.359C118.63 0 117.975 0.449617 117.713 1.13093L4.921 294.604C4.47705 295.759 5.32974 297 6.56724 297H53.2259C53.9532 297 54.6058 296.554 54.8695 295.876L169.065 2.40319C169.515 1.24701 168.662 0 167.421 0Z" fill="black" />
                      <path d="M188.421 66H140.359C139.63 66 138.975 66.4496 138.713 67.1309L25.921 360.604C25.477 361.759 26.3297 363 27.5672 363H74.2259C74.9532 363 75.6058 362.554 75.8695 361.876L190.065 68.4032C190.515 67.247 189.662 66 188.421 66Z" fill="black" />
                      <path d="M246.421 43H198.359C197.63 43 196.975 43.4496 196.713 44.1309L83.921 337.604C83.477 338.759 84.3297 340 85.5672 340H132.226C132.953 340 133.606 339.554 133.87 338.876L248.065 45.4032C248.515 44.247 247.662 43 246.421 43Z" fill="black" />
                      <path d="M280.421 81H232.359C231.63 81 230.975 81.4496 230.713 82.1309L117.921 375.604C117.477 376.759 118.33 378 119.567 378H166.226C166.953 378 167.606 377.554 167.87 376.876L282.065 83.4032C282.515 82.247 281.662 81 280.421 81Z" fill="black" />
                    </g>
                    <defs>
                      <filter id="filter0_d_114_76" x="0.802002" y="0" width="285.385" height="386" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_114_76" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_114_76" result="shape" />
                      </filter>
                    </defs>
                  </svg>

                  <h3 className='text-black text-6xl leading-[1.15] font-medium mb-6 pr-36'>Claim Your Profile</h3>
                  <p className='text-[22px] leading-normal'>NFT Profiles are personalized NFT galleries which form the foundation for a decentralized web3 social network. NFT Profiles are transferable and customizable. </p>
                  <div className={tw(
                    'bg-[#121212] drop-shadow-lg w-full h-[105px] mx-auto mt-10 mb-6',
                    'flex items-center justify-center text-center',
                    'rounded-full text-[60px] minlg:text-[62px] font-medium leading-none tracking-tight'
                  )}>
                    <span className='text-white/40'>NFT.COM</span><span className='text-[.75em] -mt-4 font-bold text-secondary-yellow'>/</span><span className='text-white'>IDEAS</span>
                  </div>
                  <div className='text-center'>
                    <a href="" className='text-xl underline underline-offset-4 hover:no-underline'>Create a Profile →</a>
                  </div>
                </div>

                <div className='bg-white rounded-3xl rounded-tr-none px-9 pt-12 pb-3 border-black border-2 relative z-0 overflow-hidden'>
                  <svg className='absolute -z-10 -top-[229px] -right-20' width="287" height="386" viewBox="0 0 287 386" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_d_114_76)">
                      <path d="M167.421 0H119.359C118.63 0 117.975 0.449617 117.713 1.13093L4.921 294.604C4.47705 295.759 5.32974 297 6.56724 297H53.2259C53.9532 297 54.6058 296.554 54.8695 295.876L169.065 2.40319C169.515 1.24701 168.662 0 167.421 0Z" fill="black" />
                      <path d="M188.421 66H140.359C139.63 66 138.975 66.4496 138.713 67.1309L25.921 360.604C25.477 361.759 26.3297 363 27.5672 363H74.2259C74.9532 363 75.6058 362.554 75.8695 361.876L190.065 68.4032C190.515 67.247 189.662 66 188.421 66Z" fill="black" />
                      <path d="M246.421 43H198.359C197.63 43 196.975 43.4496 196.713 44.1309L83.921 337.604C83.477 338.759 84.3297 340 85.5672 340H132.226C132.953 340 133.606 339.554 133.87 338.876L248.065 45.4032C248.515 44.247 247.662 43 246.421 43Z" fill="black" />
                      <path d="M280.421 81H232.359C231.63 81 230.975 81.4496 230.713 82.1309L117.921 375.604C117.477 376.759 118.33 378 119.567 378H166.226C166.953 378 167.606 377.554 167.87 376.876L282.065 83.4032C282.515 82.247 281.662 81 280.421 81Z" fill="black" />
                    </g>
                    <defs>
                      <filter id="filter0_d_114_76" x="0.802002" y="0" width="285.385" height="386" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_114_76" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_114_76" result="shape" />
                      </filter>
                    </defs>
                  </svg>

                  <h3 className='text-black text-6xl leading-[1.15] font-medium mb-6 pr-36'>Buy and Sell NFTs</h3>
                  <p className='text-[22px] leading-normal mb-4'>NFT.com has a built in marketplace aggregator for buying and selling NFTs wherever they live. Promote your collection with a single NFT Profile wherever it is for sale.</p>

                  <div className='overflow-hidden -mx-9'>
                    <div className="w-[150%] -translate-x-10 flex items-center gap-5 mb-5">
                      <img src="medici.png" className='w-28 rounded-full' alt="" />
                      <img src="medici.png" className='w-28 rounded-full' alt="" />
                      <img src="medici.png" className='w-28 rounded-full' alt="" />
                      <img src="medici.png" className='w-28 rounded-full' alt="" />
                      <img src="medici.png" className='w-28 rounded-full' alt="" />
                      <img src="medici.png" className='w-28 rounded-full' alt="" />
                      <img src="medici.png" className='w-28 rounded-full' alt="" />
                    </div>

                    <div className="w-[150%] -translate-x-2 flex items-center gap-5">
                      <img src="medici.png" className='w-28 rounded-full' alt="" />
                      <img src="medici.png" className='w-28 rounded-full' alt="" />
                      <img src="medici.png" className='w-28 rounded-full' alt="" />
                      <img src="medici.png" className='w-28 rounded-full' alt="" />
                      <img src="medici.png" className='w-28 rounded-full' alt="" />
                      <img src="medici.png" className='w-28 rounded-full' alt="" />
                      <img src="medici.png" className='w-28 rounded-full' alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Block: Discover */}
          <div className="px-5">
            <div className='max-w-nftcom w-full mx-auto grid minmd:grid-cols-2 items-center mb-16 minmd:mb-[5.5rem]'>
              <div className='minmd:ml-7'>
                <h2 className='text-5xl minxl:text-8xl leading-none mb-6'><span className='text-secondary-yellow'>
                  Discover <br />
                  <img className={tw(
                    'drop-shadow-md inline-block max-w-[6rem] minlg:max-w-none',
                    'ml-[1rem] mt-[-1rem] mb-[-1rem]'
                  )} src="ico-discover.png" alt="" /> a</span><br />
                  New World
                </h2>
                <p className='text-base minxl:text-xll'>NFTs enable new forms of community engagement. Collect, Display, and Trade your NFTs through a social network that you own. Get started by building your NFT Profile.</p>
              </div>

              <div className='minmd:-order-1 -mx-5'>
                <img src="nft-illo.jpg" alt="" />
              </div>
            </div>
          </div>

          {/* Block: How it works */}
          <div className="px-5">
            <div className='max-w-nftcom w-full mx-auto overflow-hidden'>
              <div className='relative z-0 p-6 pt-[3.15rem] bg-primary-yellow rounded-3xl mt-5 mb-[120px]'>
                <svg className='absolute -z-10 top-[-25%] minmd:top-[-80%] -right-6 max-w-[43.5%]' aria-hidden="true" width="522" height="625" viewBox="0 0 522 625" xmlns="http://www.w3.org/2000/svg">
                  <path d="M391.42 0H305.875C305.146 0 304.492 0.449257 304.23 1.13017L108.923 508.603C108.478 509.758 109.331 511 110.568 511H193.683C194.41 511 195.063 510.554 195.327 509.877L393.063 2.40395C393.514 1.24765 392.661 0 391.42 0Z" fill="white" />
                  <path d="M283.42 57H197.875C197.146 57 196.492 57.4493 196.23 58.1302L0.922552 565.603C0.477943 566.758 1.33065 568 2.5685 568H85.6835C86.4104 568 87.0629 567.554 87.3268 566.877L285.063 59.4039C285.514 58.2477 284.661 57 283.42 57Z" fill="white" />
                  <path d="M443.42 88H357.875C357.146 88 356.492 88.4493 356.23 89.1302L160.923 596.603C160.478 597.758 161.331 599 162.568 599H245.683C246.41 599 247.063 598.554 247.327 597.877L445.063 90.4039C445.514 89.2477 444.661 88 443.42 88Z" fill="white" />
                  <path d="M543.42 49H457.875C457.146 49 456.492 49.4493 456.23 50.1302L260.923 557.603C260.478 558.758 261.331 560 262.568 560H345.683C346.41 560 347.063 559.554 347.327 558.877L545.063 51.4039C545.514 50.2477 544.661 49 543.42 49Z" fill="white" />
                  <path d="M601.42 114H515.875C515.146 114 514.492 114.449 514.23 115.13L318.923 622.603C318.478 623.758 319.331 625 320.568 625H403.683C404.41 625 405.063 624.554 405.327 623.877L603.063 116.404C603.514 115.248 602.661 114 601.42 114Z" fill="white" />
                  <path d="M702.42 73H616.875C616.146 73 615.492 73.4493 615.23 74.1302L419.923 581.603C419.478 582.758 420.331 584 421.568 584H504.683C505.41 584 506.063 583.554 506.327 582.877L704.063 75.4039C704.514 74.2477 703.661 73 702.42 73Z" fill="white" />
                </svg>

                <div className='relative'>
                  <h2 className='text-5xl font-medium minxl:text-[82px] mb-[1rem]'>How it works?</h2>
                  <p className='text-base minxl:text-2xl mb-8'>How nft.com works</p>
                </div>

                <div className='grid minlg:grid-cols-3 minmd:grid-cols-3 minmd:gap-4 mb-[-127px]'>
                  <div className='bg-black rounded-2xl p-4 pb-12 md:mb-5 text-white'>
                    <img className='w-full bg-white rounded-2xl mb-6' src="hiw-img.png" alt="" />
                    <h3 className='text-2xl minxl:text-[40px] leading-tight mb-4'>Claim a <br />Profile</h3>
                    <p className='text-base minxl:text-xl'>Create an NFT Profile for your unique username that is itself an NFT. You own the profile that will go anywhere your NFTs do.</p>
                  </div>

                  <div className=' bg-black rounded-2xl p-4 pb-12 md:mb-5 text-white'>
                    <img className='w-full bg-white rounded-2xl mb-6' src="hiw-img.png" alt="" />
                    <h3 className='text-2xl minxl:text-[40px] leading-tight mb-4'>Customize your Collection</h3>
                    <p className='text-base minxl:text-xl'>Customize your NFT Profile to display your personal collection from any address or to promote your NFT collection.</p>
                  </div>

                  <div className=' bg-black rounded-2xl p-4 pb-12 text-white'>
                    <img className='w-full bg-white rounded-2xl mb-6' src="hiw-img.png" alt="" />
                    <h3 className='text-2xl minxl:text-[40px] leading-tight mb-4'>Grow your Community</h3>
                    <p className='text-base minxl:text-xl'>Promote your NFT Profile with your unique NFT.com url to drive purchasing and growth wherever your NFTs are listed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Block: Table */}
          <div className='overflow-hidden relative pt-[187px] px-5'>
            <svg className='absolute -z-10 top-[-36px] left-1/2 -translate-x-1/2' width="2102" height="940" viewBox="0 0 2102 940" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M2101.5 109H1411.75L1092.92 937.603C1092.48 938.758 1093.33 940 1094.57 940H1776.57C1777.29 940 1777.94 939.554 1778.21 938.876L2101.5 109Z" fill="#F9D54C" /> <path d="M1813.92 0H1672.51C1671.78 0 1671.12 0.454143 1670.86 1.14044L1622.9 128.113C1622.47 129.267 1623.32 130.5 1624.55 130.5H1762.09C1762.8 130.5 1763.45 130.066 1763.72 129.403L1815.55 2.43016C1816.02 1.27007 1815.17 0 1813.92 0Z" fill="white" /> <path d="M992.298 109H320.963C320.233 109 319.579 109.449 319.317 110.13L0.922309 937.603C0.477803 938.758 1.33052 940 2.56831 940H684.565C685.292 940 685.944 939.554 686.208 938.876L1003.26 125.029C1006.26 117.319 1000.57 109 992.298 109Z" fill="#F9D54C" /> <path d="M668.42 110H582.875C582.146 110 581.492 110.449 581.23 111.13L385.923 618.603C385.478 619.758 386.331 621 387.568 621H470.683C471.41 621 472.063 620.554 472.327 619.877L670.063 112.404C670.514 111.248 669.661 110 668.42 110Z" fill="url(#paint0_linear_217_4)" /> <path d="M1655.5 109H965.752L646.922 937.603C646.478 938.758 647.331 940 648.568 940H1330.57C1331.29 940 1331.94 939.554 1332.21 938.876L1655.5 109Z" fill="url(#paint1_linear_217_4)" /> <path d="M1861.42 113H1775.88C1775.15 113 1774.49 113.449 1774.23 114.13L1578.92 621.603C1578.48 622.758 1579.33 624 1580.57 624H1663.68C1664.41 624 1665.06 623.554 1665.33 622.877L1863.06 115.404C1863.51 114.248 1862.66 113 1861.42 113Z" fill="url(#paint2_linear_217_4)" /> <path d="M1938.92 44H1797.51C1796.78 44 1796.12 44.4541 1795.86 45.1404L1747.9 172.113C1747.47 173.267 1748.32 174.5 1749.55 174.5H1887.09C1887.8 174.5 1888.45 174.066 1888.72 173.403L1940.55 46.4302C1941.02 45.2701 1940.17 44 1938.92 44Z" fill="white" /> <path d="M1285.92 34H1144.51C1143.78 34 1143.12 34.4541 1142.86 35.1404L1094.9 162.113C1094.47 163.267 1095.32 164.5 1096.55 164.5H1234.09C1234.8 164.5 1235.45 164.066 1235.72 163.403L1287.55 36.4302C1288.02 35.2701 1287.17 34 1285.92 34Z" fill="white" /> <path d="M698.916 56H557.512C556.779 56 556.122 56.4541 555.862 57.1404L507.902 184.113C507.466 185.267 508.318 186.5 509.551 186.5H647.086C647.802 186.5 648.448 186.066 648.719 185.403L700.549 58.4302C701.023 57.2701 700.169 56 698.916 56Z" fill="white" /> <path d="M845.916 25H704.512C703.779 25 703.122 25.4541 702.862 26.1404L654.902 153.113C654.466 154.267 655.318 155.5 656.551 155.5H794.086C794.802 155.5 795.448 155.066 795.719 154.403L847.549 27.4302C848.023 26.2701 847.169 25 845.916 25Z" fill="white" /> <defs> <linearGradient id="paint0_linear_217_4" x1="605.131" y1="110" x2="435.468" y2="210.923" gradientUnits="userSpaceOnUse"> <stop stopColor="#FDC416" /> <stop offset="0.583333" stopColor="#FFA233" /> </linearGradient> <linearGradient id="paint1_linear_217_4" x1="1423" y1="109" x2="1119" y2="501.5" gradientUnits="userSpaceOnUse"> <stop stopColor="#FDC416" /> <stop offset="0.583333" stopColor="#FFA233" /> </linearGradient> <linearGradient id="paint2_linear_217_4" x1="1798.13" y1="113" x2="1690.25" y2="188.205" gradientUnits="userSpaceOnUse"> <stop stopColor="#FDC416" /> <stop offset="0.583333" stopColor="#FFA233" /> </linearGradient> </defs> </svg>

            <div className='max-w-nftcom w-full mx-auto bg-white shadow-2xl rounded-3xl mb-[5.4rem] px-4 minmd:px-10 pt-12 pb-5 ...'>
              <div className="minmd:flex justify-between items-center mb-4 minmd:mb-0">
                <h2 className='text-5xl minmd:text-[62px] minlg:text-[82px] minlg:leading-header max-w-2xl font-normal justify-center minmd:mb-16 ...'>
                  {data?.leaderboardTitle}
                </h2>
                <span className='text-2xl minmd:ml-4 text-[#B2B2B2]'><span className='text-[#FBC214]'>Top 10</span> collectors</span>
              </div>

              <LeaderBoard data={leaderboardData} />
            </div>
          </div>

          {/* Block: News */}
          <div className="px-5">
            <div className='max-w-nftcom w-full mx-auto minmd:px-0 overflow-hidden'>
              <div className='relative z-0 px-9 pt-[3.15rem] pb-12 bg-black rounded-3xl mt-5 mb-24'>
                <svg className='absolute -z-10 top-[-25%] minmd:top-[-60%] -right-6 max-w-[43.5%]' aria-hidden="true" width="522" height="625" viewBox="0 0 522 625" xmlns="http://www.w3.org/2000/svg">
                  <path d="M391.42 0H305.875C305.146 0 304.492 0.449257 304.23 1.13017L108.923 508.603C108.478 509.758 109.331 511 110.568 511H193.683C194.41 511 195.063 510.554 195.327 509.877L393.063 2.40395C393.514 1.24765 392.661 0 391.42 0Z" fill="white" />
                  <path d="M283.42 57H197.875C197.146 57 196.492 57.4493 196.23 58.1302L0.922552 565.603C0.477943 566.758 1.33065 568 2.5685 568H85.6835C86.4104 568 87.0629 567.554 87.3268 566.877L285.063 59.4039C285.514 58.2477 284.661 57 283.42 57Z" fill="white" />
                  <path d="M443.42 88H357.875C357.146 88 356.492 88.4493 356.23 89.1302L160.923 596.603C160.478 597.758 161.331 599 162.568 599H245.683C246.41 599 247.063 598.554 247.327 597.877L445.063 90.4039C445.514 89.2477 444.661 88 443.42 88Z" fill="white" />
                  <path d="M543.42 49H457.875C457.146 49 456.492 49.4493 456.23 50.1302L260.923 557.603C260.478 558.758 261.331 560 262.568 560H345.683C346.41 560 347.063 559.554 347.327 558.877L545.063 51.4039C545.514 50.2477 544.661 49 543.42 49Z" fill="white" />
                  <path d="M601.42 114H515.875C515.146 114 514.492 114.449 514.23 115.13L318.923 622.603C318.478 623.758 319.331 625 320.568 625H403.683C404.41 625 405.063 624.554 405.327 623.877L603.063 116.404C603.514 115.248 602.661 114 601.42 114Z" fill="white" />
                  <path d="M702.42 73H616.875C616.146 73 615.492 73.4493 615.23 74.1302L419.923 581.603C419.478 582.758 420.331 584 421.568 584H504.683C505.41 584 506.063 583.554 506.327 582.877L704.063 75.4039C704.514 74.2477 703.661 73 702.42 73Z" fill="white" />
                </svg>

                <div className='relative'>
                  <h2 className='text-5xl mb-5 text-white minxl:text-[82px]'>News</h2>
                  <p className='text-base text-[#8B8B8B] minxl:text-2xl mb-[2.6rem]'>Latest from the blog</p>
                </div>

                <div className='-mr-9 overflow-hidden mb-[50px]'>
                  <div className='minlg:flex gap-5'>
                    <div className='bg-white w-80 basis-80 flex flex-col flex-shrink-0 rounded-lg md:mb-5 text-black'>
                      <img className='w-full rounded-t-lg' src="news01.png" alt="" />
                      <div className='pt-6 px-4 pb-5 flex-grow flex flex-col items-start'>
                        <h3 className='text-2xl minxl:text-[2rem] mb-8'>7 NFT Games You Can Play Right Now</h3>
                        <div className='flex items-center mt-auto text-xl text-[rgba(96,90,69,.6)]'>
                          <img className='rounded-full mr-3' src="ava.png" alt="" />
                          Ryan Ancill
                        </div>
                      </div>
                    </div>

                    <div className='bg-white w-80 basis-80 flex flex-col flex-shrink-0 rounded-lg md:mb-5 text-black'>
                      <img className='w-full rounded-t-lg' src="news01.png" alt="" />
                      <div className='pt-6 px-4 pb-5 flex-grow flex flex-col items-start'>
                        <h3 className='text-2xl minxl:text-[2rem] mb-8'>Majority of NFT Collections Reinvest Ethereum Back Into System - Nansen</h3>
                        <div className='flex items-center mt-auto text-xl text-[rgba(96,90,69,.6)]'>
                          <img className='rounded-full mr-3' src="ava.png" alt="" />
                          Alec Otto
                        </div>
                      </div>
                    </div>

                    <div className='bg-white w-80 basis-80 flex flex-col flex-shrink-0 rounded-lg md:mb-5 text-black'>
                      <img className='w-full rounded-t-lg' src="news01.png" alt="" />
                      <div className='pt-6 px-4 pb-5 flex-grow flex flex-col items-start'>
                        <h3 className='text-2xl minxl:text-[2rem] mb-8'>Buyers Hold to Their CryptoPunk-Themed NFTs by Tiffany after Swift Sale</h3>
                        <div className='flex items-center mt-auto text-xl text-[rgba(96,90,69,.6)]'>
                          <img className='rounded-full mr-3' src="ava.png" alt="" />
                          Raphael Wild
                        </div>
                      </div>
                    </div>

                    <div className='bg-white w-80 basis-80 flex flex-col flex-shrink-0 rounded-lg md:mb-5 text-black opacity-40'>
                      <img className='w-full rounded-t-lg' src="news01.png" alt="" />
                      <div className='pt-6 px-4 pb-5 flex-grow flex flex-col items-start'>
                        <h3 className='text-2xl minxl:text-[2rem] mb-8'>The Most Expensive NFT Sales</h3>
                        <div className='flex items-center mt-auto text-xl text-[rgba(96,90,69,.6)]'>
                          <img className='rounded-full mr-3' src="ava.png" alt="" />
                          Ryan Ancill
                        </div>
                      </div>
                    </div>

                    <div className='bg-white w-80 basis-80 flex flex-col flex-shrink-0 rounded-lg md:mb-5 text-black opacity-40'>
                      <img className='w-full rounded-t-lg' src="news01.png" alt="" />
                      <div className='pt-6 px-4 pb-5 flex-grow flex flex-col items-start'>
                        <h3 className='text-2xl minxl:text-[2rem] mb-8'>Majority of NFT Collections Reinvest Ethereum Back Into System - Nansen</h3>
                        <div className='flex items-center mt-auto text-xl text-[rgba(96,90,69,.6)]'>
                          <img className='rounded-full mr-3' src="ava.png" alt="" />
                          Alec Otto
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='text-center'>
                  <a href="" className={tw(
                    'bg-[#F9D54C] drop-shadow-lg',
                    'inline-flex items-center justify-center h-[67px] px-6',
                    'rounded-full text-xl text-black font-medium uppercase'
                  )}>READ OUR BLOG</a>
                </div>
              </div>
            </div>
          </div>

          {/* Block: Profile */}
          <div className='overflow-hidden mb-12'>
            <div className='text-[#B2B2B2] italic font-medium text-7xl flex mb-5 -translate-x-28'>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> defi</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> cars</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> arts</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> marketing</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> gym</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> tech</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> defi</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> cars</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> arts</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> marketing</div>
            </div>

            <div className='text-[#B2B2B2] italic font-medium text-7xl flex mb-5 -translate-x-[10%]'>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> gaming</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> nba2k</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> draft</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> swift</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> running</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> gaming</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> nba2k</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> draft</div>
              <div className='ml-12 flex items-center'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> swift</div>
            </div>
          </div>

          {/* Block: Profile */}
          <div className='bg-[#F9D54C] overflow-hidden'>
            <div className='max-w-nftcom w-full mx-auto px-5'>
              <div className='relative z-0 p-9 pt-11 pb-12 mt-5 mb-24'>
                <svg className='absolute -z-10 top-[-25%] minmd:top-[-205%] -right-6 max-w-[43.5%]' width="684" height="1048" viewBox="0 0 684 1048" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M393.64 0H273.667C272.937 0 272.282 0.449648 272.021 1.13096L0.921002 706.501C0.477046 707.657 1.32973 708.898 2.56724 708.898H119.168C119.896 708.898 120.548 708.451 120.812 707.774L395.284 2.40319C395.734 1.24701 394.881 0 393.64 0Z" fill="white" />
                  <path d="M474.793 90.7009H354.82C354.09 90.7009 353.435 91.1506 353.174 91.8319L82.0741 797.202C81.6301 798.358 82.4828 799.599 83.7203 799.599H200.321C201.049 799.599 201.701 799.152 201.965 798.475L476.437 93.1041C476.887 91.9479 476.034 90.7009 474.793 90.7009Z" fill="white" />
                  <path d="M817.64 339H697.667C696.937 339 696.282 339.45 696.021 340.131L424.921 1045.5C424.477 1046.66 425.33 1047.9 426.567 1047.9H543.168C543.896 1047.9 544.548 1047.45 544.812 1046.77L819.284 341.403C819.734 340.247 818.881 339 817.64 339Z" fill="white" />
                  <path d="M543.64 120H423.667C422.937 120 422.282 120.45 422.021 121.131L150.921 826.501C150.477 827.657 151.33 828.898 152.567 828.898H269.168C269.896 828.898 270.548 828.451 270.812 827.774L545.284 122.403C545.734 121.247 544.881 120 543.64 120Z" fill="white" />
                  <path d="M624.794 210.701H504.82C504.09 210.701 503.436 211.15 503.174 211.832L232.074 917.202C231.63 918.357 232.483 919.599 233.721 919.599H350.322C351.049 919.599 351.701 919.152 351.965 918.474L626.437 213.104C626.887 211.948 626.034 210.701 624.794 210.701Z" fill="white" />
                </svg>

                <div className='flex justify-between items-end'>
                  <h2 className='tex t-3xl minlg:text-[122px] font-medium text-black leading-none relative'>
                    Build <img className={tw(
                      'drop-shadow-md inline-block max-w-[6rem] minlg:max-w-none',
                      'mr-[10px] ml-[1rem] mt-[-25px] mb-[-1rem]'
                    )} src="ico-discover.png" alt="" />
                    your <br />
                    <span className='inline-block pl-24 -mr-24'>
                      NFT <img className={tw(
                        'drop-shadow-md inline-block max-w-[6rem] minlg:max-w-none',
                        'mr-[1.25rem] ml-[1rem] mt-[-1rem] mb-[-1rem]'
                      )} src="ico-discover.png" alt="" />
                      profile
                    </span>

                    <svg className='absolute left-[100%] top-[60px]' width="397" height="93" viewBox="0 0 397 93" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M1.04904e-05 0.61084L341.924 0.610877C352.896 0.610883 361.792 9.47563 361.792 20.4109V59.0953L384.119 36.7397L396.636 49.1557L352.961 92.8851L309.287 49.1557L321.804 36.7397L344.131 59.0953V20.4109C344.131 19.1958 343.143 18.2109 341.924 18.2109L0 18.2108L1.04904e-05 0.61084Z" fill="black" />
                    </svg>
                  </h2>

                  <a href="" className={tw(
                    'bg-[#121212] drop-shadow-lg',
                    'inline-flex items-center justify-center text-center h-[67px] px-6',
                    'rounded-full text-xl text-white font-medium uppercase'
                  )}>create a Profile</a>
                </div>
              </div>
            </div>
          </div>
        </main>
        {preview && <PreviewBanner />}
      </>
    );
  } else {
    return (
      <>
        <main className='flex flex-col mt-20 font-grotesk not-italic HomePageContainer'>
          <Link href='/app/auctions' passHref>
            <a>
              <div className='mx-auto flex flex-row items-center justify-center w-full h-[55px] font-grotesk minmd:text-lg text-base leading-6 text-white font-[500] bg-[#111111] whitespace-pre-wrap py-2'>
                <span>Unlock the NFT Platform Beta with a Genesis Key</span>
                <div className='flex flex-col rounded items-center p-[1px] ml-2'>
                  <Vector />
                </div>
              </div>
            </a>
          </Link>
          <div className={tw('flex flex-row minmd:flex-nowrap flex-wrap items-center justify-between p-6 space-x-0 minmd:space-x-10 max-w-screen minxl:px-0 px-5 w-full minlg:max-w-[1100px] mx-auto h-full',
            'break-after-all ',
          )}
            style={{
              backgroundImage: 'url(\'/home-banner-bg.png\')',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}>
            <div className='break-after-all space-y-2 w-full ...'>
              <div className={tw(
                'font-header text-black text-5xl minxl:text-7xl leading-header',
                'break-after-all space-y-2'
              )}>
                <div>
                  {data?.subheroTitle}
                </div>
                <div>
                  {data?.subheroDescription.substring(0, data?.subheroDescription.lastIndexOf(' '))} <span className='text-[#F9D963]'>{data?.subheroDescription.split(' ').pop()}</span>
                </div>
                <div className='py-5 text-base minlg:text-xl block w-[100%] text-body text-[#A09E9E] leading-10 tracking-wide font-body minlg:w-[70%]'>
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
            <div className='flex flex-row justify-center pl-0 minxl:pl-20 minmd:justify-end py-10 minmd:py-0 w-full'>
              <FeaturedProfile
                profileOwner={featuredProfile}
                gkId={1}
                featuredNfts={featuredProfileNfts}
              />
            </div>
          </div>
          <div className='space-y-12 w-full items-center max-w-[1100px] mx-auto minlg:px-3 minxl:px-0 ...'>
            <div className='h-full px-6 minlg:px-2 py-12 ...'>
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
            <div className='h-full px-2 rounded-none minxl:rounded-xl bg-always-black py-6 drop-shadow-lg w-full mx-auto ...'>
              {tickerStats && (
                <HomePageTicker tickerStats={data.tickerStats} />
              )}
            </div>
            <div className='h-full px-6 minxl:px-2 ...'>
              <div className='text-section leading-header font-header justify-center mb-6 mt-14 ...'>
                {data?.leaderboardTitle}
              </div>
              <LeaderBoard data={leaderboardData} />
            </div>
            <div className='flex px-6 flex-row flex-wrap w-full h-full justify-center minlg:px-2 ...'>
              <div className='h-full w-full ...'>
                <div className='text-section font-header justify-center py-6 ...'>
                  {data?.threeCardTitle}
                </div>
              </div>
              <div className='h-full minmd:w-[33%] w-full ...'>
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
              <div className='h-full minmd:w-[33%] w-full ...'>
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
              <div className='h-full minmd:w-[33%] w-full ...'>
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
            <div className='h-full px-6 w-full pb-10 pt-3 minlg:px-2'>
              <div className='text-section leading-header font-header justify-center ...'>
                {data?.learnTitle}
                <div className='text-[#7F7F7F] text-body leading-body font-normal tracking-wide py-2 whitespace-normal ...'>
                  {data?.learnDescription}
                </div>
                <div className='w-full items-center ...'>
                  <div className='h-full w-full cursor-pointer ...'>
                    <LearnCards
                      cards={learnCards}
                      cardImages={learnCardImages}
                    />
                  </div>
                  <div className='flex flex-row justify-center minmd:w-auto w-full items-center pt-6 ...'>
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
        {preview && <PreviewBanner />}
      </>
    );
  }
};

Index.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  );
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