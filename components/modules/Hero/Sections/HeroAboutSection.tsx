import useWindowDimensions from 'hooks/useWindowDimensions';
import { tw } from 'utils/tw';

import { useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { use100vh } from 'react-div-100vh';

export default function HeroAboutSection() {
  const { width } = useWindowDimensions();
  const height = use100vh();
  const containerRef = useRef(null);
  const bgGifRef = useRef(null);

  const viewportHeight = () => {
    if (width > 1279) {
      return height ;
    } else {
      return 'auto';
    }
  };

  return (
    <div
      id="aboutSection"
      ref={containerRef}
      style={{
        minHeight: viewportHeight(),
      }}
      className={tw(
        'relative flex flex-col mt-24 mb-8 bg-black',
        'text-always-white overflow-hidden',
        'deprecated_minxl:flex-row deprecated_minxl:justify-between deprecated_minxl:items-center deprecated_min2xl:items-center',
      )}
    >
      <div
        className={tw(
          'deprecated_minxl:block hidden',
          'absolute top-0 left-0 w-full h-16 mb-8',
          'bg-gradient-to-b from-black to-transparent z-20',
        )}
      >
        {/* adds overlay transition between bg sections  */}
      </div>
      <div
        style={{
          bottom: Math.max(0, (containerRef?.current?.getBoundingClientRect().bottom ?? 0) - (bgGifRef?.current?.getBoundingClientRect().bottom ?? 0))
        }}
        className={tw(
          'deprecated_minxl:block hidden',
          'absolute left-0 w-full h-52 z-30',
          'bg-gradient-to-t from-black to-transparent z-20',
        )}
      >
        {/* adds overlay transition between bg sections  */}
      </div>
      {!isMobile && <video
        ref={bgGifRef}
        style={{
          marginTop: height / -2
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className={tw(
          'opacity-30',
          'deprecated_minxl:block hidden',
          'absolute z-10 max-w-full w-full aspect-square'
        )}
        src='https://cdn.nft.com/nothing-rarer.mp4'
      />}
      <div className={tw(
        'z-20 mt-12 pr-24 deprecated_minxl:pr-0',
        'deprecated_minxl:justify-start justify-end flex',
        'w-full deprecated_minxl:w-1/4',
        'deprecated_minxl:mr-6 deprecated_minxl:ml-24 deprecated_minxl:mb-12',
        'text-4xl deprecated_minmd:text-5xl deprecated_min2xl:text-6xl',
        'text-hero-pink font-hero-heading1',
      )}>
        <div className='deprecated_minxl:w-full w-4/5'>
          ABOUT <br /> THE <br /> PROJECT
        </div>
      </div>

      <div className={tw(
        'mt-12',
        'w-full deprecated_minxl:w-3/4 deprecated_minxl:ml-16 pr-24',
        'deprecated_minxl:justify-around deprecated_minxl:gap-10',
        'z-20 deprecated_minxl:items-start items-end flex flex-col deprecated_minxl:flex-row'
      )}>
        <div className="mt-5 deprecated_minxl:mt-0 deprecated_minxl:w-full w-4/5">
          <div className={tw(
            'text-lg font-bold text-always-white',
          )}>
            Genesis Keys allow you to mint four NFT.com profiles and gain access to an exclusive community.
          </div>
          <p className="mt-5 text-lg font-medium text-grey-txt">
            Genesis Keys are animated digital NFT keys on the Ethereum blockchain. Each Genesis Key holder will have the ability to mint 4 NFT.com Profiles (NFT.com/yourname) and also be a founding member of the NFT.com community.
          </p>
        </div>

        <div className="mt-16 deprecated_minxl:mt-0 deprecated_minxl:w-full w-4/5">
          <div className={tw(
            'text-lg font-bold text-always-white',
          )}>
            The first 20,000 NFT.com profiles can only be minted by Genesis Key holders.
          </div>
          <p className='mt-5 text-lg font-medium text-grey-txt'>
            NFT.com profiles are personalized NFT galleries which form the foundation for a decentralized web3 social network. Unlike web2, NFT.com Personal Profiles will themselves be web3 NFTs. This means you can create and build a profile such as NFT.com/wagmi or NFT.com/gaming.
          </p>
        </div>
      </div>
    </div>
  );
}