import { Button, ButtonType } from 'components/elements/Button';
import { LoadedContainer } from 'components/elements/LoadedContainer';
import { HeroTitle } from 'components/modules/Hero/HeroTitle';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useProfileAuctionSigner } from 'hooks/contracts/useProfileAuctionSigner';
import { useInsiderReservedProfiles } from 'hooks/useInsiderReservedProfiles';
import { useMintedReservedProfileCount } from 'hooks/useMintedReservedProfileCount';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { useGetProfileClaimHash } from 'hooks/useProfileClaimHash';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useCallback, useEffect, useState } from 'react';
import { ExternalLink } from 'styles/theme/Components';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount } from 'wagmi';

export function InsiderProfileClaim() {
  const { data: account } = useAccount();
  const { nftProfile } = useAllContracts();
  const profileAuctionSigner = useProfileAuctionSigner();
  const { alwaysBlack, link } = useThemeColors();
  const { mutate: mutateMyProfileTokens } = useMyNftProfileTokens();
  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(account?.address);
  const { reservedProfiles } = useInsiderReservedProfiles();
  
  const [minting, setMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(null);
  const [selectedReservedProfile, setSelectedReservedProfile] = useState(null);
  const [firstReservedProfileMinted, setFirstReservedProfileMinted] = useState(false);
  const [secondReservedProfileMinted, setSecondReservedProfileMinted] = useState(false);
  const [mutateMintedStatusFlag, setMutateMintedStatusFlag] = useState(0);
  const [loadedMintedState, setLoadedMintedState] = useState(false);
  const { mutate: mutateMintedReservedProfileCount } = useMintedReservedProfileCount();

  const { profileClaimHash, mutate: mutateProfileHash } = useGetProfileClaimHash(selectedReservedProfile);

  const mintProfile = useCallback((profileURIToMint: string) => {
    (async () => {
      try {
        const tx = await (await profileAuctionSigner).genesisKeyClaimProfile(
          profileURIToMint,
          ownedGKTokens?.[0],
          account?.address,
          profileClaimHash?.hash,
          profileClaimHash?.signature
        );
        setMinting(true);
        if (tx) {
          await tx.wait(1);
          setMintSuccess(profileURIToMint);
        }
        
        setMutateMintedStatusFlag(mutateMintedStatusFlag + 1);
        mutateMyProfileTokens();
        mutateProfileHash();
        setMinting(false);
      } catch (err) {
        setMinting(false);
      }
    })();
  }, [
    profileAuctionSigner,
    ownedGKTokens,
    account,
    profileClaimHash?.hash,
    profileClaimHash?.signature,
    mutateMintedStatusFlag,
    mutateMyProfileTokens,
    mutateProfileHash
  ]);

  useEffect(() => {
    (async () => {
      await Promise.all([
        nftProfile.profileOwner(reservedProfiles?.[0])
          .then(() => {
            setFirstReservedProfileMinted(true);
          }).catch(() => {
            setFirstReservedProfileMinted(false);
          }),
        nftProfile.profileOwner(reservedProfiles?.[1])
          .then(() => {
            setSecondReservedProfileMinted(true);
          }).catch(() => {
            setSecondReservedProfileMinted(false);
          }),
      ]);
      setLoadedMintedState(true);
    })();
  }, [nftProfile, mutateMintedStatusFlag, reservedProfiles]);

  const getContent = useCallback(() => {
    if (mintSuccess != null) {
      return (
        <div className='flex flex-col items-center mb-16'>
          <div className='my-16'>
            <HeroTitle items={['WELCOME']} />
          </div>
          <span className="text-xl mb-16 text-center text-secondary-txt">
            You officially own the Profile:
          </span>
          <span className="text-4xl deprecated_md:text-2xl deprecated_sm:text-lg mb-16 text-primary-txt-dk">
            NFT.com/{selectedReservedProfile}
          </span>
          <Button
            label={'NEXT'}
            color={alwaysBlack}
            onClick={() => {
              mutateMintedReservedProfileCount();
              setMintSuccess(null);
            }}
            type={ButtonType.PRIMARY}
          />
        </div>
      );
    }
  
    if (firstReservedProfileMinted && secondReservedProfileMinted) {
      return (
        <div className='flex flex-col items-center'>
          <div className='my-16'>
            <HeroTitle items={['ALL PROFILES']} />
            <HeroTitle items={['MINTED']} />
          </div>
          <span className='text-primary-txt-dk text-center max-w-lg mt-8 text-2xl'>
            You{'\''}re all done with Profile Minting!
          </span>
          <span className='text-primary-txt-dk text-center max-w-lg mt-2 text-lg mb-20'>
            Head to the <span className='font-bold'>#collab-land</span> channel on{' '}
            our <ExternalLink href='http://nft.com/discord' style={{ color: link }}>
              Discord
            </ExternalLink> and verify your wallet with {' '}
            the <span className='font-bold'>Collab.land</span> bot to receive access to {' '}
            exclusive channels.
          </span>
        </div>
      );
    }
  
    return (
      <div className="flex flex-col items-center mt-16 deprecated_sm:w-full" >
        <div className='my-16'>
          <HeroTitle items={['WELCOME TO THE']} />
          <HeroTitle items={['DIGITAL RENAISSANCE']} />
        </div>
        <span className="text-lg deprecated_md:text-base deprecated_sm:text-sm mb-4 text-primary-txt-dk">
          Please check your wallet in our sidebar to ensure you have received your key.
        </span>
        <span className="text-base deprecated_sm:text-sm mb-4 text-primary-txt-dk">
          Your profile reservations are ready. Select one of your profiles to mint:
        </span>
        <div className='flex w-full justify-center mb-8'>
          <div className={tw(
            'flex items-center rounded-xl p-4 w-2/5 cursor-pointer',
            'bg-modal-overlay-dk border border-accent-border-dk mr-5'
          )}
          onClick={() => {
            if (!firstReservedProfileMinted) {
              setSelectedReservedProfile(reservedProfiles?.[0]);
            }
          }}
          >
            <input
              className='mr-4'
              type="radio"
              disabled={firstReservedProfileMinted}
              checked={selectedReservedProfile === reservedProfiles?.[0] ||
                  firstReservedProfileMinted}
              onChange={() => null}
            />
            <div className='flex flex-col w-[90%]'>
              <div className="flex justify-between items-center">
                <span className='text-secondary-txt text-base'>
                  NFT.com/
                </span>
                {firstReservedProfileMinted && <span className='text-primary-green text-sm'>
                  MINTED!
                </span>}
              </div>
              <span className='text-primary-txt-dk font-bold text-2xl'>
                {reservedProfiles?.[0]}
              </span>
            </div>
          </div>
          <div className={tw(
            'flex rounded-xl p-4 w-2/5 cursor-pointer items-center',
            'bg-modal-overlay-dk border border-accent-border-dk'
          )}
          onClick={() => {
            if (!secondReservedProfileMinted) {
              setSelectedReservedProfile(reservedProfiles?.[1]);
            }
          }}
          >
            <input
              className='mr-4'
              type="radio"
              disabled={secondReservedProfileMinted}
              checked={selectedReservedProfile === reservedProfiles?.[1] ||
                  secondReservedProfileMinted}
              onChange={() => null}
            />
            <div className='flex flex-col w-[90%]'>
              <div className="flex justify-between items-center">
                <span className='text-secondary-txt text-base'>
                  NFT.com/
                </span>
                {secondReservedProfileMinted && <span className='text-primary-green text-sm'>
                  MINTED!
                </span>}
              </div>
              <span className='text-primary-txt-dk font-bold text-2xl'>
                {reservedProfiles?.[1]}
              </span>
            </div>
          </div>
        </div>
        <span className={tw(
          'font-hero-heading1 uppercase',
          minting ? 'opacity-50' : ''
        )}>
          <Button
            label={'Mint Your Profile'}
            color={alwaysBlack}
            loading={minting}
            disabled={isNullOrEmpty(selectedReservedProfile)}
            loadingText={'Minting'}
            onClick={() => {
              if (minting || selectedReservedProfile == null) {
                return;
              }
              mintProfile(selectedReservedProfile);
            }}
            type={ButtonType.PRIMARY}
          />
        </span>
        <span className={tw(
          'text-base text-primary-txt-dk font-rubik normal-case mt-8 text-center max-w-lg'
        )}>
          By clicking Mint Your Profile, I have read, understood, and agree to the {' '}
          <span
            onClick={() => {
              window.open(
                'https://cdn.nft.com/nft_com_terms_of_service.pdf',
                '_open'
              );
            }}
            className='cursor-pointer hover:underline hover:text-link'
          >
            Terms of Service.
          </span>
        </span>
      </div>
    );
  }, [
    alwaysBlack,
    firstReservedProfileMinted,
    link,
    mintProfile,
    mintSuccess,
    minting,
    reservedProfiles,
    secondReservedProfileMinted,
    selectedReservedProfile,
    mutateMintedReservedProfileCount
  ]);
  return <LoadedContainer loaded={loadedMintedState}>
    {getContent()}
  </LoadedContainer>;
}