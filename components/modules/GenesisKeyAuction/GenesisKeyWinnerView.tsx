import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { BigNumber } from 'ethers';
import { useAccount, useSigner } from 'wagmi';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { LoadedContainer } from 'components/elements/Loader/LoadedContainer';
import { KeyClaimVideo } from 'components/modules/GenesisKeyAuction/KeyClaimVideo';
import { HeroTitle } from 'components/modules/Hero/HeroTitle';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { MerkleResult } from 'hooks/merkle/useGenesisKeyInsiderMerkleCheck';
import { useKeyBackground } from 'hooks/state/useKeyBackground';
import { useKeyVideo } from 'hooks/state/useKeyVideo';
import { useGenesisKeyMetadata } from 'hooks/useGenesisKeyMetadata';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { processIPFSURL } from 'utils/ipfs';
import { tw } from 'utils/tw';

import { AuctionType } from './GenesisKeyAuction';
import { GenesisKeyPostClaimView } from './GenesisKeyPostClaimView';

export interface GenesisKeyWinnerViewProps {
  /**
   * TODO: support displaying multiple GKs in this component.
   */
  ownedTokenID: number;
  /**
   * This should be non-null if we want the user to claim a GK in this component.
   */
  claimData: null;
  /**
   * This should be non-null if we want the insider to claim a GK in this component.
   * This uses a different claiming function.
   */
  insiderClaimData: MerkleResult | null;
  liveAuction: AuctionType;
  onBack?: () => void;
}

export function GenesisKeyWinnerView(props: GenesisKeyWinnerViewProps) {
  const { genesisKeyTeamDistributor } = useAllContracts();
  const { address: currentAddress } = useAccount();
  const { data: signer } = useSigner();
  const { keyVideoVisible: showVideo, useKeyVideoToggle: playKeyVideo } = useKeyVideo();
  const { setKeyBackground } = useKeyBackground();
  const genesisKeyMetadata = useGenesisKeyMetadata(
    props.ownedTokenID != null ? BigNumber.from(props.ownedTokenID) : null
  );

  const genesisKeyImage = processIPFSURL(
    isMobile ? genesisKeyMetadata?.metadata?.image : genesisKeyMetadata?.metadata?.animation_url
  );

  const { mutate: mutateOwnedGKs } = useOwnedGenesisKeyTokens(currentAddress);

  const [showPostClaimView, setShowPostClaimView] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mintSucceeded, setMintSucceeded] = useState(props.ownedTokenID != null);
  const [fadeInPostClaimContent, setFadeInPostClaimContent] = useState(false);

  useEffect(() => {
    setMintSucceeded(props.ownedTokenID != null);
  }, [props.ownedTokenID]);

  useEffect(() => {
    if (genesisKeyImage && genesisKeyMetadata) {
      const bgColorAttribute = genesisKeyMetadata?.metadata?.attributes?.find(
        attr => attr?.trait_type === 'Background'
      );
      setKeyBackground(genesisKeyImage, bgColorAttribute?.value === 'Dark' ? 'black' : 'white');
    }
  }, [genesisKeyImage, genesisKeyMetadata, setKeyBackground, props.ownedTokenID]);

  useEffect(() => {
    if (mintSucceeded && !showVideo) {
      setTimeout(() => {
        setFadeInPostClaimContent(true);
      }, 3000);
    }
  }, [showVideo, mintSucceeded]);

  const getMintSuccessView = useCallback(() => {
    return (
      <div className={tw('flex flex-col items-center')}>
        <HeroTitle color='white' items={['CONGRATULATIONS!']} />
        <div
          className={tw(
            'flex flex-col rounded-xl deprecated_sm:border-none',
            'w-[600px] px-10 drop-shadow deprecated_sm:w-full',
            'mt-8 bg-always-black bg-opacity-60',
            'items-center justify-center'
          )}
        >
          <span className='py-4 text-center text-2xl text-primary-txt-dk'>
            {props.ownedTokenID != null ? `You own Genesis Key #${props.ownedTokenID}` : 'You won a Genesis Key!'}
          </span>
          {(mintSucceeded || props.ownedTokenID != null) && (
            <div className='my-3 flex w-full items-center justify-center'>
              <div
                className={tw('shadow-md hover:shadow-lg focus:shadow-lg', 'w-full space-y-5 font-bold tracking-wider')}
              >
                <Button
                  size={ButtonSize.LARGE}
                  stretch
                  onClick={() => {
                    // todo: include a link to the metadata api for rendering card previews.
                    window.open(
                      `https://twitter.com/intent/tweet?` +
                        // 'url=' + encodeURIComponent(window.location.href) + props.id +
                        // 'url=' + encodeURIComponent('https://staging-api.nft.com/gk/') + props.id +
                        // '&'+
                        `text=${encodeURIComponent(
                          `I just claimed a genesis key from NFT.com! Check it out: ` +
                            `https://${window.location.host}/app/gallery/${props.ownedTokenID}`
                        )}`,
                      '_blank'
                    );
                  }}
                  label='TWEET YOUR KEY'
                  type={ButtonType.PRIMARY}
                />
                <div
                  className={tw(
                    'text-base font-semibold deprecated_sm:text-xs',
                    'mt-5 flex cursor-pointer flex-row items-center hover:underline',
                    'flex w-full cursor-pointer justify-center text-action-primary'
                  )}
                  onClick={() => {
                    setKeyBackground('', 'black');
                    setShowPostClaimView(true);
                  }}
                >
                  Continue
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }, [mintSucceeded, props.ownedTokenID, setKeyBackground]);

  return (
    <>
      <div className='flex flex-col'>
        <div className={tw('flex items-center', 'dark z-20 mb-10 mt-20 deprecated_sm:px-4')}>
          <KeyClaimVideo />
          {showPostClaimView ? (
            <GenesisKeyPostClaimView
              onBack={() => {
                setShowPostClaimView(false);
                props.onBack && props.onBack();
              }}
            />
          ) : (
            <div className='flex w-full flex-col items-center'>
              <>
                {mintSucceeded || props.ownedTokenID != null ? (
                  <LoadedContainer loaded={fadeInPostClaimContent} durationSec={2} showLoader={false}>
                    {getMintSuccessView()}
                  </LoadedContainer>
                ) : (
                  <>
                    {props.claimData != null && (
                      <>
                        <div className='flex w-full flex-col items-center'>
                          <HeroTitle color='black' items={['WELCOME TO']} />
                          <HeroTitle color='black' items={['A NEW KIND']} />
                          <HeroTitle color='black' items={['OF PLATFORM']} />
                        </div>
                        <span
                          className={tw(
                            'mt-5 flex w-full flex-col items-center text-3xl deprecated_sm:text-xl',
                            'max-w-2xl text-center text-primary-txt'
                          )}
                        >
                          Congratulations! It is time for you to mint your Genesis Key, and become a leader of this
                          community led ecosystem!
                        </span>
                      </>
                    )}
                  </>
                )}
              </>
              {props.insiderClaimData != null && props.ownedTokenID == null && !mintSucceeded && (
                <div
                  className={tw(
                    'mt-12 flex w-full flex-col',
                    'items-center justify-center',
                    'font-hero-heading1 font-extrabold uppercase tracking-wide'
                  )}
                >
                  <div className='mb-12'>
                    <HeroTitle color='black' items={['Thank you for ']} />
                    <HeroTitle color='black' items={['supporting']} />
                    <HeroTitle color='black' items={['nft.com']} />
                  </div>
                  <span className={tw('font-rubik mb-10 text-lg normal-case', 'text-center text-primary-txt')}>
                    Click the button below to claim your Genesis Key.
                  </span>
                  <Button
                    type={ButtonType.PRIMARY}
                    size={ButtonSize.LARGE}
                    label='Claim your key'
                    disabled={mintSucceeded || submitting}
                    loading={submitting}
                    loadingText={'Claiming...'}
                    onClick={async () => {
                      try {
                        const result = await genesisKeyTeamDistributor
                          .connect(signer)
                          .claim(
                            props.insiderClaimData.index,
                            currentAddress,
                            BigNumber.from(props.insiderClaimData.amount),
                            props.insiderClaimData.proof,
                            {
                              value: BigNumber.from(0)
                            }
                          );

                        setSubmitting(true);

                        if (result) {
                          await result.wait(1);
                          playKeyVideo();
                          mutateOwnedGKs();
                          setMintSucceeded(true);
                        }
                        setSubmitting(false);
                      } catch (err) {
                        setSubmitting(false);
                      }
                    }}
                  />
                </div>
              )}
              {!mintSucceeded && (
                <span
                  className={tw(
                    'max-w-xl items-center text-center text-xs',
                    'my-5 w-full items-center',
                    'text-primary-txt'
                  )}
                >
                  There are gas fees associated with claiming your Genesis Key. By clicking the {'"'}Claim Your Key{'"'}{' '}
                  button, you agree to our{' '}
                  <span
                    onClick={() => {
                      window.open('https://cdn.nft.com/nft_com_terms_of_service.pdf', '_open');
                    }}
                    className='cursor-pointer text-link hover:underline'
                  >
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span
                    onClick={() => {
                      window.open('https://cdn.nft.com/nft_com_privacy_policy.pdf', '_open');
                    }}
                    className='cursor-pointer text-link hover:underline'
                  >
                    Privacy Policy
                  </span>
                  . Your Genesis Key will allow you to mint four (4) profile names. Certain profile names may be
                  unavailable for claiming. Users are prohibited from selecting a profile name that violates the rights
                  of any third party (including any trademark rights), that impersonates a third party, or that is
                  otherwise misleading or a breach of our{' '}
                  <span
                    onClick={() => {
                      window.open('https://cdn.nft.com/nft_com_terms_of_service.pdf', '_open');
                    }}
                    className='cursor-pointer text-link hover:underline'
                  >
                    Terms of Service
                  </span>
                  .
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
