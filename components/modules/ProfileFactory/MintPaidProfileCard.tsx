import { useCallback, useEffect, useState } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { BigNumber, utils } from 'ethers';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Info, MinusCircle, PlusCircle } from 'phosphor-react';
import useSWR from 'swr';
import { useAccount, usePrepareContractWrite, useProvider } from 'wagmi';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import ClientOnly from 'components/elements/ClientOnly';
import CustomTooltip from 'components/elements/CustomTooltip';
import MintProfileModal from 'components/modules/ProfileFactory/MintProfileModal';
import maxProfilesABI from 'constants/abis/MaxProfiles.json';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useProfileTokenQuery } from 'graphql/hooks/useProfileTokenQuery';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useGetProfileClaimHash } from 'hooks/useProfileClaimHash';
import { isNullOrEmpty } from 'utils/format';
import { getAddress } from 'utils/httpHooks';
import { tw } from 'utils/tw';

import ErrorIcon from 'public/icons/red-error-icon.svg?svgr';

import MintProfileInputField from './MintProfileInputField';

type MintPaidProfileCardProps = {
  type: 'renew' | 'mint';
  profile?: string;
};

const DynamicMintProfileModal = dynamic<React.ComponentProps<typeof MintProfileModal>>(() =>
  import('components/modules/ProfileFactory/MintProfileModal').then(mod => mod.default)
);

export default function MintPaidProfileCard({ type, profile }: MintPaidProfileCardProps) {
  const [profileURI, setProfileURI] = useState(null);
  const [input, setInput] = useState([]);
  const [profileStatus, setProfileStatus] = useState('');
  const [hasListings, setHasListings] = useState(false);
  const [registrationFee, setRegistrationFee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState(null);
  const { address: currentAddress } = useAccount();
  const { profileTokenId } = useProfileTokenQuery(profileURI || '');
  const defaultChainId = useDefaultChainId();
  const { data: nft } = useNftQuery(getAddress('nftProfile', defaultChainId), profileTokenId?._hex);
  const { profileClaimHash, mutate: mutateProfileClaimHash } = useGetProfileClaimHash(profileURI);
  const [yearValue, setYearValue] = useState(1);
  const contractAddress = getAddress('maxProfiles', defaultChainId);
  const provider = useProvider();
  const ethPriceUSD = useEthPriceUSD();
  const { profileAuction } = useAllContracts();
  const { openConnectModal } = useConnectModal();

  const setMintingModal = useCallback(isOpen => {
    if (isOpen) {
      setMinting(true);
      setModalOpen(true);
    } else {
      setMinting(false);
      setModalOpen(false);
    }
  }, []);

  const { data: feeData } = useSWR(`eth_est_${profileURI}`, async () => {
    const feeData = await provider.getFeeData();
    return feeData;
  });

  const { data } = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi: maxProfilesABI,
    functionName: type === 'mint' ? 'publicMint' : 'extendLicense',
    args:
      type === 'mint'
        ? [
            input[0]?.profileURI,
            yearValue * 60 * 60 * 24 * 365,
            0,
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            input[0]?.hash,
            input[0]?.signature
          ]
        : [
            profile,
            yearValue * 60 * 60 * 24 * 365,
            0,
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000000000000000000000000000000000000000000000000000'
          ],
    onSuccess() {
      setError(null);
    },
    onError(err) {
      err.message.includes('insufficient funds') ? setError('Insufficient funds for transaction') : console.log(err);
    },
    overrides: {
      from: currentAddress,
      value: registrationFee && registrationFee
    },
    enabled: type === 'mint' ? !isNullOrEmpty(profileURI) && !isNullOrEmpty(currentAddress) : true
  });

  useEffect(() => {
    if (!isNullOrEmpty(currentAddress)) {
      mutateProfileClaimHash();
    }
  }, [currentAddress, mutateProfileClaimHash]);

  const getMintCost = useCallback(() => {
    if (feeData?.gasPrice) {
      if (data?.request.gasLimit && registrationFee) {
        const gasFee = BigNumber.from(data?.request?.gasLimit.toString()).mul(
          BigNumber.from(feeData?.gasPrice.toString())
        );
        return utils.formatEther(BigNumber.from(registrationFee).add(gasFee));
      }
      return 0;
    }
    return 0;
  }, [feeData, data, registrationFee]);

  useEffect(() => {
    if (profileStatus === 'Listed') {
      setHasListings(true);
    } else {
      setHasListings(false);
    }
    if (isNullOrEmpty(profileURI) || profileURI === '') {
      setInput([]);
    } else {
      setInput([
        {
          profileURI,
          profileStatus,
          type: 'input-Paid',
          hash: profileClaimHash?.hash,
          signature: profileClaimHash?.signature
        }
      ]);
    }
  }, [profileURI, profileStatus, profileClaimHash]);

  useEffect(() => {
    setProfileStatus(profileTokenId ? (nft?.listings?.totalItems > 0 ? 'Listed' : 'Owned') : 'Available');
  }, [profileTokenId, nft]);

  useEffect(() => {
    (async () => {
      const [regFee] = await Promise.all([
        profileAuction.getFee(type === 'mint' ? profileURI : profile, yearValue * 60 * 60 * 24 * 365).catch(() => null)
      ]);

      if (!isNullOrEmpty(regFee)) {
        setRegistrationFee(regFee);
      }
    })();
  }, [profileAuction, profileURI, yearValue, profile, type]);

  const updateProfileValue = useCallback(input => {
    setError(null);
    setProfileURI(input);
  }, []);

  return (
    <>
      <>
        {type === 'mint' && (
          <>
            <div className='mb-4 mt-9 text-xl'>
              <span>
                Choose Your Profile Name
                <div className='bottom-.5 absolute inline-block w-max pl-1'>
                  <CustomTooltip
                    orientation='top'
                    tooltipComponent={
                      <div className='w-max rounded-xl'>
                        <p className='max-w-[150px]'>
                          An annual fee is required to register a NFT Profile. The fee is based on the length of the
                          domain. You can pre-pay this fee at creation of the NFT Profile and extend it at any time.
                        </p>
                      </div>
                    }
                  >
                    <Info size={25} color='#969696' weight='fill' />
                  </CustomTooltip>
                </div>
              </span>
            </div>
            <p className='relative mb-2 font-normal text-[#707070]'>
              Specify your profile name and duration. Don’t worry, you can extend the duration at any time through the
              settings page.
            </p>

            <MintProfileInputField
              minting={minting}
              setFreeProfile={updateProfileValue}
              name={'input-Paid'}
              type='Free'
            />
          </>
        )}
        <div className={tw(type === 'mint' ? 'mt-8' : 'mt-4')}>
          <div className='mb-10 font-noi-grotesk'>
            {type === 'renew' && (
              <div className='mb-3 flex items-center space-x-1'>
                <h3 className='text-[22px] font-medium'>Renew</h3>
              </div>
            )}
            {type === 'renew' && (
              <p className='font-normal text-[#707070]'>
                Pre-pay your annual license to maintain ownership of your NFT Profile
              </p>
            )}
            <div className='mt-10 flex items-center justify-between px-0 minmd:pl-8 minmd:pr-14'>
              <div className='flex w-max items-center space-x-3 rounded-full border border-[#B2B2B2] px-4 py-1'>
                <div className='relative'>
                  <MinusCircle
                    size={25}
                    color='#F8F8F8'
                    weight='fill'
                    className='relative z-10 hover:cursor-pointer'
                    onClick={() => yearValue > 1 && setYearValue(yearValue - 1)}
                  />
                  <div className='absolute left-2 top-2 h-3 w-3 rounded-full bg-black'></div>
                </div>
                <p className='text-2xl'>{yearValue}</p>
                <div className='relative'>
                  <PlusCircle
                    size={25}
                    color='#F8F8F8'
                    weight='fill'
                    className='relative z-10 hover:cursor-pointer'
                    onClick={() => setYearValue(yearValue + 1)}
                  />
                  <div className='absolute left-2 top-2 h-3 w-3 rounded-full bg-black'></div>
                </div>
                <p className='border-l pl-2'>Years</p>
              </div>
              <p className='text-[40px]'>=</p>
              <p className='text-xl'>
                {registrationFee ? utils.formatEther(BigNumber.from(registrationFee)) : 0.03 * yearValue} ETH
              </p>
            </div>
            <div className='flex items-center justify-between pl-2 pr-0 minmd:pl-14 minmd:pr-12'>
              <p className='font-normal text-[#B2B2B2]'>Profile Duration</p>
              <p className='font-normal text-[#B2B2B2]'>Duration Price</p>
            </div>
            <div className='mt-8 flex items-center justify-between rounded-2xl bg-[#F2F2F2] px-7 py-5 font-noi-grotesk'>
              {isNullOrEmpty(error) ? (
                <>
                  <p className='font-normal'>Estimated Total (Price + Gas)</p>
                  <p className='text-xl font-medium'>
                    ~ {parseFloat(Number(getMintCost()).toFixed(5))} ETH{' '}
                    <span className='text-base font-normal text-[#686868]'>
                      ($
                      {(ethPriceUSD * Number(getMintCost())).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                      )
                    </span>
                  </p>
                </>
              ) : (
                <div className='flex max-h-[5rem] min-h-[3rem] w-full items-center rounded border border-[#E43D20] bg-[#FFF8F7] px-2 font-noi-grotesk font-medium text-[#E43D20]'>
                  <ErrorIcon className='relative mr-2 shrink-0' />
                  {error}
                </div>
              )}
            </div>
          </div>

          {hasListings ? (
            <Link href={`/app/nft/0x98ca78e89Dd1aBE48A53dEe5799F24cC1A462F2D/${profileTokenId?.toNumber()}`}>
              <Button
                label='View NFT.com listing'
                type={ButtonType.PRIMARY}
                size={ButtonSize.XLARGE}
                stretch
                onClick={() => null}
              />
            </Link>
          ) : (
            <ClientOnly>
              <Button
                type={ButtonType.PRIMARY}
                size={ButtonSize.XLARGE}
                loading={minting}
                stretch
                label={
                  isNullOrEmpty(currentAddress) ? 'Connect Wallet' : type === 'mint' ? 'Purchase' : 'Renew License'
                }
                disabled={
                  type === 'mint'
                    ? input.some(item => item.profileStatus === 'Owned') ||
                      isNullOrEmpty(input) ||
                      input.some(item => item.profileURI === '') ||
                      !isNullOrEmpty(error)
                    : !isNullOrEmpty(error)
                }
                onClick={async () => {
                  if (minting) {
                    return;
                  }
                  if (isNullOrEmpty(currentAddress)) {
                    openConnectModal();
                    return;
                  }
                  setModalOpen(true);
                  setMinting(true);
                }}
              />
            </ClientOnly>
          )}
        </div>
        <Link href='https://docs.nft.com/nft-profiles/what-is-a-nft-profile' passHref className='mt-4' legacyBehavior>
          <a target='_blank'>
            <p className='mt-4 text-left text-xl font-normal text-[#727272] minlg:text-center minlg:text-base'>
              Learn more about <span className='inline font-medium text-black'>NFT Profiles</span>
            </p>
          </a>
        </Link>
      </>
      {modalOpen && (
        <DynamicMintProfileModal
          isOpen={modalOpen}
          setIsOpen={setMintingModal}
          profilesToMint={type === 'mint' ? input : [{ profileURI: profile }]}
          type={type === 'mint' ? 'Paid' : 'Renew'}
          duration={yearValue}
          transactionCost={registrationFee}
        />
      )}
    </>
  );
}
