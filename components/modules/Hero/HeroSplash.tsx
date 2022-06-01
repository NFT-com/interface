import { AccentType, Button, ButtonType } from 'components/modules/Hero/HeroButton';
import { HeroTitle } from 'components/modules/Hero/HeroTitle';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { useTotalGKPublicRemaining } from 'hooks/useTotalGKPublicRemaining';
import { tw } from 'utils/tw';

import { DefaultSplash } from './DefaultSplash';
import { HeroLearnMoreLink } from './HeroLearnMoreLink';

import Image from 'next/image';
import { useRouter } from 'next/router';
import truststamps from 'public/trust_stamps.png';
import { useCallback, useEffect,useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount } from 'wagmi';

const cloudVid = 'https://cdn.nft.com/keys_clouds.mp4';
const keySplashMobile = 'https://cdn.nft.com/NFT_Floating_Islands_mobile.jpg';
const splashPoster = 'https://cdn.nft.com/splash_poster.jpg';

export interface HeroSplashProps {
  onScrollToAbout: () => void;
}

export default function HeroSplash(props: HeroSplashProps) {
  const { data: account } = useAccount();
  const { alwaysBlack } = useThemeColors();
  const router = useRouter();

  const { data: myGKTokens, loading: loadingMyGkTokens } = useOwnedGenesisKeyTokens(account?.address);
  const { totalRemaining, loading: loadingTotalRemaining } = useTotalGKPublicRemaining();

  const getLearnMoreLink = useCallback(() => {
    return (
      <div className='flex flex-col items-center'>
        {
          // Whitelist closes 12 hours before the auction starts.
          1650970800000 > new Date().getTime() &&
          <div className="mt-4 block font-hero-heading1 text-base">
            <Button
              type={ButtonType.PRIMARY}
              label={'JOIN NOW'}
              textColor="black"
              onClick={() => {
                window.open(
                  'https://whitelist.nft.com',
                  '_blank'
                );
              }}/>
          </div>
        }
        <div className='mt-10'>
          <div
            className='mb-8'
            style={{
              textShadow: '0px 4px 4px rgba(0,0,0,0.9)',
            }}
          >
            <HeroLearnMoreLink onClick={props.onScrollToAbout} />
          </div>
        </div>
      </div>
    );
  }, [props.onScrollToAbout]);

  const getSplashContent = useCallback(() => {
    return <div className='flex flex-col items-center h-full justify-between'>
      <div className='flex flex-col items-center grow justify-center'>
        <HeroTitle color="blue" items={['UNLOCK THE NFT BETA WITH YOUR GENESIS KEY']} />
        {!account && <span
          className='text-primary-txt-dk text-xl mt-3 font-bold text-center'
          style={{
            textShadow: '0px 4px 4px rgba(0,0,0,0.9)',
          }}
        >
          Connect with one of our available wallet providers to start minting!
        </span>}
        <div className="mt-8 tracking-widest font-hero-heading2 w-full flex justify-center">
          <Button
            textColor={alwaysBlack}
            accent={AccentType.SCALE}
            label={'BUY KEYS'}
            onClick={() => {
              router.push('/app/auctions');
            }}
            type={ButtonType.PRIMARY}
          />
        </div>
        <Image src={truststamps} alt="quant stamp" className='mb-4 mt-8'/>
      </div>
      <span
        className={tw(
          'text-xl deprecated_minxs:text-2xl deprecated_minxs:2:text-3xl deprecated_minxl:text-4xl z-26',
          'text-center font-bold text-white',
          'tracking-wider font-hero-heading2',
        )}
      >
        {'I\'VE GOT ALL THE KEYS I NEED. WHAT\'S NEXT?'}
      </span>
      {getLearnMoreLink()}
    </div>;

    // Default splash page content. We show this if there was no more relevant content to show
    // about the auctions (e.g. if they haven't started yet, or if they're long over).
    return <DefaultSplash />;
  }, [alwaysBlack, getLearnMoreLink, router, account]);

  const [firstLoaded, setFirstLoaded] = useState(false);
  useEffect(() => {
    if (!firstLoaded) {
      setFirstLoaded(
        !loadingTotalRemaining &&
        totalRemaining != null &&
        !loadingMyGkTokens &&
        myGKTokens != null
      );
    }
  }, [firstLoaded, loadingMyGkTokens, loadingTotalRemaining, myGKTokens, totalRemaining]);

  return (
    <>
      <div className='h-screen'>
        <div
          className='absolute z-10 w-full h-full flex justify-center items-center bg-transparent overflow-hidden'
          style={{
            // eslint-disable-next-line max-len
            background: 'radial-gradient(59.6% 80.37% at 50.68% 83.52%, #272F46 0%, #202F56 46.87%, #030406 100%)'
          }}
        >
          {isMobile ?
            <Image
              src={keySplashMobile}
              className={tw(
                'absolute h-full w-full top-0 object-cover',
              )}
              alt="key Splash"
            />
            :
            <video
              poster={splashPoster}
              autoPlay
              muted
              loop
              className='w-full h-full object-top object-cover absolute top-0'
              src={cloudVid}
            />
          }
          <div
            className="w-full absolute z-18 h-full"
            // eslint-disable-next-line max-len
            style={{ background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 63.02%, #000000 100%)' }}>
          </div>
        </div>
        <div
          className={tw(
            'absolute z-20 h-full w-full flex flex-col items-center deprecated_minmd:py-auto'
          )}
        >
          {getSplashContent()}
        </div>
      </div>
      
      <div className={tw(
        'flex w-full items-center justify-center flex-col px-8',
        'deprecated_minxs:px-0 deprecated_minmd:flex-row text-always-white',
      )}
      >
      </div>
    </>
  );
}
