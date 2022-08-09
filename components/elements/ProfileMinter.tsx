import { PROFILE_URI_LENGTH_LIMIT } from 'constants/misc';
import { ProfileStatus } from 'graphql/generated/types';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useMaxProfilesSigner } from 'hooks/contracts/useMaxProfilesSigner';
import { useFreeMintAvailable } from 'hooks/state/useFreeMintAvailable';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useProfileBlocked } from 'hooks/useProfileBlocked';
import { useGetProfileClaimHash } from 'hooks/useProfileClaimHash';
import { useSupportedNetwork } from 'hooks/useSupportedNetwork';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { BidStatusIcon } from './BidStatusIcon';
import { Button, ButtonType } from './Button';
import Loader from './Loader';
import { NetworkErrorTile } from './NetworkErrorTile';

import { useCallback, useState } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount } from 'wagmi';

export const ProfileMinter = () => {
  const [currentURI, setCurrentURI] = useState('');
  const [minting, setMinting] = useState(false);
  const [, setMintSuccess] = useState(false);

  const { isSupported } = useSupportedNetwork();
  const { address: currentAddress } = useAccount();
  const { inputBorder, alwaysBlack } = useThemeColors();
  const {
    profileTokenId,
    mutate: mutateTokenId,
    loading: loadingTokenId
  } = useProfileTokenQuery(currentURI);
  const { profileTokens, mutate: mutateMyProfileTokens } = useMyNftProfileTokens();
  const { freeMintAvailable, mutate: mutateFreeMintStatus } = useFreeMintAvailable(currentAddress);
  const maxProfilesSigner = useMaxProfilesSigner();
  const { blocked: currentURIBlocked } = useProfileBlocked(currentURI, true);
  const { profileClaimHash, mutate: mutateProfileHash } = useGetProfileClaimHash(currentURI);

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

  if (currentAddress && !isSupported ) {
    return <div className='mb-12'>
      <NetworkErrorTile />
    </div>;
  }
  return (
    <div className="flex flex-col items-center h-full" >
      <div className={tw(
        'w-full mb-4 flex items-center justify-center',
      )}>
        <span className={tw(
          'text-lg font-medium text-primary-txt-dk font-rubik normal-case text-center'
        )}>
                Free Mints available: {freeMintAvailable ? 'yes' : 'no'}
        </span>
      </div>
      <div className="relative w-full flex items-center">
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
            if (freeMintAvailable || isNullOrEmpty(currentURI)) {
              return;
            }
                  
            try {
              const tx = await (await (maxProfilesSigner)).publicClaim(
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
              mutateFreeMintStatus();
            } catch (err) {
              setMinting(false);
            }
          }}
        />
      </div>
    </div>
  );
};
  