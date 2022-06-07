import { Doppler, getEnv } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import HeroSocial from './HeroSocial';

import Image from 'next/image';
import DiscordIcon from 'public/discord_gray_icon.svg';
import EmailIcon from 'public/email_icon_white.svg';
import TwitterIcon from 'public/twitter_gray_icon.svg';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { Social } from 'types';

const SOCIALS: Social[] = [
  {
    source: 'email',
    icon: EmailIcon,
    number: isNullOrEmpty(getEnv(Doppler.NEXT_PUBLIC_EMAIL_COUNT)) ?
      '100000' :
      getEnv(Doppler.NEXT_PUBLIC_EMAIL_COUNT),
    subtitle: 'Email Subscribers',
    action: 'SUBSCRIBE NOW',
    destination: 'https://whitelist.nft.com'
  },
  {
    source: 'discord',
    icon: DiscordIcon,
    number: isNullOrEmpty(getEnv(Doppler.NEXT_PUBLIC_DISCORD_COUNT)) ?
      '20000' :
      getEnv(Doppler.NEXT_PUBLIC_DISCORD_COUNT),
    subtitle: 'People on Discord',
    action: 'JOIN NOW',
    destination: 'https://discord.gg/nftdotcom'
  },
  {
    source: 'twitter',
    icon: TwitterIcon,
    number: isNullOrEmpty(getEnv(Doppler.NEXT_PUBLIC_TWITTER_COUNT)) ?
      '5000' :
      getEnv(Doppler.NEXT_PUBLIC_TWITTER_COUNT),
    subtitle: 'Followers on Twitter',
    action: 'JOIN NOW',
    destination: 'https://twitter.com/nftcomofficial'
  }
];

export default function HeroCommunitySection() {
  return (
    <div className="w-screen">
      <div id="communitySection"
        className={tw(
          'relative z-10 mt-24 mb-8 pt-16 px-8 deprecated_minmd:px-12 deprecated_minlg:px-12 mx-auto deprecated_minmd:w-11/12',
          'max-w-full items-center deprecated_minxs:2:mx-16',
          'justify-between text-always-white z-30 pt-10 deprecated_minxs:2:pt-0',
          'bg-gradient-to-b from-[rgba(0,0,0,1)] to-[rgb(0,0,0,0)]'
        )}
      >
        <div className="deprecated_minsm:max-w-[75%]">
          <div
            className={tw(
              'mb-4 text-3xl deprecated_minsm:text-4xl deprecated_minmd:text-5xl deprecated_min2xl:text-6xl',
              'font-normal text-hero-pink font-hero-heading1',
              'text-left')}>
                COMMUNITY
          </div>
          <p
            className={tw(
              'mt-5 text-lg font-medium text-grey-txt max-w-[40rem]'
            )}
          >
            We believe that those who adopt early and contribute value, should reap
            the benefits of their contributions. We invite you to join the NFT.com
            community and come together to create an exciting digital future.
          </p>
        </div>
        <div
          className={tw(
            'flex w-full items-center justify-center z-0 mb-12',
            'flex-col deprecated_minmd:flex-row',
            'deprecated_minsm:mt-24'
          )}
        >
          {
            SOCIALS.map((social) => (
              <HeroSocial {...social} key={social.source}/>
            ))}
        </div>
      </div>

      <div className="relative">
        <div className={tw(
          'w-full h-24 mb-8 absolute top-0 left-0 z-10',
          'bg-gradient-to-b from-[rgba(0,0,0,1)] to-[rgb(0,0,0,0)]'
        )}>
          {/* adds overlay transition between bg sections  */}
        </div>
        <div className="h-[50rem] relative overflow-hidden">
          {isMobile ?
            <Image
              src='https://cdn.nft.com/NftCity2Still.jpg'
              className='block z-0 absolute top-0 left-0 w-full h-full object-cover'
              alt='NFT City'
            />
            :
            <video
              autoPlay
              muted
              loop
              preload="none"
              className="block z-0 absolute top-0 left-0 w-full h-full object-cover"
              src='https://cdn.nft.com/NFTCityLoop.mp4'
            />
          }
        </div>
      </div>

    </div>

  );
}
