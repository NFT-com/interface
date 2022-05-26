import { tw } from 'utils/tw';

import { Button, ButtonType } from './HeroButton';

import ReactRotatingText from 'react-rotating-text';

export function DefaultSplash() {
  return <>
    <div className={tw(
      'absolute z-20 top-1/4',
      'text-xl deprecated_minxs:text-2xl deprecated_minxs:2:text-3xl',
      'deprecated_minmd:text-4xl deprecated_minlg:text-5xl deprecated_minxl:text-6xl',
    )}>
      <div
        className={tw(
          'text-center font-normal text-[#00A4FF] font-hero-heading1',
          'max-w-[20rem] deprecated_minxs:max-w-[21rem] deprecated_minsm:max-w-[30rem]',
          'deprecated_minmd:max-w-[36rem] deprecated_minlg:max-w-[30rem]',
          'deprecated_minxl:max-w-[100rem]',
        )}
      >
        <div
          style={{
            textShadow: '0px 4px 4px rgba(0,0,0,0.9)',
          }}
          className={tw(
            'text-lg deprecated_minsm:text-2xl deprecated_minmd:text-3xl deprecated_minlg:text-4xl',
            'text-center text-always-white font-hero-heading2',
            'tracking-wider mb-8',
          )}
        >
            Your nft.com Genesis Key unlocks <br />
        </div>
        <ReactRotatingText
          style={{
            textShadow: '0px 2px 8px rgba(0,0,0,0.9)',
          }}
          color={'#00A4FF'}
          cursor={true}
          typingInterval={100}
          pause={3000}
          emptyPause={2000}
          deletingInterval={60}
          items={[
            'THE NFT.COM ECOSYSTEM',
            'NFT.COM/YOU PROFILES',
            'ACCESS TO AN EXCLUSIVE COMMUNITY',
            'A COMMUNITY-DRIVEN PLATFORM',
            'A WEB3 SOCIAL HUB'
          ]}
        />
      </div>
    </div>
    <div className="flex flex-col h-full justify-end items-center mb-16">
      <div
        style={{
          textShadow: '0px 4px 4px rgba(0,0,0,0.9)',
        }}
        className="font-hero-heading2 tracking-wider text-always-white text-2xl text-center"
      >
          Register for the whitelist now
      </div>
      <div className="mt-3 mb-6 block font-hero-heading1 text-base">
        <Button
          type={ButtonType.PRIMARY}
          label={'JOIN THE WHITELIST'}
          textColor="black"
          onClick={() => {
            window.open(
              'https://whitelist.nft.com',
              '_blank'
            );
          }}/>
      </div>
    </div>
  </>;
}