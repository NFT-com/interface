import { Footer } from 'components/elements/Footer';
import HeroSplash from 'components/modules/Hero/HeroSplash';
import HeroAboutSection from 'components/modules/Hero/Sections/HeroAboutSection';
import { HeroCalendarCTA } from 'components/modules/Hero/Sections/HeroCalendarCTA';
import HeroCommunitySection from 'components/modules/Hero/Sections/HeroCommunitySection';
import { HeroCTA } from 'components/modules/Hero/Sections/HeroCTA';
import HeroScheduleSection from 'components/modules/Hero/Sections/HeroScheduleSection';
import HeroTeamSection from 'components/modules/Hero/Sections/HeroTeamSection';
import HeroTweetSection from 'components/modules/Hero/Sections/HeroTweetSection';
import HeroVideoSection from 'components/modules/Hero/Sections/HeroVideoSection';
import { tw } from 'utils/tw';

import Image from 'next/image';
import discordIcon from 'public/discord_gray_icon.svg';
import twitterIcon from 'public/twitter_gray_icon.svg';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface HeroPageProps {
  scrollToAbout?: boolean;
  scrollToSchedule?: boolean;
}

export function HeroPage(props: HeroPageProps) {
  const [headerBlack, setHeaderBlack] = useState(false);
  const scheduleRef = useRef<HTMLDivElement>();
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

  const handleScrollToSchedule = () => {
    contentRef.current.scroll({
      top: scheduleRef.current.offsetTop + 150,
      behavior: 'smooth'
    });};

  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent);
  });

  useEffect(() => {
    if(!scrolled) {
      if(props.scrollToAbout) {
        handleScrollToAbout();
      } else if(props.scrollToSchedule) {
        handleScrollToSchedule();
      }
      setScrolled(true);
    }
  }, [props.scrollToAbout, props.scrollToSchedule, scrolled]);
  
  const getSides = useCallback(() => {
    return (
      <div
        className={tw('z-50 right-0 bottom-0 deprecated_minmd:bottom-[50px] absolute items-center',
          'm-3 deprecated_minmd:m-10 flex flex-col justify-between h-20')}>
        <a href="https://twitter.com/nftcomofficial" target="_blank" rel="noreferrer">
          {/* <Image src={twitterIcon} className="w-8" alt="twitter icon"/> */}
        </a>
        <a href="https://discord.gg/nftdotcom" target="_blank" rel="noreferrer">
          {/* <Image src={discordIcon} className="w-8" alt="discord icon"/> */}
        </a>
      </div>
    );
  }, []);
  
  return (
    <>
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

        <div ref={scheduleRef} className='w-full'>
          <HeroScheduleSection />
        </div>

        <HeroCalendarCTA />

        <HeroTweetSection />

        <HeroTeamSection />

        <HeroCommunitySection />
      
        <Footer />

      </div>
    </>
  );
}
