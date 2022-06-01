import { LoadedContainer } from 'components/elements/LoadedContainer';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { AuctionType } from 'components/modules/GenesisKeyAuction/GenesisKeyAuction';
import { GenesisKeyLoserView } from 'components/modules/GenesisKeyAuction/GenesisKeyLoserView';
import { GenesisKeyWinnerView } from 'components/modules/GenesisKeyAuction/GenesisKeyWinnerView';
import { SignedOutView } from 'components/modules/GenesisKeyAuction/SignedOutView';
import { useGenesisKeyInsiderMerkleCheck } from 'hooks/merkle/useGenesisKeyInsiderMerkleCheck';
import { useKeyBackground } from 'hooks/state/useKeyBackground';
import { useInsiderGenesisKeyIDs } from 'hooks/useInsiderGenesisKeyIDs';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useAccount } from 'wagmi';

export default function ClaimGenesisKeyPage() {
  const [firstLoaded, setFirstLoaded] = useState(false);

  const { bg: keyBackground, img: keyImg } = useKeyBackground();
  const { data: account } = useAccount();
  const insiderMerkleData = useGenesisKeyInsiderMerkleCheck(account?.address);
  const {
    data: ownedGenesisKeyTokens,
    loading: loadingOwnedGenesisKeys
  } = useOwnedGenesisKeyTokens(account?.address);
  const { data: insiderReservedIDs, loading: loadingInsiderReservedGKs } = useInsiderGenesisKeyIDs();

  useEffect(() => {
    if (!firstLoaded) {
      setFirstLoaded(
        !loadingOwnedGenesisKeys && ownedGenesisKeyTokens != null &&
        !loadingInsiderReservedGKs && insiderReservedIDs != null
      );
    }
  }, [firstLoaded, insiderReservedIDs, loadingInsiderReservedGKs, loadingOwnedGenesisKeys, ownedGenesisKeyTokens]);

  const shouldShowClaim = useCallback(() => {
    // only insiders should have access to GK claiming here now.
    // they should only be able to claim if they don't yet have a reserved GK.
    return insiderMerkleData != null;
  }, [insiderMerkleData]);

  const getContent = useCallback(() => {
    if (!account) {
      return (<SignedOutView />);
    }
    return (
      <>
        {
          shouldShowClaim()
            ? <GenesisKeyWinnerView
              liveAuction={AuctionType.Blind}
              ownedTokenID={null}
              claimData={null}
              insiderClaimData={insiderMerkleData}
            />
            : <GenesisKeyLoserView
              liveAuction={AuctionType.Blind}
            />
        }
      </>
    );
  }, [insiderMerkleData, shouldShowClaim, account]);

  return (
    <PageWrapper
      removePinkSides
      headerOptions={{
        walletOnly: true,
        removeBackground: true,
        walletPopupMenu: true,
        removeSummaryBanner: true,
        sidebar: 'hero'
      }}>
      {!isMobile &&
            <div
              className={tw(
                'absolute items-center w-full h-full justify-center drop-shadow-md',
                'overflow-auto z-20 flex justify-center',
                isNullOrEmpty(keyImg)
                  ? '' // fall through to splash key behind this component.
                  // otherwise, fill in the background behind the minted key.
                  : keyBackground === 'white' ?
                    'bg-[#C0C0C0]'
                    : 'bg-black'
              )}
            >
              <video
                className="h-full"
                id='keyVideo'
                src={keyImg}
                autoPlay
                muted
                loop
              />
            </div>
      }
      <div className={tw(
        'relative flex flex-col overflow-y-scroll items-center mt-20',
        'overflow-x-hidden bg-black w-screen h-screen z-50',
      )}>
        <LoadedContainer loaded={firstLoaded}>
          {getContent()}
        </LoadedContainer>
      </div>
    </PageWrapper>
  );
}