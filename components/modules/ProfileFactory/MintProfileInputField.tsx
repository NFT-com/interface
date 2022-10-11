import { BidStatusIcon } from 'components/elements/BidStatusIcon';
import Loader from 'components/elements/Loader';
import { PROFILE_URI_LENGTH_LIMIT } from 'constants/misc';
import { ProfileStatus } from 'graphql/generated/types';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useProfileBlocked } from 'hooks/useProfileBlocked';
import { ExternalProtocol } from 'types';
import { filterDuplicates, isNullOrEmpty } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { filterValidListings } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import { useCallback, useEffect, useState } from 'react';

type MintProfileInputFieldProps = {
  setGKProfile?: (input: string[]) => void
  minting: boolean;
  name: string;
  setFreeProfile?: (value: string) => void;
  type: 'GK' | 'Free'
};

export default function MintProfileInputField({ minting, setGKProfile, name, setFreeProfile, type }: MintProfileInputFieldProps) {
  const [inputValue, setInputValue] = useState(null);
  const { profileTokens } = useMyNftProfileTokens();
  const defaultChainId = useDefaultChainId();
  const { blocked: currentURIBlocked } = useProfileBlocked(inputValue, true);
  const { profileTokenId, loading: loadingTokenId } = useProfileTokenQuery(inputValue);
  const { data: nft } = useNftQuery(getAddress('nftProfile', defaultChainId), profileTokenId?._hex);

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
    return profileTokenId == null ? ProfileStatus.Available : nft?.listings?.items?.length ? 'Listed' : ProfileStatus.Owned;
  }, [inputValue, currentURIBlocked, profileTokenId, nft]);
  
  const getProfileStatusText = useCallback((profileStatus, isOwner) => {
    switch (profileStatus) {
    case ProfileStatus.Available:
      return (
        <p className='text-[#2AAE47] mb-3'>Great! Profile name is available :)</p>
      );
    case ProfileStatus.Pending:
      return (
        <p>Pending Claim</p>
      );
    case ProfileStatus.Owned:
      return isOwner
        ? (
          <p className='text-[#2AAE47] mb-3'>You are the owner!</p>
        )
        : (
          <p className='text-[#F02D21] mb-3'>Sorry, profile name unavailable</p>
        );
    case 'Listed':
      return isOwner
        ? (
          <p className='text-[#2AAE47] mb-3'>You are the owner!</p>
        )
        :
        (
          listings.length === 2
            ? <p className='font-normal flex items-center justify-center mb-3'>
                  This profile is available on
              <span className='font-medium inline-flex items-center mx-1'>
                <LooksrareIcon className='h-6 w-6 relative shrink-0 mr-1' alt="Opensea logo redirect" layout="fill"/>
                    LooksRare
              </span>
                  and
              <span className='font-medium inline-flex items-center mx-1'>
                <OpenseaIcon className='h-6 w-6 relative shrink-0 mr-[3px]' alt="Opensea logo redirect" layout="fill"/>
                    OpenSea
              </span>
            </p>
            :
            <p className='font-normal flex items-center justify-center mb-3'>
                  This profile is available on
              {listings[0]?.order?.protocol === ExternalProtocol.Seaport ?
                <span className='font-medium inline-flex items-center mx-1'>
                  <OpenseaIcon className='h-6 w-6 relative shrink-0 mr-1' alt="Opensea logo redirect" layout="fill"/>
                      OpenSea
                </span>
                :
                <span className='font-medium inline-flex items-center mx-1'>
                  <LooksrareIcon className='h-6 w-6 relative shrink-0 mr-1' alt="Opensea logo redirect" layout="fill"/>
                      LooksRare
                </span>
              }
            </p>
        );
    default:
      return null;
    }
  }, [listings]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if(type === 'Free'){
        setFreeProfile(inputValue);
      } else {
        setGKProfile([inputValue, name]);
      }
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, name, type, setFreeProfile, setGKProfile]);

  return (
    <>
      <div className="relative w-full flex items-center mt-4 mb-3">
        <div className={tw(
          'left-0 pl-4 flex font-bold text-black',
          'rounded-l-lg bg-white py-3 text-lg',
          'bg-[#F8F8F8]'
        )}>
      NFT.com/
        </div>
        <input
          name={name}
          className={tw(
            'text-lg min-w-0 ProfileNameInput',
            'text-left px-3 py-3 w-full rounded-r-lg font-medium',
            'bg-[#F8F8F8]'
          )}
          placeholder="Enter Profile Name"
          autoFocus={true}
          value={inputValue}
          spellCheck={false}
          onChange={async e => {
            if (minting) {
              e.preventDefault();
              return;
            }
            const validReg = /^[a-z0-9_]*$/;
            if (
              validReg.test(e.target.value.toLowerCase()) &&
                    e.target.value?.length <= PROFILE_URI_LENGTH_LIMIT
            ) {
              setInputValue(e.target.value);
            } else {
              e.preventDefault();
            }
          }}
        />
        <div className='absolute right-0 flex pointer-events-none pr-4'>
          {loadingTokenId
            ? <Loader />
            : <BidStatusIcon
              whiteBackgroundOverride
              status={getProfileStatus()}
              isOwner={profileTokens?.map(token => token?.tokenUri?.raw?.split('/').pop()).includes(inputValue)}
            />}
        </div>
      </div>
        
      {getProfileStatusText(getProfileStatus(), profileTokens?.map(token => token?.tokenUri?.raw?.split('/').pop()).includes(inputValue))}
    </>
  );
}
    