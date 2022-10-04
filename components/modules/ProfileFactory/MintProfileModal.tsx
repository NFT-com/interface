import maxProfilesABI from 'constants/abis/MaxProfiles.json';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useMaxProfilesSigner } from 'hooks/contracts/useMaxProfilesSigner';
import { useFreeMintAvailable } from 'hooks/state/useFreeMintAvailable';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useGetProfileClaimHash } from 'hooks/useProfileClaimHash';
import { getAddress } from 'utils/httpHooks';

import { Dialog, Transition } from '@headlessui/react';
import { utils } from 'ethers';
import ETHIcon from 'public/eth_icon.svg';
import { Fragment, useState } from 'react';
import useSWR from 'swr';
import { useAccount, usePrepareContractWrite, useProvider } from 'wagmi';

type MintProfileModalProps = {
  isOpen: boolean;
  setIsOpen: (input:boolean) => void;
  currentURI: string;
  transactionCost?: number;
};

export default function RemoveModal({ isOpen, setIsOpen, currentURI, transactionCost }: MintProfileModalProps) {
  const { address: currentAddress } = useAccount();
  const defaultChainId = useDefaultChainId();
  const [minting, setMinting] = useState(false);
  const [, setMintSuccess] = useState(false);
  const { profileClaimHash, mutate: mutateProfileHash } = useGetProfileClaimHash(currentURI);
  const { mutate: mutateMyProfileTokens } = useMyNftProfileTokens();
  const { mutate: mutateFreeMintStatus } = useFreeMintAvailable(currentAddress);
  const maxProfilesSigner = useMaxProfilesSigner();
  const { mutate: mutateTokenId } = useProfileTokenQuery(currentURI);
  const ethPriceUSD = useEthPriceUSD();
  const contractAddress = getAddress('maxProfiles', defaultChainId);
  const provider = useProvider();

  const { data: feeData } = useSWR(
    `${currentAddress}_eth_est_${currentURI}`,
    async () => {
      const feeData = await provider.getFeeData();
      return feeData;
    });
  
  const { data } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: maxProfilesABI,
    functionName: 'publicClaim',
    args: [currentURI, profileClaimHash?.hash, profileClaimHash?.signature,],
    onError(err){
      console.log('err:', err);
    }
  });

  const gasCost = data && feeData ? utils.formatEther(data?.request?.gasLimit.toNumber() * feeData?.gasPrice.toNumber()) : null;
  console.log('🚀 ~ file: MintProfileModal.tsx ~ line 57 ~ RemoveModal ~ gasCost', gasCost);
  function format_output(output) {
    const n = Math.log(output) / Math.LN10;
    let x = 4-n;
    if(x<0)
      x=0;
    output = output.toFixed(x);
    return output;
  }
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
                  <a onClick={() => setIsOpen(false)} className='text-[#0A8DD7] hover:cursor-pointer text-lg'>
                    Clear
                  </a>
                </div>
                <div className="mt-7 pb-6 border-b">
                  <p className="text-lg text-[#6F6F6F] w-4/5">
                    Confirm your order details before minting.
                  </p>
                </div>

                <div className="mt-5 pb-6 border-b">
                  <div className='flex justify-between mb-5'>
                    <div>
                      <p className="text-lg font-medium">
                        nft.com/{currentURI}
                      </p>
                      <p className="text-md text-[#686868] font-normal">
                        Profile
                      </p>
                    </div>
                    {transactionCost ?
                      <p className="font-medium text-lg flex justify-center items-center">
                        {transactionCost} <ETHIcon className='ml-1' stroke="black" />
                      </p>
                      :
                      <p className="text-lg text-[#2AAE47] font-medium">
                        Free
                      </p>
                    }
                  </div>
                  <div className='flex justify-between'>
                    <p className="font-medium">
                      Estimated Gas
                    </p>
                    <div className='flex flex-col items-end'>
                      <p className="font-medium text-lg flex justify-center items-center">
                        {parseFloat(Number(gasCost).toFixed(7))} <ETHIcon className='ml-1' stroke="black" />
                      </p>
                      <p className="text-[#686868]">
                        ${(ethPriceUSD * Number(gasCost)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                        {parseFloat(Number(gasCost).toFixed(7))} ETH
                      </p>
                      <p className="text-lg text-[#686868]">
                        (${(ethPriceUSD * Number(gasCost)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-xl border border-transparent bg-[#F9D54C] hover:bg-[#EFC71E] px-4 py-4 text-lg font-medium text-black focus:outline-none focus-visible:bg-[#E4BA18]"
                    onClick={async () => {
                      try {
                        const tx = await (await (maxProfilesSigner)).publicClaim(
                          currentURI,
                          profileClaimHash?.hash,
                          profileClaimHash?.signature,
                        );
                        setMinting(true);
                        if (tx) {
                          await tx.wait(1);
                          setMintSuccess(true);
                          mutateMyProfileTokens();
                        }
                        mutateProfileHash();
                        setMinting(false);
                        mutateTokenId();
                        mutateFreeMintStatus();
                      } catch (err) {
                        setMinting(false);
                      }
                    }}
                  >
                    {!minting ? 'Mint your profile' : 'Minting'}
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
    