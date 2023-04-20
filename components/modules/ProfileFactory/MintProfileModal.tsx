import { Fragment, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { BigNumber, utils } from 'ethers';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useAccount, usePrepareContractWrite, useProvider } from 'wagmi';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import maxProfilesABI from 'constants/abis/MaxProfiles.json';
import { useMaxProfilesSigner } from 'hooks/contracts/useMaxProfilesSigner';
import { useFreeMintAvailable } from 'hooks/state/useFreeMintAvailable';
import { useMintSuccessModal } from 'hooks/state/useMintSuccessModal';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useProfileExpiryDate } from 'hooks/useProfileExpiryDate';
import { getAddress } from 'utils/httpHooks';

import ETHIcon from 'public/icons/eth_icon.svg?svgr';

type Inputs = {
  profileURI: string;
  hash: string;
  signature: string;
  status: string;
  name: string;
};

type MintProfileModalProps = {
  type: 'GK' | 'Free' | 'Paid' | 'Renew';
  isOpen: boolean;
  setIsOpen: (input: boolean) => void;
  profilesToMint: Inputs[];
  transactionCost?: number | BigNumber;
  duration?: number;
  gkTokenId?: number;
};

export default function MintProfileModal({
  isOpen,
  setIsOpen,
  transactionCost,
  profilesToMint,
  gkTokenId,
  type,
  duration
}: MintProfileModalProps) {
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
  const { setMintSuccessModalOpen } = useMintSuccessModal();
  const profileToMint = profilesToMint && profilesToMint[0];
  const { mutate: mutateProfileExpiry } = useProfileExpiryDate(type === 'Renew' ? profileToMint?.profileURI : null);

  const { data: feeData } = useSWR(`${currentAddress}_eth_est_${JSON.stringify(profilesToMint)}`, async () => {
    const feeData = await provider.getFeeData();
    return feeData;
  });

  const gkMintProfiles = profilesToMint?.map(profile => {
    return {
      profileUrl: profile.profileURI,
      tokenId: gkTokenId,
      recipient: currentAddress,
      hash: profile.hash,
      signature: profile.signature
    };
  });

  const getFunctionName = useCallback(() => {
    if (type === 'Free') {
      return 'publicClaim';
    }
    if (type === 'GK') {
      return 'genesisKeyBatchClaimProfile';
    }
    if (type === 'Paid') {
      return 'publicMint';
    }
    if (type === 'Renew') {
      return 'extendLicense';
    }
  }, [type]);

  const getArgs = useCallback(() => {
    if (type === 'Free') {
      return [profileToMint?.profileURI, profileToMint?.hash, profileToMint?.signature];
    }
    if (type === 'GK') {
      return [gkMintProfiles];
    }
    if (type === 'Paid') {
      return [
        profileToMint?.profileURI,
        duration * 60 * 60 * 24 * 365,
        0,
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        profileToMint?.hash,
        profileToMint?.signature
      ];
    }
    if (type === 'Renew') {
      return [
        profileToMint?.profileURI,
        duration * 60 * 60 * 24 * 365,
        0,
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      ];
    }
  }, [duration, gkMintProfiles, profileToMint?.hash, profileToMint?.profileURI, profileToMint?.signature, type]);

  const { data } = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi: maxProfilesABI,
    functionName: getFunctionName(),
    args: getArgs(),
    onError(err) {
      console.log('err:', err);
    },
    overrides: {
      from: type === 'Paid' ? currentAddress : null,
      value: transactionCost && (type === 'Paid' || type === 'Renew') ? transactionCost : null
    }
  });

  const submitHandler = async () => {
    if (type === 'Free') {
      try {
        const tx = await (
          await maxProfilesSigner
        ).publicClaim(profileToMint?.profileURI, profileToMint?.hash, profileToMint?.signature);
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
    } else if (type === 'Paid') {
      try {
        const tx = await (
          await maxProfilesSigner
        ).publicMint(
          profileToMint?.profileURI,
          duration * 60 * 60 * 24 * 365,
          0,
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          profileToMint?.hash,
          profileToMint?.signature,
          {
            from: currentAddress,
            value: transactionCost
          }
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
    } else if (type === 'Renew') {
      try {
        const tx = await (
          await maxProfilesSigner
        ).extendLicense(
          profileToMint?.profileURI,
          duration * 60 * 60 * 24 * 365,
          0,
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          {
            from: currentAddress,
            value: transactionCost
          }
        );
        setMinting(true);
        if (tx) {
          await tx.wait(1);
          setMintSuccess(true);
          mutateMyProfileTokens();
        }
        mutateFreeMintStatus();
        setIsOpen(false);
        setMinting(false);
        mutateProfileExpiry();
        toast.success('Renewal was successful!');
      } catch (err) {
        setMinting(false);
      }
    } else {
      try {
        const tx = await (await maxProfilesSigner).genesisKeyBatchClaimProfile(gkMintProfiles);
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
    if (!isOpen) {
      return 0;
    }
    if (feeData?.gasPrice) {
      if (data?.request.gasLimit) {
        const gas = utils.formatEther(
          BigNumber.from(data?.request?.gasLimit.toString()).mul(BigNumber.from(feeData?.gasPrice.toString()))
        );
        return type === 'Renew' ? Number(gas).toFixed(7) : parseFloat(Number(gas).toFixed(7));
      }

      return 0;
    }
    return 0;
  }, [feeData, data, isOpen, type]);

  const getTotalCost = useCallback(() => {
    if (!isOpen) {
      return 0;
    }
    if (feeData?.gasPrice && transactionCost) {
      if (data?.request.gasLimit) {
        const gasFee = BigNumber.from(data?.request?.gasLimit.toString()).mul(
          BigNumber.from(feeData?.gasPrice.toString())
        );
        return utils.formatEther(BigNumber.from(transactionCost).add(gasFee));
      }

      return 0;
    }
    return 0;
  }, [isOpen, feeData?.gasPrice, transactionCost, data?.request.gasLimit]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-[110]' onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-start justify-end p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-[325px] overflow-hidden rounded-[20px] bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <div className='flex justify-between font-medium'>
                  <Dialog.Title as='h3' className='text-[24px] leading-6 text-gray-900'>
                    {type !== 'Renew' ? 'Mint a Profile' : 'Renew Profile'}
                  </Dialog.Title>
                  {!minting && (
                    <a onClick={() => setIsOpen(false)} className='text-lg text-[#0A8DD7] hover:cursor-pointer'>
                      Clear
                    </a>
                  )}
                </div>
                <div className='mt-7 border-b pb-6'>
                  <p className='w-4/5 text-lg text-[#6F6F6F]'>
                    Confirm your order details before {type !== 'Renew' ? 'minting' : 'renewing'}.
                  </p>
                </div>

                <div className='mt-5 border-b pb-6'>
                  {profilesToMint &&
                    profilesToMint.map((profile, index) => (
                      <div className='mb-5 flex justify-between' key={profile.profileURI + index}>
                        <div>
                          <p className='text-lg font-medium'>nft.com/{profile.profileURI}</p>
                          <p className='text-md font-normal text-[#686868]'>Profile</p>
                        </div>
                        {type === 'Paid' || type === 'Renew' ? (
                          <p className='flex items-center justify-center text-lg font-medium'>
                            {transactionCost && utils.formatEther(BigNumber.from(transactionCost))}{' '}
                            <ETHIcon className='ml-1' stroke='black' />
                          </p>
                        ) : (
                          <p className='text-lg font-medium text-[#2AAE47]'>Free</p>
                        )}
                      </div>
                    ))}

                  <div className='flex justify-between'>
                    <p className='font-medium'>Estimated Gas</p>
                    <div className='flex flex-col items-end'>
                      <p className='flex items-center justify-center text-lg font-medium'>
                        {getGasCost()} <ETHIcon className='ml-1' stroke='black' />
                      </p>
                      <p className='text-[#686868]'>
                        $
                        {(ethPriceUSD * Number(getGasCost())).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='mt-7 pb-6'>
                  <div className='flex justify-between'>
                    <p className='text-lg font-medium text-[#686868]'>Total</p>
                    <div className='flex flex-col items-end'>
                      <p className='text-xl font-medium'>
                        {type !== 'Paid' && type !== 'Renew'
                          ? parseFloat(Number(getGasCost()).toFixed(7))
                          : parseFloat(Number(getTotalCost()).toFixed(7))}{' '}
                        ETH
                      </p>
                      {type !== 'Paid' && type !== 'Renew' ? (
                        <p className='text-lg text-[#686868]'>
                          ($
                          {(ethPriceUSD * Number(getGasCost())).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                          )
                        </p>
                      ) : (
                        <p className='text-lg text-[#686868]'>
                          ($
                          {(ethPriceUSD * Number(getTotalCost())).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                          )
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Button
                    type={ButtonType.PRIMARY}
                    size={ButtonSize.LARGE}
                    stretch
                    onClick={async () => {
                      submitHandler();
                    }}
                    loading={minting}
                    label={type === 'Renew' ? 'Renew' : 'Mint your profile'}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
