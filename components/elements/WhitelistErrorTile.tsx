import { AuctionCountdownTile } from 'components/modules/GenesisKeyAuction/AuctionCountdownTile';
import { AuctionType } from 'components/modules/GenesisKeyAuction/GenesisKeyAuction';
import { HeroTitle } from 'components/modules/Hero/HeroTitle';

export function WhitelistErrorTile() {
  return (
    <>
      <HeroTitle items={['THE PUBLIC SALE']} />
      <HeroTitle items={['STARTS IN']} />
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
    </>
  );
}