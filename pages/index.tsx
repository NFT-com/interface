/* eslint-disable @next/next/no-img-element */
import 'aos/dist/aos.css';

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
import { HomePageV2,TickerStat } from 'types';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { NextPageWithLayout } from './_app';

import { Player } from '@lottiefiles/react-lottie-player';
import AOS from 'aos';
import { BigNumber } from 'ethers';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { getCollection } from 'lib/contentful/api';
import { HOME_PAGE_FIELDS } from 'lib/contentful/schemas';
import { HOME_PAGE_FIELDS_V2 } from 'lib/contentful/schemas';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import Vector from 'public/Vector.svg';
import { useEffect, useState } from 'react';
import { usePageVisibility } from 'react-page-visibility';
import Ticker from 'react-ticker';

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
  },
  data_v2?: HomePageV2;
};

const Index: NextPageWithLayout = ({ preview, data, data_v2 }: HomePageProps) => {
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
  const isVisible = usePageVisibility();

  useEffect(() => {
    AOS.init({
      disable: function() {
        const maxWidth = 900;
        return window.innerWidth >= maxWidth;
      },
      duration : 700
    });

    const matchMedia = gsap.matchMedia();

    matchMedia.add('(min-width: 900px)', () => {
      // Hero
      gsap.timeline({
        scrollTrigger: {
          trigger: '#anim-hero-trigger',
          pin: '#anim-hero-trigger',
          start: '5px top',
          end: '+=100px',
          //invalidateOnRefresh: true,
          toggleActions: 'play none reverse none',
        }
      })
        .to('#anim-hero', {
          maxWidth: '100vw',
          backgroundColor: '#000',
          duration: 1.25,
          ease: 'power2.out'
        }, 0)
        .to('#anim-hero-player', {
          y: '-3%',
          rotate: '0deg',
          scale: 1,
          skewX: '0deg',
          skewY: '0deg',
          duration: 1,
          ease: 'power2.out',
        }, 0)
        .to('#anim-hero-text', {
          y: '-50%',
          duration: 1.25,
          ease: 'power2.out'
        }, 0)
        .to('#anim-hero-shadow-dark', {
          opacity: 1,
          duration: 1,
          ease: 'power2.out'
        }, 0)
        .to('#anim-hero-shadow-light', {
          opacity: 0,
          duration: 1.5,
          ease: 'power2.out'
        }, 0)
        .to('#anim-hero-caption', {
          scale: 1,
          duration: 1,
          ease: 'power2.out'
        }, 0);

      // Profile
      gsap.timeline({
        scrollTrigger: {
          trigger: '#anim-profile-trigger',
          start: 'top 90%',
          end: '+=10px',
          toggleActions: 'play none reverse none',
        }
      })
        .to('#anim-profile', {
          y: -200,
          duration: 0.8,
          ease: 'power1.out',
        }, 0)
        .to('#anim-profile-head', {
          y: 0,
          duration: 1,
          ease: 'power2.out',
        }, 0)
        .to('#anim-profile-content', {
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
        }, 0)
        .to('#anim-profile-shadow-dark', {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power1.out',
        }, 0)
        .to('#anim-profile-bg', {
          scaleY: 1,
          duration: 0.8,
          ease: 'power1.out',
        }, 0)
        .to('#anim-profile-first-item', {
          y: 0,
          duration: 0.8,
          ease: 'power1.out',
        }, 0)
        .to('#anim-profile-second-item', {
          y: 0,
          duration: 1,
          ease: 'power1.out',
        }, 0);

      // Discover
      gsap.timeline({
        scrollTrigger: {
          trigger: '#anim-discover-trigger',
          //start: 'top 90%',
          start: '10% bottom',
          end: '+=50px',
          toggleActions: 'play none reverse none',
        }
      })
        .to('#anim-discover-img', {
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
        }, 0)
        .to('#anim-discover-ttl-line-1', {
          y: 0,
          duration: 1.3,
          ease: 'power2.out',
        }, 0)
        .to('#anim-discover-ttl-line-2', {
          y: 0,
          duration: 1.5,
          ease: 'power2.out',
        }, 0)
        .to('#anim-discover-txt', {
          y: 0,
          duration: 1.5,
          ease: 'power2.out',
        }, 0);

      /* Hiw it works */
      gsap.timeline({
        scrollTrigger: {
          trigger: '#anim-hiw-trigger',
          //start: 'top 80%',
          start: 'top bottom',
          end: '+=50px',
          toggleActions: 'play none reverse none',
        }
      })
        .to('#anim-hiw-content', {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        })
        .to('.anim-hiw-item:nth-child(1)', {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
        }, '>-0.7')
        .to('.anim-hiw-item:nth-child(2)', {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
        }, '>-0.75')
        .to('.anim-hiw-item:nth-child(3)', {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
        }, '>-0.8');

      // Leaderboard
      gsap.timeline({
        scrollTrigger: {
          trigger: '#anim-leaderboard-trigger',
          start: 'top 80%',
          end: '+=50px',
          //pin: '#anim-leaderboard-trigger',
          toggleActions: 'play none reverse none',
        }
      })
        .to('#anim-leaderboard-content', {
          y: 0,
          duration: 1.2,
          ease: 'circ.out',
        }, 0)
        .to('#anim-leaderboard-decor', {
          y: 0,
          duration: 1.5,
          ease: 'circ.out',
        }, 0);

      // News
      gsap.timeline({
        scrollTrigger: {
          trigger: '#anim-news-trigger',
          start: 'top 80%',
          end: '+=50px',
          toggleActions: 'play none reverse none',
        }
      })
        .to('#anim-news-content', {
          x: '50%',
          duration: 2.75,
          ease: 'power2.out'
        }, 0);

      // Tickers
      gsap.timeline({
        scrollTrigger: {
          trigger: '#anim-ticker-trigger',
          start: '20% bottom',
          end: '+=50px',
          toggleActions: 'play none reverse none',
        }
      })
        .to('#anim-ticker-first', {
          y: 0,
          duration: 0.8,
          ease: 'circ.out',
        }, 0)
        .to('#anim-ticker-second', {
          y: 0,
          duration: 1,
          ease: 'circ.out',
        }, '>-0.8');

      // Build Profile
      gsap.timeline({
        scrollTrigger: {
          trigger: '#anim-build-profile-trigger',
          start: '20% bottom',
          end: '+=30px',
          toggleActions: 'play none reverse none',
        }
      })
        .to('#anim-build-profile-trigger', {
          y: 0,
          duration: 1.8,
          ease: 'circ.out',
        }, 0)
        .to('#anim-build-profile-ttl-1', {
          y: 0,
          duration: 2,
          ease: 'circ.out',
        }, 0)
        .to('#anim-build-profile-ttl-2', {
          y: 0,
          duration: 2.3,
          ease: 'circ.out',
        }, 0);
    });

    /* if (data?.tickerStats) {
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
    } */
  }, [/* data?.featuredProfile, data.learnCards, data.tickerStats, featuredProfileNFT1, featuredProfileNFT2, featuredProfileNFT3, data.learnCardImagesCollection.items, data.learnCardImagesCollection, data.subheroTitle */]);
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
        <main id='anim-main-trigger' className='font-noi-grotesk not-italic HomePageContainer'>
          {/* Block: Intro */}
          <div id='anim-hero-trigger' className='minlg:h-screen'>
            <div className='bg-white relative'>
              {/* Intro Text */}
              <div id='anim-hero-text' className={tw(
                'pt-[10rem] pb-[3.75rem] minmd:py-[4vh] pl-[5vw] flex flex-col justify-center items-start',
                'minmd:w-[60%] minmd:h-screen'
              )}>
                <h2 data-aos="fade-up" data-aos-delay="100" className={tw(
                  'text-[3rem] minmd:text-header minxl:text-[6.25rem] minxxl:text-[7.5rem] leading-[1.15]',
                  'text-black font-normal tracking-tight mb-14'
                )}>
                  Own your<img className={tw(
                    'drop-shadow-md inline-block w-[3.125rem] minxxl:w-[5.5rem]',
                    'mx-[1.8rem] -my-[.5rem]',
                    'rotate-[40deg] rounded-xl'
                  )} src={data_v2?.heroNfTsCollection?.items[0]?.url} alt="" />
                  <br />
                  NFT<img className={tw(
                    'drop-shadow-md inline-block w-[3.125rem] minxxl:w-[5.5rem]',
                    'mx-[1.8rem] -my-[.5rem]',
                    'rotate-[40deg] rounded-xl'
                  )} src={data_v2?.heroNfTsCollection?.items[1]?.url} alt="" />
                  <span data-aos="fade-left" data-aos-delay="200"
                    className='bg-clip-text text-transparent bg-gradient-to-r from-[#FBC214] to-[#FF9C38]'>identity</span></h2>

                <a data-aos="zoom-out" data-aos-delay="300" href={data_v2?.heroCta?.link} className={tw(
                  'bg-[#121212] hover:bg-[#414141] transition-colors drop-shadow-lg rounded-full',
                  'inline-flex items-center justify-center text-center h-[4.1875rem] minxxl:h-[6rem] px-6 minxxl:px-9',
                  'text-xl minxxl:text-3xl text-white font-medium uppercase'
                )}>{data_v2?.heroCta?.title}</a>
              </div>

              {/* Hero */}
              <div id='anim-hero' data-aos="fade-up" data-aos-delay="200" className={tw(
                'minmd:max-w-[40%] w-full minlg:h-[calc(100vh+5px)] bg-[#F9D54C]',
                'relative minlg:absolute z-[10] minmd:right-0 minmd:top-0 overflow-hidden',
                'before:block before:pb-[127%] minmd:before:pb-[60%] minmd:before:hidden'
              )}>
                <div className='absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2'>
                  <div id="anim-hero-player" className={tw(
                    'pointer-events-none',
                    'scale-x-[.55] scale-y-[.3] minlg:scale-x-[.7] minlg:scale-y-[.5] minxxl:scale-x-100 minxxl:scale-y-[.65] minhd:scale-[1.25]',
                    '-skew-x-[41deg] skew-y-[19deg]'
                  )}>
                    <Player
                      autoplay
                      loop
                      src="/anim/cycle.json"
                      style={{ height: '1600px', width: '1600px' }}
                    >
                    </Player>
                  </div>
                </div>

                <div className={tw(
                  'absolute inset-0',
                  'flex justify-center items-center'
                )}>
                  <div id='anim-hero-caption' className={tw(
                    'minlg:scale-[.58] transform-gpu',
                    'bg-[#121212] drop-shadow-lg h-[1.667em] px-[.5em]',
                    'px-7 minxxl:px-10 relative z-20',
                    'text-[calc(42px+112*(100vw-375px)/1545)]',
                    'leading-none tracking-tight rounded-full'
                  )}>
                    <div className='text-transparent flex'>NFT.COM
                      <div role='presentation' className={tw(
                        'mx-2 minlg:mx-4 minxxl:mx-8',
                        'h-[.68em] w-[.1081em] basis-[.1081em]'
                      )}></div>
                    PLANTS
                    </div>

                    <div className={tw(
                      'absolute inset-x-7 minxxl:inset-x-10 top-0 bottom-0',
                      'text-white flex'
                    )}>
                      {data_v2?.dynamicUrl['url'].map(word =>
                        <a key={word} href={'/app/mint-profiles'} className='anim-profile-link flex items-center justify-center text-center'>
                          <span className='text-white/40'>NFT.COM</span>
                          <span role='presentation' className={tw(
                            '-mb-[.1em] mx-2 minlg:mx-4 minxxl:mx-8 skew-x-[-20deg]',
                            'bg-gradient-to-b from-[#FECB02] to-[#FF9E39]',
                            'h-[.68em] w-[.1081em] basis-[.1081em] rounded-[3px]'
                          )}>
                          </span>{word.toUpperCase()}
                        </a>
                      )}
                    </div>
                  </div>

                  <span role='presentation' id='anim-hero-shadow-light' className={tw(
                    'opacity-1',
                    'absolute bottom-0 left-0 z-10 bg-img-shadow-light',
                    'w-full h-[41.25rem] pointer-events-none'
                  )}></span>
                  <span role='presentation' id='anim-hero-shadow-dark' className={tw(
                    'opacity-0',
                    'absolute bottom-0 left-0 z-10 bg-img-shadow-dark',
                    'w-full h-[28.75rem] pointer-events-none'
                  )}></span>
                </div>
              </div>
            </div>
          </div>

          {/* Block: NFT profile */}
          <div id='anim-profile-trigger'>
            <div id='anim-profile' className={tw(
              'will-change-transform minlg:px-14 minxxl:px-20 mb-[6.5rem] relative z-[10]',
            )}>
              <span role='presentation' id='anim-profile-bg' className='bg-black origin-top-left h-[61.4%] absolute left-0 right-0 top-[-1px]'></span> {/* scale-y-150 */}
              <span role='presentation' id='anim-profile-shadow-dark' className={tw(
                'opacity-0 translate-y-1/2 transform-gpu',
                'absolute bottom-full left-0 -z-10 bg-img-shadow-dark',
                'w-full h-[28.75rem] pointer-events-none'
              )}></span>
              <div className={tw(
                'w-full mx-auto pt-10 px-5 minmd:px-9 bg-black', /* pb-[8.5rem] minlg:pb-40 */
                'minlg:rounded-3xl flow-root relative z-10',
              )}>
                <h2 data-aos="fade-up" data-aos-delay="200" id='anim-profile-head' className={tw(
                  'minlg:translate-y-[400px]',
                  'text-[3rem] minmd:text-[3.75rem] minxl:text-[5.125rem] minxxl:text-[7.5rem]',
                  'leading-[1.0854] font-normal text-white mb-14 minxxl:mb-20'
                )}>
                  What you can do <br className='hidden minlg:block' />
                  with an<img className={tw(
                    'drop-shadow-md inline-block w-[4.525rem] minxxl:w-[5.5rem]',
                    'mx-[0.4em] -my-[0.7rem]',
                    'rotate-[40deg] rounded-xl'
                  )} src={data_v2?.wycdTitleNfTs?.url} alt="" />
                  <span className='bg-clip-text text-transparent bg-gradient-to-r from-[#FDCC00] to-[#FF9D39]'>NFT Profile</span></h2>

                <div id='anim-profile-content' className={tw(
                  'minlg:translate-y-[400px] transform-gpu',
                  'minlg:grid grid-cols-2 gap-2 minlg:gap-4 minxxl:gap-6 -mb-12 minlg:-mb-[6.5rem]'
                )}>
                  <div id='anim-profile-first-item' data-aos="fade-up" data-aos-delay="100" className={tw(
                    'minlg:translate-y-1/4 transform-gpu',
                    'mb-5 minlg:mb-0',
                    'px-8 pt-12 pb-4 minxxl:pt-16 minxxl:pb-6 relative z-0 overflow-hidden',
                    'bg-white border-black border-2 border-t-0 rounded-3xl rounded-tr-none'
                  )}>
                    <svg role='presentation' className={tw(
                      'absolute -z-10 -top-[14.5rem] -right-10 w-[9rem]',
                      'minlg:-top-[17.5rem] minlg:-right-28 minlg:w-[18rem]'
                    )} width="287" height="386" viewBox="0 0 287 386" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path className='anim-corner' d="M167.421 0H119.359C118.63 0 117.975 0.449617 117.713 1.13093L4.921 294.604C4.47705 295.759 5.32974 297 6.56724 297H53.2259C53.9532 297 54.6058 296.554 54.8695 295.876L169.065 2.40319C169.515 1.24701 168.662 0 167.421 0Z" fill="black" />
                      <path className='anim-corner' d="M188.421 66H140.359C139.63 66 138.975 66.4496 138.713 67.1309L25.921 360.604C25.477 361.759 26.3297 363 27.5672 363H74.2259C74.9532 363 75.6058 362.554 75.8695 361.876L190.065 68.4032C190.515 67.247 189.662 66 188.421 66Z" fill="black" />
                      <path className='anim-corner anim-corner-2' d="M246.421 43H198.359C197.63 43 196.975 43.4496 196.713 44.1309L83.921 337.604C83.477 338.759 84.3297 340 85.5672 340H132.226C132.953 340 133.606 339.554 133.87 338.876L248.065 45.4032C248.515 44.247 247.662 43 246.421 43Z" fill="black" />
                      <path className='anim-corner anim-corner-3' d="M280.421 81H232.359C231.63 81 230.975 81.4496 230.713 82.1309L117.921 375.604C117.477 376.759 118.33 378 119.567 378H166.226C166.953 378 167.606 377.554 167.87 376.876L282.065 83.4032C282.515 82.247 281.662 81 280.421 81Z" fill="black" />
                    </svg>

                    <h3 data-aos="fade-up" data-aos-delay="100" className={tw(
                      'text-black font-medium mb-6 minxxl:mb-9 minlg:pr-44 minxxl:pr-48',
                      'text-3xl minxl:text-6xl minxxl:text-[5.5rem]',
                      'leading-[1.125] minxl:leading-[1.125]'
                    )}>{data_v2?.wycdBlock1Title}</h3>
                    <p data-aos="fade-up" data-aos-delay="150" className='text-base minlg:text-[22px] minxxl:text-[2rem] leading-normal pr-[9%]'>{data_v2?.wycdBlock1Description}</p>
                    <div data-aos="fade-up" data-aos-delay="200" className={tw(
                      'w-full h-[1.7em] mx-auto mt-10 mb-6 minxxl:mb-9',
                      'bg-[#121212] drop-shadow-lg rounded-full',
                      'flex items-center justify-center text-center',
                      'text-3xl minlg:text-[3.9rem] minxxl:text-[5rem] leading-none tracking-tight'
                    )}>
                      <div className='text-transparent flex'>NFT.COM
                        <div role='presentation' className={tw(
                          'mx-1 minlg:mx-2 minxxl:mx-4',
                          'h-[.68em] w-[.1081em] basis-[.1081em]'
                        )}></div>
                        PLANTS
                      </div>

                      <div className={tw(
                        'absolute inset-x-5 minxxl:inset-x-8 top-0 bottom-0',
                        'text-white/40 flex'
                      )}>
                        {data_v2?.dynamicUrl['url'].map(word =>
                          <a key={word} href={'/app/mint-profiles'} className='anim-profile-link flex items-center justify-center text-center'>
                          NFT.COM
                            <span className={tw(
                              'mt-[.125em] -mb-[.0625] mx-1 minlg:mx-2 minxxl:mx-4 skew-x-[-20deg]',
                              'bg-gradient-to-b from-[#FECB02] to-[#FF9E39]',
                              'h-[.68em] w-[.1081em] basis-[.1081em] rounded-[3px]'
                            )}></span>{word.toUpperCase()}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className='text-center mb-10'>
                      <a href={data_v2?.wycdBlock1Cta?.link} className={tw(
                        'text-base font-medium minlg:text-xl minxxl:text-3xl',
                        'link-underline flex items-center'
                      )}>{data_v2?.wycdBlock1Cta?.title}
                        <svg role='presentation' className='w-[.7em] ml-2' viewBox="0 0 13.932 14.472" xmlns="http://www.w3.org/2000/svg">
                          <path d="M 13.932,7.236 6.723,14.472 5.346,13.095 10.287,8.262 H 0 V 6.21 H 10.287 L 5.346,1.377 6.723,0 Z" fill="currentColor" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div id='anim-profile-second-item' data-aos="fade-up" data-aos-delay="100" className={tw(
                    'minlg:translate-y-1/2 transform-gpu',
                    'mb-5 minlg:mb-0',
                    'px-8 pt-12 pb-4 minxxl:pt-16 minxxl:pb-6 relative z-0 overflow-hidden',
                    'bg-white border-black border-2 border-t-0 rounded-3xl rounded-tr-none'
                  )}>
                    <svg role='presentation' className={tw(
                      'absolute -z-10 -top-[14.5rem] -right-10 w-[9rem]',
                      'minlg:-top-[229px] minlg:-right-20 minlg:w-[18rem]'
                    )} width="287" height="386" viewBox="0 0 287 386" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path className='anim-corner reverse' d="M167.421 0H119.359C118.63 0 117.975 0.449617 117.713 1.13093L4.921 294.604C4.47705 295.759 5.32974 297 6.56724 297H53.2259C53.9532 297 54.6058 296.554 54.8695 295.876L169.065 2.40319C169.515 1.24701 168.662 0 167.421 0Z" fill="black" />
                      <path className='anim-corner reverse' d="M188.421 66H140.359C139.63 66 138.975 66.4496 138.713 67.1309L25.921 360.604C25.477 361.759 26.3297 363 27.5672 363H74.2259C74.9532 363 75.6058 362.554 75.8695 361.876L190.065 68.4032C190.515 67.247 189.662 66 188.421 66Z" fill="black" />
                      <path className='anim-corner reverse anim-corner-2' d="M246.421 43H198.359C197.63 43 196.975 43.4496 196.713 44.1309L83.921 337.604C83.477 338.759 84.3297 340 85.5672 340H132.226C132.953 340 133.606 339.554 133.87 338.876L248.065 45.4032C248.515 44.247 247.662 43 246.421 43Z" fill="black" />
                      <path className='anim-corner reverse anim-corner-3' d="M280.421 81H232.359C231.63 81 230.975 81.4496 230.713 82.1309L117.921 375.604C117.477 376.759 118.33 378 119.567 378H166.226C166.953 378 167.606 377.554 167.87 376.876L282.065 83.4032C282.515 82.247 281.662 81 280.421 81Z" fill="black" />
                    </svg>

                    <h3 data-aos="fade-up" data-aos-delay="100" className={tw(
                      'text-black font-medium mb-6 minxxl:mb-9 minlg:pr-44 minxxl:pr-48',
                      'text-3xl minxl:text-6xl minxxl:text-[5.5rem] leading-[1.125] minxl:leading-[1.125]'
                    )}>{data_v2?.wycdBlock2Title}</h3>
                    <p data-aos="fade-up" data-aos-delay="150" className='text-base minlg:text-[22px] minxxl:text-[2rem] leading-normal pr-[9%]'>{data_v2?.wycdBlock2Description}</p>

                    <div className='overflow-hidden -mx-9 mt-4 minxxl:mt-6'>
                      <div data-aos="fade-left" data-aos-delay="200" className="image-ticker mb-4 minxxl:mb-6 h-16 minxl:h-28 minxxl:h-36">
                        <Ticker speed={7} offset='100%' direction='toRight' move={isVisible}>
                          {() => (
                            <div className='flex'>
                              {data_v2?.wycdBlock2Row1NftsCollection?.items.map((image, index) =>
                                <div key={index} className='block w-16 minxl:w-28 minxxl:w-36 mx-[10px]'>
                                  <img src={image.url} className='rounded-full w-full' alt="" />
                                </div>
                              )}
                            </div>
                          )}
                        </Ticker>
                      </div>

                      <div data-aos="fade-left" data-aos-delay="250" className="image-ticker h-16 minxl:h-28 minxxl:h-36">
                        <Ticker speed={7} offset='-100%' move={isVisible}>
                          {() => (
                            <div className='flex'>
                              {data_v2?.wycdBlock2Row2NftsCollection?.items.map((image, index) =>
                                <div key={index} className='block w-16 minxl:w-28 minxxl:w-36 mx-[10px]'>
                                  <img src={image.url} className='rounded-full w-full' alt="" />
                                </div>
                              )}
                            </div>
                          )}
                        </Ticker>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Block: Discover */}
          <div id='anim-discover-trigger' className="px-5 pt-8 minlg:mt-[-200px] minlg:pt-16 minxxl:pt-24 minmd:px-14 minxxl:px-20">
            <div className='grid minmd:grid-cols-2 items-center mb-16 minmd:mb-[5.5rem]'>
              <div className='minmd:ml-7 minxl:pr-[24%]'>
                <h2 data-aos="fade-up" data-aos-delay="100" className={tw(
                  'text-[3rem] minmd:text-[3.75rem] minxl:text-[5.125rem] minxxl:text-[7.5rem] leading-[1.0854] font-normal',
                  'mb-6 minxxl:mb-9'
                )}>
                  <span id='anim-discover-ttl-line-1' data-aos="fade-up" data-aos-delay="200"
                    className={tw(
                      'minlg:translate-y-40 transform-gpu',
                      'block bg-clip-text text-transparent bg-gradient-to-r from-[#FCC315] to-[#FF9C38]'
                    )}>
                    Discover <br />
                    <img className={tw(
                      'inline-block w-[3.125rem] minxxl:w-[5.5rem]',
                      'mx-[1.8rem] -mt-[.75rem] -mb-[.4rem]',
                      'rotate-[40deg] rounded-xl'
                    )} src={data_v2?.discoverTitleNfTs.url} alt="" />a
                  </span>
                  <span id='anim-discover-ttl-line-2' className='block minlg:translate-y-40 transform-gpu'>New World</span>
                </h2>
                <p id='anim-discover-txt' data-aos="fade-up" data-aos-delay="300" className={tw(
                  'minlg:translate-y-40 transform-gpu',
                  'text-[1rem] minlg:text-[1.375rem] minxxl:text-[2rem] leading-[1.455]'
                )}>{data_v2?.discoverDescription}</p>
              </div>

              <div id='anim-discover-img' data-aos="fade-up" data-aos-delay="400" className={tw(
                'minlg:translate-y-1/2 transform-gpu',
                'minmd:-order-1 -mx-5'
              )}>
                <video className='w-full' autoPlay loop muted playsInline src="video-discover.mp4"></video>
                {/* <img className='w-full' src={data_v2?.discoverImage?.url} alt=''/> */}
              </div>
            </div>
          </div>

          {/* Block: How it works */}
          <div id='anim-hiw-trigger' className={tw(
            'px-3 minlg:px-14 minxxl:px-20 minxxl:mb-8',
          )}>
            <div id='anim-hiw-content' className={tw(
              'minlg:translate-y-1/2 transform-gpu',
              'flow-root relative z-0 bg-primary-yellow rounded-3xl',
              'mt-5 mb-[7.5rem] px-3 minlg:p-6 pt-[3.15rem]'
            )}>
              <svg role='presentation' className='absolute -z-10 top-0 right-0 translate-x-[2rem] -translate-y-[40%] max-w-full' aria-hidden="true" width="507" height="234" viewBox="0 0 506.52539 233.98633" xmlns="http://www.w3.org/2000/svg">
                <path className='anim-corner anim-corner-4' fill='white' d="M 154.64664,1.03125 H 66.916171 L 0.11929558,174.58985 c -0.44460856,1.15499 0.4086356,2.39648 1.64648442,2.39648 h 83.115235 c 0.726899,0 1.378678,-0.44605 1.642578,-1.12305 z" />
                <path className='anim-corner anim-corner-5' fill='white' d="m 240.83804,0 h -87.46093 l -45.25586,117.58985 c -0.445,1.15499 0.40753,2.39648 1.64453,2.39648 h 83.11523 c 0.727,0 1.37858,-0.44605 1.64258,-1.12305 z" />
                <path className='anim-corner anim-corner-4' fill='white' d="m 326.97672,0.38867 -87.91797,0.0957 -78.9375,205.10547 c -0.445,1.15499 0.40753,2.39648 1.64453,2.39648 h 83.11523 c 0.727,0 1.37858,-0.44605 1.64258,-1.12305 z" />
                <path className='anim-corner anim-corner-5' fill='white' d="m 411.80094,0.33594 -87.64649,-0.12305 -64.0332,166.37696 c -0.445,1.15499 0.40753,2.39648 1.64453,2.39648 h 83.11523 c 0.727,0 1.37858,-0.44605 1.64258,-1.12305 z" />
                <path className='anim-corner anim-corner-6' fill='white' d="m 495.19351,0.16797 -87.94336,-0.16406 -89.1289,231.58594 c -0.445,1.15499 0.40753,2.39648 1.64453,2.39648 h 83.11523 c 0.727,0 1.37858,-0.44605 1.64258,-1.12305 z" />
                <path className='anim-corner anim-corner-4' fill='white' d="M 506.52539,1.0859375 492.07422,1.0332031 419.12109,190.58984 c -0.445,1.15499 0.40754,2.39649 1.64453,2.39649 h 83.11524 c 0.727,0 1.37858,-0.44605 1.64258,-1.12305 l 0.0781,-0.20117 z" />
              </svg>

              <div className='relative px-4 minlg:px-0'>
                <h2 data-aos="fade-up" data-aos-delay="100" className='text-[3rem] minmd:text-[3.75rem] minxl:text-[5.125rem] minxxl:text-[7.5rem] leading-[1.0854] font-normal mb-[1rem]'>{data_v2?.hiwTitle}</h2>
                <p data-aos="fade-up" data-aos-delay="200" className='text-base minlg:text-[1.625rem] minxxl:text-4xl mb-8'>{data_v2?.hiwSubtitle}</p>
              </div>

              <div className='grid minlg:grid-cols-3 minmd:grid-cols-3 minmd:gap-4 minxxl:gap-7 mb-[-7.5rem]'>
                <div className={tw(
                  'minlg:translate-y-full minlg:opacity-0 transform-gpu',
                  'anim-hiw-item bg-black rounded-2xl p-4 minxxl:p-7 pb-12 minxxl:pb-20 md:mb-5 text-white'
                )}>
                  <img data-aos="zoom-in" data-aos-delay="100" className='w-full bg-white rounded-2xl mb-6' src={data_v2?.hiwBlock1Image?.url} alt="" />
                  <h3 data-aos="fade-up" data-aos-delay="200" className='text-2xl minlg:text-[2.5rem] minxxl:text-6xl font-medium leading-tight mb-4'>{data_v2?.hiwBlock1Title}</h3>
                  <p data-aos="fade-up" data-aos-delay="300" className='text-base minlg:text-xl minxxl:text-3xl'>{data_v2?.hiwBlock1Description}</p>
                </div>

                <div className={tw(
                  'minlg:translate-y-full minlg:opacity-0 transform-gpu',
                  'anim-hiw-item bg-black rounded-2xl p-4 minxxl:p-7 pb-12 minxxl:pb-20 md:mb-5 text-white'
                )}>
                  <img data-aos="zoom-in" data-aos-delay="100" className='w-full bg-white rounded-2xl mb-6' src={data_v2?.hiwBlock2Image?.url} alt="" />
                  <h3 data-aos="fade-up" data-aos-delay="200" className='text-2xl minlg:text-[2.5rem] minxxl:text-6xl font-medium leading-tight mb-4'>{data_v2?.hiwBlock2Title}</h3>
                  <p data-aos="fade-up" data-aos-delay="300" className='text-base minlg:text-xl minxxl:text-3xl'>{data_v2?.hiwBlock2Description}</p>
                </div>

                <div className={tw(
                  'minlg:translate-y-full minlg:opacity-0 transform-gpu',
                  'anim-hiw-item bg-black rounded-2xl p-4 minxxl:p-7 pb-12 minxxl:pb-20 md:mb-5 text-white'
                )}>
                  <img data-aos="zoom-in" data-aos-delay="100" className='w-full bg-white rounded-2xl mb-6' src={data_v2?.hiwBlock3Image?.url} alt="" />
                  <h3 data-aos="fade-up" data-aos-delay="200" className='text-2xl minlg:text-[2.5rem] minxxl:text-6xl font-medium leading-tight mb-4'>{data_v2?.hiwBlock3Title}</h3>
                  <p data-aos="fade-up" data-aos-delay="300" className='text-base minlg:text-xl minxxl:text-3xl'>{data_v2?.hiwBlock3Description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Block: Leaderboard */}
          <div id='anim-leaderboard-trigger' className={tw(
            'px-3 minmd:px-14 minxxl:px-20 pt-[10rem] minlg:pt-[11.725rem] minxxl:pt-64',
            'minhd:mb-28 overflow-hidden relative'
          )}>
            <div id="anim-leaderboard-decor" className='absolute -z-10 top-0 left-0 right-0 translate-y-1/2 transform-gpu'>
              <svg role='presentation' className={tw(
                'relative left-1/2 -translate-x-1/2 -translate-y-[2.2rem]',
                'ml-[-12%] w-[160%]'
              )} viewBox="0 0 2102 940" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M2101.5 109H1411.75L1092.92 937.603C1092.48 938.758 1093.33 940 1094.57 940H1776.57C1777.29 940 1777.94 939.554 1778.21 938.876L2101.5 109Z" fill="#F9D54C" /> <path d="M1813.92 0H1672.51C1671.78 0 1671.12 0.454143 1670.86 1.14044L1622.9 128.113C1622.47 129.267 1623.32 130.5 1624.55 130.5H1762.09C1762.8 130.5 1763.45 130.066 1763.72 129.403L1815.55 2.43016C1816.02 1.27007 1815.17 0 1813.92 0Z" fill="white" /> <path d="M992.298 109H320.963C320.233 109 319.579 109.449 319.317 110.13L0.922309 937.603C0.477803 938.758 1.33052 940 2.56831 940H684.565C685.292 940 685.944 939.554 686.208 938.876L1003.26 125.029C1006.26 117.319 1000.57 109 992.298 109Z" fill="#F9D54C" /> <path d="M668.42 110H582.875C582.146 110 581.492 110.449 581.23 111.13L385.923 618.603C385.478 619.758 386.331 621 387.568 621H470.683C471.41 621 472.063 620.554 472.327 619.877L670.063 112.404C670.514 111.248 669.661 110 668.42 110Z" fill="url(#paint0_linear_217_4)" /> <path d="M1655.5 109H965.752L646.922 937.603C646.478 938.758 647.331 940 648.568 940H1330.57C1331.29 940 1331.94 939.554 1332.21 938.876L1655.5 109Z" fill="url(#paint1_linear_217_4)" /> <path d="M1861.42 113H1775.88C1775.15 113 1774.49 113.449 1774.23 114.13L1578.92 621.603C1578.48 622.758 1579.33 624 1580.57 624H1663.68C1664.41 624 1665.06 623.554 1665.33 622.877L1863.06 115.404C1863.51 114.248 1862.66 113 1861.42 113Z" fill="url(#paint2_linear_217_4)" /> <path d="M1938.92 44H1797.51C1796.78 44 1796.12 44.4541 1795.86 45.1404L1747.9 172.113C1747.47 173.267 1748.32 174.5 1749.55 174.5H1887.09C1887.8 174.5 1888.45 174.066 1888.72 173.403L1940.55 46.4302C1941.02 45.2701 1940.17 44 1938.92 44Z" fill="white" /> <path d="M1285.92 34H1144.51C1143.78 34 1143.12 34.4541 1142.86 35.1404L1094.9 162.113C1094.47 163.267 1095.32 164.5 1096.55 164.5H1234.09C1234.8 164.5 1235.45 164.066 1235.72 163.403L1287.55 36.4302C1288.02 35.2701 1287.17 34 1285.92 34Z" fill="white" /> <path d="M698.916 56H557.512C556.779 56 556.122 56.4541 555.862 57.1404L507.902 184.113C507.466 185.267 508.318 186.5 509.551 186.5H647.086C647.802 186.5 648.448 186.066 648.719 185.403L700.549 58.4302C701.023 57.2701 700.169 56 698.916 56Z" fill="white" /> <path d="M845.916 25H704.512C703.779 25 703.122 25.4541 702.862 26.1404L654.902 153.113C654.466 154.267 655.318 155.5 656.551 155.5H794.086C794.802 155.5 795.448 155.066 795.719 154.403L847.549 27.4302C848.023 26.2701 847.169 25 845.916 25Z" fill="white" /> <defs> <linearGradient id="paint0_linear_217_4" x1="605.131" y1="110" x2="435.468" y2="210.923" gradientUnits="userSpaceOnUse"> <stop stopColor="#FDC416" /> <stop offset="0.583333" stopColor="#FFA233" /> </linearGradient> <linearGradient id="paint1_linear_217_4" x1="1423" y1="109" x2="1119" y2="501.5" gradientUnits="userSpaceOnUse"> <stop stopColor="#FDC416" /> <stop offset="0.583333" stopColor="#FFA233" /> </linearGradient> <linearGradient id="paint2_linear_217_4" x1="1798.13" y1="113" x2="1690.25" y2="188.205" gradientUnits="userSpaceOnUse"> <stop stopColor="#FDC416" /> <stop offset="0.583333" stopColor="#FFA233" /> </linearGradient> </defs> </svg>
            </div>

            <div id='anim-leaderboard-content' className={tw(
              'minlg:translate-y-1/4 transform-gpu',
              'bg-white shadow-2xl rounded-3xl mb-[5rem] minlg:mb-[6.75rem] px-4 minmd:px-10 pt-12 ...'
            )}>
              <div className="minmd:flex justify-between items-center mb-4 minmd:mb-0">
                <h2 data-aos="fade-up" data-aos-delay="100" className={tw(
                  'text-[3rem] minmd:text-[3.75rem] minxl:text-[5.125rem] minxxl:text-[7.5rem]',
                  'minxl:leading-[.842] font-normal max-w-2xl justify-center minmd:mb-16 ...'
                )}>
                  {data?.leaderboardTitle}
                </h2>
                <span data-aos="fade-up" data-aos-delay="150" className='text-[1.25rem] minmd:text-[1.625rem] minxxl:text-[2.25rem] minmd:ml-4 text-[#B2B2B2]'><span className='text-[#FBC214]'>Top 10</span> collectors</span>
              </div>

              <div data-aos="fade-up" data-aos-delay="300" className='min-h-[52.625rem]'>
                <StaticLeaderboard data={leaderboardData} />
              </div>
            </div>
          </div>

          {/* Block: News */}
          <div id='anim-news-trigger' className="px-3 minmd:px-14 minxxl:px-20">
            <div className='minmd:px-0 overflow-hidden'>
              <div className={tw(
                'relative z-0 px-9 py-[2.5rem] minlg:py-[3.2rem] mb-20 minlg:mb-32',
                'bg-black rounded-3xl'
              )}>
                <svg role='presentation' className={tw(
                  'absolute -z-10 top-0 right-0 max-w-[250px] minlg:max-w-none',
                  'translate-x-[20px] -translate-y-[67px]'
                )} aria-hidden="true" width='402' height='225' viewBox="0 0 402 225" xmlns="http://www.w3.org/2000/svg">
                  <path className='anim-corner anim-corner-news' fill='white' d="m 196.51769,0.23242 c -2.09052,0.0166 -1.6e-4,0.0288 -11.04687,0.043 -9.77623,0.0125 -24.441,0.0191 -46.4375,0.01 C 118.4882,0.27642 89.900015,0.24902 54.570425,0.20532 L 0.1192529,141.7168 c -0.44450556,1.15499 0.4086956,2.39648 1.6464844,2.39648 H 139.26183 c 0.727,0 1.37858,-0.44505 1.64258,-1.12305 z" />
                  <path className='anim-corner anim-corner-news-2' fill='white' d="M 337.16418,0 H 194.81652 l -85.69726,222.7168 c -0.444,1.15499 0.40948,2.39648 1.64648,2.39648 h 137.49609 c 0.727,0 1.37858,-0.44505 1.64258,-1.12305 z" />
                  <path className='anim-corner anim-corner-news' fill='white' d="M 402.02941,0.16797 335.80676,0.00781 265.11926,183.7168 c -0.444,1.15498 0.40948,2.39648 1.64648,2.39648 h 134.2793 c 0.0353,-3.56905 0.0578,-4.54761 0.10351,-10.49023 0.10001,-13.00163 0.22498,-32.40575 0.375,-61.35938 0.14425,-27.83896 0.31539,-65.79648 0.50586,-114.0957 z" />
                </svg>

                <div className='relative'>
                  <h2 data-aos="fade-up" className='text-[3rem] minmd:text-[3.75rem] minxl:text-[5.125rem] minxxl:text-[7.5rem] leading-[1.0854] font-normal mb-5 text-white'>{data_v2.newsTitle}</h2>
                  <p data-aos="fade-up" data-aos-delay="100" className='text-base minlg:text-2xl minxxl:text-4xl text-[#8B8B8B] mb-[2.6rem]'>{data_v2.newsSubtitle}</p>
                </div>

                <div className='-mx-9 overflow-hidden mb-12'>
                  <div id='anim-news-content' className='translate-x-[150%] transform-gpu'>
                    <Ticker speed={7} move={isVisible}>
                      {() => (
                        <div className='flex'>
                          {data_v2?.newsSlidesCollection?.items.map((preview) =>
                            <a key={preview.slug} href={`articles/${preview.slug}`} className={tw(
                              'bg-white flex flex-col flex-shrink-0 rounded-lg md:mb-5 text-black',
                              'mx-[10px] minlg:mx-4 minxxl:mx-5 cursor-pointer',
                              'w-48 minlg:w-80 minxxl:w-[28rem] basis-48 minlg:basis-80 minxxl:basis-[28rem]'
                            )}>
                              <div className='before:pb-[54.129%] before:block relative overflow-hidden'>
                                <img className='absolute top-0 w-full rounded-t-lg' src={preview.heroImage?.url} alt="" />
                              </div>

                              <div className='py-5 px-4 minxxl:py-8 minxxl:px-7  flex-grow flex flex-col items-start'>
                                <h3 className={tw(
                                  'text-[1.125rem] minlg:text-[2rem] minxxl:text-[2.75rem] leading-[1.09375] ',
                                  'mb-11 minxxl:mb-16'
                                )}>{preview.title}</h3>
                                <div className='flex items-center mt-auto text-xs minlg:text-xl minxxl:text-3xl font-medium text-[#605A45]/60'>
                                  <img className={tw(
                                    'rounded-full mr-[6px] minlg:mr-3 block object-cover',
                                    'h-5 minlg:h-9 minxxl:h-12 w-5 minlg:w-9 minxxl:w-12'
                                  )} src={preview.author?.image?.url} alt="" />
                                  {preview.author?.name}
                                </div>
                              </div>
                            </a>)}
                        </div>
                      )}
                    </Ticker>
                  </div>
                </div>

                <div data-aos="zoom-in" data-aos-delay="100" className='text-center'>
                  <a href={data_v2?.newsCta?.link} className={tw(
                    'bg-[#F9D54C] hover:bg-[#dcaf07] drop-shadow-lg rounded-full transition-colors',
                    'inline-flex items-center justify-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
                    'text-xl minxxl:text-3xl text-black font-medium uppercase'
                  )}>{data_v2?.newsCta?.title.toUpperCase()}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Block: Ticker */}
          <div id='anim-ticker-trigger' className='overflow-x-hidden mb-[4.625rem] minlg:pb-[40rem] minlg:mb-[-34.3rem]'>
            <div id='anim-ticker-first' className={tw(
              'text-4xl minlg:text-7xl minxxl:text-9xl mb-2 -ml-7',
              'minlg:translate-y-96 transform-gpu'
            )}>
              <Ticker speed={7} offset='100%' direction='toRight' move={isVisible}>
                {() => (
                  <div className='flex flex-row'>
                    {data_v2?.tags?.tags1.map(tag =>
                      <div key={tag} className={tw(
                        'px-3 minlg:px-10 minxxl:px-14 flex items-baseline group'
                      )}
                      ><div role='presentation' className={tw(
                          'mr-1 minlg:mr-2 minxxl:mr-3 skew-x-[-20deg]',
                          'group-hover:bg-gradient-to-b from-[#FECB02] to-[#FF9E39]',
                          'h-[.556em] w-[.0833em] basis-[.0833em] bg-[#B2B2B2] rounded-[3px]'
                        )}></div>

                        <i className={tw(
                          'animate-text-gadient bg-[length:200%_200%]',
                          'pb-4 pr-1 bg-clip-text text-[#B2B2B2] bg-gradient-to-r from-[#FF9E39] to-[#FECB02]',
                          'transition-colors group-hover:text-transparent'
                        )}>{tag}</i>
                      </div>)}
                  </div>
                )}
              </Ticker>
            </div>

            <div id='anim-ticker-second' className={tw(
              'text-4xl minlg:text-7xl minxxl:text-9xl mb-2',
              'minlg:translate-y-96 transform-gpu'
            )}>
              <Ticker speed={7} offset='-100%' move={isVisible}>
                {() => (
                  <div className='flex flex-row'>
                    {data_v2?.tags?.tags2.map(tag =>
                      <div key={tag} className={tw(
                        'px-3 minlg:px-10 minxxl:px-14 flex items-baseline group'
                      )}
                      ><div role='presentation' className={tw(
                          'mr-1 minlg:mr-2 minxxl:mr-3 skew-x-[-20deg]',
                          'group-hover:bg-gradient-to-b from-[#FECB02] to-[#FF9E39]',
                          'h-[.556em] w-[.0833em] basis-[.0833em] bg-[#B2B2B2] rounded-[3px]'
                        )}></div>

                        <i className={tw(
                          'animate-text-gadient bg-[length:200%_200%] whitespace-nowrap',
                          'pb-4 pr-1 bg-clip-text text-[#B2B2B2] bg-gradient-to-r from-[#FF9E39] to-[#FECB02]',
                          'transition-colors group-hover:text-transparent'
                        )}>{tag}</i>
                      </div>)}
                  </div>
                )}
              </Ticker>
            </div>
          </div>

          {/* Block: Profile */}
          <div id='anim-build-profile-trigger' className={tw(
            'bg-[#F9D54C] overflow-hidden minlg:translate-y-[20rem]',
            'minlg:-mb-96 minlg:pb-96'
          )}>
            <div className='px-3 minmd:px-14 minxxl:px-20'>
              <div className={tw(
                'relative z-0',
                'pt-[5.625rem] minlg:pt-28 minxxl:pt-32 pb-16 minxxl:pb-20 mb-[4.75rem] minlg:mb-24'
              )}>
                <svg role='presentation' className={tw(
                  'absolute -z-10',
                  '-top-10rem -right-6 w-[18.5625rem] h-[10.625rem]',
                  'minlg:-top-1 minlg:-right-12 minlg:w-[37.125rem] minlg:h-[21.25rem]',
                  'minxxl:-top-4 minxxl:w-[52rem] minxxl:h-[29.75rem]'
                )} viewBox="0 0 594 340" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path className='anim-corner anim-corner-profile-1' fill='white' d="M 155.03896,0.46679 34.318265,0.23242 0.11904389,89.21679 c -0.444,1.156 0.408985,2.39844 1.64648401,2.39844 H 118.36513 c 0.728,0 1.38053,-0.448 1.64453,-1.125 z" />
                  <path className='anim-corner anim-corner-profile-2' fill='white' d="M 235.35927,0.2832 C 199.44407,0.2047 174.93655,0.16139 114.51552,0.00195 L 68.966705,118.51757 c -0.444,1.156 0.40753,2.39649 1.64453,2.39649 H 187.21279 c 0.728,0 1.38053,-0.448 1.64453,-1.125 z" />
                  <path className='anim-corner anim-corner-profile-3' fill='white' d="M 351.91591,0 H 230.5292 l -80.41016,209.21679 c -0.444,1.155 0.40848,2.39844 1.64648,2.39844 h 116.60157 c 0.72699,0 1.37857,-0.447 1.64257,-1.125 z" />
                  <path className='anim-corner anim-corner-profile-4' fill='white' d="M 594.4413,0.625 472.60537,0.21093 342.9667,337.51562 c -0.444,1.16 0.40753,2.4004 1.64453,2.4004 h 116.60156 c 0.728,0 1.38053,-0.4509 1.64453,-1.1309 z" />
                </svg>

                <div className={tw(
                  'minlg:flex justify-between items-end pr-[3%]',
                  'text-[calc(54px+112*(100vw-375px)/1545)]'
                )}>
                  <h2 data-aos="fade-up" data-aos-delay="100" className={tw(
                    'text-[1em]',
                    'text-black font-normal leading-[1.1] relative',
                    'mb-14 minlg:mb-0 minlg:pl-8 minxxl:pl-16 tracking-[-3px]'
                  )}>
                    <span id='anim-build-profile-ttl-1' className='minlg:translate-y-[18rem] transform-gpu'>
                    Build<img className={tw(
                        'drop-shadow-md inline-block w-[3.125rem] minlg:w-[4.375rem] minxxl:w-[5.5rem]',
                        '-mt-7 mr-9 ml-12',
                        'rotate-[40deg] rounded-xl',
                      )} src={data_v2?.bynpTitleNfTsCollection.items[0].url} alt="" />
                    your</span>
                    <span id='anim-build-profile-ttl-2' data-aos="fade-up" data-aos-delay="200" className={tw(
                      'block -mr-10 minlg:pl-24 minlg:-mr-24 ',
                      'minlg:translate-y-[18rem] transform-gpu'
                    )}>
                      NFT<img className={tw(
                        'drop-shadow-md inline-block w-[3.125rem] minlg:w-[4.375rem] minxxl:w-[5.5rem]',
                        '-mt-7 mr-9 ml-12',
                        'rotate-[40deg] rounded-xl',
                      )} src={data_v2?.bynpTitleNfTsCollection.items[1].url} alt="" />
                      profile
                    </span>
                  </h2>

                  <div className="text-center minlg:text-right pb-8 leading-[0]">
                    <svg role='presentation' className={tw(
                      'hidden minlg:block mb-[.1em] w-[3.246em] minxxl:h-[.754em]',
                      '-translate-x-[16%] minxxl:-translate-x-[20%]'
                    )} viewBox="0 0 397 93" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M1.04904e-05 0.61084L341.924 0.610877C352.896 0.610883 361.792 9.47563 361.792 20.4109V59.0953L384.119 36.7397L396.636 49.1557L352.961 92.8851L309.287 49.1557L321.804 36.7397L344.131 59.0953V20.4109C344.131 19.1958 343.143 18.2109 341.924 18.2109L0 18.2108L1.04904e-05 0.61084Z" fill="black" />
                    </svg>

                    <div data-aos="fade-down" data-aos-delay="200">
                      <svg role='presentation' className='minlg:hidden block mb-[1.875rem] mx-auto' width="33" height="96" viewBox="0 0 33 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M19.8361 0C19.8361 0 19.8361 62.9869 19.8361 67.315V82.6261L28.2712 73.7779L33 78.6921L16.5 96L0 78.6921L4.72878 73.7779L13.164 82.6261V67.315V0H19.8361Z" fill="black" />
                      </svg>
                    </div>

                    <a data-aos="zoom-out" data-aos-delay="300" href={data_v2?.bynpCta?.link} className={tw(
                      'bg-[#121212] hover:bg-[#414141] transition-colors drop-shadow-lg rounded-full',
                      'inline-flex items-center justify-center text-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
                      'text-xl minxxl:text-3xl text-white font-medium uppercase'
                    )}>{data_v2?.bynpCta?.title}</a>
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
    <DefaultLayout hideSearch>
      {page}
    </DefaultLayout>
  );
};

export async function getServerSideProps({ preview = false }) {
  const homeData = await getCollection(preview, 1, 'homePageCollection', HOME_PAGE_FIELDS);
  const homeDataV2 = getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V3_ENABLED) && await getCollection(false, 10, 'homepageV2Collection', HOME_PAGE_FIELDS_V2);
  return {
    props: {
      preview,
      data: homeData[0] ?? null,
      data_v2: homeDataV2[0] ?? null,
    }
  };
}

export default Index;
