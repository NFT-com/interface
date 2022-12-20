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
import { convertDurationToSec, SaleDuration } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import { ListingCheckoutNftTableRow } from './ListingCheckoutNftTableRow';
import { NFTListingsCartSummaryModal } from './NFTListingsCartSummaryModal';

import Image from 'next/image';
import router from 'next/router';
import LooksrareGray from 'public/looksrare_gray.svg';
import LooksrareIcon from 'public/looksrare-icon.svg';
// import NFTLogo from 'public/nft_logo_yellow.svg';
import OpenSeaGray from 'public/opensea_gray.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import X2Y2Gray from 'public/x2y2-gray.svg';
import X2Y2Icon from 'public/x2y2-icon.svg';
import Slider from 'rc-slider';
import { useContext, useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';

export function ListingCheckout() {
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
    setDuration('30 Days' as SaleDuration);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
    
  const profileOwnerToShow: PartialDeep<Profile> = toList[0]?.nft?.wallet?.preferredProfile ?? profileData?.profile;
  const [showSummary, setShowSummary] = useState(false);
  // const [nftcomMarketplaceEnabled, setNftcomMarketplaceEnabled] = useState(true);

  const openseaFullyEnabled = !isNullOrEmpty(toList) && toList.find(nft => {
    const hasTarget = nft?.targets?.find(target => target?.protocol === ExternalProtocol.Seaport) != null;
    return !hasTarget; // return true if missing the desired target.
  }) == null; // target is fully enabled if we didn't find an NFT that was missing it.
  const looksrareFullyEnabled = !isNullOrEmpty(toList) && toList.find(nft => {
    const hasTarget = nft?.targets?.find(target => target?.protocol === ExternalProtocol.LooksRare) != null;
    return !hasTarget; // return true if missing the desired target.
  }) == null; // target is fully enabled if we didn't find an NFT that was missing it.
  const X2Y2FullyEnabled = !isNullOrEmpty(toList) && toList.find(nft => {
    const hasTarget = nft?.targets?.find(target => target?.protocol === ExternalProtocol.X2Y2) != null;
    return !hasTarget; // return true if missing the desired target.
  }) == null; // target is fully enabled if we didn't find an NFT that was missing it.

  const ListingOneNFT = () => {
    return(
      <div className='flex flex-col justify-start items-center bg-gray-200 w-2/5'>
        <div className='w-full ml-44 mt-20'>
          <h1
            className='text-2xl font-semibold font-noi-grotesk cursor-pointer'
            onClick={() => {
              router.back();
            }}>
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
                  <div className="relative object-cover aspect-square rounded-md object-cover w-full aspect-square">
                    <Image
                      layout='fill'
                      alt="NFT Profile Image"
                      src={processIPFSURL(profileOwnerToShow?.photoURL)}
                      className="object-cover absolute w-full h-full justify-center rounded-[50%] object-cover" />
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

  const ListingCheckoutInfo = () => {
    return <div className="flex flex-col items-center mx-auto minmd:w-full mt-10">
      <div className="flex flex-col items-center w-full">
        <div className='w-full flex flex-col items-center'>
          <span className='text-lg w-full font-semibold flex text-[#6F6F6F]'>Select Marketplace/s</span>
          <div className='flex minmd:flex-col minlg:flex-row items-start w-full '>
            <div
              onClick={() => {
                toggleTargetMarketplace(ExternalProtocol.Seaport);
                setShowSummary(false);
              }}
              className={tw(
                'border-[#D5D5D5] rounded-xl text-lg  w-1/3',
                'px-4 py-3 cursor-pointer w-full mt-4 mr-2 flex flex-col items-center',
                openseaFullyEnabled ? 'border-2 border-primary-yellow font-bold' : 'border'
              )}
            >
              {openseaFullyEnabled
                ? <OpenseaIcon
                  className='h-[1.95rem] relative shrink-0 -my-[4px] -mb-[3px]'
                  alt="Opensea logo"
                  layout="fill"
                />
                : <OpenSeaGray className='w-fit h-fit' />}
              <span className='font-semibold text-base'>Opensea</span>
              <span className='ml-2 font-medium text-sm text-[#6F6F6F]'>(1.5% fee)</span>
            </div>
            <div
              onClick={() => {
                toggleTargetMarketplace(ExternalProtocol.LooksRare);
                setShowSummary(false);
              }}
              className={tw(
                'border-[#D5D5D5] rounded-xl text-lg  w-1/3',
                'px-4 py-3 cursor-pointer w-full mt-4 mr-2 flex flex-col items-center',
                looksrareFullyEnabled ? 'border-2 border-primary-yellow font-bold' : 'border'
              )}
            >
              {looksrareFullyEnabled
                ? <LooksrareIcon
                  className='h-[1.95rem] relative shrink-0 -my-[4px] -mb-[3px]'
                  alt="Looksrare logo"
                  layout="fill"
                />
                :
                <LooksrareGray className='w-fit h-fit' />}
              <span className='font-semibold text-base'>Looksrare</span>
              <span className='ml-2 font-medium text-sm text-[#6F6F6F]'>(2% fee)</span>
            </div>
            {getEnvBool(Doppler.NEXT_PUBLIC_X2Y2_ENABLED) && <div
              onClick={() => {
                toggleTargetMarketplace(ExternalProtocol.X2Y2);
                setShowSummary(false);
              }}
              className={tw(
                'border-[#D5D5D5] rounded-xl text-lg w-1/3',
                'px-4 pt-3 py-3 cursor-pointer w-full mt-4 flex flex-col items-center',
                X2Y2FullyEnabled ? 'border-2 border-primary-yellow font-bold' : 'border'
              )}
            >
              {X2Y2FullyEnabled ? <X2Y2Icon className='h-[1.95rem] relative shrink-0 -my-[4px] -mb-[3px]' /> : <X2Y2Gray className='relative shrink-0 -mt-[1px] -mb-[3px]' />}
              <span className='font-semibold text-base'>X2Y2</span>
              <span className='ml-2 font-medium text-sm text-[#6F6F6F]'>(0.5% fee)</span>
            </div>}
          </div>
        </div>
        <div className='w-full flex flex-col mt-8 items-center'>
          <span className='text-lg w-full flex font-semibold'>Set Duration</span>
          <div className='mt-8 w-full'>
            <Slider
              step={10}
              min={0}
              max={60}
              defaultValue={30}
              marks={{ 0: '1 Hour', 10: '1 Day', 20: '7 Days', 30: '30 Days',40: '60 Days', 50: '90 Days', 60: '180 Days' }}
              onChange={(value) => {
                const duration = value === 0 ?
                  '1 Hour'
                  : value === 10 ?
                    '1 Day'
                    : value === 20 ?
                      '7 Days'
                      : value === 30 ?
                        '30 Days'
                        : value === 40 ?
                          '60 Days'
                          : value === 50 ?
                            '90 Days'
                            : '180 Days';
                setDuration(duration as SaleDuration);
              }}
              trackStyle={[{ backgroundColor: '#F9D54C' }]}
              handleStyle={[{ backgroundColor: 'black', border: 'none', width: '15px', height: '15px' }, { backgroundColor: 'black', border: 'none', width: '15px', height: '15px' }]}
            />
          </div>
        </div>
        <div className='flex flex-col items-start w-full mb-10'>
          <span className='text-2xl w-full flex font-bold mt-10 mb-8'>Your Listings</span>
          <table className="text-sm table-auto w-full">
            <tbody>
              {filterNulls(toList).map((listing, index) => {
                return (
                  <>
                    <tr className='text-base'>
                      <td className="font-medium pb-3 text-blog-text-reskin text-left">NFT</td>
                      <td className="font-medium pb-3 text-blog-text-reskin text-left">Marketplace</td>
                      <td className="font-medium pb-3 text-blog-text-reskin text-left">Type of auction</td>
                      <td className="font-medium pb-3 text-blog-text-reskin text-left">Set Price</td>
                      <td className="font-medium pb-3 text-blog-text-reskin text-left">{' '}</td>
                    </tr>
                    <ListingCheckoutNftTableRow key={index} listing={listing} onPriceChange={() => {
                      setShowSummary(false);
                    }} />
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        {
          (isNullOrEmpty(toList) || toList.length === 0) && <div className='flex flex-col items-center justify-center my-12'>
    No NFTs staged for listing
          </div>
        }
        {!showSummary && toList.length > 0 && <Button
          label={'Start Listing'}
          disabled={!allListingsConfigured()}
          onClick={async () => {
            await prepareListings();
            setShowSummary(true);
          }}
          type={ButtonType.PRIMARY}
          stretch
        />}
      </div>
      <NFTListingsCartSummaryModal visible={showSummary && toList.length > 0} onClose={() => setShowSummary(false)} />
    </div>;
  };
  
  return !getEnvBool(Doppler.NEXT_PUBLIC_TX_ROUTER_RESKIN_ENABLED)
    ? (
      <div className="flex flex-col items-center w-full mt-10">
        <div className="flex flex-col items-center w-full">
          <div className='w-full flex flex-col px-8 items-center'>
            <span className='text-2xl w-full flex font-bold'>Select Marketplace</span>
            <div className='flex flex-col minlg:flex-row items-center justify-around w-full '>
              <div
                onClick={() => {
                  toggleTargetMarketplace(ExternalProtocol.Seaport);
                  setShowSummary(false);
                }}
                className={tw(
                  'border border-[#D5D5D5] rounded-xl text-lg',
                  'px-4 py-6 cursor-pointer w-full mt-4 mx-4',
                  openseaFullyEnabled ? 'border-2 border-primary-yellow font-bold' : ''
                )}
              >
                <span>Opensea</span>
                <span className='ml-2 font-medium text-sm text-[#6F6F6F]'>(2.5% fee)</span>
              </div>
              <div
                onClick={() => {
                  toggleTargetMarketplace(ExternalProtocol.LooksRare);
                  setShowSummary(false);
                }}
                className={tw(
                  'border border-[#D5D5D5] rounded-xl text-lg',
                  'px-4 py-6 cursor-pointer w-full mt-4',
                  looksrareFullyEnabled ? 'border-2 border-primary-yellow font-bold' : ''
                )}
              >
                <span>Looksrare</span>
                <span className='ml-2 font-medium text-sm text-[#6F6F6F]'>(2% fee)</span>
              </div>
              {getEnvBool(Doppler.NEXT_PUBLIC_X2Y2_ENABLED) &&
              <div
                onClick={() => {
                  toggleTargetMarketplace(ExternalProtocol.X2Y2);
                  setShowSummary(false);
                }}
                className={tw(
                  'border border-[#D5D5D5] rounded-xl text-lg',
                  'px-4 py-6 cursor-pointer w-full mt-4 mx-4',
                  X2Y2FullyEnabled ? 'border-2 border-primary-yellow font-bold' : ''
                )}
              >
                <span>X2Y2</span>
                <span className='ml-2 font-medium text-sm text-[#6F6F6F]'>(0.5% fee)</span>
              </div>
              }
            </div>
          </div>
          <div className='w-full flex flex-col px-8 mt-8 items-center'>
            <span className='text-2xl w-full flex font-bold'>Set Duration</span>
            <div className='flex flex-row items-center justify-around mt-4 w-full max-w-lg'>
              {
                ['1 Hour', '1 Day', '7 Days','30 Days', '60 Days', '90 Days', '180 Days'].map(duration => {
                  return <div
                    key={duration}
                    onClick={() => {
                      setDuration(duration as SaleDuration);
                    }}
                    className={tw(
                      'rounded-full py-2.5 px-2',
                      toList?.find(l => l?.duration === convertDurationToSec(duration as SaleDuration)) ? 'bg-primary-yellow font-bold' : 'border border-[#D5D5D5] text-black',
                      'cursor-pointer hover:opacity-80',
                    )}
                  >
                    {duration}
                  </div>;
                })
              }
            </div>
          </div>
          <div className='my-8 overflow-x-scroll w-full flex flex-col'>
            <div className="border-t border-[#D5D5D5] mx-8">
              <span className='text-2xl w-full flex font-bold mt-10 mb-8 mx-8'>Your Listings</span>
            </div>
            <table className="w-full mx-8 text-sm table-auto">
              <thead>
                <tr>
                  <th className="font-medium pb-3 text-blog-text-reskin text-left">NFT</th>
                  <th className="font-medium pb-3 text-blog-text-reskin text-left">Set Price</th>
                  <th className="font-medium pb-3 text-blog-text-reskin text-left">Marketplaces</th>
                </tr>
              </thead>
              <tbody>
                {filterNulls(toList).map((listing, index) => {
                  return (<ListingCheckoutNftTableRow key={index} listing={listing} onPriceChange={() => {
                    setShowSummary(false);
                  }} />);
                })}
              </tbody>
            </table>
          </div>
          {
            (isNullOrEmpty(toList) || toList.length === 0) && <div className='flex flex-col items-center justify-center my-12'>
          No NFTs staged for listing
            </div>
          }
          {!showSummary && toList.length > 0 && <Button
            label={'Start Listing'}
            disabled={!allListingsConfigured()}
            onClick={async () => {
              await prepareListings();
              setShowSummary(true);
            }}
            type={ButtonType.PRIMARY}
          />}
        </div>
        <NFTListingsCartSummaryModal visible={showSummary && toList.length > 0} onClose={() => setShowSummary(false)} />
      </div>
    ) :
    (
      <div className={`flex w-full justify-${ toList.length === 1 ? 'between h-screen': 'start'}`}>
        {toList.length === 1 && ListingOneNFT()}
        {(toList.length === 0 || toList.length > 1) &&<div className='hidden minmd:block w-1/5 mt-20'>
          <h1
            className='text-xl font-semibold font-noi-grotesk cursor-pointer ml-28'
            onClick={() => {
              router.back();
            }}>
            Back
          </h1>
        </div>}
        <div className='w-full flex flex-col justify-start items-center w-full minmd:w-3/5 minmd:px-28'>
          <div className='w-full minmd:mt-20'>
            <h1 className='text-3xl font-semibold font-noi-grotesk'>Create Listings</h1>
          </div>
          {ListingCheckoutInfo()}
        </div>
      </div>
    );
}