import CustomTooltip2 from 'components/elements/CustomTooltip2';
import MintProfileModal from 'components/modules/ProfileFactory/MintProfileModal';
import maxProfilesABI from 'constants/abis/MaxProfiles.json';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useGetProfileClaimHash } from 'hooks/useProfileClaimHash';
import { isNullOrEmpty } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { tw } from 'utils/tw';

import MintProfileInputField from './MintProfileInputField';

import { BigNumber, utils } from 'ethers';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Info, MinusCircle, PlusCircle } from 'phosphor-react';
import { useCallback, useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import useSWR from 'swr';
import { useAccount, usePrepareContractWrite, useProvider } from 'wagmi';

type MintPaidProfileCardProps = {
  type: 'renew' | 'mint';
  profile?: string;
}

const DynamicMintProfileModal = dynamic<React.ComponentProps<typeof MintProfileModal>>(() => import('components/modules/ProfileFactory/MintProfileModal').then(mod => mod.default));

export default function MintPaidProfileCard({ type, profile } : MintPaidProfileCardProps) {
  const [profileURI, setProfileURI] = useState(null);
  const [input, setInput] = useState([]);
  const [profileStatus, setProfileStatus] = useState('');
  const [hasListings, setHasListings] = useState(false);
  const [registrationFee, setRegistrationFee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [minting, setMinting] = useState(false);

  const { address: currentAddress } = useAccount();
  const { profileTokenId } = useProfileTokenQuery(profileURI || '');
  const defaultChainId = useDefaultChainId();
  const { data: nft } = useNftQuery(getAddress('nftProfile', defaultChainId), profileTokenId?._hex);
  const { profileClaimHash } = useGetProfileClaimHash(profileURI);
  const [yearValue, setYearValue] = useState(1);
  const contractAddress = getAddress('maxProfiles', defaultChainId);
  const provider = useProvider();
  const ethPriceUSD = useEthPriceUSD();
  const { profileAuction } = useAllContracts();

  const setMintingModal = useCallback((isOpen) => {
    if(isOpen){
      setMinting(true);
      setModalOpen(true);
    } else {
      setMinting(false);
      setModalOpen(false);
    }
  }, [setModalOpen]);

  const { data: feeData } = useSWR(
    `eth_est_${profileURI}`,
    async () => {
      const feeData = await provider.getFeeData();
      return feeData;
    });
  const { data } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: maxProfilesABI,
    functionName: type === 'mint' ? 'publicMint' : 'extendLicense',
    args: [type === 'mint' ? input[0]?.profileURI : profile, yearValue * 60 * 60 * 24 * 365, 0 , '0x0000000000000000000000000000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000000000000000000000000000', input[0]?.hash, input[0]?.signature],
    onError(err){
      console.log('err:', err);
    },
    overrides: {
      from: currentAddress,
      value: registrationFee && registrationFee,
    },
  });
  
  const getMintCost = useCallback(() => {
    if(feeData?.gasPrice){
      if(data?.request.gasLimit && registrationFee) {
        const gasFee = BigNumber.from(data?.request?.gasLimit.toString()).mul(BigNumber.from(feeData?.gasPrice.toString()));
        return utils.formatEther(BigNumber.from(registrationFee).add(gasFee));
      }
      else {
        return 0;
      }
    } else {
      return 0;
    }
  }, [feeData, data, registrationFee]);

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
        type: 'input-Paid',
        hash: profileClaimHash?.hash,
        signature: profileClaimHash?.signature
      }]);
    }
  }, [profileURI, profileStatus, profileClaimHash]);

  useEffect(() => {
    setProfileStatus(profileTokenId ? nft?.listings?.totalItems > 0 ? 'Listed' : 'Owned' : 'Available');
  }, [profileTokenId, nft]);

  useEffect(() => {
    (async () => {
      const [
        regFee
      ] = await Promise.all([
        profileAuction.getFee(type === 'mint' ? profileURI : profile, yearValue * 60 * 60 * 24 * 365).catch(() => null)
      ]);

      if(!isNullOrEmpty(regFee)){
        setRegistrationFee(regFee);
      }
    })();
  }, [profileAuction, profileURI, yearValue, profile, type]);
  
  return (
    <div className={tw(
      type === 'mint' && 'relative mt-16 minlg:mt-12 z-50 px-5'
    )}>
      <div className={tw(
        type === 'mint' && 'max-w-[600px] mx-auto bg-white rounded-[20px] pt-6 minmd:pt-[64px] px-4 minmd:px-12 minlg:px-[76px] pb-10 font-medium'
      )}>
        {type === 'mint' &&
          <>
            <h2 className='text-[32px] font-medium'>Claim your free NFT Profile</h2>
            <p className='mt-9 mb-4 text-xl '>You have already received one free mint</p>
            <p className='text-[#707070] font-normal mb-2'>Create your NFT Profile to build your social identity</p>
            <MintProfileInputField
              minting={minting}
              setFreeProfile={setProfileURI}
              name={'input-Paid'}
              type="Free"
            />
          </>
        }
            
        <div className={tw(
          type === 'mint' ? 'mt-8' : 'mt-4'
        )}>
          <div className='mb-10 font-noi-grotesk'>
            <div className='flex items-center space-x-1 mb-3'>
              <h3 className='text-[22px] font-medium'>{type === 'mint' ? 'Register ': 'Renew'}</h3>
              <div className='w-max'>
                <CustomTooltip2
                  orientation='top'
                  tooltipComponent={
                    <div
                      className="rounded-xl w-max"
                    >
                      <p className='max-w-[150px]'>An annual fee is required to register a NFT Profile. The fee is based on the length of the domain. You can pre-pay this fee at creation of the NFT Profile and extend it at anytime.</p>
                    </div>
                  }
                >
                  <Info size={25} color="#969696" weight="fill" />
                </CustomTooltip2>
              </div>
              
            </div>
            <p className='text-[#707070] font-normal'>Increase registration period to avoid paying gas every year</p>
            <div className='mt-10 flex justify-between items-center pr-0 pl-0 minmd:pr-14 minmd:pl-8'>
              <div className='rounded-full w-max py-1 px-4 flex space-x-3 border border-[#B2B2B2] items-center'>
                <div className='relative'>
                  <MinusCircle size={25} color="#F8F8F8" weight="fill" className='relative z-10 hover:cursor-pointer' onClick={() => yearValue > 1 && setYearValue(yearValue - 1)} />
                  <div className='bg-black w-3 h-3 absolute top-2 left-2 rounded-full'></div>
                </div>
                <p className='text-2xl'>{yearValue}</p>
                <div className='relative'>
                  <PlusCircle size={25} color="#F8F8F8" weight="fill" className='relative z-10 hover:cursor-pointer' onClick={() => setYearValue(yearValue + 1)} />
                  <div className='bg-black w-3 h-3 absolute top-2 left-2 rounded-full'></div>
                </div>
                <p className='border-l pl-2'>Years</p>
              </div>
              <p className='text-[40px]'>=</p>
              <p className='text-xl'>{registrationFee && utils.formatEther(BigNumber.from(registrationFee))} ETH</p>
            </div>
            <div className='flex items-center justify-between pr-0 pl-2 minmd:pr-12 minmd:pl-14'>
              <p className='text-[#B2B2B2] font-normal'>Registration Period</p>
              <p className='text-[#B2B2B2] font-normal'>Registration Price</p>
            </div>
            <div className='rounded-2xl bg-[#F2F2F2] px-7 py-5 flex items-center justify-between mt-8 font-noi-grotesk'>
              <p className='font-normal'>Estimated Total (Price + Gas)</p>
              <p className='font-medium text-xl'>~ {parseFloat(Number(getMintCost()).toFixed(5))} ETH <span className='font-normal text-base text-[#686868]'>(${(ethPriceUSD * Number(getMintCost())).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span></p>
            </div>
          </div>
          
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
              disabled={ type === 'mint' ? input.some(item => item.profileStatus === 'Owned') || isNullOrEmpty(input) || input.some(item => item.profileURI === '') : false }
              onClick={async () => {
                if (
                  minting
                ) {
                  return;
                }
                setModalOpen(true);
              }}
            >
              {minting ? <ReactLoading type='spin' color='#707070' height={28} width={28} /> : type === 'mint' ? <span>Purchase</span> : <span>Renew License</span>}
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
      <DynamicMintProfileModal isOpen={modalOpen} setIsOpen={setMintingModal} profilesToMint={type === 'mint' ? input : [{ profileURI: profile }]} type={type === 'mint' ? 'Paid' : 'Renew'} duration={yearValue} transactionCost={registrationFee} />
    </div>
  );
}
    