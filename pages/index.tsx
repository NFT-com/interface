/* eslint-disable @next/next/no-img-element */
import { FeaturedProfile } from 'components/elements/FeaturedProfile';
import HomePageTicker from 'components/elements/HomePageTicker';
import { LearnCards } from 'components/elements/LearnCards';
import StaticPreviewBanner from 'components/elements/PreviewBanner';
import { ProfileFeed } from 'components/elements/ProfileFeed';
import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { WalletRainbowKitButton as StaticWalletRainbowKitButton } from 'components/elements/WalletRainbowKitButton';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { LeaderBoard as StaticLeaderboard } from 'components/modules/Profile/LeaderBoard';
import { useLeaderboardQuery } from 'graphql/hooks/useLeaderboardQuery';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { TickerStat } from 'types';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { NextPageWithLayout } from './_app';

import { Player } from '@lottiefiles/react-lottie-player';
import { BigNumber } from 'ethers';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { getCollection } from 'lib/contentful/api';
import { HOME_PAGE_FIELDS } from 'lib/contentful/schemas';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import Vector from 'public/Vector.svg';
import { useEffect, useRef, useState } from 'react';

const DynamicLeaderBoard = dynamic<React.ComponentProps<typeof StaticLeaderboard>>(() => import('components/modules/Profile/LeaderBoard').then(mod => mod.LeaderBoard));
const DynamicWalletRainbowKitButton = dynamic<React.ComponentProps<typeof StaticWalletRainbowKitButton>>(() => import('components/elements/WalletRainbowKitButton').then(mod => mod.WalletRainbowKitButton));
const DynamicPreviewBanner = dynamic<React.ComponentProps<typeof StaticPreviewBanner>>(() => import('components/elements/PreviewBanner'));

gsap.registerPlugin(ScrollTrigger);

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

  const el = useRef(null);
  //const q = gsap.utils.selector(el);

  useEffect(() => {
    const imagesAnim = gsap.to('#hero-anim', {
      scrollTrigger: {
        trigger: '.hero-parent',
        scrub: false,
        pin: true,
        start: '1px top',
        end: '+=50%',
        toggleActions: 'play none none none',
      },
      width: '100vw',
      backgroundColor: '#000',
      duration: 1.5,
      ease: 'power2.out'
    });

    const heroAnim = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-parent',
        start: '1px top',
        end: '+=50%',
        toggleActions: 'play none none none',
      }
    })
      .to('#hero-player', {
        rotate: '0deg',
        skewX: '0deg',
        skewY: '0deg',
        duration: 1.5,
        ease: 'power2.out',
      }, 0)
      .to('#hero-text-anim', {
        y: '-50%',
        duration: 1.5,
        ease: 'power2.out'
      }, 0)
      .to('#hero-shadow-dark', {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out'
      }, 0)
      .to('#hero-shadow-light', {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.out'
      }, 0)
      .to('#hero-caption', {
        scale: 1,
        duration: 1.5,
        ease: 'power2.out'
      }, 0);

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

    return () => {
      imagesAnim.kill();
      heroAnim.kill();
    };
  }, [data?.featuredProfile, data.learnCards, data.tickerStats, featuredProfileNFT1, featuredProfileNFT2, featuredProfileNFT3, data.learnCardImagesCollection.items, data.learnCardImagesCollection, data.subheroTitle]);
  if (getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V3_ENABLED)) {
    return (
      <>
        <NextSeo
          title='NFT.com | The Social NFT Marketplace'
          description='Join NFT.com to display, trade, and engage with your NFTs.'
          openGraph={{
            url: 'https://www.nft.com',
            title: 'NFT.com | The Social NFT Marketplace',
            description: 'Join NFT.com to display, trade, and engage with your NFTs.',
            site_name: 'NFT.com',
          }}
          twitter={{
            cardType: 'summary_large_image',
          }}
        />
        <main className='font-grotesk not-italic HomePageContainer'>
          {/* Block: Intro */}
          <div className='bg-white hero-parent' ref={el}>
            {/* Intro Text */}
            <div id='hero-text-anim' className='py-32 pl-[5vw] h-screen flex flex-col justify-center items-start'>
              <h2 className={tw(
                'text-5xl minmd:text-6xl minxl:text-[82px] minxxl:text-[120px] leading-[1.0854]',
                'text-black font-medium mb-14'
              )}>
                Own your <img className={tw(
                  'drop-shadow-md inline-block max-w-[6rem] minlg:max-w-none',
                  'mr-[1.25rem] ml-[1rem] mt-[-1rem] mb-[-1rem]'
                )} src="ico-discover.png" alt="" />
                <br className='hidden minlg:block' />
                NFT <img className={tw(
                  'drop-shadow-md inline-block max-w-[6rem] minlg:max-w-none',
                  'mr-[1.25rem] ml-[1rem] mt-[-1rem] mb-[-1rem]'
                )} src="ico-discover.png" alt="" />
                <span className='text-secondary-yellow'>identity</span></h2>

              <a href="" className={tw(
                'bg-[#121212] hover:bg-[#414141] transition-colors drop-shadow-lg rounded-full',
                'inline-flex items-center justify-center text-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
                'text-xl minxxl:text-3xl text-white font-medium uppercase'
              )}>create a Profile</a>
            </div>

            {/* Animation */}
            <div id='hero-anim' className='overflow-hidden absolute right-0 top-0 h-screen bg-[#F9D54C] z-[105]'>
              <div id="hero-player" className='-skew-x-[34deg] skew-y-[18deg] scale-[1.6]'>
                <Player
                  autoplay
                  loop
                  src="/anim/cycle.json"
                  style={{ height: '100%', width: '100%', minWidth: '45rem' }}
                >
                </Player>
              </div>

              <div id='hero-caption' className={tw(
                'scale-[.6]',
                'absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 rounded-full',
                'bg-[#121212] drop-shadow-lg h-[1.667em] px-[.5em]',
                'flex items-center justify-center text-center px-7',
                'text-[2.625rem] minmd:text-[5rem] minlg:text-[7rem] minxxl:text-[9rem]',
                'font-medium leading-none tracking-tight'
              )}>
                <span className='text-white/40'>NFT.COM</span>
                <span className='text-[.75em] -mt-3 font-bold text-secondary-yellow'>/</span>
                <span className='text-white'>IDEAS</span>
              </div>

              <span id='hero-shadow-light' className={tw(
                'opacity-1',
                'absolute w-full h-[28.75rem] bottom-0 left-0 z-10 bg-img-shadow-light pointer-events-none'
              )}></span>
              <span id='hero-shadow-dark' className={tw(
                'opacity-0',
                'absolute w-full h-[28.75rem] bottom-0 left-0 z-10 bg-img-shadow-dark pointer-events-none'
              )}></span>
            </div>
          </div>

          {/* Block: NFT profile */}
          <div className={tw(
            'minlg:px-14 minxxl:px-20 relative',
            'before:block before:absolute before:left-0 before:right-0 before:top-0',
            'before:bg-black before:h-[34rem]'
          )}>
            <div className={tw(
              'w-full mx-auto pt-10 px-5 mb-40 minmd:px-9 bg-black ',
              'minlg:rounded-3xl flow-root relative z-10'
            )}>
              <h2 className={tw(
                'text-5xl minmd:text-6xl minxl:text-[82px] minxxl:text-[120px]',
                'leading-[1.0854] font-medium text-white mb-14'
              )}>
                What you can do <br className='hidden minlg:block' />
                with an
                <img className={tw(
                  'drop-shadow-md inline-block max-w-[6rem] minlg:max-w-none',
                  'mr-[1.25rem] ml-[1rem] mt-[-1rem] mb-[-1rem]'
                )} src="ico-discover.png" alt="" />
                <span className='text-secondary-yellow'>NFT Profile</span></h2>

              <div className='minlg:grid grid-cols-2 gap-2 minlg:gap-4 -mb-24'>
                <div className={tw(
                  'mb-5 minlg:mb-0',
                  'px-8 pt-12 pb-4 relative z-0 overflow-hidden',
                  'bg-white border-black border-2 rounded-3xl rounded-tr-none'
                )}>
                  <svg className={tw(
                    'absolute -z-10 -top-[14.5rem] -right-10 w-[9rem]',
                    'minlg:-top-[16.875rem] minlg:-right-28 minlg:w-[18rem]'
                  )} width="287" height="386" viewBox="0 0 287 386" fill="none" xmlns="http://www.w3.org/2000/svg">
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

                  <h3 className={tw(
                    'text-black font-bold mb-6 minlg:pr-44',
                    'text-3xl minxl:text-6xl minxxl:text-[5.5rem]',
                    'leading-[1.125] minxl:leading-[1.125]'
                  )}>Claim Your Profile</h3>
                  <p className='text-base minlg:text-[22px] minxxl:text-3xl leading-normal'>NFT Profiles are personalized NFT galleries which form the foundation for a decentralized web3 social network. NFT Profiles are transferable and customizable. </p>
                  <div className={tw(
                    'w-full h-[1.7em] mx-auto mt-10 mb-6',
                    'bg-[#121212] drop-shadow-lg rounded-full',
                    'flex items-center justify-center text-center',
                    'text-3xl minlg:text-[4rem] minxxl:text-[5rem] font-medium leading-none tracking-tight'
                  )}>
                    <span className='text-white/40'>NFT.COM</span>
                    <span className='text-[.75em] leading-loose font-bold text-secondary-yellow'>/</span>
                    <span className='text-white'>IDEAS</span>
                  </div>
                  <div className='text-center mb-10'>
                    <a href="" className={tw(
                      'text-base minlg:text-xl minxxl:text-3xl',
                      'underline underline-offset-4 hover:no-underline'
                    )}>Create a Profile →</a>
                  </div>
                </div>

                <div className={tw(
                  'px-8 pt-12 pb-4 relative z-0 overflow-hidden',
                  'bg-white border-black border-2 rounded-3xl rounded-tr-none'
                )}>
                  <svg className={tw(
                    'absolute -z-10 -top-[14.5rem] -right-10 w-[9rem]',
                    'minlg:-top-[229px] minlg:-right-20 minlg:w-[18rem]'
                  )} width="287" height="386" viewBox="0 0 287 386" fill="none" xmlns="http://www.w3.org/2000/svg">
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

                  <h3 className={tw(
                    'text-black font-bold mb-6 minlg:pr-44',
                    'text-3xl minxl:text-6xl minxxl:text-[5.5rem] leading-[1.125] minxl:leading-[1.125]'
                  )}>Buy and Sell NFTs</h3>
                  <p className='text-base minlg:text-[22px] minxxl:text-3xl leading-normal mb-4'>NFT.com has a built in marketplace aggregator for buying and selling NFTs wherever they live. Promote your collection with a single NFT Profile wherever it is for sale.</p>

                  <div className='overflow-hidden -mx-9'>
                    <div className="w-[150%] -translate-x-5 flex items-center gap-5 mb-4">
                      <img src="medici.png" className='w-16 minxl:w-28 minxxl:w-36 rounded-full' alt="" />
                      <img src="medici.png" className='w-16 minxl:w-28 minxxl:w-36 rounded-full' alt="" />
                      <img src="medici.png" className='w-16 minxl:w-28 minxxl:w-36 rounded-full' alt="" />
                      <img src="medici.png" className='w-16 minxl:w-28 minxxl:w-36 rounded-full' alt="" />
                      <img src="medici.png" className='w-16 minxl:w-28 minxxl:w-36 rounded-full' alt="" />
                      <img src="medici.png" className='w-16 minxl:w-28 minxxl:w-36 rounded-full' alt="" />
                      <img src="medici.png" className='w-16 minxl:w-28 minxxl:w-36 rounded-full' alt="" />
                    </div>

                    <div className="w-[150%] -translate-x-20 flex items-center gap-5">
                      <img src="medici.png" className='w-16 minxl:w-28 minxxl:w-36 rounded-full' alt="" />
                      <img src="medici.png" className='w-16 minxl:w-28 minxxl:w-36 rounded-full' alt="" />
                      <img src="medici.png" className='w-16 minxl:w-28 minxxl:w-36 rounded-full' alt="" />
                      <img src="medici.png" className='w-16 minxl:w-28 minxxl:w-36 rounded-full' alt="" />
                      <img src="medici.png" className='w-16 minxl:w-28 minxxl:w-36 rounded-full' alt="" />
                      <img src="medici.png" className='w-16 minxl:w-28 minxxl:w-36 rounded-full' alt="" />
                      <img src="medici.png" className='w-16 minxl:w-28 minxxl:w-36 rounded-full' alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Block: Discover */}
          <div className="px-3 minmd:px-14 minxxl:px-20">
            <div className='grid minmd:grid-cols-2 items-center mb-16 minmd:mb-[5.5rem]'>
              <div className='minmd:ml-7'>
                <h2 className='text-5xl minmd:text-6xl minxl:text-[82px] minxxl:text-[120px] leading-[1.0854] font-medium mb-6'><span className='text-secondary-yellow'>
                  Discover <br />
                  <img className={tw(
                    'drop-shadow-md inline-block max-w-[1.15em] minlg:max-w-none',
                    'ml-[1rem] mt-[-1rem] mb-[-1rem]'
                  )} src="ico-discover.png" alt="" /> a</span><br />
                  New World
                </h2>
                <p className='text-base minlg:text-xl minxxl:text-3xl'>NFTs enable new forms of community engagement. Collect, Display, and Trade your NFTs through a social network that you own. Get started by building your NFT Profile.</p>
              </div>

              <div className='minmd:-order-1 -mx-5'>
                <img className='w-full' src="nft-illo.jpg" alt="" />
              </div>
            </div>
          </div>

          {/* Block: How it works */}
          <div className="px-3 minlg:px-14 minxxl:px-20">
            <div className='overflow-hidden'>
              <div className='relative z-0 p-6 pt-[3.15rem] bg-primary-yellow rounded-3xl mt-5 mb-[120px]'>
                <svg className='absolute -z-10 top-0 right-0 translate-x-1/3 -translate-y-2/3 minmd:translate-x-1/3 -minmd:translate-y-3/4 max-w-full' aria-hidden="true" width="522" height="625" viewBox="0 0 522 625" xmlns="http://www.w3.org/2000/svg">
                  <path d="M391.42 0H305.875C305.146 0 304.492 0.449257 304.23 1.13017L108.923 508.603C108.478 509.758 109.331 511 110.568 511H193.683C194.41 511 195.063 510.554 195.327 509.877L393.063 2.40395C393.514 1.24765 392.661 0 391.42 0Z" fill="white" />
                  <path d="M283.42 57H197.875C197.146 57 196.492 57.4493 196.23 58.1302L0.922552 565.603C0.477943 566.758 1.33065 568 2.5685 568H85.6835C86.4104 568 87.0629 567.554 87.3268 566.877L285.063 59.4039C285.514 58.2477 284.661 57 283.42 57Z" fill="white" />
                  <path d="M443.42 88H357.875C357.146 88 356.492 88.4493 356.23 89.1302L160.923 596.603C160.478 597.758 161.331 599 162.568 599H245.683C246.41 599 247.063 598.554 247.327 597.877L445.063 90.4039C445.514 89.2477 444.661 88 443.42 88Z" fill="white" />
                  <path d="M543.42 49H457.875C457.146 49 456.492 49.4493 456.23 50.1302L260.923 557.603C260.478 558.758 261.331 560 262.568 560H345.683C346.41 560 347.063 559.554 347.327 558.877L545.063 51.4039C545.514 50.2477 544.661 49 543.42 49Z" fill="white" />
                  <path d="M601.42 114H515.875C515.146 114 514.492 114.449 514.23 115.13L318.923 622.603C318.478 623.758 319.331 625 320.568 625H403.683C404.41 625 405.063 624.554 405.327 623.877L603.063 116.404C603.514 115.248 602.661 114 601.42 114Z" fill="white" />
                  <path d="M702.42 73H616.875C616.146 73 615.492 73.4493 615.23 74.1302L419.923 581.603C419.478 582.758 420.331 584 421.568 584H504.683C505.41 584 506.063 583.554 506.327 582.877L704.063 75.4039C704.514 74.2477 703.661 73 702.42 73Z" fill="white" />
                </svg>

                <div className='relative'>
                  <h2 className='text-5xl minmd:text-6xl minxl:text-[82px] minxxl:text-[120px] leading-[1.0854] font-medium mb-[1rem]'>How it works?</h2>
                  <p className='text-base minlg:text-2xl minxxl:text-4xl mb-8'>How nft.com works</p>
                </div>

                <div className='grid minlg:grid-cols-3 minmd:grid-cols-3 minmd:gap-4 mb-[-127px]'>
                  <div className='bg-black rounded-2xl p-4 pb-12 md:mb-5 text-white'>
                    <img className='w-full bg-white rounded-2xl mb-6' src="hiw-img.png" alt="" />
                    <h3 className='text-2xl minlg:text-[2.5rem] minxxl:text-6xl leading-tight mb-4'>Claim a <br className='hidden minlg:block' />Profile</h3>
                    <p className='text-base minlg:text-xl minxxl:text-3xl'>Create an NFT Profile for your unique username that is itself an NFT. You own the profile that will go anywhere your NFTs do.</p>
                  </div>

                  <div className=' bg-black rounded-2xl p-4 pb-12 md:mb-5 text-white'>
                    <img className='w-full bg-white rounded-2xl mb-6' src="hiw-img.png" alt="" />
                    <h3 className='text-2xl minlg:text-[2.5rem] minxxl:text-6xl leading-tight mb-4'>Customize your Collection</h3>
                    <p className='text-base minlg:text-xl minxxl:text-3xl'>Customize your NFT Profile to display your personal collection from any address or to promote your NFT collection.</p>
                  </div>

                  <div className=' bg-black rounded-2xl p-4 pb-12 text-white'>
                    <img className='w-full bg-white rounded-2xl mb-6' src="hiw-img.png" alt="" />
                    <h3 className='text-2xl minlg:text-[2.5rem] minxxl:text-6xl leading-tight mb-4'>Grow your Community</h3>
                    <p className='text-base minlg:text-xl minxxl:text-3xl'>Promote your NFT Profile with your unique NFT.com url to drive purchasing and growth wherever your NFTs are listed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Block: Table */}
          <div className='px-3 minmd:px-14 minxxl:px-20 overflow-hidden relative pt-[11.625rem]'>
            <svg className='absolute -z-10 top-0 left-1/2 -translate-x-[58%] -translate-y-[2.2rem]' width="2102" height="940" viewBox="0 0 2102 940" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M2101.5 109H1411.75L1092.92 937.603C1092.48 938.758 1093.33 940 1094.57 940H1776.57C1777.29 940 1777.94 939.554 1778.21 938.876L2101.5 109Z" fill="#F9D54C" /> <path d="M1813.92 0H1672.51C1671.78 0 1671.12 0.454143 1670.86 1.14044L1622.9 128.113C1622.47 129.267 1623.32 130.5 1624.55 130.5H1762.09C1762.8 130.5 1763.45 130.066 1763.72 129.403L1815.55 2.43016C1816.02 1.27007 1815.17 0 1813.92 0Z" fill="white" /> <path d="M992.298 109H320.963C320.233 109 319.579 109.449 319.317 110.13L0.922309 937.603C0.477803 938.758 1.33052 940 2.56831 940H684.565C685.292 940 685.944 939.554 686.208 938.876L1003.26 125.029C1006.26 117.319 1000.57 109 992.298 109Z" fill="#F9D54C" /> <path d="M668.42 110H582.875C582.146 110 581.492 110.449 581.23 111.13L385.923 618.603C385.478 619.758 386.331 621 387.568 621H470.683C471.41 621 472.063 620.554 472.327 619.877L670.063 112.404C670.514 111.248 669.661 110 668.42 110Z" fill="url(#paint0_linear_217_4)" /> <path d="M1655.5 109H965.752L646.922 937.603C646.478 938.758 647.331 940 648.568 940H1330.57C1331.29 940 1331.94 939.554 1332.21 938.876L1655.5 109Z" fill="url(#paint1_linear_217_4)" /> <path d="M1861.42 113H1775.88C1775.15 113 1774.49 113.449 1774.23 114.13L1578.92 621.603C1578.48 622.758 1579.33 624 1580.57 624H1663.68C1664.41 624 1665.06 623.554 1665.33 622.877L1863.06 115.404C1863.51 114.248 1862.66 113 1861.42 113Z" fill="url(#paint2_linear_217_4)" /> <path d="M1938.92 44H1797.51C1796.78 44 1796.12 44.4541 1795.86 45.1404L1747.9 172.113C1747.47 173.267 1748.32 174.5 1749.55 174.5H1887.09C1887.8 174.5 1888.45 174.066 1888.72 173.403L1940.55 46.4302C1941.02 45.2701 1940.17 44 1938.92 44Z" fill="white" /> <path d="M1285.92 34H1144.51C1143.78 34 1143.12 34.4541 1142.86 35.1404L1094.9 162.113C1094.47 163.267 1095.32 164.5 1096.55 164.5H1234.09C1234.8 164.5 1235.45 164.066 1235.72 163.403L1287.55 36.4302C1288.02 35.2701 1287.17 34 1285.92 34Z" fill="white" /> <path d="M698.916 56H557.512C556.779 56 556.122 56.4541 555.862 57.1404L507.902 184.113C507.466 185.267 508.318 186.5 509.551 186.5H647.086C647.802 186.5 648.448 186.066 648.719 185.403L700.549 58.4302C701.023 57.2701 700.169 56 698.916 56Z" fill="white" /> <path d="M845.916 25H704.512C703.779 25 703.122 25.4541 702.862 26.1404L654.902 153.113C654.466 154.267 655.318 155.5 656.551 155.5H794.086C794.802 155.5 795.448 155.066 795.719 154.403L847.549 27.4302C848.023 26.2701 847.169 25 845.916 25Z" fill="white" /> <defs> <linearGradient id="paint0_linear_217_4" x1="605.131" y1="110" x2="435.468" y2="210.923" gradientUnits="userSpaceOnUse"> <stop stopColor="#FDC416" /> <stop offset="0.583333" stopColor="#FFA233" /> </linearGradient> <linearGradient id="paint1_linear_217_4" x1="1423" y1="109" x2="1119" y2="501.5" gradientUnits="userSpaceOnUse"> <stop stopColor="#FDC416" /> <stop offset="0.583333" stopColor="#FFA233" /> </linearGradient> <linearGradient id="paint2_linear_217_4" x1="1798.13" y1="113" x2="1690.25" y2="188.205" gradientUnits="userSpaceOnUse"> <stop stopColor="#FDC416" /> <stop offset="0.583333" stopColor="#FFA233" /> </linearGradient> </defs> </svg>

            <div className='bg-white shadow-2xl rounded-3xl mb-[5.5rem] px-4 minmd:px-10 pt-12 pb-5 ...'>
              <div className="minmd:flex justify-between items-center mb-4 minmd:mb-0">
                <h2 className='text-5xl minmd:text-6xl minxl:text-[82px] minxxl:text-[120px] minxl:leading-[.842] font-medium max-w-2xl justify-center minmd:mb-16 ...'>
                  {data?.leaderboardTitle}
                </h2>
                <span className='text-2xl minmd:ml-4 text-[#B2B2B2]'><span className='text-[#FBC214]'>Top 10</span> collectors</span>
              </div>

              <DynamicLeaderBoard data={leaderboardData} />
            </div>
          </div>

          {/* Block: News */}
          <div className="px-3 minmd:px-14 minxxl:px-20">
            <div className='minmd:px-0 overflow-hidden'>
              <div className='relative z-0 px-9 pt-[3.15rem] pb-12 bg-black rounded-3xl mt-5 mb-32'>
                <svg className={tw(
                  'absolute -z-10 top-0 right-0 max-w-[300px] minlg:max-w-[522px]',
                  'translate-x-1/3 -translate-y-2/3 minmd:translate-x-1/3 -minmd:translate-y-3/4'
                )} aria-hidden="true" viewBox="0 0 522 625" xmlns="http://www.w3.org/2000/svg">
                  <path d="M391.42 0H305.875C305.146 0 304.492 0.449257 304.23 1.13017L108.923 508.603C108.478 509.758 109.331 511 110.568 511H193.683C194.41 511 195.063 510.554 195.327 509.877L393.063 2.40395C393.514 1.24765 392.661 0 391.42 0Z" fill="white" />
                  <path d="M283.42 57H197.875C197.146 57 196.492 57.4493 196.23 58.1302L0.922552 565.603C0.477943 566.758 1.33065 568 2.5685 568H85.6835C86.4104 568 87.0629 567.554 87.3268 566.877L285.063 59.4039C285.514 58.2477 284.661 57 283.42 57Z" fill="white" />
                  <path d="M443.42 88H357.875C357.146 88 356.492 88.4493 356.23 89.1302L160.923 596.603C160.478 597.758 161.331 599 162.568 599H245.683C246.41 599 247.063 598.554 247.327 597.877L445.063 90.4039C445.514 89.2477 444.661 88 443.42 88Z" fill="white" />
                  <path d="M543.42 49H457.875C457.146 49 456.492 49.4493 456.23 50.1302L260.923 557.603C260.478 558.758 261.331 560 262.568 560H345.683C346.41 560 347.063 559.554 347.327 558.877L545.063 51.4039C545.514 50.2477 544.661 49 543.42 49Z" fill="white" />
                  <path d="M601.42 114H515.875C515.146 114 514.492 114.449 514.23 115.13L318.923 622.603C318.478 623.758 319.331 625 320.568 625H403.683C404.41 625 405.063 624.554 405.327 623.877L603.063 116.404C603.514 115.248 602.661 114 601.42 114Z" fill="white" />
                  <path d="M702.42 73H616.875C616.146 73 615.492 73.4493 615.23 74.1302L419.923 581.603C419.478 582.758 420.331 584 421.568 584H504.683C505.41 584 506.063 583.554 506.327 582.877L704.063 75.4039C704.514 74.2477 703.661 73 702.42 73Z" fill="white" />
                </svg>

                <div className='relative'>
                  <h2 className='text-5xl minmd:text-6xl minxl:text-[82px] minxxl:text-[120px] leading-[1.0854] font-medium mb-5 text-white'>News</h2>
                  <p className='text-base minlg:text-2xl minxxl:text-4xl text-[#8B8B8B] mb-[2.6rem]'>Latest from the blog</p>
                </div>

                <div className='-mr-9 overflow-hidden mb-12'>
                  <div className='flex gap-5'>
                    <div className={tw(
                      'bg-white flex flex-col flex-shrink-0 rounded-lg md:mb-5 text-black',
                      'w-48 minlg:w-80 minxxl:w-[28rem] basis-48 minlg:basis-80 minxxl:basis-[28rem]'
                    )}>
                      <img className='w-full rounded-t-lg' src="news01.png" alt="" />
                      <div className='pt-6 px-4 pb-5 flex-grow flex flex-col items-start'>
                        <h3 className='text-lg minlg:text-[2rem] minxxl:text-5xl mb-8'>7 NFT Games You Can Play Right Now</h3>
                        <div className='flex items-center mt-auto text-xl text-[rgba(96,90,69,.6)]'>
                          <img className='rounded-full mr-3' src="ava.png" alt="" />
                          Ryan Ancill
                        </div>
                      </div>
                    </div>

                    <div className={tw(
                      'bg-white flex flex-col flex-shrink-0 rounded-lg md:mb-5 text-black',
                      'w-48 minlg:w-80 minxxl:w-[28rem] basis-48 minlg:basis-80 minxxl:basis-[28rem]'
                    )}>
                      <img className='w-full rounded-t-lg' src="news01.png" alt="" />
                      <div className='pt-6 px-4 pb-5 flex-grow flex flex-col items-start'>
                        <h3 className='text-lg minlg:text-[2rem] minxxl:text-5xl mb-8'>Majority of NFT Collections Reinvest Ethereum Back Into System - Nansen</h3>
                        <div className='flex items-center mt-auto text-xl text-[rgba(96,90,69,.6)]'>
                          <img className='rounded-full mr-3' src="ava.png" alt="" />
                          Alec Otto
                        </div>
                      </div>
                    </div>

                    <div className={tw(
                      'bg-white flex flex-col flex-shrink-0 rounded-lg md:mb-5 text-black',
                      'w-48 minlg:w-80 minxxl:w-[28rem] basis-48 minlg:basis-80 minxxl:basis-[28rem]'
                    )}>
                      <img className='w-full rounded-t-lg' src="news01.png" alt="" />
                      <div className='pt-6 px-4 pb-5 flex-grow flex flex-col items-start'>
                        <h3 className='text-lg minlg:text-[2rem] minxxl:text-5xl mb-8'>Buyers Hold to Their CryptoPunk-Themed NFTs by Tiffany after Swift Sale</h3>
                        <div className='flex items-center mt-auto text-xl text-[rgba(96,90,69,.6)]'>
                          <img className='rounded-full mr-3' src="ava.png" alt="" />
                          Raphael Wild
                        </div>
                      </div>
                    </div>

                    <div className={tw(
                      'bg-white flex flex-col flex-shrink-0 rounded-lg md:mb-5 text-black',
                      'w-48 minlg:w-80 minxxl:w-[28rem] basis-48 minlg:basis-80 minxxl:basis-[28rem]',
                      'opacity-40'
                    )}>
                      <img className='w-full rounded-t-lg' src="news01.png" alt="" />
                      <div className='pt-6 px-4 pb-5 flex-grow flex flex-col items-start'>
                        <h3 className='text-lg minlg:text-[2rem] minxxl:text-5xl mb-8'>The Most Expensive NFT Sales</h3>
                        <div className='flex items-center mt-auto text-xl text-[rgba(96,90,69,.6)]'>
                          <img className='rounded-full mr-3' src="ava.png" alt="" />
                          Ryan Ancill
                        </div>
                      </div>
                    </div>

                    <div className={tw(
                      'bg-white flex flex-col flex-shrink-0 rounded-lg md:mb-5 text-black',
                      'w-48 minlg:w-80 minxxl:w-[28rem] basis-48 minlg:basis-80 minxxl:basis-[28rem]',
                      'opacity-40'
                    )}>
                      <img className='w-full rounded-t-lg' src="news01.png" alt="" />
                      <div className='pt-6 px-4 pb-5 flex-grow flex flex-col items-start'>
                        <h3 className='text-lg minlg:text-[2rem] minxxl:text-5xl mb-8'>Majority of NFT Collections Reinvest Ethereum Back Into System - Nansen</h3>
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
                    'bg-[#F9D54C] hover:bg-[#dcaf07] drop-shadow-lg rounded-full transition-colors',
                    'inline-flex items-center justify-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
                    'text-xl minxxl:text-3xl text-black font-medium uppercase'
                  )}>READ OUR BLOG</a>
                </div>
              </div>
            </div>
          </div>

          {/* Block: Ticker */}
          <div className='overflow-hidden mb-20'>
            <div className={tw(
              'text-4xl minlg:text-7xl minxxl:text-9xl',
              'text-[#B2B2B2] italic font-medium flex mb-6',
              '-translate-x-28'
            )}>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> defi</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> cars</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> arts</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> marketing</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> gym</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> tech</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> defi</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> cars</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> arts</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> marketing</div>
            </div>

            <div className={tw(
              'text-4xl minlg:text-7xl minxxl:text-9xl',
              'text-[#B2B2B2] italic font-medium flex mb-6',
              '-translate-x-[10%]'
            )}>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> gaming</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> nba2k</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> draft</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> swift</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> running</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> gaming</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> nba2k</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> draft</div>
              <div className='ml-12 flex items-center hover:text-[#FFAA2C] transition-colors cursor-pointer'><span className='text-[.6em] mt-2 font-bold not-italic'>/</span> swift</div>
            </div>
          </div>

          {/* Block: Profile */}
          <div className='bg-[#F9D54C] overflow-hidden'>
            <div className='px-3 minmd:px-14 minxxl:px-20'>
              <div className='relative z-0 pt-24 pb-12 mt-5 mb-24'>
                <svg className={tw(
                  'absolute -z-10 top-0 right-0 max-w-[43.5%]',
                  '-translate-x-1/3 -translate-y-2/4 minmd:translate-x-1/3 -minmd:translate-y-3/4'
                )} width="684" height="1048" viewBox="0 0 684 1048" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M393.64 0H273.667C272.937 0 272.282 0.449648 272.021 1.13096L0.921002 706.501C0.477046 707.657 1.32973 708.898 2.56724 708.898H119.168C119.896 708.898 120.548 708.451 120.812 707.774L395.284 2.40319C395.734 1.24701 394.881 0 393.64 0Z" fill="white" />
                  <path d="M474.793 90.7009H354.82C354.09 90.7009 353.435 91.1506 353.174 91.8319L82.0741 797.202C81.6301 798.358 82.4828 799.599 83.7203 799.599H200.321C201.049 799.599 201.701 799.152 201.965 798.475L476.437 93.1041C476.887 91.9479 476.034 90.7009 474.793 90.7009Z" fill="white" />
                  <path d="M817.64 339H697.667C696.937 339 696.282 339.45 696.021 340.131L424.921 1045.5C424.477 1046.66 425.33 1047.9 426.567 1047.9H543.168C543.896 1047.9 544.548 1047.45 544.812 1046.77L819.284 341.403C819.734 340.247 818.881 339 817.64 339Z" fill="white" />
                  <path d="M543.64 120H423.667C422.937 120 422.282 120.45 422.021 121.131L150.921 826.501C150.477 827.657 151.33 828.898 152.567 828.898H269.168C269.896 828.898 270.548 828.451 270.812 827.774L545.284 122.403C545.734 121.247 544.881 120 543.64 120Z" fill="white" />
                  <path d="M624.794 210.701H504.82C504.09 210.701 503.436 211.15 503.174 211.832L232.074 917.202C231.63 918.357 232.483 919.599 233.721 919.599H350.322C351.049 919.599 351.701 919.152 351.965 918.474L626.437 213.104C626.887 211.948 626.034 210.701 624.794 210.701Z" fill="white" />
                </svg>

                <div className='minlg:flex justify-between items-end'>
                  <h2 className={tw(
                    'text-[3.25rem] minlg:text-[7.625rem] minxxl:text-[10rem]',
                    'text-black font-medium leading-tight relative',
                    'mb-44 minlg:mb-0'
                  )}>
                    Build <img className={tw(
                      'drop-shadow-md inline-block max-w-[4rem] minlg:max-w-none',
                      'mr-[.625rem] ml-[1rem] mt-[-1.5rem] mb-[-1rem]'
                    )} src="ico-discover.png" alt="" />
                    your <br />
                    <span className='inline-block -mr-10 minlg:pl-24 minlg:-mr-24'>
                      NFT <img className={tw(
                        'drop-shadow-md inline-block max-w-[4rem] minlg:max-w-none',
                        'mr-[1.25rem] ml-[1rem] mt-[-1rem] mb-[-1rem]'
                      )} src="ico-discover.png" alt="" />
                      profile
                    </span>
                    <svg className='hidden minlg:block absolute left-[100%] top-[60px]' width="397" height="93" viewBox="0 0 397 93" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M1.04904e-05 0.61084L341.924 0.610877C352.896 0.610883 361.792 9.47563 361.792 20.4109V59.0953L384.119 36.7397L396.636 49.1557L352.961 92.8851L309.287 49.1557L321.804 36.7397L344.131 59.0953V20.4109C344.131 19.1958 343.143 18.2109 341.924 18.2109L0 18.2108L1.04904e-05 0.61084Z" fill="black" />
                    </svg>

                    <svg className='minlg:hidden absolute top-[100%] left-1/2 translate-y-10 -translate-x-1/2' width="33" height="96" viewBox="0 0 33 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M19.8361 0C19.8361 0 19.8361 62.9869 19.8361 67.315V82.6261L28.2712 73.7779L33 78.6921L16.5 96L0 78.6921L4.72878 73.7779L13.164 82.6261V67.315V0H19.8361Z" fill="black" />
                    </svg>
                  </h2>

                  <div className="text-center minlg:text-left">
                    <a href="" className={tw(
                      'bg-[#121212] hover:bg-[#414141] transition-colors drop-shadow-lg rounded-full',
                      'inline-flex items-center justify-center text-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
                      'text-xl minxxl:text-3xl text-white font-medium uppercase'
                    )}>create a Profile</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        {preview && <DynamicPreviewBanner />}
      </>
    );
  } else {
    return (
      <>
        <NextSeo
          title='NFT.com | The Social NFT Marketplace'
          description='Join NFT.com to display, trade, and engage with your NFTs.'
          openGraph={{
            url: 'https://www.nft.com',
            title: 'NFT.com | The Social NFT Marketplace',
            description: 'Join NFT.com to display, trade, and engage with your NFTs.',
            site_name: 'NFT.com',
          }}
          twitter={{
            cardType: 'summary_large_image',
          }}
        />
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
                <DynamicWalletRainbowKitButton signInButton showWhenConnected={false} />
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
              <DynamicLeaderBoard data={leaderboardData} />
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
        {preview && <DynamicPreviewBanner />}
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
