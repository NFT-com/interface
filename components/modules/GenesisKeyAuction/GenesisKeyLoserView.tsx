import { Button, ButtonType } from 'components/elements/Button';
import { HeroTitle } from 'components/modules/Hero/HeroTitle';
import { tw } from 'utils/tw';

import { AuctionType } from './GenesisKeyAuction';

import { useThemeColors } from 'styles/theme/useThemeColors';

export interface GenesisKeyLoserViewProps {
  liveAuction: AuctionType;
}

export function GenesisKeyLoserView(props: GenesisKeyLoserViewProps) {
  const { primaryText } = useThemeColors();

  return (
    <div className="flex flex-col items-center deprecated_sm:text-center pt-20">
      <HeroTitle color="black" items={['SORRY!']} />
      <HeroTitle color="black" items={['YOU WERE OUTBID']} />
      <div className={tw('flex flex-col items-center text-center space-y-12 mt-8',
        'text-black w-2/4',
        'text-base minmd:text-lg minlg:text-xl')}
      >
        <span>
        No funds have been removed from your wallet, and your bid signature has been removed.
        </span>
        <span>
        From all of us at NFT.com, we would like to thank you for{' '}
        participating in the Genesis Key {props.liveAuction} Auction.
        </span>
        
        {props.liveAuction === AuctionType.Blind && <span>
        While you did not win a Genesis Key today, you will still{' '}
        have the opportunity to purchase one in{' '}
        our upcoming Public Sale.
        </span>}
      </div>
      {props.liveAuction === AuctionType.Blind &&
        <div className={tw(
          'flex flex-col items-center my-6 text-black w-2/4 text-center',
          'text-base minmd:text-lg minlg:text-xl')}
        >
          <span className="text-xl my-6 max-w-2xl text-center" style={{ color: primaryText }}>
          Join our Discord below for the Public Sale instructions!
          </span>
          <div
            className='no-underline font-hero-heading1 mb-5 deprecated_sm:mb-16'>
            <Button
              type={ButtonType.PRIMARY}
              label={'JOIN DISCORD'}
              onClick={() => {
                window.open(
                  'https://discord.gg/nftdotcom',
                  '_blank',
                );
              }}
            />
          </div>
        </div>
      }
    </div>
  );
}