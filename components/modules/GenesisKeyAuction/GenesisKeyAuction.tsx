import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';

import { LoadedContainer } from 'components/elements/Loader/LoadedContainer';
import { NetworkErrorTile as StaticNetworkErrorTile } from 'components/elements/NetworkErrorTile';
import { useKeyBackground } from 'hooks/state/useKeyBackground';
import { useGenesisKeyPublicSaleData } from 'hooks/useGenesisKeyPublicSaleData';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { useSupportedNetwork } from 'hooks/useSupportedNetwork';
import { useTotalGKPublicRemaining } from 'hooks/useTotalGKPublicRemaining';
import { isNullOrEmpty } from 'utils/format';
import { tw } from 'utils/tw';

import { GenesisKeyPublicSale } from './GenesisKeyPublicSale';
import { SignedOutView } from './SignedOutView';

export enum AuctionType {
  Blind = 'Blind',
  Public = 'Public'
}

const DynamicNetworkErrorTile = dynamic<React.ComponentProps<typeof StaticNetworkErrorTile>>(() =>
  import('components/elements/NetworkErrorTile').then(mod => mod.NetworkErrorTile)
);

/**
 * the whole genesis key auction flow, with the following steps:
 * - wallet connection (if not connected)
 * - countdown (if auction not started yet)
 * - Bid input (initial and modify existing)
 * - post-auction UI (congrats if won, sorry if lost)
 */
export function GenesisKeyAuction() {
  const liveAuctionName = 'public';
  const { address: currentAddress } = useAccount();
  const { isSupported } = useSupportedNetwork();
  const { totalRemaining, loading: loadingTotalGKRemaining } = useTotalGKPublicRemaining();

  const keyBackground: { img; bg } = useKeyBackground();

  const { currentPrice, loading: loadingPublicAuctionData } = useGenesisKeyPublicSaleData();

  const { data: ownedGenesisKeyTokens, loading: loadingOwnedGenesisKeys } = useOwnedGenesisKeyTokens(currentAddress);

  const [firstLoaded, setFirstLoaded] = useState(false);
  useEffect(() => {
    if (!firstLoaded) {
      if (!currentAddress) {
        setFirstLoaded(true);
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
    isSupported,
    firstLoaded,
    loadingPublicAuctionData,
    loadingTotalGKRemaining,
    totalRemaining,
    loadingOwnedGenesisKeys,
    currentAddress
  ]);

  const [auctionEnded, setAuctionEnded] = useState(totalRemaining?.lte(0) ?? false);

  useEffect(() => {
    setAuctionEnded(totalRemaining?.lte(0) ?? false);
  }, [liveAuctionName, totalRemaining]);

  const getAuctionContent = useCallback(() => {
    if (!currentAddress) {
      return (
        <div className='flex h-full w-full flex-col items-center'>
          <SignedOutView auctionText />
        </div>
      );
    }
    if (!isSupported) {
      return null;
    }
    if (!auctionEnded && !currentAddress) {
      return (
        <div className='flex h-full w-full flex-col items-center'>
          <SignedOutView auctionText />
        </div>
      );
    }
    if (!auctionEnded && currentAddress) {
      return (
        <div className='flex h-full w-full flex-col items-center'>
          <GenesisKeyPublicSale currentPrice={currentPrice} />
        </div>
      );
    }
    if (auctionEnded) {
      if (!currentAddress) {
        return (
          <div className='flex h-full w-full flex-col items-center'>
            <SignedOutView auctionText ended />
          </div>
        );
      }
      return (
        <div className='flex h-full w-full flex-col items-center'>
          <div
            className={tw(
              'w-full items-center',
              'h-10 justify-center text-center text-lg',
              isMobile ? 'px-4' : '',
              'text-primary-txt dark:text-primary-txt-dk'
            )}
          >
            The {'Public Sale'} has <span className='font-bold'>Ended</span>.
          </div>
          <GenesisKeyPublicSale currentPrice={currentPrice} />
        </div>
      );
    }
  }, [isSupported, auctionEnded, currentAddress, currentPrice]);

  return (
    <div
      className={tw('h-screen w-screen bg-cover bg-center bg-no-repeat', 'backdrop-blur-sm backdrop-opacity-80')}
      style={{
        // eslint-disable-next-line max-len
        background: 'radial-gradient(59.6% 80.37% at 50.68% 83.52%, #272F46 0%, #202F56 46.87%, #030406 100%)'
      }}
    >
      <div
        className={tw(
          'absolute bottom-0 h-full w-full',
          'items-center justify-center',
          'bg-transparent',
          'bg-contain bg-center bg-no-repeat bg-blend-screen sm:bg-cover',
          'bg-clip-content',
          'backdrop-saturate-150'
        )}
        style={
          isMobile && isNullOrEmpty(keyBackground.img)
            ? { backgroundImage: `url(${keyBackground.img})` }
            : { backgroundImage: '' }
        }
      >
        {!isMobile && (
          <div
            className={tw(
              'absolute h-full w-full items-center justify-center drop-shadow-md',
              'z-20 flex justify-center overflow-auto',
              isNullOrEmpty(keyBackground.img)
                ? '' // fall through to splash key behind this component.
                : // otherwise, fill in the background behind the minted key.
                keyBackground.bg === 'white'
                ? 'bg-[#C0C0C0]'
                : 'bg-black'
            )}
          >
            <video className='h-full' id='keyVideo' src={keyBackground.img} autoPlay muted loop />
          </div>
        )}
        <div
          className={tw('absolute z-40 h-full w-full')}
          // eslint-disable-next-line max-len
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 63.02%, #000000 100%)'
          }}
        >
          <div className={tw('flex h-full w-full flex-col items-center pt-20')}>
            {currentAddress && !isSupported && <DynamicNetworkErrorTile />}
            <LoadedContainer loaded={firstLoaded} fitToParent>
              {getAuctionContent()}
            </LoadedContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
