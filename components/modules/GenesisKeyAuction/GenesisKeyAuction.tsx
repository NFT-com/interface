import { CountdownUnits } from 'components/elements/CountdownUnits';
import { LoadedContainer } from 'components/elements/LoadedContainer';
import { NetworkErrorTile } from 'components/elements/NetworkErrorTile';
import { WhitelistErrorTile } from 'components/elements/WhitelistErrorTile';
import { GenesisFooter } from 'components/modules/GenesisKeyAuction/GenesisFooter';
import { useMyGenesisKeyBid } from 'graphql/hooks/useMyGenesisKeyBid';
import { useGenesisKeyBlindMerkleCheck } from 'hooks/merkle/useGenesisKeyBlindMerkleCheck';
import { useGenesisKeyInsiderMerkleCheck } from 'hooks/merkle/useGenesisKeyInsiderMerkleCheck';
import { useKeyBackground } from 'hooks/state/useKeyBackground';
import { useGenesisKeyPublicSaleData } from 'hooks/useGenesisKeyPublicSaleData';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { useSupportedNetwork } from 'hooks/useSupportedNetwork';
import { useTotalGKPublicRemaining } from 'hooks/useTotalGKPublicRemaining';
import { useWhitelistCheck } from 'hooks/useWhitelistCheck';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { AuctionCountdownTile } from './AuctionCountdownTile';
import { GenesisKeyBlindAuctionInput } from './GenesisKeyBlindAuctionInput';
import { GenesisKeyLoserView } from './GenesisKeyLoserView';
import { GenesisKeyPublicSale } from './GenesisKeyPublicSale';
import { GenesisKeyWinnerView } from './GenesisKeyWinnerView';
import { SignedOutView } from './SignedOutView';

import Image from 'next/image';
import truststamps from 'public/trust_stamps.png';
import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useAccount } from 'wagmi';

export enum AuctionType {
  Blind = 'Blind',
  Public = 'Public'
}

export interface GenesisKeyAuctionProps {
  liveAuctionName: AuctionType;
}
/**
 * the whole genesis key auction flow, with the following steps:
 * - wallet connection (if not connected)
 * - countdown (if auction not started yet)
 * - Bid input (initial and modify existing)
 * - post-auction UI (congrats if won, sorry if lost)
 */
export function GenesisKeyAuction(props: GenesisKeyAuctionProps) {
  const { liveAuctionName } = props;
  const { data: account } = useAccount();
  const { isSupported } = useSupportedNetwork();
  const { bid: myGenesisKeyBid, loading: loadingMyGKBid } = useMyGenesisKeyBid();
  const { totalRemaining, loading: loadingTotalGKRemaining } = useTotalGKPublicRemaining();

  const merkleData = useGenesisKeyBlindMerkleCheck(account?.address);
  const insiderMerkleData = useGenesisKeyInsiderMerkleCheck(account?.address);
  const { isWhitelisted, loading: loadingWhitelisted } = useWhitelistCheck(account?.address);

  const keyBackground: { img, bg } = useKeyBackground();

  const {
    currentPrice,
    loading: loadingPublicAuctionData,
  } = useGenesisKeyPublicSaleData();

  const {
    data: ownedGenesisKeyTokens,
    loading: loadingOwnedGenesisKeys
  } = useOwnedGenesisKeyTokens(account?.address);

  const [firstLoaded, setFirstLoaded] = useState(false);
  useEffect(() => {
    if (!firstLoaded) {
      if (!account) {
        setFirstLoaded(true);
      } else if (liveAuctionName === AuctionType.Blind) {
        setFirstLoaded(
          !loadingMyGKBid &&
          !loadingWhitelisted &&
          !loadingOwnedGenesisKeys &&
          ownedGenesisKeyTokens != null
        );
      } else {
        setFirstLoaded(
          !loadingTotalGKRemaining &&
          totalRemaining != null &&
          !loadingPublicAuctionData &&
          !loadingOwnedGenesisKeys &&
          ownedGenesisKeyTokens != null
        );
      }
    }
  }, [
    ownedGenesisKeyTokens,
    liveAuctionName,
    loadingWhitelisted,
    isSupported,
    firstLoaded,
    loadingMyGKBid,
    loadingPublicAuctionData,
    loadingTotalGKRemaining,
    myGenesisKeyBid,
    totalRemaining,
    loadingOwnedGenesisKeys,
    account
  ]);

  const [auctionStarted, setAuctionStarted] = useState(
    liveAuctionName === AuctionType.Blind ?
      Number(process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_START) <= new Date().getTime() :
      Number(process.env.NEXT_PUBLIC_GK_PUBLIC_SALE_TENTATIVE_START) <= new Date().getTime()
  );
  const [auctionEnded, setAuctionEnded] = useState(
    liveAuctionName === AuctionType.Blind ?
      Number(process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_END) <= new Date().getTime() :
      totalRemaining?.lte(0) ?? false
  );
  
  useEffect(() => {
    setAuctionEnded(liveAuctionName === AuctionType.Blind ?
      Number(process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_END) <= new Date().getTime() :
      totalRemaining?.lte(0) ?? false
    );
  }, [liveAuctionName, totalRemaining]);

  const getAuctionContent = useCallback(() => {
    if(!account){
      return (
        <div className='w-full flex h-full flex-col items-center'>
          <SignedOutView auctionText />
        </div>);
    }
    if (!isSupported) {
      return null;
    }
    if (!auctionStarted) {
      return (
        <div className='w-full flex h-full flex-col items-center'>
          <div className="text-2xl mb-5 text-primary-txt-dk text-center">
            The {' '}
            {liveAuctionName === AuctionType.Blind ? 'Auction' : 'Sale'}{' '}
            has <span className="font-bold">not</span> started
          </div>
          <AuctionCountdownTile
            to={liveAuctionName === AuctionType.Blind
              ? Number(process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_START)
              : Number(process.env.NEXT_PUBLIC_GK_PUBLIC_SALE_TENTATIVE_START)}
            nextAuctionName={liveAuctionName}
            onEnded={() => {
              setAuctionStarted(true);
            }}
          />
          {/* <Image src={truststamps} alt="quant stamp" className='mb-4 mt-8'/> */}
          <div className='flex grow justify-end items-center'>
            <GenesisFooter />
          </div>
        </div>
      );
    }
    if (auctionStarted && !auctionEnded && !account) {
      return <div className='w-full flex h-full flex-col items-center'>
        <SignedOutView auctionText />
      </div>;
    }
    if (auctionStarted && !auctionEnded && account) {
      return (
        <div className='w-full flex flex-col h-full items-center'>
          {liveAuctionName === AuctionType.Blind && <div
            className={tw(
              'flex flex-col w-full items-center',
              'justify-center text-lg text-center pt-8',
              isMobile ? 'px-4 mb-12' : '',
              'text-primary-txt-dk'
            )}
          >
            <span>
              {liveAuctionName} Auction is <span className="font-bold">Live</span>.
              {' '}Ends in{' '}
            </span>
            <div className="flex">
              <CountdownUnits
                to={Number(process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_END)}
                onEnded={() => {
                  setAuctionEnded(true);
                }}
              />
            </div>
          </div>}
          {
            (
              process.env.NEXT_PUBLIC_LIVE_AUCTION_NAME === 'blind' &&
              !isWhitelisted
            ) ?
              <div className='mt-16 flex flex-col items-center h-full'>
                <WhitelistErrorTile />
                <div className='flex flex-col justify-end grow'>
                  <div className='flex items-center grow'>
                    <GenesisFooter />
                  </div>
                </div>
              </div> :
              liveAuctionName === AuctionType.Blind
                ? <GenesisKeyBlindAuctionInput />
                : <GenesisKeyPublicSale currentPrice={currentPrice}/>
          }
        </div>
      );
    }
    if (auctionEnded) {
      if (!account) {
        return <div className='w-full h-full flex flex-col items-center'>
          <SignedOutView auctionText ended/>
        </div>;
      }
      return (
        <div className='w-full h-full flex flex-col items-center'>
          <div className={tw(
            'w-full items-center',
            'justify-center h-10 text-lg text-center',
            isMobile ? 'px-4' : '',
            'text-primary-txt dark:text-primary-txt-dk'
          )}
          >
            The {' '}
            {liveAuctionName === AuctionType.Blind ? 'Auction' : 'Public Sale'}{' '}
            has <span className="font-bold">Ended</span>.
          </div>
          {
            liveAuctionName === AuctionType.Public ?
              <GenesisKeyPublicSale currentPrice={currentPrice} /> :
              ownedGenesisKeyTokens?.length > 0 || merkleData != null || insiderMerkleData != null
                ? <GenesisKeyWinnerView
                  liveAuction={liveAuctionName}
                  ownedTokenID={ownedGenesisKeyTokens?.[0]}
                  claimData={merkleData}
                  insiderClaimData={insiderMerkleData}
                />
                : !isWhitelisted
                  ?
                  <div className='mt-16 flex flex-col items-center h-full'>
                    <WhitelistErrorTile />
                    <div className='flex flex-col justify-end grow'>
                      <div className='flex items-center grow'>
                        <GenesisFooter />
                      </div>
                    </div>
                  </div> :
                  <GenesisKeyLoserView
                    liveAuction={liveAuctionName}
                  />
          }
        </div>
      );
    }
  }, [
    isSupported,
    auctionStarted,
    auctionEnded,
    account,
    liveAuctionName,
    isWhitelisted,
    currentPrice,
    ownedGenesisKeyTokens,
    merkleData,
    insiderMerkleData
  ]);

  return (
    <div className={tw(
      'w-screen h-screen bg-no-repeat bg-center bg-cover',
      'backdrop-blur-sm backdrop-opacity-80'
    )}
    style={{
      // eslint-disable-next-line max-len
      background: 'radial-gradient(59.6% 80.37% at 50.68% 83.52%, #272F46 0%, #202F56 46.87%, #030406 100%)'
    }}>
      <div className={tw(
        'absolute bottom-0 w-full h-full',
        'justify-center items-center',
        'bg-transparent',
        'bg-no-repeat bg-center bg-contain sm:bg-cover bg-blend-screen',
        'bg-clip-content',
        'backdrop-saturate-150',
      )}
      style={
        (isMobile && isNullOrEmpty(keyBackground.img)) ?
          { backgroundImage: `url(${keyBackground.img})` }
          : { backgroundImage: '' }
      }
      >
        {!isMobile &&
            <div
              className={tw(
                'absolute items-center w-full h-full justify-center drop-shadow-md',
                'overflow-auto z-20 flex justify-center',
                isNullOrEmpty(keyBackground.img)
                  ? '' // fall through to splash key behind this component.
                  // otherwise, fill in the background behind the minted key.
                  : keyBackground.bg === 'white' ?
                    'bg-[#C0C0C0]'
                    : 'bg-black'
              )}
            >
              <video
                className="h-full"
                id='keyVideo'
                src={keyBackground.img}
                autoPlay
                muted
                loop
              />
            </div>
        }
        <div
          className={tw('w-full h-full absolute z-40' )}
          // eslint-disable-next-line max-len
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 63.02%, #000000 100%)'
          }}
        >
          <div
            className={tw(
              'flex flex-col w-full h-full items-center mt-20',
            )}>
            {account && !isSupported && <NetworkErrorTile />}
            <LoadedContainer loaded={firstLoaded} fitToParent>
              {getAuctionContent()}
            </LoadedContainer>
          </div>
        </div>
      </div>
    </div>);
}