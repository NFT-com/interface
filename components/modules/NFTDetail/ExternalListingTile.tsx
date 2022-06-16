import { Button, ButtonType } from 'components/elements/Button';
import { tw } from 'utils/tw';

export interface ExternalListingTileProps {
  listingURL: string;
  exchange: string;
}

const Colors = {
  'looksrare': 'bg-looksrare-green',
  'opensea': 'bg-opensea-blue',
  'x2y2': 'bg-x2y2-orange',
  'rarible': 'bg-rarible-red',
};

export function ExternalListingTile(props: ExternalListingTileProps) {
  const { listingURL } = props;

  return <div className="flex flex-col bg-white dark:bg-secondary-bg-dk rounded-xl p-5 my-6">
    <div className='flex items-center mb-4'>
      <div className={tw(
        'aspect-square h-8 w-8 rounded-full',
        Colors[props.exchange]
      )}>
        {/* todo: put <Image> here  */}
      </div>
      <div className="flex flex-col text-primary-txt dark:text-primary-txt-dk ml-3">
        <span className='text-sm'>
            Listed on <span className='text-link'>{props.exchange}</span>
        </span>
        <div className='flex items-center'>
          <span className='text-base font-medium'>
            0.9 ETH
          </span>
          <span className='text-base text-secondary-txt ml-2'>
            $100
          </span>
        </div>
      </div>
    </div>
    <Button
      stretch
      color="white"
      label={'View Listing'}
      onClick={() => {
        window.open(listingURL, '_blank');
      }}
      type={ButtonType.PRIMARY}
    />
  </div>;
}