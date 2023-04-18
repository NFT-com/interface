import 'aos/dist/aos.css';
import 'swiper/css';
import 'swiper/css/scrollbar';

import DefaultSEO from 'config/next-seo.config';
import { NonAuthLikeModal } from 'components/elements/nonAuthLikeModal';
import { BlogSection } from 'components/modules/HomePage/BlogSection';
import { BuildProfile } from 'components/modules/HomePage/BuildProfile';
import { DiscoverCollections } from 'components/modules/HomePage/DiscoverCollections';
import { DynamicLinks } from 'components/modules/HomePage/DynamicLinks';
import { HeroSection } from 'components/modules/HomePage/HeroSection';
import { SocialSection } from 'components/modules/HomePage/SocialSection';
import { WhatWeCanDo } from 'components/modules/HomePage/WhatWeCanDo';
import HomePageV2Layout from 'components/modules/HomePageV2/HomePageV2';
import contentfulBackupData from 'constants/contentful_backup_data.json';
import { HomePageV2, HomePageV3 } from 'types/HomePage';
import { Doppler, getEnvBool } from 'utils/env';

import { NextPageWithLayout } from './_app';

import AOS from 'aos';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { getCollection } from 'lib/contentful/api';
import { HOME_PAGE_FIELDS_V2, HOME_PAGE_FIELDS_V3 } from 'lib/contentful/schemas';
import dynamic from 'next/dynamic';
import { NextSeo } from 'next-seo';
import React, { useEffect } from 'react';
import { usePageVisibility } from 'react-page-visibility';

const HomeLayout = dynamic(import('components/layouts/HomeLayout'));
const DynamicPreviewBanner = dynamic(import('components/elements/PreviewBanner'));

gsap.registerPlugin(ScrollTrigger);

type HomePageProps = {
  preview: boolean;
  data_v2?: HomePageV2;
  homePageDataV3?: HomePageV3;
};

const Index: NextPageWithLayout = ({ preview, data_v2, homePageDataV3 }: HomePageProps) => {
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
        }, 0)
        .to('#anim-profile-ttl-icon', {
          y: 0,
          duration: 2.2,
          ease: 'power2.out',
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
        }, 0)
        .to('#anim-discover-ttl-icon', {
          y: 0,
          duration: 2.2,
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
          trigger: '#anim-leaderboard',
          start: 'top 50%',
          end: '+=30px',
          toggleActions: 'play none reverse none',
        }
      })
        .to('.anim-leaderboard-row', {
          y: 0,
          duration: 1.2,
          ease: 'circ.out',
        }, 0);

      gsap.to('#anim-leaderboard-decor', {
        scrollTrigger: {
          trigger: '#anim-leaderboard-trigger',
          start: 'top top',
          end: '+=400',
          pin: '#anim-leaderboard-trigger'
        }
      });

      // News
      gsap.timeline({
        scrollTrigger: {
          trigger: '#anim-news-trigger',
          start: 'top 80%',
          end: '+=30px',
          toggleActions: 'play none reverse none',
        }
      })
        .to('#anim-news-content', {
          x: 0,
          duration: 2,
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

      // Marquees
      gsap.timeline({
        scrollTrigger: {
          trigger: '#anim-ticker-trigger',
          start: '20% bottom',
          end: '+=30px',
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
    });

    window.requestAnimationFrame(function() {
      const HeroTtlIcons = document.querySelectorAll<HTMLElement>('.anim-profile-icon');
      [...HeroTtlIcons].forEach(item => {
        item.style.transform = 'translateY(0)';
      });
    });
  }, []);
  if (getEnvBool(Doppler.NEXT_PUBLIC_HP_V3_ENABLED)) {
    return (
      <>
        <NextSeo
          {...DefaultSEO}
          title='NFT.com | The Social NFT Marketplace'
          description='Join NFT.com to display, trade, and engage with your NFTs.'
          openGraph={{
            url: 'https://www.nft.com',
            title: 'NFT.com | The Social NFT Marketplace',
            description: 'Join NFT.com to display, trade, and engage with your NFTs.',
            site_name: 'NFT.com',
          }}
        />
        <main id='anim-main-trigger' className='font-noi-grotesk not-italic HomePageContainer'>
          <HeroSection data={{
            dynamicUrls: homePageDataV3?.dynamicUrls,
            heroTextData: homePageDataV3?.heroTextData,
            heroImagesCollection: homePageDataV3?.heroImagesCollection
          }}/>

          <WhatWeCanDo data={{
            whatWeCanDoTitle: {
              gradientTitle: homePageDataV3?.whatWeCanDoTitle?.gradientTitle
            },
            whatWeCanDoImage: {
              url: homePageDataV3?.whatWeCanDoImage?.url
            }
          }}/>

          <DynamicLinks data={{
            sectionDynamicLinks: homePageDataV3.sectionDynamicLinks
          }} isVisible={isVisible}/>

          <DiscoverCollections data={homePageDataV3.collectionsSection}/>

          <SocialSection data={homePageDataV3?.textAndImageCollection}/>

          <BlogSection
            blogSectionTitle={homePageDataV3.blogSectionTitle}
            goToBlogButton={homePageDataV3.goToBlogButton}
            data={homePageDataV3.blogCollection}/>

          <BuildProfile data={homePageDataV3?.buildProfileSection}/>
        </main>

        {preview && <DynamicPreviewBanner />}

        <NonAuthLikeModal />
      </>
    );
  }else {
    return <HomePageV2Layout
      preview={preview}
      data_v2={data_v2}/>;
  }
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
  const homeDataV3 = await getCollection(false, 10, 'homepageV3TestCollection', HOME_PAGE_FIELDS_V3);
  return {
    props: {
      preview,
      data_v2: homeDataV2[0] ?? contentfulBackupData[0],
      homePageDataV3: homeDataV3 && homeDataV3[0],
    }
  };
}

export default Index;
