import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { tw } from 'utils/tw';

import { HeroSidebarGenesisKey } from './HeroSidebarGenesisKey';
import { HeroSidebarProfile } from './HeroSidebarProfile';

import { BigNumber } from 'ethers';
import { motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import { ChevronsUp } from 'react-feather';
import { useAccount } from 'wagmi';

export function HeroSidebarProfiles() {
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const { address: currentAddress } = useAccount();
  const { data: ownedGenesisKeyTokens } = useOwnedGenesisKeyTokens(currentAddress);

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
      myOwnedProfileTokens :
      myOwnedProfileTokens?.slice(0, 3) ?? [];
  }, [myOwnedProfileTokens, showMoreProfiles]);

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
              tokenId={BigNumber.from(ownedGKToken?.id?.tokenId).toNumber()}
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
        profilesToShow?.map((profileToken, index) => {
          const shortURI = profileToken?.tokenUri?.raw?.split('/').pop();
          return (
            <HeroSidebarProfile
              uri={shortURI}
              key={profileToken?.tokenUri?.raw ?? 1000 + index}
              onShowMore={
                profilesToShow?.length < myOwnedProfileTokens?.length &&
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
    myOwnedProfileTokens?.length,
    ownedGenesisKeyTokens?.length,
    profilesToShow,
    showMoreGKs,
    showMoreProfiles
  ]);

  return (
    <>
      {((myOwnedProfileTokens ?? []).length > 0 ||
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
          height: showMoreGKs || showMoreProfiles || (ownedGenesisKeyTokens?.length ?? []) < 3
            ? 'auto' :
            collapsed ?
              0 :
              (16 * 4 * // height of a tile
                (2.5 /* currentAddress for extra spacing */ +
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