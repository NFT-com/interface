import useScript from 'hooks/useScript';
import useWindowDimensions from 'hooks/useWindowDimensions';

import Image from 'next/image';
import { isMobile } from 'react-device-detect';

export default function WhitelistPage() {
  useScript('https://widget.gleamjs.io/e.js');
  const { height, width } = useWindowDimensions();

  return (
    <div className='bg-black' style={{ height, width }}>
      {isMobile ?
        <Image
          src='https://cdn.nft.com/NftCityStill.jpg'
          layout='fill'
          className='object-fill absolute'
          alt='NFT City'
        />
        :
        <video
          autoPlay
          muted
          loop
          preload="none"
          className="object-fill absolute"
          style={{ height, width }}
          src="https://cdn.nft.com/NftCityLoop.mp4"
        />
      }
      <div
        className='absolute z-30 overflow-visible'
        style={{ height, width }}
      >
        <a
          className="e-widget no-button generic-loader overflow-visible"
          href="https://gleam.io/6JBbA/nftcom-whitelist"
          rel="nofollow">
          NFT.com Whitelist
        </a>
      </div>
    </div>
  );
}