import { PROFILE_URI_LENGTH_LIMIT } from 'constants/misc';
import { MaxProfiles } from 'constants/typechain';
import { ProfileStatus } from 'graphql/generated/types';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useProfileAuctionSigner } from 'hooks/contracts/useProfileAuctionSigner';
import { useClaimableProfileCount } from 'hooks/useClaimableProfileCount';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useProfileBlocked } from 'hooks/useProfileBlocked';
import { useGetProfileClaimHash } from 'hooks/useProfileClaimHash';
import { useSupportedNetwork } from 'hooks/useSupportedNetwork';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { BidStatusIcon } from './BidStatusIcon';
import { Button, ButtonType } from './Button';
import { LoadedContainer } from './LoadedContainer';
import Loader from './Loader';
import { NetworkErrorTile } from './NetworkErrorTile';

import { SwitchHorizontalIcon } from '@heroicons/react/solid';
import { useCallback, useEffect, useState } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount } from 'wagmi';

export const ProfileMinter = () => {
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [currentURI, setCurrentURI] = useState('');
  const [minting, setMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [nextTokenIdWithClaimable, setNextTokenIdWithClaimable] = useState(null);
  const [claimableIndex, setClaimableIndex] = useState(0);

  const { isSupported } = useSupportedNetwork();
  const { data: account } = useAccount();
  const { inputBorder, alwaysBlack } = useThemeColors();
  const {
    profileTokenId,
    mutate: mutateTokenId,
    loading: loadingTokenId
  } = useProfileTokenQuery(currentURI);
  const { profileTokens, mutate: mutateMyProfileTokens } = useMyNftProfileTokens();
  const {
    claimable,
    totalClaimable,
    mutate: mutateClaimableProfileCount,
    loading: loadingClaimable
  } = useClaimableProfileCount(account?.address);
  const publicClaimSigner = useProfileAuctionSigner();
  const { blocked: currentURIBlocked } = useProfileBlocked(currentURI, true);
  const { profileClaimHash, mutate: mutateProfileHash } = useGetProfileClaimHash(currentURI);

  useEffect(() => {
    const allClaimableIds = (claimable ?? [])
      .filter(maybeClaimable => maybeClaimable?.claimable > 0)
      .map(maybeClaimable => maybeClaimable.tokenId)
      .sort();
    const nextClaimableToken = claimableIndex < allClaimableIds?.length ?
      allClaimableIds[claimableIndex] :
      allClaimableIds[0];
    setNextTokenIdWithClaimable(nextClaimableToken);
    if (claimableIndex >= allClaimableIds?.length) {
      setClaimableIndex(0);
    }
  }, [claimable, claimableIndex]);

  useEffect(() => {
    if (!firstLoaded) {
      setFirstLoaded(
        !loadingTokenId &&
        !loadingClaimable &&
        claimable != null
      );
    }
  }, [firstLoaded, claimable, loadingClaimable, loadingTokenId]);

  const getProfileStatus = useCallback(() => {
    if (isNullOrEmpty(currentURI)) {
      return null;
    }
    if (currentURIBlocked) {
      return ProfileStatus.Owned;
    }
    return profileTokenId == null ? ProfileStatus.Available : ProfileStatus.Owned;
  }, [currentURI, currentURIBlocked, profileTokenId]);

  const isProfileUnavailable = useCallback(() => {
    if (currentURIBlocked) {
      return true;
    }
    const status = getProfileStatus();
    return status != null && status === ProfileStatus.Owned;
  }, [currentURIBlocked, getProfileStatus]);

  if (account && !isSupported ) {
    return <div className='mb-12'>
      <NetworkErrorTile />
    </div>;
  }
  return (
    <LoadedContainer loaded={firstLoaded}>
      <div className="flex flex-col items-center h-full" >
        <span className={tw(
          'my-8 text-center text-primary-txt-dk'
        )}>
          {totalClaimable}&nbsp;
         Profile{totalClaimable !== 1 ? 's': ''} Available to mint
        </span>
        {mintSuccess || totalClaimable === 0 ?
          <span className={tw('text-2xl my-8 text-center text-primary-txt-dk')}>
            done
          </span>
          :
          <>
            <div className={tw(
              'w-full mb-4 flex items-center justify-center',
            )}>
              <span className={tw(
                'text-lg font-medium text-primary-txt-dk font-rubik normal-case text-center'
              )}>
                Use Key: {nextTokenIdWithClaimable}
              </span>
              {claimable?.length > 1 && <SwitchHorizontalIcon
                color="white"
                className="cursor-pointer ml-2 h-5"
                onClick={() => {
                  setClaimableIndex(claimableIndex + 1);
                }}
              />}
            </div>
            <div className="relative w-full flex items-center">
              <div className={tw(
                'left-0 pl-4 flex font-bold text-black',
                'rounded-l-lg bg-white py-3 text-lg'
              )}>
                NFT.com/
              </div>
              <input
                className={tw(
                  'text-lg min-w-0',
                  'text-left px-3 py-3 w-full rounded-r-lg font-medium'
                )}
                placeholder="What should we call you?"
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
                style={{
                  borderColor: inputBorder,
                  color: alwaysBlack,
                }}
              />
              <div className='absolute right-0 flex pointer-events-none pr-4'>
                {loadingTokenId
                  ? <Loader />
                  : <BidStatusIcon
                    whiteBackgroundOverride
                    status={getProfileStatus()}
                    isOwner={profileTokens?.map(token => token?.tokenUri?.raw?.split('/').pop()).includes(currentURI)}
                  />}
              </div>
            </div>
            <div className={tw(
              'my-8 uppercase font-hero-heading1 font-extrabold tracking-wide',
              'flex items-center flex-col',
              minting ? 'opacity-50' : ''
            )}>
              <Button
                type={ButtonType.PRIMARY}
                color={alwaysBlack}
                loadingText={'Minting...'}
                loading={minting}
                label={'Mint Your Profile'}
                onClick={async () => {
                  if (
                    minting ||
                    isProfileUnavailable() ||
                    isNullOrEmpty(currentURI) ||
                    loadingTokenId
                  ) {
                    return;
                  }
                  if (nextTokenIdWithClaimable == null || isNullOrEmpty(currentURI)) {
                    return;
                  }
                  
                  try {
                    const tx = await (await publicClaimSigner as MaxProfiles).publicClaim(
                      currentURI,
                      profileClaimHash?.hash,
                      profileClaimHash?.signature,
                    );
                    setMinting(true);

                    if (tx) {
                      await tx.wait(1);
                      setMintSuccess(true);
                      mutateMyProfileTokens();
                    }
                    mutateProfileHash();
                    setMinting(false);
                    mutateTokenId();
                    mutateClaimableProfileCount();
                  } catch (err) {
                    setMinting(false);
                  }
                }}
              />
            </div>
          </>}
      </div>
    </LoadedContainer>
  );
};
  