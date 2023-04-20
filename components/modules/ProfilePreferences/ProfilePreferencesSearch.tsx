import { useCallback, useEffect, useState } from 'react';
import { SwitchHorizontalIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

import { BidStatusIcon } from 'components/elements/BidStatusIcon';
import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { LoadedContainer } from 'components/elements/Loader/LoadedContainer';
import Loader from 'components/elements/Loader/Loader';
import { NetworkErrorTile } from 'components/elements/NetworkErrorTile';
import { HeroTitle } from 'components/modules/Hero/HeroTitle';
import { PROFILE_URI_LENGTH_LIMIT } from 'constants/misc';
import { ProfileStatus } from 'graphql/generated/types';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useProfileAuctionSigner } from 'hooks/contracts/useProfileAuctionSigner';
import { useClaimableProfileCount } from 'hooks/useClaimableProfileCount';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useProfileBlocked } from 'hooks/useProfileBlocked';
import { useGetProfileClaimHash } from 'hooks/useProfileClaimHash';
import { useSupportedNetwork } from 'hooks/useSupportedNetwork';
import { useTotalGKPublicRemaining } from 'hooks/useTotalGKPublicRemaining';
import { isNullOrEmpty } from 'utils/format';
import { getAddress } from 'utils/httpHooks';
import { tw } from 'utils/tw';

import { useThemeColors } from 'styles/theme/useThemeColors';

export function ProfilePreferencesSearch() {
  const defaultChainId = useDefaultChainId();
  const [currentURI, setCurrentURI] = useState('');
  const [minting, setMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [nextTokenIdWithClaimable, setNextTokenIdWithClaimable] = useState(null);
  const [claimableIndex, setClaimableIndex] = useState(0);

  const router = useRouter();
  const { isSupported } = useSupportedNetwork();
  const { address: currentAddress } = useAccount();
  const { inputBorder, alwaysBlack, link } = useThemeColors();
  const { profileTokenId, mutate: mutateTokenId, loading: loadingTokenId } = useProfileTokenQuery(currentURI);
  const { profileTokens, mutate: mutateMyProfileTokens } = useMyNftProfileTokens();
  const {
    claimable,
    totalClaimable,
    mutate: mutateClaimableProfileCount,
    loading: loadingClaimable
  } = useClaimableProfileCount(currentAddress);
  const profileAuctionSigner = useProfileAuctionSigner();

  const { blocked: currentURIBlocked } = useProfileBlocked(currentURI, true);
  const { profileClaimHash, mutate: mutateProfileHash } = useGetProfileClaimHash(currentURI);
  const { totalRemaining } = useTotalGKPublicRemaining();

  useEffect(() => {
    const allClaimableIds = (claimable ?? [])
      .filter(maybeClaimable => maybeClaimable?.claimable > 0)
      .map(maybeClaimable => maybeClaimable.tokenId)
      .sort();
    const nextClaimableToken =
      claimableIndex < allClaimableIds?.length ? allClaimableIds[claimableIndex] : allClaimableIds[0];
    setNextTokenIdWithClaimable(nextClaimableToken);
    if (claimableIndex >= allClaimableIds?.length) {
      setClaimableIndex(0);
    }
  }, [claimable, claimableIndex]);

  const [firstLoaded, setFirstLoaded] = useState(false);
  useEffect(() => {
    if (!firstLoaded) {
      setFirstLoaded(!loadingTokenId && !loadingClaimable && claimable != null);
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

  const allDoneText = useCallback(() => {
    return (
      <>
        <div className='my-4 flex max-w-xl flex-col text-center text-xl text-primary-txt-dk'>
          <span>Looking to get a NFT Profile?</span>
          <span>Purchase a Genesis Key and mint four (4) NFT Profiles</span>

          {totalRemaining?.gt(0) && (
            <div
              className={tw(
                'mt-4 flex justify-center pb-8 deprecated_sm:w-screen',
                'font-hero-heading1 font-extrabold uppercase tracking-wide'
              )}
            >
              <Button
                type={ButtonType.PRIMARY}
                size={ButtonSize.LARGE}
                label='Purchase Genesis Key'
                onClick={() => {
                  router.push(`/app/collection/${getAddress('genesisKey', defaultChainId)}`);
                }}
              />
            </div>
          )}

          <span>
            If you have a Genesis Key, head to the <span className='font-bold'>#collab-land</span> channel on our{' '}
            <span
              style={{ color: link }}
              className='cursor-pointer hover:underline'
              onClick={() => {
                window.open('https://nft.com/discord', '_blank');
              }}
            >
              Discord
            </span>{' '}
            and verify your wallet with the <span className='font-bold'>Collab.land</span> bot to receive access to{' '}
            exclusive channels.
          </span>
        </div>
        <div
          className={tw(
            'flex justify-center pb-8 deprecated_sm:w-screen',
            'font-hero-heading1 font-extrabold uppercase tracking-wide'
          )}
        >
          <Button
            type={ButtonType.PRIMARY}
            size={ButtonSize.LARGE}
            label='GO TO DISCORD'
            onClick={() => {
              window.open('https://nft.com/discord', '_blank');
            }}
          />
        </div>
      </>
    );
  }, [link, router, totalRemaining, defaultChainId]);

  const getNonSearchView = useCallback(() => {
    if (currentAddress && !isSupported) {
      return (
        <div className='mb-12'>
          <NetworkErrorTile />
        </div>
      );
    }
    if (!isNullOrEmpty(currentURI)) {
      return (
        <>
          <div className='mb-4'>
            <HeroTitle color='white' items={['WELCOME']} />
          </div>
          <span className='mb-16 text-center text-4xl text-primary-txt-dk'>{currentURI}</span>
          <span className='mb-2 text-center text-xl' style={{ color: 'white' }}>
            You officially own:
          </span>
          <span className='mb-16 text-2xl deprecated_md:text-lg' style={{ color: 'white' }}>
            NFT.com/{currentURI}
          </span>
          {totalClaimable > 0 ? (
            <>
              <span className='mb-4 max-w-2xl text-center text-lg text-white'>
                It looks like you{"'"}ve got another profile to mint. Feel free to mint now or anytime you connect your
                wallet to NFT.com
              </span>
              <div
                className={tw(
                  'flex justify-center pb-16 deprecated_sm:w-screen',
                  'font-hero-heading1 font-extrabold uppercase tracking-wide'
                )}
              >
                <Button
                  type={ButtonType.PRIMARY}
                  size={ButtonSize.LARGE}
                  label='MINT ANOTHER PROFILE'
                  onClick={() => {
                    setCurrentURI('');
                    setMintSuccess(false);
                  }}
                />
              </div>
            </>
          ) : (
            allDoneText()
          )}
        </>
      );
    }
    if (totalClaimable === 0) {
      return <>{allDoneText()}</>;
    }
  }, [currentAddress, allDoneText, isSupported, currentURI, totalClaimable]);

  return (
    <LoadedContainer loaded={firstLoaded}>
      <div className='flex h-full flex-col items-center deprecated_sm:w-full'>
        <span
          className={tw(
            'my-8 text-center text-2xl text-primary-txt-dk deprecated_md:text-lg deprecated_sm:mt-32 deprecated_sm:text-base'
          )}
        >
          {totalClaimable}&nbsp; Profile{totalClaimable !== 1 ? 's' : ''} Available to mint
        </span>
        {mintSuccess || totalClaimable === 0 ? (
          getNonSearchView()
        ) : (
          <>
            <div className='mb-8 mt-16'>
              <HeroTitle color='white' items={['CHOOSE YOUR']} />
              <HeroTitle color='white' items={['NFT.COM PROFILE']} />
            </div>
            <div className={tw('mb-4 flex w-full items-center justify-center')}>
              <span className={tw('font-rubik text-center text-lg font-medium normal-case text-primary-txt-dk')}>
                Use Key: {nextTokenIdWithClaimable}
              </span>
              {claimable?.length > 1 && (
                <SwitchHorizontalIcon
                  color='white'
                  className='ml-2 h-5 cursor-pointer'
                  onClick={() => {
                    setClaimableIndex(claimableIndex + 1);
                  }}
                />
              )}
            </div>
            <div className='relative flex w-full items-center deprecated_sm:px-8'>
              <div
                className={tw(
                  'left-0 flex pl-4 font-bold text-black deprecated_sm:right-8',
                  'rounded-l-lg bg-white py-3 text-lg'
                )}
              >
                NFT.com/
              </div>
              <input
                className={tw(
                  'ProfileNameInput min-w-0 text-lg',
                  'w-full rounded-r-lg px-3 py-3 text-left font-medium'
                )}
                placeholder='What should we call you?'
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
                  color: alwaysBlack
                }}
              />
              <div className='pointer-events-none absolute right-0 flex pr-4 deprecated_sm:right-8'>
                {loadingTokenId ? (
                  <Loader />
                ) : (
                  <BidStatusIcon
                    whiteBackgroundOverride
                    status={getProfileStatus()}
                    isOwner={profileTokens?.map(token => token?.tokenUri?.raw?.split('/').pop()).includes(currentURI)}
                  />
                )}
              </div>
            </div>
            <div
              className={tw(
                'font-hero-heading1 my-8 font-extrabold uppercase tracking-wide',
                'flex flex-col items-center',
                minting ? 'opacity-50' : ''
              )}
            >
              <Button
                type={ButtonType.PRIMARY}
                size={ButtonSize.LARGE}
                loadingText={'Minting...'}
                loading={minting}
                label={'Mint Your Profile'}
                onClick={async () => {
                  if (minting || isProfileUnavailable() || isNullOrEmpty(currentURI) || loadingTokenId) {
                    return;
                  }
                  if (nextTokenIdWithClaimable == null || isNullOrEmpty(currentURI)) {
                    return;
                  }
                  try {
                    const tx = await profileAuctionSigner.genesisKeyBatchClaimProfile([
                      {
                        profileUrl: currentURI,
                        tokenId: nextTokenIdWithClaimable,
                        recipient: currentAddress,
                        hash: profileClaimHash?.hash,
                        signature: profileClaimHash?.signature
                      }
                    ]);
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
              <span className={tw('font-rubik mt-8 max-w-lg text-center text-base normal-case text-primary-txt-dk')}>
                By clicking Mint Your Profile, I have read, understood, and agree to the{' '}
                <span
                  onClick={() => {
                    window.open('https://cdn.nft.com/nft_com_terms_of_service.pdf', '_open');
                  }}
                  className='cursor-pointer hover:text-link hover:underline'
                >
                  Terms of Service.
                </span>
              </span>
            </div>
          </>
        )}
      </div>
    </LoadedContainer>
  );
}
