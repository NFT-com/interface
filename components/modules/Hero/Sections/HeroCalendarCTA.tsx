import { CountdownUnits } from 'components/elements/CountdownUnits';
import { Button, ButtonType } from 'components/modules/Hero/HeroButton';
import { useGallery } from 'hooks/state/useGallery';
import { useTotalGKPublicRemaining } from 'hooks/useTotalGKPublicRemaining';
import { getAuctionCalendarLink } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import heroCTA from 'public/Background_CTA.png';

export function HeroCalendarCTA() {
  const whitelistClosed = 1650970800000 <= new Date().getTime();
  const { setGalleryShowMyStuff, setGalleryItemType } = useGallery();

  const { totalRemaining } = useTotalGKPublicRemaining();

  const router = useRouter();

  if (totalRemaining?.eq(0)) {
    return <div
      style={{
        backgroundImage: `url(${heroCTA})`,
      }}
      className={tw(
        'w-full z-50 h-[252px] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center',
      )}
    >
      <div className={tw(
        'flex deprecated_sm:flex-col deprecated_sm:text-center w-full justify-center font-hero-heading2',
        'tracking-wider text-lg deprecated_minmd:text-xl deprecated_minlg:text-2xl deprecated_minxl:text-3xl',
      )}>
        <span className='text-always-white'>VIEW THE GENESIS KEYS.{' '}</span>
        <span className="text-hero-pink ml-2 deprecated_sm:ml-0">OWN A KEY? ACCESS YOUR KEY ART.</span>
      </div>
      <div className="mt-4 font-hero-heading1 text-base flex w-full deprecated_sm:flex-col justify-center">
        <Button
          type={ButtonType.PRIMARY}
          label={'EXPLORE GENESIS KEYS'}
          textColor="black"
          onClick={() => {
            setGalleryShowMyStuff(false);
            setGalleryItemType('gk');
            router.push('/app/gallery');
          }}/>
        <div className='ml-4 deprecated_sm:ml-0'>
          <Button
            type={ButtonType.PRIMARY}
            label={'VIEW MY GENESIS KEY'}
            textColor="black"
            onClick={() => {
              setGalleryShowMyStuff(true);
              setGalleryItemType('gk');
              router.push('/app/gallery');
            }}/>
        </div>
      </div>
    </div>;
  }

  // Hide whitelist CTA after the auction has started, but before we've sold out.
  if (Number(process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_START) < new Date().getTime()) {
    return null;
  }

  return <div
    style={{
      backgroundImage: `url(${heroCTA})`,
    }}
    className="w-full h-[340px] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-end"
  >
    <span className='mb-2 tracking-wider text-hero-pink font-hero-heading2 text-lg'>
      THE {whitelistClosed ? ' PUBLIC SALE ' : ' AUCTION '} STARTS
    </span>
    <span className={tw(
      'tracking-wider text-always-white font-hero-heading2',
      'text-xl deprecated_minmd:text-2xl deprecated_minlg:text-3xl deprecated_minxl:text-4xl'
    )}>
      {whitelistClosed ? 'MAY 2ND, 2022 @ 7PM EDT' : 'APRIL 26TH, 2022 @ 7PM EDT'}
    </span>
    <div
      className={tw(
        'mt-4 flex deprecated_sm:text-lg',
        whitelistClosed ? 'mb-20' : ''
      )}
    >
      <CountdownUnits
        to={Number(
          whitelistClosed ?
            process.env.NEXT_PUBLIC_GK_PUBLIC_SALE_TENTATIVE_START :
            1651014000442 /** UTC timestamp ms */)
        }
      />
    </div>
    {!whitelistClosed && <div className="mt-4 mb-16 font-hero-heading2 flex deprecated_sm:flex-col deprecated_sm:items-center">
      <div className="font-hero-heading1">
        <Button
          type={ButtonType.PRIMARY}
          label={'REGISTER NOW'}
          textColor="black"
          onClick={() => {
            window.open(
              'https://whitelist.nft.com',
              '_blank'
            );
          }} />
      </div>
      <div className={tw(
        whitelistClosed ? '' : 'ml-4',
        'font-hero-heading1 deprecated_sm:ml-0 deprecated_sm:mt-4'
      )}>
        <Button
          type={ButtonType.PRIMARY}
          label={'ADD TO CALENDAR'}
          textColor="black"
          onClick={() => {
            window.open(
              getAuctionCalendarLink(),
              '_blank'
            );
          }}
        />
      </div>
    </div>}
  </div>;
}