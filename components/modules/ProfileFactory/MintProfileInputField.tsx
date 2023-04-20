import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';

import { BidStatusIcon } from 'components/elements/BidStatusIcon';
import Loader from 'components/elements/Loader/Loader';
import { getAddressForChain, nftProfile } from 'constants/contracts';
import { PROFILE_URI_LENGTH_LIMIT } from 'constants/misc';
import { ProfileStatus } from 'graphql/generated/types';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useProfileBlocked } from 'hooks/useProfileBlocked';
import { filterDuplicates, isNullOrEmpty } from 'utils/format';
import { getAddress } from 'utils/httpHooks';
import { getLooksrareAssetPageUrl } from 'utils/looksrareHelpers';
import { filterValidListings } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import { ExternalProtocol } from 'types';

import LooksrareIcon from 'public/icons/looksrare-icon.svg?svgr';
import OpenseaIcon from 'public/icons/opensea-icon.svg?svgr';

type MintProfileInputFieldProps = {
  setGKProfile?: (input: string[]) => void;
  minting: boolean;
  name: string;
  setFreeProfile?: (value: string) => void;
  type: 'GK' | 'Free';
};

export default function MintProfileInputField({
  minting,
  setGKProfile,
  name,
  setFreeProfile,
  type
}: MintProfileInputFieldProps) {
  const [inputValue, setInputValue] = useState(undefined);
  const { profileTokens } = useMyNftProfileTokens();
  const defaultChainId = useDefaultChainId();
  const { blocked: currentURIBlocked } = useProfileBlocked(inputValue, true);
  const { profileTokenId, loading: loadingTokenId } = useProfileTokenQuery(inputValue);
  const { data: nft } = useNftQuery(getAddress('nftProfile', defaultChainId), profileTokenId?._hex);
  const [error, setError] = useState(null);

  const listings = filterDuplicates(
    filterValidListings(nft?.listings?.items),
    (first, second) => first.order?.protocol === second.order?.protocol
  );

  const getProfileStatus = useCallback(() => {
    if (isNullOrEmpty(inputValue)) {
      return null;
    }
    if (currentURIBlocked) {
      return ProfileStatus.Owned;
    }
    return profileTokenId == null
      ? ProfileStatus.Available
      : nft?.listings?.items?.length
      ? 'Listed'
      : ProfileStatus.Owned;
  }, [inputValue, currentURIBlocked, profileTokenId, nft]);

  const getProfileStatusText = useCallback(
    (profileStatus, isOwner) => {
      switch (profileStatus) {
        case ProfileStatus.Available:
          return <p className='mb-3 text-[#2AAE47]'>Great! Profile name is available :)</p>;
        case ProfileStatus.Owned:
          return isOwner ? (
            <p className='mb-3 text-[#2AAE47]'>You are the owner!</p>
          ) : (
            <p className='mb-3 text-[#F02D21]'>Sorry, profile name unavailable</p>
          );
        case 'Listed':
          return isOwner ? (
            <p className='mb-3 text-[#2AAE47]'>You are the owner!</p>
          ) : listings?.length === 2 ? (
            <p className='mb-3 flex items-center justify-center font-normal'>
              This profile is available on
              <span className='mx-1 inline-flex items-center font-medium'>
                <LooksrareIcon
                  onClick={(e: MouseEvent<any>) => {
                    e.preventDefault();
                    window.open(
                      getLooksrareAssetPageUrl(
                        getAddressForChain(nftProfile, defaultChainId),
                        BigNumber.from(profileTokenId).toString()
                      ),
                      '_blank'
                    );
                    e.stopPropagation();
                  }}
                  className='relative mr-1 h-6 w-6 shrink-0 hover:cursor-pointer'
                  alt='Looksrare logo redirect'
                  layout='fill'
                />
                LooksRare
              </span>
              and
              <span className='mx-1 inline-flex items-center font-medium'>
                <OpenseaIcon className='relative mr-[3px] h-6 w-6 shrink-0' alt='Opensea logo redirect' layout='fill' />
                OpenSea
              </span>
            </p>
          ) : (
            <p className='mb-3 flex items-center justify-center font-normal'>
              This profile is available on
              {listings[0]?.order?.protocol === ExternalProtocol.Seaport ? (
                <span className='mx-1 inline-flex items-center font-medium'>
                  <OpenseaIcon className='relative mr-1 h-6 w-6 shrink-0' alt='Opensea logo redirect' layout='fill' />
                  OpenSea
                </span>
              ) : (
                <span className='mx-1 inline-flex items-center font-medium'>
                  <LooksrareIcon
                    onClick={(e: MouseEvent<any>) => {
                      e.preventDefault();
                      window.open(
                        getLooksrareAssetPageUrl(
                          getAddressForChain(nftProfile, defaultChainId),
                          BigNumber.from(profileTokenId).toString()
                        ),
                        '_blank'
                      );
                      e.stopPropagation();
                    }}
                    className='relative mr-1 h-6 w-6 shrink-0 hover:cursor-pointer'
                    alt='Looksrare logo redirect'
                    layout='fill'
                  />
                  LooksRare
                </span>
              )}
            </p>
          );
        default:
          return null;
      }
    },
    [defaultChainId, listings, profileTokenId]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (type === 'Free') {
        setFreeProfile(inputValue);
      } else {
        setGKProfile([inputValue, name]);
      }
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, name, type, setFreeProfile, setGKProfile]);

  return (
    <>
      <div className='relative mb-3 mt-4 flex w-full items-center'>
        <div className={tw('left-0 flex pl-4 font-bold text-black', 'rounded-l-lg py-3 text-lg', 'bg-[#F8F8F8]')}>
          NFT.com/
        </div>
        <input
          name={name}
          className={tw(
            'ProfileNameInput min-w-0 text-lg',
            'w-full rounded-r-lg px-3 py-3 text-left font-medium',
            'bg-[#F8F8F8]'
          )}
          placeholder='Enter Profile Name'
          autoFocus={true}
          value={inputValue}
          spellCheck={false}
          onChange={async e => {
            if (minting) {
              e.preventDefault();
            } else {
              const validReg = /^[a-z0-9_]*$/;
              if (validReg.test(e.target.value.toLowerCase()) && e.target.value?.length <= PROFILE_URI_LENGTH_LIMIT) {
                setInputValue(e.target.value.toLowerCase());
                setError(null);
              } else {
                setError('Special characters are not allowed');
                setTimeout(() => setError(null), 1000);
                e.preventDefault();
              }
            }
          }}
        />
        <div className='pointer-events-none absolute right-0 flex pr-4'>
          {loadingTokenId ? (
            <Loader />
          ) : (
            <BidStatusIcon
              whiteBackgroundOverride
              status={getProfileStatus()}
              isOwner={profileTokens?.map(token => token?.tokenUri?.raw?.split('/').pop()).includes(inputValue)}
            />
          )}
        </div>
      </div>

      {getProfileStatusText(
        getProfileStatus(),
        profileTokens?.map(token => token?.tokenUri?.raw?.split('/').pop()).includes(inputValue)
      )}
      {error && <p className='mb-3 text-[#F02D21]'>{error}</p>}
    </>
  );
}
