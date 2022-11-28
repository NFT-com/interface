import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useGetProfileClaimHash } from 'hooks/useProfileClaimHash';
import { isNullOrEmpty } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { tw } from 'utils/tw';

import MintProfileInputField from './MintProfileInputField';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';

type MintFreeProfileCardProps = {
  minting: boolean;
  setModalOpen: (open: boolean) => void;
  setMintingState: (mintingInput: {inputs: any[], type: string, tokenId: string, registrationFee: string, duration: number}) => void;
};

export default function MintFreeProfileCard({ minting, setModalOpen, setMintingState }: MintFreeProfileCardProps ) {
  const [profileURI, setProfileURI] = useState(null);
  const [input, setInput] = useState([]);
  const [profileStatus, setProfileStatus] = useState('');
  const [hasListings, setHasListings] = useState(false);
  const { profileTokenId } = useProfileTokenQuery(profileURI || '');
  const defaultChainId = useDefaultChainId();
  const { data: nft } = useNftQuery(getAddress('nftProfile', defaultChainId), profileTokenId?._hex);
  const { profileClaimHash } = useGetProfileClaimHash(profileURI);

  useEffect(() => {
    if(profileStatus === 'Listed') {
      setHasListings(true);
    } else {
      setHasListings(false);
    }
    if(isNullOrEmpty(profileURI) || profileURI === ''){
      setInput([]);
    } else {
      setInput([{
        profileURI,
        profileStatus,
        type: 'input-Free',
        hash: profileClaimHash?.hash,
        signature: profileClaimHash?.signature
      }]);
    }
  }, [profileURI, profileStatus, profileClaimHash]);

  useEffect(() => {
    setProfileStatus(profileTokenId ? nft?.listings?.totalItems > 0 ? 'Listed' : 'Owned' : 'Available');
  }, [profileTokenId, nft]);
  
  return (
    <div className='relative mt-16 minlg:mt-12 z-50 px-5'>
      <div className='max-w-[600px] mx-auto bg-white rounded-[20px] pt-6 minmd:pt-[64px] px-4 minmd:px-12 minlg:px-[76px] pb-10 font-medium'>
        <h2 className='text-[32px] font-medium'>Claim your free NFT Profile</h2>

        <p className='mt-9 text-xl font-normal'>Every wallet receives <span className='font-bold text-transparent bg-gradient-to-r from-[#FAC213] to-[#FF9B37] bg-clip-text'>one free mint!</span></p>
        <p className='text-[#707070] font-normal mt-4 mb-2'>Create your NFT Profile to build your social identity</p>

        <MintProfileInputField
          minting={minting}
          setFreeProfile={setProfileURI}
          name={'input-Free'}
          type="Free"
        />
            
        <div className='mt-12 minlg:mt-[59px]'>
          {hasListings ?
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
            :
            <button
              type="button"
              className={tw(
                'inline-flex w-full justify-center',
                'rounded-xl border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E]',
                'px-4 py-4 text-lg font-medium text-black',
                'focus:outline-none focus-visible:bg-[#E4BA18]',
                'disabled:bg-[#D5D5D5] disabled:text-[#7C7C7C]'
              )}
              disabled={input.some(item => item.profileStatus === 'Owned') || isNullOrEmpty(input) || input.some(item => item.profileURI === '') }
              onClick={async () => {
                if (
                  minting
                ) {
                  return;
                }
                setModalOpen(true);
                setMintingState({
                  inputs: input,
                  type: 'Free',
                  tokenId: null,
                  registrationFee: null,
                  duration: null
                });
              }}
            >
              {minting ? <ReactLoading type='spin' color='#707070' height={28} width={28} /> : <span>Mint your NFT profile</span> }
            </button>
          }
              
        </div>
        <Link href='https://docs.nft.com/nft-profiles/what-is-a-nft-profile' passHref className='mt-4'>
          <a target="_blank" >
            <p className='text-[#727272] text-left minlg:text-center mt-4 text-xl minlg:text-base font-normal'>
            Learn more about <span className='text-black inline font-medium'>NFT Profiles</span>
            </p>
          </a>
        </Link>
      </div>
    </div>
  );
}
    