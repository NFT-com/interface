import { Button, ButtonType } from 'components/elements/Button';
import { HeroTitle } from 'components/modules/Hero/HeroTitle';
import { tw } from 'utils/tw';

import { AuctionCountdownTile } from './AuctionCountdownTile';
import { AuctionType } from './GenesisKeyAuction';
import { GenesisKeyWaitingView } from './GenesisKeyWaitingView';

import { useThemeColors } from 'styles/theme/useThemeColors';

export interface GenesisKeyLoserViewProps {
  liveAuction: AuctionType;
}

export function GenesisKeyLoserView(props: GenesisKeyLoserViewProps) {
  const { primaryText } = useThemeColors();

  if (
    props.liveAuction === AuctionType.Blind &&
    !(process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_ALL_BIDS_EXECUTED === 'true')
  ) {
    return <GenesisKeyWaitingView />;
  }

  return (
    <div className="flex flex-col items-center deprecated_sm:text-center">
      <HeroTitle items={['SORRY!']} />
      <HeroTitle items={['YOU WERE OUTBID']} />
      <div className={tw('flex flex-col items-center text-center space-y-12 mt-8',
        'text-white w-2/4',
        'deprecated_xxl:text-xl deprecated_lg:text-xl deprecated_md:text-lg deprecated_sm:text-base')}
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
      <div className='mt-8 mb-4'>
        <AuctionCountdownTile
          hideLabel
          to={Number(process.env.NEXT_PUBLIC_GK_PUBLIC_SALE_TENTATIVE_START)}
          nextAuctionName={AuctionType.Public}
          onEnded={() => {
            // do nothing
          }}
        />
      </div>
      {props.liveAuction === AuctionType.Blind &&
        <div className={tw(
          'flex flex-col items-center my-6 text-white w-2/4 text-center',
          'deprecated_xxl:text-xl deprecated_lg:text-xl deprecated_md:text-lg deprecated_sm:text-base')}
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