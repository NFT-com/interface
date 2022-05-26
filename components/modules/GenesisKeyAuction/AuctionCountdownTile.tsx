import { CountdownUnits } from 'components/elements/CountdownUnits';
import { tw } from 'utils/tw';

import { AuctionType } from './GenesisKeyAuction';
import { GenesiskeyEducationModal } from './GenesisKeyEducationModal';

export interface AuctionCountdownTileProps {
  to: number; // timestamp
  nextAuctionName: AuctionType;
  onEnded?: () => void;
  type?: 'hero' | 'default'
  hideLabel?: boolean
}

export function AuctionCountdownTile(props: AuctionCountdownTileProps) {
  return (
    <div
      className={tw(
        'rounded-xl p-5 flex flex-col items-center deprecated_minmd:w-[40rem]',
        'bg-pagebg dark:bg-pagebg-dk',
      )}
      style={{ opacity: 0.9 }}
    >
      {
        props.hideLabel !== true &&
        <div className="text-2xl mb-4 text-primary-txt dark:text-primary-txt-dk">
          Starts in
        </div>
      }
      <div className={tw(
        'flex',
        props.type === 'hero' ? 'tracking-wider font-hero-heading2' : ''
      )}>
        <CountdownUnits to={props.to} onEnded={props.onEnded} />
      </div>
      {
        props.nextAuctionName === AuctionType.Blind &&
          <GenesiskeyEducationModal />
      }
    </div>
  );
}