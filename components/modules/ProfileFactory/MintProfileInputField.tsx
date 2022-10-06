import { BidStatusIcon } from 'components/elements/BidStatusIcon';
import Loader from 'components/elements/Loader';
import { PROFILE_URI_LENGTH_LIMIT } from 'constants/misc';
import { ProfileStatus } from 'graphql/generated/types';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { ExternalProtocol } from 'types';
import { tw } from 'utils/tw';

import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import { useCallback } from 'react';

type MintProfileInputFieldProps = {
  listings: any[];
  currentURI: string;
  setCurrentURI: (URI: string) => void
  minting: boolean;
  loadingTokenId: boolean;
  getProfileStatus: () => any;
};

export default function MintProfileInputField({ listings, currentURI, minting, setCurrentURI, loadingTokenId, getProfileStatus }: MintProfileInputFieldProps) {
  const { profileTokens } = useMyNftProfileTokens();

  const getProfileStatusText = useCallback((profileStatus, isOwner) => {
    switch (profileStatus) {
    case ProfileStatus.Available:
      return (
        <p className='text-[#2AAE47]'>Great! Profile name is available :)</p>
      );
    case ProfileStatus.Pending:
      return (
        <p>Pending Claim</p>
      );
    case ProfileStatus.Owned:
      return isOwner
        ? (
          <p className='text-[#2AAE47]'>You are the owner!</p>
        )
        : (
          <p className='text-[#F02D21]'>Sorry, profile name unavailable</p>
        );
    case ProfileStatus.Listed:
      return isOwner
        ? (
          <p className='text-[#2AAE47]'>You are the owner!</p>
        )
        :
        (
          listings.length === 2
            ? <p className='font-normal flex items-center justify-center'>
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
            <p className='font-normal flex items-center justify-center'>
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
  return (
    <>
      <div className="relative w-full flex items-center mt-6 mb-3">
        <div className={tw(
          'left-0 pl-4 flex font-bold text-black',
          'rounded-l-lg bg-white py-3 text-lg',
          'bg-[#F8F8F8]'
        )}>
      NFT.com/
        </div>
        <input
          className={tw(
            'text-lg min-w-0 ProfileNameInput',
            'text-left px-3 py-3 w-full rounded-r-lg font-medium',
            'bg-[#F8F8F8]'
          )}
          placeholder="Enter Profile Name"
          autoFocus={true}
          value={currentURI ?? ''}
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
              setCurrentURI(e.target.value.toLowerCase());
            } else {
              e.preventDefault();
            }
          }}
        />
        <div className='absolute right-0 flex pointer-events-none pr-4 deprecated_sm:right-8'>
          {loadingTokenId
            ? <Loader />
            : <BidStatusIcon
              whiteBackgroundOverride
              status={getProfileStatus()}
              isOwner={profileTokens?.map(token => token?.tokenUri?.raw?.split('/').pop()).includes(currentURI)}
            />}
        </div>
      </div>
        
      {getProfileStatusText(getProfileStatus(), profileTokens?.map(token => token?.tokenUri?.raw?.split('/').pop()).includes(currentURI))}
    </>
  );
}
    