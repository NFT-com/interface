import maxProfilesABI from 'constants/abis/MaxProfiles.json';
import { useMaxProfilesSigner } from 'hooks/contracts/useMaxProfilesSigner';
import { useFreeMintAvailable } from 'hooks/state/useFreeMintAvailable';
import { useMintSuccessModal } from 'hooks/state/useMintSuccessModal';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { Doppler, getEnvBool } from 'utils/env';
import { getAddress } from 'utils/httpHooks';

import { Dialog, Transition } from '@headlessui/react';
import { BigNumber, utils } from 'ethers';
import { useRouter } from 'next/router';
import ETHIcon from 'public/eth_icon.svg';
import { Fragment, useCallback, useState } from 'react';
import ReactLoading from 'react-loading';
import useSWR from 'swr';
import { useAccount, usePrepareContractWrite, useProvider } from 'wagmi';

type Inputs = {
  profileURI: string;
  hash: string;
  signature: string;
  status: string;
  name: string;
};

type MintProfileModalProps = {
  type: 'GK' | 'Free' | 'Paid'
  isOpen: boolean;
  setIsOpen: (input:boolean) => void;
  profilesToMint: Inputs[];
  transactionCost?: number;
  duration?: number;
  gkTokenId?: number;
};

export default function MintProfileModal({ isOpen, setIsOpen, transactionCost, profilesToMint, gkTokenId, type, duration }: MintProfileModalProps) {
  const { address: currentAddress } = useAccount();
  const router = useRouter();
  const defaultChainId = useDefaultChainId();
  const [minting, setMinting] = useState(false);
  const [, setMintSuccess] = useState(false);
  const { mutate: mutateMyProfileTokens } = useMyNftProfileTokens();
  const { mutate: mutateFreeMintStatus } = useFreeMintAvailable(currentAddress);
  const maxProfilesSigner = useMaxProfilesSigner();
  const ethPriceUSD = useEthPriceUSD();
  const contractAddress = getAddress('maxProfiles', defaultChainId);
  const provider = useProvider();
  const { setMintSuccessModalOpen }= useMintSuccessModal();

  const { data: feeData } = useSWR(
    `${currentAddress}_eth_est_${JSON.stringify(profilesToMint)}`,
    async () => {
      const feeData = await provider.getFeeData();
      return feeData;
    });

  const profileToMint = profilesToMint && profilesToMint[0];
  const gkMintProfiles = profilesToMint?.map((profile) => {
    return {
      profileUrl: profile.profileURI,
      tokenId: gkTokenId,
      recipient: currentAddress,
      hash: profile.hash,
      signature: profile.signature
    };
  });

  const { data } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: maxProfilesABI,
    functionName: type === 'GK' ? 'genesisKeyBatchClaimProfile' : type === 'Free' ?'publicClaim' : 'publicMint',
    args: type === 'GK' ? [gkMintProfiles] : type ==='Free' ? [profileToMint?.profileURI, profileToMint?.hash, profileToMint?.signature] : [profileToMint?.profileURI, duration * 60 * 60 * 24 * 365, 0 , '0x0000000000000000000000000000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000000000000000000000000000', profileToMint?.hash, profileToMint?.signature],
    onError(err){
      console.log('err:', err);
    },
    overrides: {
      from: type ==='Paid' ? currentAddress : null,
      value: transactionCost && type ==='Paid' ? transactionCost : null,
    },
  });

  const submitHandler = async () => {
    if(type === 'Free' && getEnvBool(Doppler.NEXT_PUBLIC_GA_ENABLED)){
      try {
        const tx = await (await (maxProfilesSigner)).publicClaim(
          profileToMint?.profileURI,
          profileToMint?.hash,
          profileToMint?.signature,
        );
        setMinting(true);
        if (tx) {
          await tx.wait(1);
          setMintSuccess(true);
          mutateMyProfileTokens();
        }
        mutateFreeMintStatus();
        setIsOpen(false);
        setMintSuccessModalOpen(true);
        router.push(`/${profileToMint?.profileURI}`);
        setMinting(false);
      } catch (err) {
        setMinting(false);
      }
    } else if (type === 'Paid' && getEnvBool(Doppler.NEXT_PUBLIC_GA_ENABLED)){
      try {
        const tx = await (await (maxProfilesSigner)).publicMint(
          profileToMint?.profileURI,
          duration * 60 * 60 * 24 * 365,
          0,
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          profileToMint?.hash,
          profileToMint?.signature,
          {
            from: currentAddress,
            value: transactionCost,
          },
        );
        setMinting(true);
        if (tx) {
          await tx.wait(1);
          setMintSuccess(true);
          mutateMyProfileTokens();
        }
        mutateFreeMintStatus();
        setIsOpen(false);
        setMintSuccessModalOpen(true);
        router.push(`/${profileToMint?.profileURI}`);
        setMinting(false);
      } catch (err) {
        setMinting(false);
      }
    } else {
      try {
        const tx = await(await(maxProfilesSigner)).genesisKeyBatchClaimProfile(
          gkMintProfiles
        );
        setMinting(true);
        if (tx) {
          await tx.wait(1);
          setMintSuccess(true);
          mutateMyProfileTokens();
        }
        mutateFreeMintStatus();
        setIsOpen(false);
        setMintSuccessModalOpen(true);
        router.push(`/${gkMintProfiles[0].profileUrl}`);
        setMinting(false);
      } catch (err) {
        setMinting(false);
      }
    }
  };

  const getGasCost = useCallback(() => {
    if(!isOpen){
      return 0;
    }
    if(feeData?.gasPrice){
      if(data?.request.gasLimit) {
        return utils.formatEther(BigNumber.from(data?.request?.gasLimit.toString()).mul(BigNumber.from(feeData?.gasPrice.toString())));
      }
      else {
        return 0;
      }
    } else {
      return 0;
    }
  }, [feeData, data, isOpen]);

  const getTotalCost = useCallback(() => {
    if(!isOpen){
      return 0;
    }
    if(feeData?.gasPrice && transactionCost){
      if(data?.request.gasLimit) {
        const gasFee = BigNumber.from(data?.request?.gasLimit.toString()).mul(BigNumber.from(feeData?.gasPrice.toString()));
        return utils.formatEther(BigNumber.from(transactionCost).add(gasFee));
      }
      else {
        return 0;
      }
    } else {
      return 0;
    }
  }, [isOpen, feeData?.gasPrice, transactionCost, data?.request.gasLimit]);
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[105]" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-end p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[325px] transform overflow-hidden rounded-[20px] bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className='flex justify-between font-medium'>
                  <Dialog.Title
                    as="h3"
                    className="text-[24px] leading-6 text-gray-900"
                  >
                    Mint a Profile
                  </Dialog.Title>
                  {!minting &&
                    <a onClick={() => setIsOpen(false)} className='text-[#0A8DD7] hover:cursor-pointer text-lg'>
                      Clear
                    </a>
                  }
                </div>
                <div className="mt-7 pb-6 border-b">
                  <p className="text-lg text-[#6F6F6F] w-4/5">
                    Confirm your order details before minting.
                  </p>
                </div>

                <div className="mt-5 pb-6 border-b">
                  {profilesToMint && profilesToMint.map((profile, index) => (
                    <div className='flex justify-between mb-5' key={profile.profileURI + index}>
                      <div>
                        <p className="text-lg font-medium">
                          nft.com/{profile.profileURI}
                        </p>
                        <p className="text-md text-[#686868] font-normal">
                          Profile
                        </p>
                      </div>
                      {type === 'Paid' ?
                        <p className="font-medium text-lg flex justify-center items-center">
                          {transactionCost && utils.formatEther(BigNumber.from(transactionCost))} <ETHIcon className='ml-1' stroke="black" />
                        </p>
                        :
                        <p className="text-lg text-[#2AAE47] font-medium">
                          Free
                        </p>
                      }
                    </div>
                  ))}
                  
                  <div className='flex justify-between'>
                    <p className="font-medium">
                      Estimated Gas
                    </p>
                    <div className='flex flex-col items-end'>
                      <p className="font-medium text-lg flex justify-center items-center">
                        {parseFloat(Number(getGasCost()).toFixed(7))} <ETHIcon className='ml-1' stroke="black" />
                      </p>
                      <p className="text-[#686868]">
                        ${(ethPriceUSD * Number(getGasCost())).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 pb-6">
                  <div className='flex justify-between'>
                    <p className="text-lg text-[#686868] font-medium">
                    Total
                    </p>
                    <div className='flex flex-col items-end'>
                      <p className="text-xl font-medium">
                        {type !== 'Paid' ? parseFloat(Number(getGasCost()).toFixed(7)) : parseFloat(Number(getTotalCost()).toFixed(7))} ETH
                      </p>
                      {type !== 'Paid' ?
                        <p className="text-lg text-[#686868]">
                          (${(ethPriceUSD * Number(getGasCost())).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                        </p>
                        :
                        <p className="text-lg text-[#686868]">
                          (${(ethPriceUSD * Number(getTotalCost())).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                        </p>
                      }
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-xl border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E] px-4 py-4 text-lg font-medium text-black focus:outline-none focus-visible:bg-[#E4BA18]"
                    onClick={async () => {
                      submitHandler();
                    }}
                  >
                    {minting ? <ReactLoading type='spin' color='#707070' height={28} width={28} /> : <span>Mint your profile</span>}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
    