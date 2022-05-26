import { GenesisFooter } from 'components/modules/GenesisKeyAuction/GenesisFooter';
import { AccentType, Button, ButtonType } from 'components/modules/Hero/HeroButton';
import { HeroTitle } from 'components/modules/Hero/HeroTitle';

import { AuctionCountdownTile } from './AuctionCountdownTile';
import { AuctionType } from './GenesisKeyAuction';

import Image from 'next/image';
import truststamps from 'public/trust_stamps.png';
import { useState } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';

export function GenesisKeyWaitingView() {
  const { alwaysBlack } = useThemeColors();
  const [countdownOver, setCountdownOver] = useState(false);
  return (
    <div className="flex flex-col items-center pt-20 deprecated_sm:text-center z-50">
      <HeroTitle items={['WE\'RE CALCULATING']} />
      <HeroTitle items={['THE RESULTS']} />
      {!countdownOver && <div className='mt-8 mb-4'>
        <AuctionCountdownTile
          hideLabel
          to={1651273200000} // 4/29/2022, 7:00:00 PM
          nextAuctionName={AuctionType.Public}
          onEnded={() => {
            setCountdownOver(true);
          }}
        />
      </div>}
      <div className='flex flex-col items-center text-xl my-6 space-y-6'>
        <span className="max-w-2xl text-center text-secondary-txt-dk">
        We will make an announcement in our Discord Server once the results are in.{'\n'}
        You can then come back to NFT.com to see if you won a Genesis Key!
        </span>
        <span className="text-secondary-txt-dk">
        It is now safe to close this window.
        </span>
      </div>
      <div className='mb-5 deprecated_sm:mb-16'>
        <Button
          textColor={alwaysBlack}
          accent={AccentType.SCALE}
          label={'JOIN DISCORD'}
          onClick={() => {
            window.open('https://discord.gg/nftdotcom', '_blank');
          }}
          type={ButtonType.PRIMARY}
        />
      </div>
      <div className='flex justify-center w-screen deprecated_sm:px-4'>
        {/* <Image src={truststamps} alt="quant stamp" className='mb-4 mt-8'/> */}
      </div>
      <div className='flex justify-end deprecated_sm:justify-center items-center deprecated_sm:relative bottom-0'>
        <GenesisFooter />
      </div>
    </div>
  );
}