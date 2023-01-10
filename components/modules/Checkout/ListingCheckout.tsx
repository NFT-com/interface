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
    toList.forEach(stagedNft => {
      if(!stagedNft.duration) {
        setDuration(30);
      }
    });
  },[setDuration, toList]);
    
  const profileOwnerToShow: PartialDeep<Profile> = toList[0]?.nft?.wallet?.preferredProfile ?? profileData?.profile;
  const [showSummary, setShowSummary] = useState(false);
  const [nftcomMarketplaceEnabled, setNftcomMarketplaceEnabled] = useState(true);

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

  const openseaAtLeastOneEnabled = !isNullOrEmpty(toList) && toList.find(nft => {
    return nft?.targets?.find(target => target?.protocol === ExternalProtocol.Seaport) != null;
  }) != null;
  const looksrareAtLeastOneEnabled = !isNullOrEmpty(toList) && toList.find(nft => {
    return nft?.targets?.find(target => target?.protocol === ExternalProtocol.LooksRare) != null;
  }) != null;
  const X2Y2AtLeastOneEnabled = !isNullOrEmpty(toList) && toList.find(nft => {
    return nft?.targets?.find(target => target?.protocol === ExternalProtocol.X2Y2) != null;
  }) != null;

  const buttonsRowWidth = () => {
    if (getEnvBool(Doppler.NEXT_PUBLIC_NATIVE_TRADING_TEST) && getEnvBool(Doppler.NEXT_PUBLIC_X2Y2_ENABLED)) {
      return 'w-1/4';
    } else if (!getEnvBool(Doppler.NEXT_PUBLIC_NATIVE_TRADING_TEST) && !getEnvBool(Doppler.NEXT_PUBLIC_X2Y2_ENABLED)) {
      return 'w-1/2';
    } else {
      return 'w-full';
    }
  };

  const ListingOneNFT = () => {
    return(
      <div className='hidden minlg:flex flex-col justify-start items-center bg-gray-200 w-2/5 min-h-[100vh]'>
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
    return <div className="flex flex-col items-center minlg:mx-auto minmd:w-full mt-10">
      <div className="flex flex-col items-center w-full">
        <div className='w-full flex flex-col items-center'>
          <span className='text-lg w-full font-semibold flex text-[#A6A6A6]'>Select Marketplace(s)</span>
          <div className='flex flex-wrap minlg:flex-nowrap justify-between minlg:flex-row items-start w-full mt-2'>
            {getEnvBool(Doppler.NEXT_PUBLIC_NATIVE_TRADING_TEST) && <div
              onClick={() => {
                setNftcomMarketplaceEnabled(!nftcomMarketplaceEnabled);
                setShowSummary(false);
              }}
              className={tw(
                `max-h-[93px] w-[49%] minlg:${buttonsRowWidth()}`,
                'border-[#D5D5D5] rounded-xl text-lg',
                'px-4 py-3 cursor-pointer mt-2 minlg:mr-2 flex flex-col items-center',
                nftcomMarketplaceEnabled ? 'border-2 border-primary-yellow font-bold bg-[#FFF0CB]' : 'border-2'
              )}
            >
              {nftcomMarketplaceEnabled
                ? <NFTLogo
                  className='h-[1.95rem] relative shrink-0 -my-[4px] -mb-[3px]'
                  alt="Opensea logo"
                  layout="fill"
                />
                : <NFTLogo className='w-fit h-fit' />}
              <span className='font-semibold text-base'>NFT</span>
              <span className='ml-2 font-medium text-sm text-[#6F6F6F]'>(0% fee)</span>
            </div>}
            <div
              onClick={() => {
                toggleTargetMarketplace(ExternalProtocol.Seaport);
                setShowSummary(false);
              }}
              className={tw(
                `max-h-[93px] w-[49%] minlg:${buttonsRowWidth()}`,
                'border-[#D5D5D5] rounded-xl text-lg',
                'px-4 py-3 cursor-pointer mt-2 minlg:mr-2 flex flex-col items-center',
                openseaAtLeastOneEnabled ? 'border-2 border-primary-yellow font-bold' : 'border-2'
              )}
            >
              {openseaAtLeastOneEnabled
                ? <OpenseaIcon
                  className='h-[1.95rem] relative shrink-0 -my-[4px] -mb-[3px]'
                  alt="Opensea logo"
                  layout="fill"
                />
                : <OpenSeaGray className='relative shrink-0 -mt-[1px]' />}
              <span className='font-semibold text-base'>Opensea</span>
              <span className='ml-2 font-medium text-sm text-[#6F6F6F]'>(1.5% fee)</span>
            </div>
            <div
              onClick={() => {
                toggleTargetMarketplace(ExternalProtocol.LooksRare);
                setShowSummary(false);
              }}
              className={tw(
                `max-h-[93px] w-[49%] minlg:${buttonsRowWidth()}`,
                'border-[#D5D5D5] rounded-xl text-lg',
                'px-4 py-3 cursor-pointer mt-2 minlg:mr-2 flex flex-col items-center',
                looksrareAtLeastOneEnabled ? 'border-2 border-primary-yellow font-bold' : 'border-2'
              )}
            >
              {looksrareAtLeastOneEnabled
                ? <LooksrareIcon
                  className='h-[1.97rem] relative shrink-0 -my-[4px] -mb-[3px]'
                  alt="Looksrare logo"
                  layout="fill"
                />
                :
                <LooksrareGray className='h-[1.8rem] relative shrink-0 -mb-[4px]' />}
              <span className='font-semibold text-base'>Looksrare</span>
              <span className='ml-2 font-medium text-sm text-[#6F6F6F]'>(2% fee)</span>
            </div>
            {getEnvBool(Doppler.NEXT_PUBLIC_X2Y2_ENABLED) && <div
              onClick={() => {
                toggleTargetMarketplace(ExternalProtocol.X2Y2);
                setShowSummary(false);
              }}
              className={tw(
                `max-h-[93px] w-[49%] minlg:${buttonsRowWidth()}`,
                'border-[#D5D5D5] rounded-xl text-lg',
                'px-4 pt-3 py-3 cursor-pointer mt-2 flex flex-col items-center',
                X2Y2AtLeastOneEnabled ? 'border-2 border-primary-yellow font-bold' : 'border-2'
              )}
            >
              {X2Y2AtLeastOneEnabled
                ? <X2Y2Icon className='h-[1.5rem] relative shrink-0 mb-[2px]' /> :
                <X2Y2Gray className='h-[1.5rem] relative shrink-0 mb-[2px]' />}
              <span className='font-semibold text-base'>X2Y2</span>
              <span className='ml-2 font-medium text-sm text-[#6F6F6F]'>(0.5% fee)</span>
            </div>}
          </div>
        </div>
        <div className='w-full flex flex-col mt-8 items-center'>
          <span className='text-lg w-full flex font-semibold'>Set Duration</span>
          <div className='mt-8 w-[93%] minlg:w-full'>
            <Slider
              trackStyle={[{ backgroundColor: '#F9D54C' }]}
              handleStyle={[{ backgroundColor: 'black', border: 'none', width: '15px', height: '15px' }, { backgroundColor: 'black', border: 'none', width: '15px', height: '15px' }]}
              marks={{ 1: '1 Day', 30: '|', 60: '|', 90: '|',120: '|', 150: '|', 180: '180 Days' }}
              min={1}
              max={180}
              defaultValue={30}
              handleRender={handleRender}
              onChange={(value) => setDuration(value as number)}
            />
          </div>
        </div>
        <div className='flex flex-col items-start w-full mb-10'>
          <span className='text-2xl w-full flex font-bold mt-20 minlg:mt-10 mb-8'>Your Listings</span>
          <div className="text-sm w-full">
            {filterNulls(toList).map((listing, index) => {
              return (
                <ListingCheckoutNftTableRow key={index} listing={listing} onPriceChange={() => {
                  setShowSummary(false);
                }} />
              );
            })}
          </div>
        </div>
        {
          (isNullOrEmpty(toList) || toList.length === 0) && <div className='flex flex-col items-center justify-center mb-12'>
            <NoActivityIcon />
            <span className='text-lg font-medium font-noi-grotesk mb-2 flex items-center justify-center mt-5 text-[#4D4D4D]'>You haven’t added any listings yet</span>
          </div>
        }
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
          {/* <div className='w-full flex flex-col px-8 mt-8 items-center'>
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
                      'border border-[#D5D5D5] text-black',
                      'cursor-pointer hover:opacity-80',
                    )}
                  >
                    {duration}
                  </div>;
                })
              }
            </div>
          </div> */}
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
      <div className='flex w-full justify-between h-full'>
        {toList.length === 1 && ListingOneNFT()}
        {(toList.length === 0 || toList.length > 1) && <div className='hidden minlg:block w-1/5 mt-20'>
          <h1
            className='text-xl font-semibold font-noi-grotesk cursor-pointer ml-28'
            onClick={() => {
              router.back();
            }}>
            Back
          </h1>
        </div>}
        <div className={tw(
          toList.length === 1 ? 'minlg:px-[5%]' : 'minlg:px-2 minxl:px-4',
          'w-full flex flex-col justify-start items-center w-full minlg:w-3/5 minxxl:px-28')}>
          <div className='w-full minlg:mt-20 flex minlg:block justify-start items-end minlg:items-center minlg:mx-auto'>
            <span
              className='minlg:hidden text-lg font-semibold font-noi-grotesk cursor-pointer minlg:ml-28'
              onClick={() => {
                router.back();
              }}>
              Back
            </span>
            <h1 className='text-2xl minlg:text-3xl pl-12 minlg:pl-0 font-semibold font-noi-grotesk'>Create Listings</h1>
          </div>
          {ListingCheckoutInfo()}
        </div>
        {(toList.length === 0 || toList.length > 1) && <div className='hidden minlg:block w-1/5 mt-20'></div>}
      </div>
    );
}