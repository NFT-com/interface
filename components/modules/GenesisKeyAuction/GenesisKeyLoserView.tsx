import { useRouter } from 'next/router';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { HeroTitle } from 'components/modules/Hero/HeroTitle';
import { tw } from 'utils/tw';

import { AuctionType } from './GenesisKeyAuction';

export interface GenesisKeyLoserViewProps {
  liveAuction: AuctionType;
}

export function GenesisKeyLoserView(props: GenesisKeyLoserViewProps) {
  const router = useRouter();
  return (
    <div className='flex flex-col items-center pt-20 deprecated_sm:text-center'>
      <HeroTitle color='black' items={['Looking to get']} />
      <HeroTitle color='black' items={['a Genesis Key?']} />
      <div
        className={tw(
          'mt-8 flex flex-col items-center space-y-12 text-center',
          'w-2/4 text-black',
          'text-base minmd:text-lg minlg:text-xl'
        )}
      >
        <span>View active marketplace listings for the Genesis Key Collection</span>
      </div>
      {props.liveAuction === AuctionType.Blind && (
        <div
          className={tw(
            'my-6 flex w-2/4 flex-col items-center text-center text-black',
            'text-base minmd:text-lg minlg:text-xl'
          )}
        >
          <div className='font-hero-heading1 mb-5 no-underline deprecated_sm:mb-16'>
            <Button
              size={ButtonSize.LARGE}
              type={ButtonType.PRIMARY}
              label={'View Listings'}
              onClick={() => router.push('/app/collection/0x8fB5a7894AB461a59ACdfab8918335768e411414')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
