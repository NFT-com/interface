import 'rc-slider/assets/index.css';

import { Button, ButtonType } from 'components/elements/Button';
import { DropdownPicker } from 'components/elements/DropdownPicker';
import LoggedInIdenticon from 'components/elements/LoggedInIdenticon';
import { PriceInput } from 'components/elements/PriceInput';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { Profile } from 'graphql/generated/types';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useNftProfileTokens } from 'hooks/useNftProfileTokens';
import { SupportedCurrency } from 'hooks/useSupportedCurrencies';
import { Doppler, getEnv } from 'utils/env';
import { getEtherscanLink, processIPFSURL, shortenAddress } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { tw } from 'utils/tw';

import { NFTListingsCartSummaryModal } from './NFTListingsCartSummaryModal';

import { BigNumber } from 'ethers';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'phosphor-react';
import { useContext, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';

export function OfferCheckout() {
  const {
    prepareListings,
    allListingsConfigured,
  } = useContext(NFTListingsContext);

  const router = useRouter();
  const { chain } = useNetwork();
  const defaultChainId = useDefaultChainId();

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
  const [selectedExpirationOption, setSelectedExpirationOption] = useState(2);

  console.log('profileOwnerToShow: ', profileOwnerToShow);
  console.log('nft: ', nft);

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
        <div className='mt-20 w-1/2'>
          <video
            autoPlay
            muted
            loop
            key={nft?.metadata?.imageURL}
            src={processIPFSURL(nft?.metadata?.imageURL)}
            poster={processIPFSURL(nft?.metadata?.imageURL)}
            className={tw(
              'rounded-md w-full',
            )}
          />
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
                  profileOwnerToShow?.url && 'cursor-pointer'
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
          <div className='font-bold w-full'>
            <PriceInput
              key={'BidInput'}
              offer={true}
              currencyAddress={getAddress('weth', defaultChainId)}
              currencyOptions={['ETH', 'WETH']}
              onPriceChange={(val: BigNumber) => {
                console.log('val', val);
              }}
              onCurrencyChange={(currency: SupportedCurrency) => {
                console.log('currency', currency);
              }}
              error={false}
            />
          </div>

          <div className='flex items-center justify-between w-full'>
            <div className='text-[16px] flex text-[#B2B2B2] mb-1 mt-3'>Your Balance</div>
            <div className='text-[16px] flex text-[#B2B2B2] mb-1 mt-3'>1 ETH</div>
          </div>

          <div className='w-full text-[16px] font-medium flex text-[#6A6A6A] mb-1 mt-5'>Set Bid Expiration</div>
          <div className='mb-2 rounded-md h-12 w-full font-bold'>
            <DropdownPicker
              v2
              offer={true}
              options={expirationOptions}
              selectedIndex={selectedExpirationOption}
              placeholder={'Select Expiration'}
            />
          </div>

          <div className='border-b-[1px] border-dashed border-[#ECECEC] w-full my-3' />

          <div className='flex items-center justify-between w-full'>
            <div className='text-[16px] flex text-[#4D4D4D] mb-1 mt-3'>Subtotal</div>
            <div className='text-[16px] flex text-[#4D4D4D] mb-1 mt-3'>1 ETH</div>
          </div>

          <div className='border-b-[1px] border-dashed border-[#ECECEC] w-full my-3' />

          <div className='flex items-center justify-between w-full'>
            <div className='text-[16px] flex text-[#4D4D4D] mb-1 mt-3'>Total</div>
            <div className='text-[16px] flex text-[#4D4D4D] font-medium mb-1 mt-3'>1 ETH</div>
          </div>

        </div>
        {!showSummary && nft && collection ?
          <div className='w-full pb-8'>
            <Button
              label={'Place Bid'}
              disabled={!allListingsConfigured()}
              onClick={async () => {
                await prepareListings();
                setShowSummary(true);
              }}
              type={ButtonType.PRIMARY}
              stretch
            />
          </div> :
          ''
        }
      </div>
      <NFTListingsCartSummaryModal visible={showSummary && nft != undefined && collection != undefined} onClose={() => setShowSummary(false)} />
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