import { AuctionCountdownTile } from 'components/modules/GenesisKeyAuction/AuctionCountdownTile';
import { AuctionType } from 'components/modules/GenesisKeyAuction/GenesisKeyAuction';
import { AccentType, Button, ButtonType } from 'components/modules/Hero/HeroButton';
import { HeroTitle } from 'components/modules/Hero/HeroTitle';
import { useGenesisKeyInsiderMerkleCheck } from 'hooks/merkle/useGenesisKeyInsiderMerkleCheck';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { useTotalGKPublicRemaining } from 'hooks/useTotalGKPublicRemaining';
import useWindowDimensions from 'hooks/useWindowDimensions';
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
  const insiderMerkleData = useGenesisKeyInsiderMerkleCheck(account?.address);
  const { width, height } = useWindowDimensions();

  const liveAuctionName = process.env.NEXT_PUBLIC_LIVE_AUCTION_NAME;
  const [auctionStarted, setAuctionStarted] = useState(
    liveAuctionName === 'blind' ?
      Number(process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_START) <= new Date().getTime() :
      Number(process.env.NEXT_PUBLIC_GK_PUBLIC_SALE_TENTATIVE_START) <= new Date().getTime()
  );
  const { data: myGKTokens, loading: loadingMyGkTokens } = useOwnedGenesisKeyTokens(account?.address);
  const { totalRemaining, loading: loadingTotalRemaining } = useTotalGKPublicRemaining();

  const auctionEnded = liveAuctionName === 'blind' ?
    Number(process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_END) <= new Date().getTime() :
    totalRemaining?.lte(0) ?? false;

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
    const genesisKeyRecognized = myGKTokens?.length > 0;
    if ((process.env.NEXT_PUBLIC_GK_FLOWS_ENABLED === 'true') && !auctionStarted) {
      return <div className='flex flex-col h-full items-center justify-between dark'>
        <div className='flex flex-col items-center grow justify-center'>
          <HeroTitle color="blue" items={[liveAuctionName === 'blind' ? 'THE AUCTION' : 'THE PUBLIC SALE']} />
          <HeroTitle color="blue" items={['WILL START SOON']} />
          <div className="mt-4 deprecated_sm:w-full">
            <div className='w-full flex justify-center'>
              <AuctionCountdownTile
                to={liveAuctionName === 'blind'
                  ? Number(process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_START)
                  : Number(process.env.NEXT_PUBLIC_GK_PUBLIC_SALE_TENTATIVE_START)}
                nextAuctionName={
                  liveAuctionName === 'blind' ? AuctionType.Blind : AuctionType.Public
                }
                onEnded={() => {
                  setAuctionStarted(true);
                }}
              />
            </div>
            {
              /* 4/26/2022, 6:00:00 PM (1 hour before auction) */
              1651010400000 < new Date().getTime() &&
              <div className="mt-8 tracking-widest font-hero-heading2 w-full flex justify-center">
                <Button
                  textColor={alwaysBlack}
                  accent={AccentType.SCALE}
                  label={liveAuctionName === 'blind' ? 'GO TO AUCTION' : 'BUY KEYS'}
                  onClick={() => {
                    router.push('/app/auctions');
                  }}
                  type={ButtonType.PRIMARY}
                />
              </div>
            }
            <Image src={truststamps} alt="quant stamp" className='mb-4 mt-8'/>
          </div>
        </div>
        {getLearnMoreLink()}
      </div>;
    } else if ((process.env.NEXT_PUBLIC_GK_FLOWS_ENABLED === 'true') && auctionEnded) {
      return <div className='flex flex-col items-center h-full justify-between'>
        <div className='flex flex-col items-center grow justify-center space-y-5'>
          {
            insiderMerkleData ?
              <>
                <HeroTitle color="blue" items={['THANK YOU FOR']} />
                <HeroTitle color="blue" items={['SUPPORTING NFT.COM']} />
              </> :
              <>
                <HeroTitle color="blue" items={['THE PUBLIC SALE']} />
                <HeroTitle color="blue" items={['WILL START SOON']} />
                <AuctionCountdownTile
                  hideLabel
                  to={Number(process.env.NEXT_PUBLIC_GK_PUBLIC_SALE_TENTATIVE_START)}
                  nextAuctionName={AuctionType.Public}
                  onEnded={() => {
                    // do nothing
                  }}
                />
              </>
          }
          { liveAuctionName === 'blind' && !account && <span
            className='text-primary-txt-dk text-xl font-bold mt-3'
            style={{
              textShadow: '0px 4px 4px rgba(0,0,0,0.9)',
            }}
          >
          Connect your wallet to see if you won the blind auction!
          </span>}
          {account &&
          <>
            <span
              className='text-primary-txt-dk text-xl font-bold mt-3'
              style={{
                textShadow: '0px 4px 4px rgba(0,0,0,0.9)',
              }}
            >
          If you participated in the Blind Auction, please click below to find out if you won!
            </span>
            <div className="tracking-widest font-hero-heading2 mt-4 flex flex-col items-center">
              {liveAuctionName === 'blind' && <Button
                textColor={alwaysBlack}
                accent={AccentType.SCALE}
                label={genesisKeyRecognized ?
                  'MINT YOUR PROFILES NOW' :
                  insiderMerkleData ?
                    'CLAIM YOUR KEY' :
                    'CHECK TO SEE IF YOU WON'
                }
                onClick={() => {
                  if (genesisKeyRecognized) {
                    router.push('/app/claim-profiles');
                  } else {
                    router.push('/app/auctions');
                  }
                }}
                type={ButtonType.PRIMARY}
              />}
              { liveAuctionName === 'blind' && !auctionEnded &&
              <Image src={truststamps} alt="quant stamp" className='mb-4 mt-32'/>
              }
            </div>
          </>
          }
        </div>
        <div className='flex flex-col items-center'>
          <span
            className={tw(
              'text-xl deprecated_minxs:text-2xl deprecated_minxs:2:text-3xl deprecated_minxl:text-4xl z-26',
              'text-center font-bold text-white',
              'tracking-wider font-hero-heading2',
            )}
          >
            {
              liveAuctionName === 'blind' ?
                'GET A GENESIS KEY IN THE PUBLIC SALE' :
                'I\'VE GOT ALL THE KEYS I NEED. WHAT\'S NEXT?'
            }
          </span>
          {getLearnMoreLink()}
        </div>
      </div>;
    } else if ((process.env.NEXT_PUBLIC_GK_FLOWS_ENABLED === 'true') && auctionStarted) {
      return <div className='flex flex-col items-center h-full justify-between'>
        <div className='flex flex-col items-center grow justify-center'>
          <HeroTitle color="blue" items={[liveAuctionName === 'blind' ? 'THE AUCTION' : 'UNLOCK THE NFT BETA WITH YOUR GENESIS KEY']} />
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
              label={liveAuctionName === 'blind' ? 'GO TO AUCTION' : 'BUY KEYS'}
              onClick={() => {
                router.push('/app/auctions');
              }}
              type={ButtonType.PRIMARY}
            />
          </div>
          {liveAuctionName === 'blind' ?
            <span
              className='text-primary-txt-dk max-w-lg text-center mt-6 mb-8 text-sm'
              style={{
                textShadow: '0px 4px 4px rgba(0,0,0,0.9)',
              }}
            >
              Please read the {' '}
              <span
                onClick={() => {
                  window.open(
                    'https://nftcom-prod-assets.s3.amazonaws.com/nft_com_whitelist_blind_auction_terms.pdf',
                    '_blank'
                  );
                }}
                className='text-link hover:underline cursor-pointer'
              >
                Auction Rules
              </span>{' '} carefully before participating. {' '}
              By clicking the button above, I have read, understood, and agree to {' '}
              <span
                onClick={() => {
                  window.open(
                    'https://cdn.nft.com/nft_com_terms_of_service.pdf',
                    '_open'
                  );
                }}
                className='cursor-pointer hover:underline text-link'
              >
              Terms of Service.
              </span>
            </span> :
            ''}
          <Image src={truststamps} alt="quant stamp" className='mb-4 mt-8'/>
        </div>
        {liveAuctionName === 'public' && <span
          className={tw(
            'text-xl deprecated_minxs:text-2xl deprecated_minxs:2:text-3xl deprecated_minxl:text-4xl z-26',
            'text-center font-bold text-white',
            'tracking-wider font-hero-heading2',
          )}
        >
          {'I\'VE GOT ALL THE KEYS I NEED. WHAT\'S NEXT?'}
        </span>}
        {getLearnMoreLink()}
      </div>;
    }

    // Default splash page content. We show this if there was no more relevant content to show
    // about the auctions (e.g. if they haven't started yet, or if they're long over).
    return <DefaultSplash />;
  }, [myGKTokens?.length, auctionStarted, auctionEnded, liveAuctionName, alwaysBlack, getLearnMoreLink, router, insiderMerkleData, account]);

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
              className={tw(
                'absolute' ,
                width > height ? 'w-full top-0' : 'h-full object-top object-cover top-0',
              )}
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
