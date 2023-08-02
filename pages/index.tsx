import 'aos/dist/aos.css';
import 'swiper/css';
import 'swiper/css/scrollbar';

import DefaultSEO from 'config/next-seo.config';
import LoaderPageFallback from 'components/elements/Loader/LoaderPageFallback';
import { HomePageV2, HomePageV3 } from 'types/HomePage';

import { NextPageWithLayout } from './_app';

import AOS from 'aos';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { getCollection } from 'lib/contentful/api';
import {
  HOME_PAGE_FIELDS_V3
} from 'lib/contentful/schemas';
import dynamic from 'next/dynamic';
import { NextSeo } from 'next-seo';
import React, { useEffect } from 'react';
import { usePageVisibility } from 'react-page-visibility';

const NonAuthLikeModal = dynamic(
  import('components/elements/nonAuthLikeModal')
);
const BlogSection = dynamic(import('components/modules/HomePage/BlogSection'));
const BuildProfile = dynamic(
  import('components/modules/HomePage/BuildProfile')
);
const DiscoverCollections = dynamic(
  import('components/modules/HomePage/DiscoverCollections')
);
const DynamicLinks = dynamic(
  import('components/modules/HomePage/DynamicLinks')
);
const HeroSection = dynamic(import('components/modules/HomePage/HeroSection'));
const SocialSection = dynamic(
  import('components/modules/HomePage/SocialSection')
);
const WhatWeCanDo = dynamic(import('components/modules/HomePage/WhatWeCanDo'));
const HomeLayout = dynamic(import('components/layouts/HomeLayout'), {
  loading: () => <LoaderPageFallback />
});
const DynamicPreviewBanner = dynamic(
  import('components/elements/PreviewBanner')
);

gsap.registerPlugin(ScrollTrigger);

type HomePageProps = {
  preview: boolean;
  data_v2?: HomePageV2;
  homePageDataV3?: HomePageV3;
};

const Index: NextPageWithLayout = ({
  preview,
  homePageDataV3
}: HomePageProps) => {
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
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '#anim-hero-trigger',
            pin: '#anim-hero-trigger',
            start: '5px top',
            end: '+=100px',
            //invalidateOnRefresh: true,
            toggleActions: 'play none reverse none'
          }
        })
        .to(
          '#anim-hero',
          {
            maxWidth: '100vw',
            backgroundColor: '#000',
            duration: 1.25,
            ease: 'power2.out'
          },
          0
        )
        .to(
          '#anim-hero-player',
          {
            y: '-3%',
            rotate: '0deg',
            scale: 1,
            skewX: '0deg',
            skewY: '0deg',
            duration: 1,
            ease: 'power2.out'
          },
          0
        )
        .to(
          '#anim-hero-text',
          {
            y: '-50%',
            duration: 1.25,
            ease: 'power2.out'
          },
          0
        )
        .to(
          '#anim-hero-shadow-dark',
          {
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
          },
          0
        )
        .to(
          '#anim-hero-shadow-light',
          {
            opacity: 0,
            duration: 1.5,
            ease: 'power2.out'
          },
          0
        )
        .to(
          '#anim-hero-caption',
          {
            scale: 1,
            duration: 1,
            ease: 'power2.out'
          },
          0
        );
    });

    window.requestAnimationFrame(function () {
      const HeroTtlIcons =
        document.querySelectorAll<HTMLElement>('.anim-profile-icon');
      [...HeroTtlIcons].forEach(item => {
        item.style.transform = 'translateY(0)';
      });
    });
  }, []);

  return (
    <>
      <NextSeo
        {...DefaultSEO}
        title='NFT.com | The Social NFT Marketplace'
        description='Join NFT.com to display, trade, and engage with your NFTs.'
        openGraph={{
          url: 'https://www.nft.com',
          title: 'NFT.com | The Social NFT Marketplace',
          description:
              'Join NFT.com to display, trade, and engage with your NFTs.',
          site_name: 'NFT.com'
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
          },
          whatWeCanDoBg: {
            url: homePageDataV3?.whatWeCanDoBg?.url
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
};

Index.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export async function getStaticProps({ preview = false }) {
  const homeDataV3 = await getCollection(
    false,
    10,
    'homePageV3ProdCollection',
    HOME_PAGE_FIELDS_V3
  );
  return {
    props: {
      preview,
      homePageDataV3: homeDataV3 && homeDataV3[0]
    }
  };
}

export default Index;
