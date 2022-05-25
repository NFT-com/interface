import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { tw } from 'utils/tw';

import { HeroSidebarGenesisKey } from './HeroSidebarGenesisKey';
import { HeroSidebarProfile } from './HeroSidebarProfile';

import { motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import { ChevronsUp } from 'react-feather';
import { useAccount } from 'wagmi';

export function HeroSidebarProfiles() {
  const { profileUris: myOwnedProfileTokenUris } = useMyNftProfileTokens();
  const { data: account } = useAccount();
  const { data: ownedGenesisKeyTokens } = useOwnedGenesisKeyTokens(account?.address);

  const [collapsed, setCollapsed] = useState(false);
  const [showMoreGKs, setShowMoreGKs] = useState(false);
  const [showMoreProfiles, setShowMoreProfiles] = useState(false);

  const genesisKeysToShow = useMemo(() => {
    return showMoreGKs ?
      ownedGenesisKeyTokens :
      ownedGenesisKeyTokens?.slice(0, 3) ?? [];
  }, [ownedGenesisKeyTokens, showMoreGKs]);
  const profilesToShow = useMemo(() => {
    return showMoreProfiles ?
      myOwnedProfileTokenUris :
      myOwnedProfileTokenUris?.slice(0, 3) ?? [];
  }, [myOwnedProfileTokenUris, showMoreProfiles]);

  const getAssets = useCallback(() => {
    if (collapsed) {
      return null;
    }

    return <>
      {
        genesisKeysToShow?.map((ownedGKToken, index) => {
          return (
            <HeroSidebarGenesisKey
              key={index}
              tokenId={ownedGKToken}
              onShowMore={
                genesisKeysToShow?.length < ownedGenesisKeyTokens?.length &&
                !showMoreGKs &&
                index === 2 ?
                  () => setShowMoreGKs(true) :
                  null
              }
            />
          );
        })
      }
      {
        profilesToShow?.map((profileUri, index) => {
          const shortURI = profileUri.split('/').pop();
          return (
            <HeroSidebarProfile
              uri={shortURI}
              key={profileUri}
              onShowMore={
                profilesToShow?.length < myOwnedProfileTokenUris?.length &&
                !showMoreProfiles &&
                index === 2 ?
                  () => setShowMoreProfiles(true) :
                  null
              }
            />
          );
        })
      }
    </>;
  }, [
    collapsed,
    genesisKeysToShow,
    myOwnedProfileTokenUris?.length,
    ownedGenesisKeyTokens?.length,
    profilesToShow,
    showMoreGKs,
    showMoreProfiles
  ]);

  return (
    <>
      {((myOwnedProfileTokenUris ?? []).length > 0 ||
      (ownedGenesisKeyTokens ?? []).length > 0) &&
      <>
        <div className='mx-5 text-primary-txt-dk text-2xl mb-4 mt-2.5'>
          Assets
        </div>
        <div className='mx-5 text-gray-400 text-lg mb-4 mt-2.5 flex justify-between'>
          <span>NFT.com</span>
          <ChevronsUp
            onClick={() => {
              setCollapsed(!collapsed);
              setShowMoreGKs(false);
              setShowMoreProfiles(false);
            }}
            className={tw('cursor-pointer transition-transform', collapsed ? 'rotate-180' : '')}
          />
        </div>
      </>}
      <motion.div
        animate={{
          height: showMoreGKs || showMoreProfiles || (myOwnedProfileTokenUris?.length ?? []) < 3
            ? 'auto' :
            collapsed ?
              0 :
              (16 * 4 * // height of a tile
                (2.5 /* account for extra spacing */ +
                (genesisKeysToShow?.length ?? 0) + (profilesToShow?.length ?? 0)))
        }}
        transition={{ duration: 0.2 }}
        className={tw('w-full overflow-hidden')}
      >
        {getAssets()}
      </motion.div>
    </>
  );
}