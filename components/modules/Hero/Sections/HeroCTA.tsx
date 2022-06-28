import { Button, ButtonType } from 'components/modules/Hero/HeroButton';
import { useGallery } from 'hooks/state/useGallery';
import { useTotalGKPublicRemaining } from 'hooks/useTotalGKPublicRemaining';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import heroCTA from 'public/Background_CTA.png';

export function HeroCTA() {
  const whitelistClosed = 1650970800000 <= new Date().getTime();
  const router = useRouter();
  const { setGalleryItemType } = useGallery();
  const { totalRemaining } = useTotalGKPublicRemaining();
  
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
        <span className='text-hero-pink'>CHECK OUT YOUR PROFILES,{' '}</span>
        <span className="text-always-white ml-2 deprecated_sm:ml-0">AND SEE WHAT YOUR COMMUNITY CREATED.</span>
      </div>
      <div className="mt-4 font-hero-heading1 text-base">
        <Button
          type={ButtonType.PRIMARY}
          label={'DISCOVER PROFILES'}
          textColor="black"
          onClick={() => {
            setGalleryItemType('profile');
            router.push('/app/gallery');
          }}/>
      </div>
    </div>;
  }

  return <div
    style={{
      backgroundImage: `url(${heroCTA})`,
    }}
    className={tw(
      'w-full z-50 h-[252px] bg-cover bg-center bg-no-repeat flex flex-col items-center',
      whitelistClosed ? 'justify-start' : 'justify-end'
    )}
  >
    <div className={tw(
      'flex deprecated_sm:flex-col deprecated_sm:text-center text-always-white font-hero-heading2',
      'tracking-wider text-lg deprecated_minmd:text-xl deprecated_minlg:text-2xl deprecated_minxl:text-3xl',
      whitelistClosed ? 'pt-20' : ''
    )}>
      <span>what will your key look like?</span>
      <span className='ml-2 deprecated_sm:ml-0 text-hero-pink'>what profile will you choose to build?</span>
    </div>
    {
      !whitelistClosed &&
      <div className="mt-4 mb-20 font-hero-heading1 text-base">
        <Button
          type={ButtonType.PRIMARY}
          label={'JOIN THE WHITELIST'}
          textColor="black"
          onClick={() => {
            window.open(
              'https://whitelist.nft.com',
              '_blank'
            );
          }}/>
      </div>
    }
  </div>;
}