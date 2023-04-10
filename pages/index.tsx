/* eslint-disable @next/next/no-img-element */
import 'aos/dist/aos.css';

import BlurImage from 'components/elements/BlurImage';
import StaticPreviewBanner from 'components/elements/PreviewBanner';
import HomeLayout from 'components/layouts/HomeLayout';
import contentfulBackupData from 'constants/contentful_backup_data.json';
import { HomePageV2 } from 'types';
import { getBaseUrl } from 'utils/helpers';
import { tw } from 'utils/tw';

import { NextPageWithLayout } from './_app';

import { Player } from '@lottiefiles/react-lottie-player';
import AOS from 'aos';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { getCollection } from 'lib/contentful/api';
import { HOME_PAGE_FIELDS_V2 } from 'lib/contentful/schemas';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import testImage from 'public/browser.jpg';
import profileImage from 'public/profile-images.webp';
import { useEffect } from 'react';
import Marquee from 'react-fast-marquee';
import { usePageVisibility } from 'react-page-visibility';

const DynamicPreviewBanner = dynamic<React.ComponentProps<typeof StaticPreviewBanner>>(() => import('components/elements/PreviewBanner'));

gsap.registerPlugin(ScrollTrigger);

type HomePageProps = {
  preview: boolean;
  data_v2?: HomePageV2;
};

const Index: NextPageWithLayout = ({ preview, data_v2 }: HomePageProps) => {
  const isVisible = usePageVisibility();

  useEffect(() => {
    AOS.init({
      disable: function () {
        const maxWidth = 900;
        return window.innerWidth >= maxWidth;
      },
      duration: 700
    });

    ScrollTrigger.saveStyles('#anim-hero-player, #anim-hero-caption');
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

      // Discover
      gsap.timeline({
        scrollTrigger: {
          trigger: '#anim-discover-trigger',
          start: 'top 80%',
          end: '+=30px',
          toggleActions: 'play none reverse none',
        }
      })
        .to('#anim-discover-content', {
          x: 0,
          duration: 2,
          ease: 'power2.out'
        }, 0);
    });

    window.requestAnimationFrame(function() {
      const HeroTtlIcons = document.querySelectorAll<HTMLElement>('.anim-profile-icon');
      [...HeroTtlIcons].forEach(item => {
        item.style.transform = 'translateY(0)';
      });
    });
  }, []);
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
              'pt-[10rem] pb-[3.75rem] minlg:py-[4vh] pl-[5vw] flex flex-col justify-center items-start',
              'minlg:w-[55%] minxl:w-[58.5%] minlg:h-screen'
            )}>
              <h2 data-aos="fade-up" data-aos-delay="100" className={tw(
                'text-[2.5rem] minmd:text-[5.2rem] minlg:text-[3.3rem] minxl:text-[5.2rem] minxxl:text-[6.8rem] leading-[1.5] minmd:leading-[1.15]',
                'text-black font-normal tracking-tight mb-11'
              )}>
                Own your
                <span className='inline-block rotate-[40deg]'>
                  <img
                    className={tw(
                      'anim-profile-icon -translate-y-[120vw] transition transform duration-[2s]',
                      'drop-shadow-md inline-block w-[2.5rem] minmd:w-[3.125rem] minxxl:w-[4.5rem]',
                      'mx-[1.8rem] minxxl:mx-[2.2rem] -my-[.5rem] rounded-xl'
                    )}
                    src={`${getBaseUrl('https://www.nft.com/')}api/imageFetcher?gcp=false&url=${encodeURIComponent(data_v2?.heroNfTsCollection?.items[0]?.url)}`}
                    alt="NFT image"
                  />
                </span>
                <br />
                NFT
                <span className='inline-block rotate-[40deg]'>
                  <img className={tw(
                    'anim-profile-icon -translate-y-[120vw] transition transform duration-[2s] delay-200',
                    'drop-shadow-md inline-block w-[2.5rem] minmd:w-[3.125rem] minxxl:w-[4.5rem]',
                    'mx-[1.8rem] minxxl:mx-[2.2rem] -my-[.5rem] rounded-xl',
                  )}
                  src={`${getBaseUrl('https://www.nft.com/')}api/imageFetcher?gcp=false&url=${encodeURIComponent(data_v2?.heroNfTsCollection?.items[1]?.url)}`}
                  alt="NFT image" />
                </span>
                <span data-aos="fade-left" data-aos-delay="200"
                  className='bg-clip-text text-transparent bg-gradient-to-r from-[#FBC214] to-[#FF9C38]'>
                    identity
                </span>
              </h2>

              <p className='text-xl mb-9'>NFTs enable new forms of community engagement.</p>

              <a data-aos="zoom-out" data-aos-delay="300" href={data_v2?.heroCta?.link} className={tw(
                'bg-[#121212] hover:bg-[#414141] transition-colors drop-shadow-lg rounded-full',
                'inline-flex items-center justify-center text-center h-[4.1875rem] minxxl:h-[6rem] px-6 minxxl:px-9',
                'text-xl minxxl:text-3xl text-white font-medium uppercase'
              )}>{data_v2?.heroCta?.title}</a>
            </div>

            {/* Hero */}
            <div id='anim-hero' data-aos="fade-up" data-aos-delay="200" className={tw(
              'minlg:max-w-[45%] minxl:max-w-[41.5%] w-full minlg:h-[calc(100vh+5px)] bg-[#F9D54C]',
              'relative minlg:absolute z-[10] minlg:right-0 minlg:top-0 overflow-hidden',
              'before:block before:pb-[127%] minmd:before:pb-[80%] minlg:before:pb-[60%] minlg:before:hidden'
            )}>
              <div className='absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2'>
                <div id="anim-hero-player" className={tw(
                  'pointer-events-none',
                  'scale-x-[2.6] scale-y-[1.6]',
                  'minmd:scale-x-[2] minmd:scale-y-[1.3] minlg:scale-x-[1.2] minlg:scale-y-[0.8]',
                  'minxxl:scale-x-100 minxxl:scale-y-[.65] minhd:scale-[1.25]',
                  '-skew-x-[41deg] skew-y-[19deg]'
                )}>
                  <Player
                    autoplay
                    loop
                    src="/anim/cycle.json"
                    style={{ height: '85vw', width: '85vw' }}
                  >
                  </Player>
                </div>
              </div>

              <div className={tw(
                'absolute inset-0 px-4',
                'flex justify-center items-center'
              )}>
                <div id='anim-hero-caption' className={tw(
                  'minlg:scale-[.57] minxxl:scale-[.58] transform-gpu',
                  'bg-[#121212] drop-shadow-lg h-[1.667em] px-[.375em]',
                  'minlg:px-7 minxxl:px-10 relative z-20',
                  'text-[calc(42px+112*(100vw-375px)/1545)]',
                  'leading-none tracking-tight rounded-full'
                )}>
                  {/* Placeholder the broadest word */}
                  <div className='text-transparent flex'>NFT.COM
                    <div role='presentation' className={tw(
                      'mx-2 minlg:mx-4 minxxl:mx-8',
                      'h-[.68em] w-[.1081em] basis-[.1081em]'
                    )}></div>
                    PLANTS
                  </div>

                  <div className={tw(
                    'absolute inset-x-4 minlg:inset-x-7 minxxl:inset-x-10 top-0 bottom-0',
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

        {/* Block: Marquee */}
        <div id='anim-ticker-trigger' className='overflow-x-hidden py-[4.625rem]'>
          <div id='anim-ticker-first' className={tw(
            'text-4xl minlg:text-7xl minxxl:text-9xl -ml-7'
          )}>
            <Marquee gradient={false} speed={60} loop={0} direction='right' play={isVisible} className="flex flex-row">
              {data_v2?.tags?.tags1.map((tag, index) =>
                <div key={tag} className={tw(
                  'px-2 minlg:px-10 minxxl:px-14 flex items-baseline group', index === 0 ? 'mr-2 minlg:mr-10 minxxl:mr-14': ''
                )}
                ><div role='presentation' className={tw(
                    'mr-2 minxxl:mr-3 skew-x-[-20deg]',
                    'group-hover:bg-gradient-to-b from-[#FECB02] to-[#FF9E39]',
                    'h-[2.5rem] w-[.3125rem] basis-[.3125rem] minxl:h-[.556em] minxl:w-[.0833em] minxl:basis-[.0833em]',
                    'bg-[#B2B2B2] rounded-[3px]'
                  )}></div>

                  <i className={tw(
                    'animate-text-gadient bg-[length:200%_200%]',
                    'pb-4 pr-1 bg-clip-text text-[#B2B2B2] bg-gradient-to-r from-[#FF9E39] to-[#FECB02]',
                    'transition-colors group-hover:text-transparent'
                  )}>{tag}</i>
                </div>)}
            </Marquee>
          </div>
        </div>

        {/* Block: Discover Collections */}
        <div id='anim-discover-trigger' className='bg-black'>
          <div className={tw(
            'relative z-0 py-[2.5rem] minlg:pt-[6.25rem] minlg:pb-12',
          )}>
            <div className='relative text-center'>
              <h2 data-aos="fade-up" className={tw(
                'text-[3rem] minmd:text-[3.75rem] minxl:text-[5.125rem] minxxl:text-[7.5rem] leading-[1.0854] font-normal text-white',
                'mb-[6.125rem]'
              )}>Discover Collections</h2>
            </div>

            <div className='overflow-hidden mb-12'>
              <div id='anim-discover-content' data-aos="fade-left" className='minlg:translate-x-full minlg:transform-gpu'>
                <div className="flex">
                  {data_v2?.newsSlidesCollection?.items.map((preview) =>
                    <Link key={preview.slug} href={`articles/${preview.slug}`} className={tw(
                      'bg-white flex flex-col flex-shrink-0 rounded-2xl md:mb-5 text-black',
                      'mx-[7px] cursor-pointer',
                      'w-48 minlg:w-[30.125rem] minxxl:w-[32rem] basis-48 minlg:basis-[30.125rem] minxxl:basis-[32rem] '
                    )}>
                      <div className='before:pb-[40.249%] before:block relative overflow-hidden'>
                        <BlurImage
                          fill
                          className='rounded-t-2xl object-cover'
                          src={`${getBaseUrl('https://www.nft.com/')}api/imageFetcher?gcp=false&url=${encodeURIComponent(preview?.heroImage?.url)}`}
                          alt={preview.title}
                        />
                      </div>

                      <div className='py-5 px-4 minxxl:py-8 minxxl:px-7 flex-grow flex flex-col items-start'>
                        <h3 className={tw(
                          'text-[1.125rem] minlg:text-[2rem] minxxl:text-[2.75rem] leading-[1.09375] font-semibold',
                          'mb-11 minxxl:mb-16'
                        )}>{preview.title}</h3>
                        <div className='flex items-center mt-auto text-xs minlg:text-xl minxxl:text-3xl font-medium text-[#605A45]/60'>
                          <div className={tw(
                            'relative rounded-full mr-[6px] minlg:mr-3 block object-cover',
                            'h-5 minlg:h-9 minxxl:h-12 w-5 minlg:w-9 minxxl:w-12'
                          )}>
                            <Image fill className='object-cover rounded-full' src={preview.author?.image?.url} alt={`Image for author, ${preview.author?.name}`} />
                          </div>
                          {preview.author?.name}
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div data-aos="zoom-in" data-aos-delay="100" className='text-center'>
              <a href={data_v2?.newsCta?.link} className={tw(
                'bg-[#F9D54C] hover:bg-[#dcaf07] drop-shadow-lg rounded-full transition-colors',
                'inline-flex items-center justify-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
                'text-xl minxxl:text-3xl text-black font-medium uppercase'
              )}>View all collections</a>
            </div>
          </div>
        </div>

        {/* Block: Text/Image */}
        <div className="pt-8 minxxl:pt-16 pb-9">
          <div className='grid minmd:grid-cols-2 items-center'>
            <div className='minmd:ml-[13.2vw] minmd:max-w-[25rem]'>
              <h2 data-aos="fade-up" data-aos-delay="100" className={tw(
                'text-[3rem] minmd:text-[3.75rem] minxxl:text-[5rem] leading-[1.0854] font-normal',
                'tracking-tight mb-6 minxxl:mb-9'
              )}>
                <span>Free </span>
                <span data-aos="fade-up" data-aos-delay="200"
                  className={tw(
                    'inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#FCC315] to-[#FF9C38]'
                  )}>
                  trading
                </span>
              </h2>
              <p data-aos="fade-up" data-aos-delay="300" className={tw(
                'mb-9',
                'text-[1rem] minlg:text-[1.375rem] minxxl:text-[2rem] leading-[1.455]'
              )}>Lorem ipsum dolor sit amet consectetur. Nibh dictum dis pellentesque laoreet elementum faucibus scelerisque.</p>
              <a href={''} className={tw(
                'bg-[#F9D54C] hover:bg-[#dcaf07] drop-shadow-lg rounded-full transition-colors',
                'inline-flex items-center justify-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
                'text-xl minxxl:text-3xl text-black font-medium uppercase'
              )}>Create profile</a>
            </div>

            <div data-aos="fade-up" data-aos-delay="400" className={tw(
              ''
            )}>
              <Image src={testImage} alt="Test" />
            </div>
          </div>

          <div className='grid minmd:grid-cols-2 items-center -mt-8 -mb-28'>
            <div className='minmd:ml-[13.2vw] minmd:max-w-[25rem]'>
              <h2 data-aos="fade-up" data-aos-delay="100" className={tw(
                'text-[3rem] minmd:text-[3.75rem] minxxl:text-[5rem] leading-[1.0854] font-normal',
                'tracking-tight mb-6 minxxl:mb-9'
              )}>
                <span>Live </span>
                <span data-aos="fade-up" data-aos-delay="200"
                  className='bg-clip-text text-transparent bg-gradient-to-r from-[#FCC315] to-[#FF9C38]'>
                  social feed
                </span>
              </h2>
              <p data-aos="fade-up" data-aos-delay="300" className={tw(
                'mb-9',
                'text-[1rem] minlg:text-[1.375rem] minxxl:text-[2rem] leading-[1.455]'
              )}>Lorem ipsum dolor sit amet consectetur. Nibh dictum dis pellentesque laoreet elementum faucibus scelerisque.</p>
              <a href={''} className={tw(
                'bg-[#F9D54C] hover:bg-[#dcaf07] drop-shadow-lg rounded-full transition-colors',
                'inline-flex items-center justify-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
                'text-xl minxxl:text-3xl text-black font-medium uppercase'
              )}>Create profile</a>
            </div>

            <div data-aos="fade-up" data-aos-delay="400" className={tw(
              'minmd:-order-1'
            )}>
              <Image src={testImage} alt="Test" />
            </div>
          </div>

          <div className='grid minmd:grid-cols-2 items-center'>
            <div className='minmd:ml-[13.2vw] minmd:max-w-[25rem]'>
              <h2 data-aos="fade-up" data-aos-delay="100" className={tw(
                'text-[3rem] minmd:text-[3.75rem] minxxl:text-[5rem] leading-[1.0854] font-normal',
                'tracking-tight mb-6 minxxl:mb-9'
              )}>
                Talk <span className='bg-clip-text text-transparent bg-gradient-to-r from-[#FCC315] to-[#FF9C38]'>directly</span>
                <span data-aos="fade-up" data-aos-delay="200"
                  className={tw(
                    'inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#FCC315] to-[#FF9C38]'
                  )}>
                  with artists
                </span>
              </h2>
              <p data-aos="fade-up" data-aos-delay="300" className={tw(
                'mb-9',
                'text-[1rem] minlg:text-[1.375rem] minxxl:text-[2rem] leading-[1.455]'
              )}>Lorem ipsum dolor sit amet consectetur. Nibh dictum dis pellentesque laoreet elementum faucibus scelerisque.</p>
              <a href={''} className={tw(
                'bg-[#F9D54C] hover:bg-[#dcaf07] drop-shadow-lg rounded-full transition-colors',
                'inline-flex items-center justify-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
                'text-xl minxxl:text-3xl text-black font-medium uppercase'
              )}>Create profile</a>
            </div>

            <div data-aos="fade-up" data-aos-delay="400" className={tw(
              ''
            )}>
              <Image src={testImage} alt="Test" />
            </div>
          </div>
        </div>

        {/* Block: Insights */}
        <div className='bg-[#282828]'>
          <div className={tw(
            'relative z-0 py-[2.5rem] minlg:pt-[6.25rem] minlg:pb-[7.625rem]',
          )}>
            <div className='relative text-center text-white'>
              <h2 data-aos="fade-up" className='text-[3rem] minmd:text-[3.75rem] minxl:text-[5.125rem] minxxl:text-[7.5rem] leading-[1.0854] font-normal mb-[.625rem]'>Insights</h2>
              <p data-aos="fade-up" data-aos-delay="100" className='text-lg mb-[3.75rem]'>Learn about the latest trends and updates in the world of NFTs.</p>
            </div>

            <div className='overflow-hidden mb-12'>
              <div data-aos="fade-left">
                <div className="flex">
                  {data_v2?.newsSlidesCollection?.items.map((preview) =>
                    <Link key={preview.slug} href={`articles/${preview.slug}`} className={tw(
                      'bg-white flex flex-col flex-shrink-0 rounded-lg md:mb-5 text-black',
                      'mx-[7px] cursor-pointer',
                      'w-48 minlg:w-[23.5rem] minxxl:w-[28rem] basis-48 minlg:basis-[23.5rem] minxxl:basis-[28rem] '
                    )}>
                      <div className='before:pb-[54.129%] before:block relative overflow-hidden aspect-4/3'>
                        <BlurImage
                          fill
                          className='rounded-t-lg object-cover'
                          src={`${getBaseUrl('https://www.nft.com/')}api/imageFetcher?gcp=false&url=${encodeURIComponent(preview?.heroImage?.url)}`}
                          alt={preview.title}
                        />
                      </div>

                      <div className='py-5 px-4 minxxl:py-8 minxxl:px-7 flex-grow flex flex-col items-start'>
                        <h3 className={tw(
                          'text-[1.125rem] minlg:text-[2rem] minxxl:text-[2.75rem] leading-[1.09375] ',
                          'mb-11 minxxl:mb-16'
                        )}>{preview.title}</h3>
                        <div className='flex items-center mt-auto text-xs minlg:text-xl minxxl:text-3xl font-medium text-[#605A45]/60'>
                          <div className={tw(
                            'relative rounded-full mr-[6px] minlg:mr-3 block object-cover',
                            'h-5 minlg:h-9 minxxl:h-12 w-5 minlg:w-9 minxxl:w-12'
                          )}>
                            <Image fill className='object-cover rounded-full' src={preview.author?.image?.url} alt={`Image for author, ${preview.author?.name}`} />
                          </div>
                          {preview.author?.name}
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
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

        {/* Block: Profile */}
        <div className={tw(
          'bg-black relative overflow-hidden z-0',
          'before:absolute before:left-[-3%] before:right-[-3%] before:top-0 before:bottom-2/4 before:bg-[#282828] before:-z-10'
        )}>
          <div className={tw(
            'bg-gradient-to-r from-[#FAC213] to-[#FF9B37] rounded-[1.875rem]',
            'relative z-0 max-w-[94%] mx-auto overflow-hidden'
          )}>
            <div className={tw(
              'minmd:flex'
            )}>
              <div className={tw(
                'minmd:w-[45%] pl-8 minxl:pl-36',
                'py-12 minlg:py-20 minxxl:py-32'
              )}>
                <h2 data-aos="fade-up" data-aos-delay="100" className={tw(
                  'text-[calc(48px+54*(100vw-375px)/1545)] text-center minmd:text-left',
                  'text-black font-normal leading-[1.1] relative',
                  'mb-4 minlg:mb-2 tracking-[-3px]'
                )}>
                  <span className='text-[1em]'>
                    Build your
                  </span>
                  <span
                    data-aos="fade-up"
                    data-aos-delay="200"
                    className={tw(
                      'text-[1em] block'
                    )}>
                    NFT
                    Profile
                  </span>
                </h2>

                <p className={tw(
                  'text-lg leading-[1.333] mb-9'
                )}>Join other 10k NFT profiles!</p>
                <a data-aos="zoom-out" data-aos-delay="300" href={data_v2?.bynpCta?.link} className={tw(
                  'bg-[#121212] hover:bg-[#414141] transition-colors drop-shadow-lg rounded-full',
                  'inline-flex items-center justify-center text-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
                  'text-xl minxxl:text-3xl text-white font-medium uppercase'
                )}>{data_v2?.bynpCta?.title}</a>
              </div>

              <div className='minmd:w-[55%] text-right'>
                <Image className='ml-auto' src={profileImage} alt='' />
              </div>
            </div>
          </div>
        </div>
      </main>
      {preview && <DynamicPreviewBanner />}
    </>
  );
};

Index.getLayout = function getLayout(page) {
  return (
    <HomeLayout >
      {page}
    </HomeLayout>
  );
};

export async function getStaticProps({ preview = false }) {
  const homeDataV2 = await getCollection(false, 10, 'homepageV2Collection', HOME_PAGE_FIELDS_V2);
  return {
    props: {
      preview,
      data_v2: homeDataV2[0] ?? contentfulBackupData[0],
    }
  };
}

export default Index;
