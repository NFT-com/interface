import { isMobile } from 'react-device-detect';

import { WalletRainbowKitButton } from 'components/elements/WalletRainbowKitButton';
import { HeroTitle } from 'components/modules/Hero/HeroTitle';

export interface SignedOutViewProps {
  auctionText?: boolean;
  ended?: boolean;
}

export function SignedOutView(props: SignedOutViewProps) {
  return (
    <div className='mt-8 flex flex-col items-center px-8'>
      {props.auctionText === true ? (
        <>
          <HeroTitle color={'white'} items={['Unlock the NFT Platform Beta']} />
          <HeroTitle color={'white'} items={['with a Genesis Key']} />
        </>
      ) : (
        <>
          <HeroTitle color={'black'} items={['CONNECT YOUR WALLET']} />
        </>
      )}
      <div className='my-5 max-w-nftcom text-base text-primary-txt-dk'>
        Connect with one of our available wallet providers below to get started. After connecting your wallet, you will
        reach the Genesis Key purchase screen.
      </div>
      <div className='flex flex-col items-center rounded-xl p-5' style={{ width: isMobile ? '90%' : '30rem' }}>
        <WalletRainbowKitButton signInButton={true} />
      </div>
    </div>
  );
}
