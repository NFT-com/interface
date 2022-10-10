import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useGetProfileClaimHash } from 'hooks/useProfileClaimHash';
import { isNullOrEmpty } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { tw } from 'utils/tw';

import MintProfileInputField from './MintProfileInputField';
import MintProfileModal from './MintProfileModal';

import Link from 'next/link';
import ETHIcon from 'public/eth_icon.svg';
import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';

type MintFreeProfileCardProps = {
  type: 'Free' | 'Paid'
};

export default function MintFreeProfileCard({ type }: MintFreeProfileCardProps ) {
  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [minting, setMinting] = useState(false);
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

  const closeModal = () => {
    setMintModalOpen(false);
    setMinting(false);
  };
  
  return (
    <div className='relative mt-28 minlg:mt-12 z-50 px-5'>
      <div className='max-w-[600px] mx-auto bg-white rounded-[20px] pt-6 minmd:pt-[64px] px-4 minmd:px-12 minlg:px-[76px] pb-10 font-medium'>
        <h2 className='text-[32px] w-5/6'>Claim your free NFT Profile</h2>
        {type === 'Free' ?
          <p className='mt-6 text-xl w-5/6'>Every wallet receives one <span className='text-secondary-yellow'>free mint!</span></p>
          :
          <p className='mt-6 text-xl w-5/6'>You have already received one free mint</p>
        }

        <MintProfileInputField
          minting={minting}
          setFreeProfile={setProfileURI}
          name={`input-${type}`}
          type="Free"
        />
            
        <div className='mt-12 minlg:mt-[59px]'>
          {type === 'Paid' &&
              <p className="text-[#5B5B5B] text-center mb-3">
                Transaction fee {' '}<span className='text-black font-medium text-lg inline-flex items-center'> 0.1000<ETHIcon className='inline ml-1' stroke="black" /></span>
              </p>
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
                setMinting(true);
                setMintModalOpen(true);
              }}
            >
              {minting ? <ReactLoading type='spin' color='#707070' height={28} width={28} /> : <span>Mint your NFT profile</span>}
            </button>
          }
              
        </div>
        <p className='text-[#727272] text-left minlg:text-center mt-4 text-xl minlg:text-base font-normal'>
            Already have an account? <span className='text-black block minlg:inline font-medium'>Sign in</span>
        </p>
      </div>
      <MintProfileModal isOpen={mintModalOpen} setIsOpen={closeModal} profilesToMint={input} type={type} />
    </div>
  );
}
    