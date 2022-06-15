import { WalletRainbowKitButton } from 'components/elements/WalletRainbowKitButton';
import { HeroTitle } from 'components/modules/Hero/HeroTitle';

import { isMobile } from 'react-device-detect';

export interface SignedOutViewProps {
  auctionText?: boolean;
  ended?: boolean;
}

export function SignedOutView(props: SignedOutViewProps) {
  return (
    <div className='flex flex-col items-center'>
      {
        props.auctionText === true ?
          <>
            <HeroTitle items={['THE SALE']}/>
            <HeroTitle items={[props.ended === true ? 'HAS ENDED' : 'HAS STARTED']}/>
          </>
          : <>
            <HeroTitle items={['CONNECT YOUR WALLET']}/>
          </>
      }
      <div className="text-base my-5 text-primary-txt-dk">
        Connect with one of our available wallet providers.
      </div>
      <div
        className="rounded-xl items-center p-5 flex flex-col"
        style={{ width: isMobile ? '90%' : '30rem' }}>
        <WalletRainbowKitButton signInButton={true} />
      </div>
    </div>
  );
}