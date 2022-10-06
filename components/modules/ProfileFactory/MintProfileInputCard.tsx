import { DropdownPicker } from 'components/elements/DropdownPicker';
import { ProfileStatus } from 'graphql/generated/types';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useFreeMintAvailable } from 'hooks/state/useFreeMintAvailable';
import { useClaimableProfileCount } from 'hooks/useClaimableProfileCount';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useProfileBlocked } from 'hooks/useProfileBlocked';
import { filterDuplicates, filterNulls, isNullOrEmpty } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { filterValidListings } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import MintProfileInputField from './MintProfileInputField';

import Link from 'next/link';
import ETHIcon from 'public/eth_icon.svg';
import { useCallback, useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { useAccount } from 'wagmi';

type MintProfileInputCardProps = {
  currentURI: string;
  setCurrentURI: (URI: string) => void;
  setMintModalOpen: (isOpen: boolean) => void;
  minting: boolean;
  setMinting: (isMinting: boolean) => void;
};

export default function MintProfileInputCard({ currentURI, setCurrentURI, setMintModalOpen, minting, setMinting }: MintProfileInputCardProps) {
  const { address: currentAddress } = useAccount();
  const [claimableIndex, setClaimableIndex] = useState(0);
  const [nextTokenIdWithClaimable, setNextTokenIdWithClaimable] = useState(null);
  const [gkOptions, setGKOptions] = useState(null);
  const [selectedGK, setSelectedGK] = useState(null);
  const [inputCount, setInputCount] = useState(1);

  const defaultChainId = useDefaultChainId();
  const { blocked: currentURIBlocked } = useProfileBlocked(currentURI, true);
  const { profileTokenId,loading: loadingTokenId } = useProfileTokenQuery(currentURI);
  const { freeMintAvailable } = useFreeMintAvailable(currentAddress);
  const { claimable } = useClaimableProfileCount(currentAddress);
  const { data: nft } = useNftQuery(getAddress('nftProfile', defaultChainId), profileTokenId?._hex);

  const listings = filterDuplicates(
    filterValidListings(nft?.listings?.items),
    (first, second) => first.order?.protocol === second.order?.protocol
  );

  const getProfileStatus = useCallback(() => {
    if (isNullOrEmpty(currentURI)) {
      return null;
    }
    if (currentURIBlocked) {
      return ProfileStatus.Owned;
    }
    return profileTokenId == null ? ProfileStatus.Available : nft?.listings?.items?.length ? ProfileStatus.Listed : ProfileStatus.Owned;
  }, [currentURI, currentURIBlocked, profileTokenId, nft]);

  useEffect(() => {
    setInputCount(1);
  }, [selectedGK]);

  const getGKOptions = useCallback(() => {
    const gks = [];
    claimable && claimable.map((key) => {
      gks.push({
        label: `Genesis Key #${key?.tokenId}`,
        onSelect: () => null,
      });
    });
    setGKOptions(gks);
  }, [claimable]);

  const setActiveGK = useCallback((tokenId) => {
    const id = tokenId?.split('#')[1];
    const gk = claimable?.find((key) => {
      return key.tokenId === Number(id);
    });
    setSelectedGK(gk);
  }, [claimable]);

  const isProfileUnavailable = useCallback(() => {
    if (currentURIBlocked) {
      return true;
    }
    const status = getProfileStatus();
    return status != null && status === ProfileStatus.Owned;
  }, [currentURIBlocked, getProfileStatus]);

  useEffect(() => {
    const allClaimableIds = (claimable ?? [])
      .filter(maybeClaimable => maybeClaimable?.claimable > 0)
      .map(maybeClaimable => maybeClaimable.tokenId)
      .sort();
    const nextClaimableToken = claimableIndex < allClaimableIds?.length ?
      allClaimableIds[claimableIndex] :
      allClaimableIds[0];
    setNextTokenIdWithClaimable(nextClaimableToken);
    getGKOptions();
    if (claimableIndex >= allClaimableIds?.length) {
      setClaimableIndex(0);
    }
  }, [claimable, claimableIndex, getGKOptions]);
  
  return (
    <div className='relative mt-28 minlg:mt-12 z-50 px-5'>
      <div className='max-w-[600px] mx-auto bg-white rounded-[20px] pt-6 minmd:pt-[64px] px-4 minmd:px-12 minlg:px-[76px] pb-10 font-medium'>
        <h2 className='text-[32px] w-5/6'>Claim your free NFT Profile</h2>
        {freeMintAvailable ? <p className='mt-6 text-xl w-5/6'>Every wallet receives one <span className='text-secondary-yellow'>free mint!</span></p> : null}
        {!freeMintAvailable && !claimable ? <p className='mt-6 text-xl w-5/6'>You have already received one free mint</p> : null}
        {!freeMintAvailable && claimable ? <p className='mt-6 text-xl w-5/6'>Genesis Key holders receive <span className='text-secondary-yellow'>four free mints!</span></p> : null}
        
        {
          [...Array(inputCount)].map((i) =>
            <MintProfileInputField
              key={i}
              listings={listings}
              currentURI={currentURI}
              minting={minting}
              setCurrentURI={setCurrentURI}
              loadingTokenId={loadingTokenId}
              getProfileStatus={getProfileStatus}
            />)
        }
        
        {!freeMintAvailable && claimable && gkOptions &&
          <div className='flex justify-between items-center'>
            <div>
              <DropdownPicker
                onChange={setActiveGK}
                selectedIndex={0}
                options={filterNulls(
                  gkOptions
                )}
              />
            </div>

            {inputCount <= 4 && selectedGK?.claimable > 0 && selectedGK?.claimable - inputCount !== 0 ? <p className='hover:cursor-pointer' onClick={() => setInputCount(inputCount + 1)}>Add NFT Profile</p> : null}
          
          </div>
        }
            
        <div className='mt-12 minlg:mt-[59px]'>
          {!freeMintAvailable && !claimable &&
              <p className="text-[#5B5B5B] text-center mb-3">
                Transaction fee {' '}<span className='text-black font-medium text-lg inline-flex items-center'> 0.1000<ETHIcon className='inline ml-1' stroke="black" /></span>
              </p>
          }

          {
            !freeMintAvailable && claimable &&
            <p className="text-[#5B5B5B] text-center mb-3 font-normal">
              {selectedGK?.claimable < 3 ? `Minted ${4 - selectedGK?.claimable} ` : `Minting ${inputCount} `}
              out of 4 free NFT Profiles
            </p>
          }
          {!listings?.length ?
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
                isProfileUnavailable() ||
                isNullOrEmpty(currentURI)}
              onClick={async () => {
                if (
                  minting ||
                  isProfileUnavailable() ||
                  isNullOrEmpty(currentURI) ||
                  loadingTokenId
                ) {
                  return;
                }
                if (nextTokenIdWithClaimable == null && !freeMintAvailable || isNullOrEmpty(currentURI)) {
                  return;
                }
                setMinting(true);
                setMintModalOpen(true);
              }}
            >
              {minting ? <ReactLoading type='spin' color='#707070' height={28} width={28} /> : <span>Mint your NFT profile</span>}
            </button>
            :
            <Link href={`/app/nft/0x98ca78e89Dd1aBE48A53dEe5799F24cC1A462F2D/${profileTokenId?.toNumber()}`}>
              <button
                type="button"
                className={tw(
                  'inline-flex w-full justify-center',
                  'rounded-xl border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E]',
                  'px-4 py-4 text-lg font-medium text-black',
                  'focus:outline-none focus-visible:bg-[#E4BA18]',
                  'disabled:bg-[#D5D5D5] disabled:text-[#7C7C7C]'
                )}
                
              >
                    View NFT.com listing
              </button>
            </Link>
          }
              
        </div>
        <p className='text-[#727272] text-left minlg:text-center mt-4 text-xl minlg:text-base font-normal'>
            Already have an account? <span className='text-black block minlg:inline font-medium'>Sign in</span>
        </p>
      </div>
    </div>
  );
}
    