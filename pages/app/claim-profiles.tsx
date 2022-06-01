import { LoadedContainer } from 'components/elements/LoadedContainer';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { GenesisFooter } from 'components/modules/GenesisKeyAuction/GenesisFooter';
import { SignedOutView } from 'components/modules/GenesisKeyAuction/SignedOutView';
import { InsiderProfileClaim } from 'components/modules/ProfilePreferences/InsiderProfileClaim';
import { ProfilePreferencesSearch } from 'components/modules/ProfilePreferences/ProfilePreferencesSearch';
import { useGenesisKeyInsiderMerkleCheck } from 'hooks/merkle/useGenesisKeyInsiderMerkleCheck';
import { useMintedReservedProfileCount } from 'hooks/useMintedReservedProfileCount';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { tw } from 'utils/tw';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const keySplash = 'https://cdn.nft.com/key_splash2.png';

export default function ProfilePreferencesPage() {
  const { data: account } = useAccount();
  const { data: ownedGKs, loading: loadingOwnedGKs } = useOwnedGenesisKeyTokens(account?.address ?? null);
  const insiderMerkleData = useGenesisKeyInsiderMerkleCheck(account?.address);
  const { mintedReservedProfileCount, loading: loadingReservedCount } = useMintedReservedProfileCount();
  const showInsiderReservedProfiles = insiderMerkleData != null &&
    ownedGKs?.length >= 1 &&
    (mintedReservedProfileCount ?? 2) < 2;

  const [firstLoaded, setFirstLoaded] = useState(false);

  useEffect(() => {
    if (!firstLoaded) {
      if (insiderMerkleData != null) {
        setFirstLoaded(
          (!loadingOwnedGKs) &&
          (!loadingReservedCount) &&
          mintedReservedProfileCount != null &&
          ownedGKs != null
        );
      } else {
        setFirstLoaded(true);
      }
    }
  }, [
    firstLoaded,
    insiderMerkleData,
    loadingOwnedGKs,
    loadingReservedCount,
    ownedGKs,
    mintedReservedProfileCount
  ]);

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
      <div
        className={tw(
          'flex flex-col relative w-screen h-screen items-center',
          'justify-center overflow-y-scroll overflow-x-hidden'
        )}
      >
        <Image
          src={keySplash}
          className="h-full"
          alt="key Splash"
          layout="fill"
          objectFit="contain"
        />
        <div
          className={tw(
            'z-20 absolute h-full w-full flex flex-col justify-center items-center',
            'backdrop-filter backdrop-blur-sm backdrop-saturate-150 bg-black bg-opacity-80'
          )}>
          <LoadedContainer loaded={firstLoaded}>
            {
              !account ?
                <SignedOutView /> :
                showInsiderReservedProfiles ?
                  <InsiderProfileClaim /> :
                  <ProfilePreferencesSearch />
            }
          </LoadedContainer>
          <div className='flex items-center'>
            <GenesisFooter />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}