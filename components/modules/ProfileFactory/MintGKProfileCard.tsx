import { DropdownPicker } from 'components/elements/DropdownPicker';
import { LoadedContainer } from 'components/elements/LoadedContainer';
import { RoundedCornerAmount, RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useProfilesMintedByGKQuery } from 'graphql/hooks/useProfilesMintedByGK';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useClaimableProfileCount } from 'hooks/useClaimableProfileCount';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { useGetProfileClaimHash } from 'hooks/useProfileClaimHash';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { tw } from 'utils/tw';

import MintProfileInputField from './MintProfileInputField';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { CheckCircle } from 'phosphor-react';
import { useCallback, useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { useAccount, useNetwork } from 'wagmi';

type MintGKProfileCardProps = {
  minting: boolean;
  setModalOpen: (open: boolean) => void;
  setMintingState: (mintingInput: {inputs: any[], type: string, tokenId: string}) => void;
};

export default function MintGKProfileCard({ setModalOpen, setMintingState, minting }: MintGKProfileCardProps) {
  const [currentValue, setCurrentValue] = useState(null);
  const [profileStatus, setProfileStatus] = useState('');
  const [selectedGK, setSelectedGK] = useState(null);
  const { openConnectModal } = useConnectModal();
  const defaultChainId = useDefaultChainId();
  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const { loading: loadingGKTokens } = useOwnedGenesisKeyTokens(currentAddress);
  const { claimable, loading: loadingClaimable } = useClaimableProfileCount(currentAddress);
  const { data: mintedProfiles, loading: loadingMintedProfiles } = useProfilesMintedByGKQuery(selectedGK?.tokenId.toString(), defaultChainId);
  const { profileClaimHash } = useGetProfileClaimHash(currentValue && currentValue[0]);
  const { profileTokenId } = useProfileTokenQuery(currentValue && currentValue[0]);
  const { data: nft } = useNftQuery(getAddress('nftProfile', defaultChainId), profileTokenId?._hex);
  const resetInputs = useCallback(() => {
    const inputArr = [];
    Array.from(Array(4).keys()).map((_, i) => {
      inputArr.push({
        name: `input${i}`,
        isVisible: i === 0 ? true : false,
        status: null,
        profileURI: null,
        hash: null,
        signature: null
      });
    });

    return inputArr;
  }, []);
  const [inputs, setInputs] = useState(resetInputs());
  const index = currentValue && inputs.findIndex(x => x.name === currentValue[1]);
  const filteredInputs = inputs.filter(input => !Object.values(input).includes(null));
  const inputCount = inputs.filter(input => {return input.isVisible;})?.length || 0;

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(
        !loadingMintedProfiles &&
        !loadingClaimable &&
        !loadingMintedProfiles &&
        !loadingGKTokens &&
        claimable != null
      );
    }
  }, [isLoaded, loadingClaimable, loadingMintedProfiles, claimable, loadingGKTokens]);

  useEffect(() => {
    if(isNullOrEmpty(currentValue)){
      return;
    }
    if(currentValue[0] === '') {
      setInputs(prevState => prevState.map(item => {
        if (item.name === currentValue[1]) {
          return {
            ...item,
            isVisible: inputCount > 1 ? false : true,
            profileURI: null,
            hash: null,
            signature: null,
            status: null
          };
        }
        return item;
      }));
      setCurrentValue([]);
    } else {
      setInputs(prevState => prevState.map(item => {
        if (item.name === currentValue[1]) {
          return {
            ...item,
            status: profileStatus,
            profileURI: currentValue[0],
            hash: profileClaimHash?.hash,
            signature: profileClaimHash?.signature
          };
        }
        return item;
      }));
    }
  }, [currentValue, profileClaimHash, profileStatus, index, inputCount]);

  useEffect(() => {
    setProfileStatus(profileTokenId ? nft?.listings?.totalItems > 0 ? 'Listed' : 'Owned' : 'Available');
  }, [profileTokenId, currentValue, nft]);

  const setInputVisible = useCallback(() => {
    const found = inputs.find(element => !element.isVisible);
    setInputs(prevState => prevState.map(item => {
      if (item.name === found.name) {
        return {
          ...item,
          isVisible: true
        };
      }
      return item;
    }));
  }, [inputs]);

  const getGKOptions = useCallback(() => {
    const gks = [];
    claimable && claimable.map((key) => {
      gks.push({
        label: `Genesis Key #${key?.tokenId}`,
        onSelect: () => null,
      });
    });
    return gks;
  }, [claimable]);

  useEffect(() => {
    setInputs(resetInputs());
  }, [selectedGK, resetInputs, chain?.id]);

  const setActiveGK = useCallback((tokenId) => {
    const id = tokenId?.split('#')[1];
    const gk = claimable?.find((key) => {
      return key.tokenId === Number(id);
    });
    setSelectedGK(gk);
  }, [claimable, setSelectedGK]);
  
  return (
    <div className='relative mt-16 minlg:mt-12 z-50 px-5'>
      <div className='max-w-[600px] mx-auto bg-white rounded-[20px] pt-6 minmd:pt-[64px] px-4 minmd:px-12 minlg:px-[76px] pb-10 font-medium'>
        
        <h2 className='text-[32px] font-medium'>Claim your free NFT Profile</h2>
        <p className='mt-9 text-xl font-normal'>Genesis Key holders receive <span className='font-bold text-transparent bg-text-gradient bg-clip-text'>four free mints!</span></p>
        <LoadedContainer newLoader fitToParent loaded={isLoaded}>
          {currentAddress && claimable?.length === 0 &&
          <div className='flex flex-col justify-center items-center'>
            <p className='text-red-500 mt-10 mb-2'>No Genesis Key detected for mint.</p>
            <div className='flex flex-col items-center'>
              <Link href='/app/auctions'>
                <button
                  type="button"
                  className={tw(
                    'inline-flex w-max justify-center ml-2',
                    'rounded-xl border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E]',
                    'px-4 py-2 text-lg font-medium text-black',
                    'focus:outline-none focus-visible:bg-[#E4BA18]'
                  )}
                >
                  Buy Genesis Key
                </button>
              </Link>
              <Link href='/'>
                <p className='mt-2 hover:cursor-pointer'>Return to home</p>
              </Link>
            </div>
          </div>
          }
        
          <div className='mt-9'>

            {!currentAddress &&
          <div className='flex justify-center'>
            <button
              onClick={openConnectModal}
              type="button"
              className={tw(
                'inline-flex w-max justify-center ml-2',
                'rounded-xl border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E]',
                'px-4 py-2 text-lg font-medium text-black',
                'focus:outline-none focus-visible:bg-[#E4BA18]'
              )}
            >
              Connect Wallet
            </button>
          </div>
            }

            {currentAddress && mintedProfiles && !loadingMintedProfiles && mintedProfiles?.profilesMintedByGK.map((profile) =>
              <Link key={profile.url} href={`/${profile.url}`}>
                <div className='h-14 flex justify-between items-center bg-[#FCE795] rounded-xl px-4 py-2 mb-4 hover:cursor-pointer' key={profile.url}>
                  <div className='flex flex-row items-center gap-[14px]'>
                    <RoundedCornerMedia
                      extraClasses='mr-[14px]'
                      containerClasses='h-10 w-10'
                      src={profile.photoURL}
                      variant={RoundedCornerVariant.All}
                      height={40}
                      width={40}
                      amount={RoundedCornerAmount.Medium}
                    />
                    <p>{profile.url}</p>
                  </div>
                  <CheckCircle size={28} color="black" weight="fill" />
                </div>
              </Link>
            )}

            {loadingMintedProfiles && currentAddress &&
            <>
              <div className='h-14 flex justify-between items-center bg-gray-300 animate-pulse rounded-xl px-4 py-2 mb-4'></div>
              <div className='h-14 flex justify-between items-center bg-gray-300 animate-pulse rounded-xl px-4 py-2 mb-4'></div>
              <div className='h-14 flex justify-between items-center bg-gray-300 animate-pulse rounded-xl px-4 py-2 mb-4'></div>
              <div className='h-14 flex justify-between items-center bg-gray-300 animate-pulse rounded-xl px-4 py-2 mb-4'></div>
            </>
            }
            {
              currentAddress && inputs.map((input, i) => {
                if (input.isVisible && selectedGK && selectedGK?.claimable > 0){
                  return <MintProfileInputField
                    key={i}
                    minting={minting}
                    setGKProfile={setCurrentValue}
                    name={input.name}
                    type='GK'
                  />;
                }
              })
            }
          </div>
        
          {!isNullOrEmpty(claimable) &&
          <div className='flex justify-between items-center'>
            <div>
              <DropdownPicker
                onChange={setActiveGK}
                selectedIndex={0}
                options={filterNulls(
                  getGKOptions()
                )}
                showKeyIcon
              />
            </div>
            {inputCount <= 4 && selectedGK?.claimable > 0 && selectedGK?.claimable - inputCount !== 0 ? <p className='hover:cursor-pointer' onClick={() => setInputVisible()}>Add NFT Profile</p> : null}
          </div>
          }
            
          <div className='mt-12 minlg:mt-[59px]'>
            {
              !isNullOrEmpty(claimable) &&
            <p className="text-[#5B5B5B] text-center mb-3 font-normal">
              {selectedGK?.claimable <= 3 ? `Minted ${4 - selectedGK?.claimable} ` : `Minting ${inputCount} `}
              out of 4 free NFT Profiles
            </p>
            }

            {claimable && claimable.length ?
              <button
                type="button"
                className={tw(
                  'inline-flex w-full justify-center',
                  'rounded-xl border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E]',
                  'px-4 py-4 text-lg font-medium text-black',
                  'focus:outline-none focus-visible:bg-[#E4BA18]',
                  'disabled:bg-[#D5D5D5] disabled:text-[#7C7C7C]'
                )}
                disabled={
                  inputs.some(item => item.status === 'Owned') ||
                inputs.some(item => item.isVisible === true && item.profileURI === null) ||
                isNullOrEmpty(inputs) ||
                inputs.some(item => item.profileURI === '') ||
                isNullOrEmpty(filteredInputs) ||
                filteredInputs.some(item => item.profileURI === undefined)
                }
                onClick={async () => {
                  if (
                    minting
                  ) {
                    return;
                  }
                  setModalOpen(true);
                  setMintingState({
                    inputs: filteredInputs,
                    type: 'GK',
                    tokenId: selectedGK?.tokenId
                  });
                }}
              >
                {minting ? <ReactLoading type='spin' color='#707070' height={28} width={28} /> : <span>Mint your NFT profile</span>}
              </button>
              : null
            }
              
          </div>
          <Link href='https://docs.nft.com/nft-profiles/what-is-a-nft-profile' passHref className='mt-4'>
            <a target="_blank" >
              <p className='text-[#727272] text-left minlg:text-center mt-4 text-xl minlg:text-base font-normal'>
            Learn more about <span className='text-black inline font-medium'>NFT Profiles</span>
              </p>
            </a>
          </Link>
        </LoadedContainer>
      </div>
    </div>
  );
}
    