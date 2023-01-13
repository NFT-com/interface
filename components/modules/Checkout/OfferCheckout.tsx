import 'rc-slider/assets/index.css';

import { Button, ButtonType } from 'components/elements/Button';
import LoggedInIdenticon from 'components/elements/LoggedInIdenticon';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { Profile } from 'graphql/generated/types';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useNftProfileTokens } from 'hooks/useNftProfileTokens';
import { ExternalProtocol } from 'types';
import { Doppler, getEnvBool } from 'utils/env';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import { processIPFSURL } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ListingCheckoutNftTableRow } from './ListingCheckoutNftTableRow';
import { NFTListingsCartSummaryModal } from './NFTListingsCartSummaryModal';
import { handleRender } from './TooltipSlider';

import Image from 'next/image';
import router from 'next/router';
import { ArrowLeft } from 'phosphor-react';
import LooksrareGray from 'public/looksrare_gray.svg';
import LooksrareIcon from 'public/looksrare-icon.svg';
import NFTLogo from 'public/nft_logo_yellow.svg';
import NoActivityIcon from 'public/no_activity.svg';
import OpenSeaGray from 'public/opensea_gray.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import X2Y2Gray from 'public/x2y2-gray.svg';
import X2Y2Icon from 'public/x2y2-icon.svg';
import Slider from 'rc-slider';
import { useContext, useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';

export function OfferCheckout() {
  const {
    toList,
    setDuration,
    toggleTargetMarketplace,
    prepareListings,
    allListingsConfigured,
  } = useContext(NFTListingsContext);

  const { profileTokens } = useNftProfileTokens(toList[0]?.nft?.wallet?.address);
  const { profileData } = useProfileQuery(
    toList[0]?.nft?.wallet?.preferredProfile == null ?
      profileTokens[0]?.tokenUri?.raw?.split('/').pop() :
      null
  );

  useEffect(() => {
    toList.forEach(stagedNft => {
      if(!stagedNft.duration) {
        setDuration(30);
      }
    });
  },[setDuration, toList]);
    
  const profileOwnerToShow: PartialDeep<Profile> = toList[0]?.nft?.wallet?.preferredProfile ?? profileData?.profile;
  const [showSummary, setShowSummary] = useState(false);

  const ListingOneNFT = () => {
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
            key={toList[0]?.nft?.metadata?.imageURL}
            src={processIPFSURL(toList[0]?.nft?.metadata?.imageURL)}
            poster={processIPFSURL(toList[0]?.nft?.metadata?.imageURL)}
            className={tw(
              'rounded-md w-full',
            )}
          />
          <div className='flex font-noi-grotesk mt-6'>
            <div className='flex flex-col justify-between w-3/5'>
              <span className='font-semibold text-ellipsis overflow-hidden'>{toList[0]?.nft?.metadata?.name}</span>
              <span className='text-[#6F6F6F] whitespace-nowrap text-ellipsis overflow-hidden'>{toList[0]?.collectionName}</span>
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
              <span className='whitespace-nowrap text-ellipsis overflow-hidden ml-2'>@{profileOwnerToShow?.url}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OfferCheckoutInfo = () => {
    return <div className="flex flex-col items-center minlg:mx-auto minmd:w-full mt-6">
      <div className="flex flex-col items-center w-full">
        <div className='w-full flex flex-col items-center'>
          <span className='text-[18px] w-full flex text-black'>Once your bid is placed, you will be the highest bidder in the auction.</span>
          <div className='minlg:hidden w-full text-base font-normal flex text-[#A6A6A6] mb-3'>Bid</div>
          <input
            type="text"
            placeholder="bid"
            className={tw(
              'text-sm border border-gray-200 h-12 w-full minlg:w-[25%]',
              'text-left p-1 rounded-md mb-2 bg-gray-200 pl-3 minlg:ml-2 minlg:mr-1',
            )}
          />
        </div>
        {!showSummary && toList.length > 0 && <div className='w-full pb-8'><Button
          label={'Start Listing'}
          disabled={!allListingsConfigured()}
          onClick={async () => {
            await prepareListings();
            setShowSummary(true);
          }}
          type={ButtonType.PRIMARY}
          stretch
        /></div>}
      </div>
      <NFTListingsCartSummaryModal visible={showSummary && toList.length > 0} onClose={() => setShowSummary(false)} />
    </div>;
  };
  
  return <div className='font-noi-grotesk flex w-full justify-between h-full'>
    {toList.length === 1 && ListingOneNFT()}
    {(toList.length === 0 || toList.length > 1) && <div className='hidden minlg:block w-1/5 mt-20'>
      <h1
        className='text-xl font-semibold cursor-pointer ml-28 flex items-center'
        onClick={() => {
          router.back();
        }}>
        <ArrowLeft size={24} color="black" className='ListingPageBackButton mr-3' />
        Back
      </h1>
    </div>}
    <div className={tw(
      toList.length === 1 ? 'minlg:px-[5%]' : 'minlg:px-2 minxl:px-4',
      'w-full flex flex-col justify-start items-center minlg:w-3/5 minxxl:px-28')}>
      <div className='w-full minlg:mt-20 flex minlg:block justify-start items-end minlg:items-center minlg:mx-auto'>
        <span
          className='minlg:hidden text-lg font-semibold cursor-pointer flex items-center minlg:ml-28'
          onClick={() => {
            router.back();
          }}>
          <ArrowLeft size={24} color="black" className='ListingPageBackButton mr-3' />
          Back
        </span>
        <h1 className='text-2xl minlg:text-3xl pl-12 minlg:pl-0 font-semibold'>Your Offers</h1>
      </div>
      {OfferCheckoutInfo()}
    </div>
    {(toList.length === 0 || toList.length > 1) && <div className='hidden minlg:block w-1/5 mt-20'></div>}
  </div>
}