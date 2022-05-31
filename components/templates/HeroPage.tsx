import { Footer } from 'components/elements/Footer';
import { PageWrapper } from 'components/layouts/PageWrapper';
import HeroSplash from 'components/modules/Hero/HeroSplash';
import HeroAboutSection from 'components/modules/Hero/Sections/HeroAboutSection';
import { HeroCalendarCTA } from 'components/modules/Hero/Sections/HeroCalendarCTA';
import HeroCommunitySection from 'components/modules/Hero/Sections/HeroCommunitySection';
import { HeroCTA } from 'components/modules/Hero/Sections/HeroCTA';
import HeroTeamSection from 'components/modules/Hero/Sections/HeroTeamSection';
import HeroTweetSection from 'components/modules/Hero/Sections/HeroTweetSection';
import HeroVideoSection from 'components/modules/Hero/Sections/HeroVideoSection';
import { tw } from 'utils/tw';

import DiscordIcon from 'public/discord_gray_icon.svg';
import TwitterIcon from 'public/twitter_gray_icon.svg';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';

export interface HeroPageProps {
  scrollToAbout?: boolean;
}

export function HeroPage(props: HeroPageProps) {
  const [headerBlack, setHeaderBlack] = useState(false);
  const aboutRef = useRef<HTMLDivElement>();
  const contentRef = useRef<HTMLDivElement>();
  const [scrolled, setScrolled] = useState(false);

  const listenScrollEvent = () => {
    window.scrollY > 10
      ? setHeaderBlack(true)
      : setHeaderBlack(false);
  };

  const handleScrollToAbout = () => {
    contentRef.current.scroll({
      top: aboutRef.current.offsetTop,
      behavior: 'smooth'
    });};

  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent);
  });
  
  useEffect(() => {
    if(!scrolled) {
      if(props.scrollToAbout) {
        handleScrollToAbout();
      }
      setScrolled(true);
    }
  }, [props.scrollToAbout, scrolled]);

  const getSides = useCallback(() => {
    return (
      <div
        className={tw('z-50 right-0 bottom-0 deprecated_minmd:bottom-[50px] absolute items-center',
          'm-3 deprecated_minmd:m-10 flex flex-col justify-between h-20')}>
        <a href="https://twitter.com/nftcomofficial" target="_blank" rel="noreferrer">
          <TwitterIcon className='w-8' />
        </a>
        <a href="https://discord.gg/nftdotcom" target="_blank" rel="noreferrer">
          <DiscordIcon className='w-8' />
        </a>
      </div>
    );
  }, []);
  
  return (
    <PageWrapper
      headerOptions={{
        walletOnly: true,
        removeBackground: true,
        walletPopupMenu: true,
        removeSummaryBanner: true,
        sidebar: 'hero',
        heroHeader: true,
        heroHeaderBlack: headerBlack,
      }}
      removePinkSides={isMobile}
    >
      {getSides()}
      <div
        ref={contentRef}
        className={tw(
          'relative',
          'overflow-x-hidden bg-black w-screen h-screen')}
        onScroll={(event: React.UIEvent<HTMLDivElement>) => {
          const containerHeight = event.currentTarget.clientHeight;
          const scrollTop = event.currentTarget.scrollTop;
          setHeaderBlack(scrollTop >= containerHeight);
        }}
      >
        <HeroSplash onScrollToAbout={() => {
          contentRef.current.scroll({
            top: aboutRef.current.offsetTop,
            behavior: 'smooth'
          });
        }}/>
        
        <div ref={aboutRef} className='w-full'>
          <HeroAboutSection />
        </div>

        <div className='w-full'>
          <HeroVideoSection />
        </div>

        <HeroCTA />

        <HeroCalendarCTA />

        <HeroTweetSection />

        <HeroTeamSection />

        <HeroCommunitySection />
      
        <Footer />
      </div>
    </PageWrapper>
  );
}
