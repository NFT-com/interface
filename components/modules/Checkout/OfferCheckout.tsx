import 'rc-slider/assets/index.css';

import { Button, ButtonType } from 'components/elements/Button';
import { DropdownPicker } from 'components/elements/DropdownPicker';
import LoggedInIdenticon from 'components/elements/LoggedInIdenticon';
import { PriceInput } from 'components/elements/PriceInput';
import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { NULL_ADDRESS } from 'constants/addresses';
import { Profile } from 'graphql/generated/types';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery'
import { useEthBalance } from 'hooks/balances/useEthBalance';
import { useWethBalance } from 'hooks/balances/useWethBalance';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useNftProfileTokens } from 'hooks/useNftProfileTokens';
import { SupportedCurrency } from 'hooks/useSupportedCurrencies';
import { Doppler, getEnv } from 'utils/env';
import { getEtherscanLink, processIPFSURL, shortenAddress } from 'utils/helpers';
import { getAddress, SupportedTokenContract } from 'utils/httpHooks';
import { tw } from 'utils/tw';

import { OfferSummaryModal } from './OfferSummaryModal';

import { BigNumber } from 'ethers';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'phosphor-react';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork } from 'wagmi';

export function OfferCheckout() {
  const router = useRouter();
  const { chain } = useNetwork();
  const defaultChainId = useDefaultChainId();
  const { address: currentAddress } = useAccount();

  const userEthBalance = useEthBalance(currentAddress);
  const userWethBalance = useWethBalance(currentAddress);

  const { contractAddress, tokenId } = router.query;
  const { data: nft } = useNftQuery(contractAddress as `0x${string}`, tokenId ? BigNumber.from(tokenId) : BigNumber.from(0));
  const { data: collection } = useCollectionQuery(String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)), contractAddress as `0x${string}`);

  const { profileTokens } = useNftProfileTokens(nft?.wallet?.address);
  const { profileData } = useProfileQuery(
    nft?.wallet?.preferredProfile == null ?
      profileTokens[0]?.tokenUri?.raw?.split('/').pop() :
      null
  );
    
  const profileOwnerToShow: PartialDeep<Profile> = nft?.wallet?.preferredProfile ?? profileData?.profile;
  const [showSummary, setShowSummary] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>('ETH');
  const [selectedPrice, setSelectedPrice] = useState<BigNumber>(BigNumber.from(0));
  const [selectedExpirationOption, setSelectedExpirationOption] = useState(2);

  const getBalance = () => {
    if (selectedCurrency === 'ETH') {
      return Number(BigNumber.from(userEthBalance?.balance?.balance || 0)) / 10 ** 18 + ` ${selectedCurrency}`;
    } else if (selectedCurrency === 'WETH') {
      return Number(BigNumber.from(userWethBalance?.balance)) / 10 ** 18 + ` ${selectedCurrency}`;
    }
  };

  const offerConfigured = () => {
    if (BigNumber.from(selectedPrice)?.eq(0)) {
      return false;
    } else if (selectedCurrency === 'ETH' && BigNumber.from(userEthBalance?.balance?.balance)?.lt(selectedPrice)) {
      return false;
    } else if (selectedCurrency === 'WETH' && BigNumber.from(userWethBalance?.balance)?.lt(selectedPrice)) {
      return false;
    }

    return true;
  };

  const BiddingOneNFT = () => {
    return(
      <div className='hidden minlg:flex flex-col justify-start items-center bg-gray-200 w-2/5 min-h-[100vh]'>
        <div className='w-full ml-44 mt-20'>
          <h1
            className='text-2xl font-semibold font-noi-grotesk cursor-pointer flex items-center'
            onClick={() => {
              router.back();
            }}
          >
            <ArrowLeft size={24} color="black" className='ListingPageBackButton mr-3' />
            Back
          </h1>
        </div>
        {nft?.metadata?.imageURL ?
          <div className='mt-20 w-1/2'>
            <div className="flex w-full max-h-[600px] h-full max-w-nftcom object-contain drop-shadow-lg rounded aspect-square">
              <RoundedCornerMedia
                key={nft?.id}
                src={processIPFSURL(nft?.metadata?.imageURL)}
                videoOverride={true}
                variant={RoundedCornerVariant.None}
                objectFit='contain'
                extraClasses='rounded'
                containerClasses='h-full w-full' />
            </div>
            <div className='flex font-noi-grotesk mt-6'>
              <div className='flex flex-col justify-between w-3/5'>
                <span className='font-semibold text-ellipsis overflow-hidden'>{nft?.metadata?.name}</span>
                <span className='text-[#6F6F6F] whitespace-nowrap text-ellipsis overflow-hidden'>{collection?.collection?.name || '-'}</span>
              </div>
              <div className='flex justify-start h-full w-2/5'>
                <div className='flex flex-col h-[42px] w-[42px] '>
                  {profileOwnerToShow?.photoURL ?
                    <div className="relative object-cover aspect-square rounded-md w-full">
                      <Image
                        layout='fill'
                        alt="NFT Profile Image"
                        src={processIPFSURL(profileOwnerToShow?.photoURL)}
                        className="object-cover absolute w-full h-full justify-center rounded-[50%]" />
                    </div>
                    :
                    <LoggedInIdenticon round border />
                  }
                </div>
                <div
                  className={tw(
                    'flex px-3 items-center',
                    'cursor-pointer hover:underline'
                  )}
                  onClick={() => {
                    if (profileOwnerToShow?.url) {
                      router.push('/' + profileOwnerToShow?.url);
                    } else {
                      window.open(getEtherscanLink(Number(defaultChainId), nft?.wallet?.address, 'address'), '_blank');
                    }
                  }}
                >
                  <span className="text-base whitespace-nowrap text-ellipsis overflow-hidden ml-2leading-5 font-noi-grotesk">
                    {profileOwnerToShow?.url ?
                      `@${profileOwnerToShow?.url}` :
                      shortenAddress(nft?.wallet?.address, isMobile ? 4 : 6) ?? 'Unknown'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
          :
          <div className='mt-[30vh] w-1/2 flex flex-col justify-center items-center'>
            <div role="status">
              <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#FDCC00]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            <span className='text-[#6F6F6F] mt-4'>Loading NFT...</span>
          </div>
        }
      </div>
    );
  };

  // color?: string;
  // icon?: string;
  // disabled?: boolean
  const expirationOptions = [
    {
      label: '1 Day',
      onSelect: () => setSelectedExpirationOption(0)
    },
    {
      label: '3 Days',
      onSelect: () => setSelectedExpirationOption(1)
    },
    {
      label: '7 Days',
      onSelect: () => setSelectedExpirationOption(2)
    },
    {
      label: '14 Days',
      onSelect: () => setSelectedExpirationOption(3)
    },
    {
      label: '30 Days',
      onSelect: () => setSelectedExpirationOption(4)
    },
    {
      label: '60 Days',
      onSelect: () => setSelectedExpirationOption(5)
    },
    {
      label: '90 Days',
      onSelect: () => setSelectedExpirationOption(6)
    },
    {
      label: '180 Days',
      onSelect: () => setSelectedExpirationOption(7)
    },
  ];

  const OfferCheckoutInfo = () => {
    return <div className="flex flex-col items-center minlg:mx-auto minmd:w-full mt-6">
      <div className="flex flex-col items-center w-full">
        <div className='w-full flex flex-col items-center mb-4'>
          <span className='text-[18px] w-full flex text-black'>Once your bid is placed, you will be the highest bidder in the auction.</span>
          <div className='w-full text-[16px] font-medium flex text-[#6A6A6A] mb-1 mt-3'>Bid</div>
          {nft ?
            <div className='font-bold w-full'>
              <PriceInput
                key={'BidInput'}
                offer={true}
                currencyAddress={selectedCurrency?.toLowerCase() === 'eth' ?
                  NULL_ADDRESS :
                  getAddress(selectedCurrency?.toLowerCase() as SupportedTokenContract, defaultChainId)
                }
                currencyOptions={['ETH', 'WETH']}
                onPriceChange={(val: BigNumber) => {
                  setSelectedPrice(val || BigNumber.from(0));
                }}
                onCurrencyChange={(currency: SupportedCurrency) => {
                  setSelectedCurrency(currency);
                }}
                error={false}
              />
            </div> :
            <div className="animate-pulse flex h-5 my-2 w-full space-x-4">
              <div className="h-5 w-full bg-slate-200 rounded" />
            </div>
          }

          <div className='flex items-center justify-between w-full'>
            <div className='text-[16px] flex text-[#B2B2B2] mb-1 mt-3'>Your Balance</div>
            <div className='text-[16px] flex text-[#B2B2B2] mb-1 mt-3'>{getBalance()}</div>
          </div>

          <div className='w-full text-[16px] font-medium flex text-[#6A6A6A] mb-1 mt-5'>Set Bid Expiration</div>
          {nft ?
            <div className='mb-2 rounded-md h-12 w-full font-bold'>
              <DropdownPicker
                v2
                offer={true}
                options={expirationOptions}
                selectedIndex={selectedExpirationOption}
                placeholder={'Select Expiration'}
              />
            </div> :
            <div className="animate-pulse flex h-5 my-2 w-full space-x-4">
              <div className="h-5 w-full bg-slate-200 rounded" />
            </div>
          }

          <div className='border-b-[1px] border-dashed border-[#ECECEC] w-full my-3' />

          <div className='flex items-center justify-between w-full'>
            <div className='text-[16px] flex text-[#4D4D4D] mb-1 mt-3'>Subtotal</div>
            <div className='text-[16px] flex text-[#4D4D4D] mb-1 mt-3'>{Number(selectedPrice) / 10 ** 18 || '-'} {selectedCurrency}</div>
          </div>

          <div className='border-b-[1px] border-dashed border-[#ECECEC] w-full my-3' />

          <div className='flex items-center justify-between w-full'>
            <div className='text-[16px] flex text-[#4D4D4D] mb-1 mt-3'>Total</div>
            <div className='text-[16px] flex text-[#4D4D4D] font-medium mb-1 mt-3'>{Number(selectedPrice) / 10 ** 18 || '-'} {selectedCurrency}</div>
          </div>

        </div>
        {!showSummary && nft && collection ?
          <div className='w-full pb-8'>
            <Button
              label={'Place Bid'}
              disabled={!offerConfigured()}
              onClick={async () => {
                setShowSummary(true);
              }}
              type={ButtonType.PRIMARY}
              stretch
            />
          </div> :
          ''
        }
      </div>
      <OfferSummaryModal
        visible={showSummary && nft != undefined && collection != undefined}
        onClose={() => setShowSummary(false)}
        expirationOptions={expirationOptions.map(i => i.label)}
        selectedCurrency={selectedCurrency}
        selectedPrice={selectedPrice}
        selectedExpirationOption={selectedExpirationOption}
      />
    </div>;
  };
  
  return <div className='font-noi-grotesk flex w-full justify-between h-full'>
    {BiddingOneNFT()}
    <div className={tw('w-full flex flex-col justify-start items-center mx-auto minlg:w-[500px]')}>
      <div className='w-full minlg:mt-20 flex minlg:block justify-start items-end minlg:items-center minlg:mx-auto'>
        <span
          className='minlg:hidden text-lg font-semibold cursor-pointer flex items-center minlg:ml-28'
          onClick={() => {
            router.back();
          }}>
          <ArrowLeft size={24} color="black" className='ListingPageBackButton mr-3' />
          Back
        </span>
        <h1 className='text-2xl minlg:text-3xl pl-12 minlg:pl-0 font-semibold'>Your Offer</h1>
      </div>
      {OfferCheckoutInfo()}
    </div>
  </div>;
}