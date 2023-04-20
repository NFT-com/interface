import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAccount } from 'wagmi';

import { LoadedContainer } from 'components/elements/Loader/LoadedContainer';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { SignedOutView } from 'components/modules/GenesisKeyAuction/SignedOutView';
import { InsiderProfileClaim } from 'components/modules/ProfilePreferences/InsiderProfileClaim';
import { ProfilePreferencesSearch } from 'components/modules/ProfilePreferences/ProfilePreferencesSearch';
import { useGenesisKeyInsiderMerkleCheck } from 'hooks/merkle/useGenesisKeyInsiderMerkleCheck';
import { useInsiderReservedProfiles } from 'hooks/useInsiderReservedProfiles';
import { useMintedReservedProfileCount } from 'hooks/useMintedReservedProfileCount';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { tw } from 'utils/tw';

const keySplash = 'https://cdn.nft.com/key_splash2.png';

export default function ProfilePreferencesPage() {
  const { reservedProfiles } = useInsiderReservedProfiles();
  const { address: currentAddress } = useAccount();
  const { data: ownedGKs, loading: loadingOwnedGKs } = useOwnedGenesisKeyTokens(currentAddress ?? null);
  const insiderMerkleData = useGenesisKeyInsiderMerkleCheck(currentAddress);
  const { mintedReservedProfileCount, loading: loadingReservedCount } = useMintedReservedProfileCount();
  const showInsiderReservedProfiles =
    insiderMerkleData != null &&
    ownedGKs?.length >= 1 &&
    (mintedReservedProfileCount ?? 2) < (reservedProfiles?.length || 2);

  const [firstLoaded, setFirstLoaded] = useState(false);

  useEffect(() => {
    if (!firstLoaded) {
      if (insiderMerkleData != null) {
        setFirstLoaded(
          !loadingOwnedGKs && !loadingReservedCount && mintedReservedProfileCount != null && ownedGKs != null
        );
      } else {
        setFirstLoaded(true);
      }
    }
  }, [firstLoaded, insiderMerkleData, loadingOwnedGKs, loadingReservedCount, ownedGKs, mintedReservedProfileCount]);

  return (
    <div
      className={tw(
        'relative flex h-screen w-screen flex-col items-center',
        'justify-center overflow-y-auto overflow-x-hidden'
      )}
    >
      <Image src={keySplash} className='h-full' alt='key Splash' layout='fill' objectFit='contain' />
      <div
        className={tw(
          'absolute z-20 flex h-full w-full flex-col items-center justify-center',
          'bg-black bg-opacity-80 backdrop-blur-sm backdrop-saturate-150 backdrop-filter'
        )}
      >
        <LoadedContainer loaded={firstLoaded}>
          {!currentAddress ? (
            <SignedOutView />
          ) : showInsiderReservedProfiles ? (
            <InsiderProfileClaim />
          ) : (
            <ProfilePreferencesSearch />
          )}
        </LoadedContainer>
      </div>
    </div>
  );
}

ProfilePreferencesPage.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
