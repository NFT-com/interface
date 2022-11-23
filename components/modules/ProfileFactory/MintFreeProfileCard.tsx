import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useGetProfileClaimHash } from 'hooks/useProfileClaimHash';
import { isNullOrEmpty } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { tw } from 'utils/tw';

import MintProfileInputField from './MintProfileInputField';

import Link from 'next/link';
import { Info, MinusCircle, PlusCircle } from 'phosphor-react';
import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';

type MintFreeProfileCardProps = {
  type: 'Free' | 'Paid';
  minting: boolean;
  setModalOpen: (open: boolean) => void;
  setMintingState: (mintingInput: {inputs: any[], type: string, tokenId: string}) => void;
};

export default function MintFreeProfileCard({ type, minting, setModalOpen, setMintingState }: MintFreeProfileCardProps ) {
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
        type: `input-${type}`,
        hash: profileClaimHash?.hash,
        signature: profileClaimHash?.signature
      }]);
    }
  }, [profileURI, profileStatus, type, profileClaimHash]);

  useEffect(() => {
    setProfileStatus(profileTokenId ? nft?.listings?.totalItems > 0 ? 'Listed' : 'Owned' : 'Available');
  }, [profileTokenId, nft]);
  
  return (
    <div className='relative mt-16 minlg:mt-12 z-50 px-5'>
      <div className='max-w-[600px] mx-auto bg-white rounded-[20px] pt-6 minmd:pt-[64px] px-4 minmd:px-12 minlg:px-[76px] pb-10 font-medium'>
        <h2 className='text-[32px] font-medium'>Claim your free NFT Profile</h2>
        {type === 'Free' ?
          <p className='mt-9 text-xl font-normal'>Every wallet receives one <span className='font-bold text-transparent bg-text-gradient bg-clip-text'>free mint!</span></p>
          :
          <>
            <p className='mt-9 mb-4 text-xl '>You have already received one free mint</p>
            <p className='text-[#707070] font-normal mb-2'>Create your NFT Profile to build your social identity</p>
          </>
        }

        <MintProfileInputField
          minting={minting}
          setFreeProfile={setProfileURI}
          name={`input-${type}`}
          type="Free"
        />
            
        <div className={tw(
          type === 'Free' ? 'mt-12 minlg:mt-[59px]' : 'mt-8'
        )}>
          {type === 'Paid' &&
              <div className='mb-10 font-noi-grotesk'>
                <div className='flex items-center space-x-1 mb-3'>
                  <h3 className='text-[22px] font-medium'>Register</h3>
                  <Info size={25} color="#969696" weight="fill" />
                </div>
                <p className='text-[#707070] font-normal'>Increase registration period to avoid paying gas every year</p>
                <div className='mt-10 flex justify-between items-center pr-0 pl-0 minmd:pr-14 minmd:pl-8'>
                  <div className='rounded-full w-max py-1 px-4 flex space-x-3 border border-[#B2B2B2] items-center'>
                    <div className='relative'>
                      <MinusCircle size={25} color="#F8F8F8" weight="fill" className='relative z-10' />
                      <div className='bg-black w-3 h-3 absolute top-2 left-2 rounded-full'></div>
                    </div>
                    <p className='text-2xl'>1</p>
                    <div className='relative'>
                      <PlusCircle size={25} color="#F8F8F8" weight="fill" className='relative z-10' />
                      <div className='bg-black w-3 h-3 absolute top-2 left-2 rounded-full'></div>
                    </div>
                    
                    <p className='border-l pl-2'>Years</p>
                  </div>
                  <p className='text-[40px]'>=</p>
                  <p className='text-xl'>0.004 ETH</p>
                </div>
                <div className='flex items-center justify-between pr-0 pl-2 minmd:pr-12 minmd:pl-14'>
                  <p className='text-[#B2B2B2] font-normal'>Registration Period</p>
                  <p className='text-[#B2B2B2] font-normal'>Registration Price</p>
                </div>
                <div className='rounded-2xl bg-[#F2F2F2] px-7 py-5 flex items-center justify-between mt-8 font-noi-grotesk'>
                  <p className='font-normal'>Estimated Total (Price + Gas)</p>
                  <p className='font-medium text-xl'>~0.009 ETH <span className='font-normal text-base text-[#686868]'>($12.2)</span></p>
                </div>
              </div>
          }
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
              disabled={input.some(item => item.status === 'Owned') || isNullOrEmpty(input) || input.some(item => item.value === '') }
              onClick={async () => {
                if (
                  minting
                ) {
                  return;
                }
                setModalOpen(true);
                setMintingState({
                  inputs: input,
                  type: type,
                  tokenId: null
                });
              }}
            >
              {minting ? <ReactLoading type='spin' color='#707070' height={28} width={28} /> : type === 'Free' ? <span>Mint your NFT profile</span> : <span>Purchase</span>}
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
    