import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { LoadedContainer } from 'components/elements/Loader/LoadedContainer';
import { HeroTitle } from 'components/modules/Hero/HeroTitle';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useProfileAuctionSigner } from 'hooks/contracts/useProfileAuctionSigner';
import { useInsiderReservedProfiles } from 'hooks/useInsiderReservedProfiles';
import { useMintedReservedProfileCount } from 'hooks/useMintedReservedProfileCount';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { useGetProfileClaimHash } from 'hooks/useProfileClaimHash';
import { isNullOrEmpty } from 'utils/format';
import { tw } from 'utils/tw';

import { ExternalLink } from 'styles/theme/Components';
import { useThemeColors } from 'styles/theme/useThemeColors';

export function InsiderProfileClaim() {
  const { address: currentAddress } = useAccount();
  const { nftProfile } = useAllContracts();
  const profileAuctionSigner = useProfileAuctionSigner();
  const { link } = useThemeColors();
  const { mutate: mutateMyProfileTokens } = useMyNftProfileTokens();
  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(currentAddress);
  const { reservedProfiles } = useInsiderReservedProfiles();

  const [minting, setMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(null);
  const [selectedReservedProfile, setSelectedReservedProfile] = useState(null);
  const [firstReservedProfileMinted, setFirstReservedProfileMinted] = useState(false);
  const [secondReservedProfileMinted, setSecondReservedProfileMinted] = useState(false);
  const [thirdReservedProfileMinted, setThirdReservedProfileMinted] = useState(false);
  const [fourthReservedProfileMinted, setFourthReservedProfileMinted] = useState(false);
  const [mutateMintedStatusFlag, setMutateMintedStatusFlag] = useState(0);
  const [loadedMintedState, setLoadedMintedState] = useState(false);
  const { mutate: mutateMintedReservedProfileCount } = useMintedReservedProfileCount();

  const { profileClaimHash, mutate: mutateProfileHash } = useGetProfileClaimHash(selectedReservedProfile);

  const mintProfile = useCallback(
    (profileURIToMint: string) => {
      (async () => {
        try {
          const tx = await profileAuctionSigner.genesisKeyBatchClaimProfile([
            {
              profileUrl: profileURIToMint,
              tokenId: ownedGKTokens?.[0]?.id?.tokenId,
              recipient: currentAddress,
              hash: profileClaimHash.hash,
              signature: profileClaimHash.signature
            }
          ]);
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
    },
    [
      profileAuctionSigner,
      ownedGKTokens,
      currentAddress,
      profileClaimHash?.hash,
      profileClaimHash?.signature,
      mutateMintedStatusFlag,
      mutateMyProfileTokens,
      mutateProfileHash
    ]
  );

  useEffect(() => {
    (async () => {
      await Promise.all([
        nftProfile
          .profileOwner(reservedProfiles?.[0])
          .then(() => {
            setFirstReservedProfileMinted(true);
          })
          .catch(() => {
            setFirstReservedProfileMinted(false);
          }),
        nftProfile
          .profileOwner(reservedProfiles?.[1])
          .then(() => {
            setSecondReservedProfileMinted(true);
          })
          .catch(() => {
            setSecondReservedProfileMinted(false);
          }),
        nftProfile
          .profileOwner(reservedProfiles?.[2])
          .then(() => {
            setThirdReservedProfileMinted(true);
          })
          .catch(() => {
            setThirdReservedProfileMinted(false);
          }),
        nftProfile
          .profileOwner(reservedProfiles?.[3])
          .then(() => {
            setFourthReservedProfileMinted(true);
          })
          .catch(() => {
            setFourthReservedProfileMinted(false);
          })
      ]);
      setLoadedMintedState(true);
    })();
  }, [nftProfile, mutateMintedStatusFlag, reservedProfiles]);

  const getContent = useCallback(() => {
    if (mintSuccess != null) {
      return (
        <div className='mb-16 flex flex-col items-center'>
          <div className='my-16'>
            <HeroTitle items={['WELCOME']} />
          </div>
          <span className='mb-16 text-center text-xl text-secondary-txt'>You officially own the Profile:</span>
          <span className='mb-16 text-4xl text-primary-txt-dk deprecated_md:text-2xl deprecated_sm:text-lg'>
            NFT.com/{selectedReservedProfile}
          </span>
          <Button
            label={'NEXT'}
            size={ButtonSize.LARGE}
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
          <span className='mt-8 max-w-lg text-center text-2xl text-primary-txt-dk'>
            You{"'"}re all done with Profile Minting!
          </span>
          <span className='mb-20 mt-2 max-w-lg text-center text-lg text-primary-txt-dk'>
            Head to the <span className='font-bold'>#collab-land</span> channel on our{' '}
            <ExternalLink href='http://nft.com/discord' style={{ color: link }}>
              Discord
            </ExternalLink>{' '}
            and verify your wallet with the <span className='font-bold'>Collab.land</span> bot to receive access to{' '}
            exclusive channels.
          </span>
        </div>
      );
    }

    return (
      <div className='mt-16 flex flex-col items-center deprecated_sm:w-full'>
        <div className='my-16'>
          <HeroTitle items={['WELCOME TO THE']} />
          <HeroTitle items={['DIGITAL RENAISSANCE']} />
        </div>
        <span className='mb-4 text-lg text-primary-txt-dk deprecated_md:text-base deprecated_sm:text-sm'>
          Please check your wallet in our sidebar to ensure you have received your key.
        </span>
        <span className='mb-4 text-base text-primary-txt-dk deprecated_sm:text-sm'>
          Your profile reservations are ready. Select one of your profiles to mint:
        </span>
        <div className='mb-8 flex w-full justify-center'>
          {reservedProfiles.map((profile, index) => {
            const reservedProfileMinted =
              index === 0
                ? firstReservedProfileMinted
                : index === 1
                ? secondReservedProfileMinted
                : index === 2
                ? thirdReservedProfileMinted
                : index === 3
                ? fourthReservedProfileMinted
                : false;

            return (
              <div
                key={index}
                className={tw(
                  'flex w-2/5 cursor-pointer items-center rounded-xl p-4',
                  'mr-5 border border-accent-border-dk bg-modal-overlay-dk'
                )}
                onClick={() => {
                  if (!reservedProfileMinted) {
                    setSelectedReservedProfile(profile);
                  }
                }}
              >
                <input
                  className='mr-4'
                  type='radio'
                  disabled={reservedProfileMinted}
                  checked={selectedReservedProfile === profile || reservedProfileMinted}
                  onChange={() => null}
                />
                <div className='flex w-[90%] flex-col'>
                  <div className='flex items-center justify-between'>
                    <span className='text-base text-secondary-txt'>NFT.com/</span>
                    {reservedProfileMinted && <span className='text-sm text-primary-green'>MINTED!</span>}
                  </div>
                  <span className='text-2xl font-bold text-primary-txt-dk'>{profile}</span>
                </div>
              </div>
            );
          })}
        </div>
        <span className={tw('font-hero-heading1 uppercase', minting ? 'opacity-50' : '')}>
          <Button
            label={'Mint Your Profile'}
            size={ButtonSize.LARGE}
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
    );
  }, [
    mintSuccess,
    firstReservedProfileMinted,
    secondReservedProfileMinted,
    reservedProfiles,
    minting,
    selectedReservedProfile,
    mutateMintedReservedProfileCount,
    link,
    thirdReservedProfileMinted,
    fourthReservedProfileMinted,
    mintProfile
  ]);
  return <LoadedContainer loaded={loadedMintedState}>{getContent()}</LoadedContainer>;
}
