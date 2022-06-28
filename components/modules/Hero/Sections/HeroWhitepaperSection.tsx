import { tw } from 'utils/tw';

import { isMobile } from 'react-device-detect';
import { useThemeColors } from 'styles/theme/useThemeColors';

export default function HeroWhitepaperSection() {
  const { alwaysWhite } = useThemeColors();

  return (
    <div
      id="whitepaperSection"
      className="flex flex-col w-full items-center justify-center py-14"
      style={{ color: alwaysWhite }}
    >
      <video
        autoPlay
        muted
        loop
        preload="none"
        className={tw('w-full mb-12', isMobile ? '' : 'rounded-xl')}
        style={{ width: isMobile ? '100%' : '80%' }}
      >
        <source src={'https://cdn.nft.com/NFTCity-KeySpinLoop.mp4'} type='video/mp4'/>
      </video>
    </div>
  );
}