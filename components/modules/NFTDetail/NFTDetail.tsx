/* eslint-disable @next/next/no-img-element */
import LoggedInIdenticon from 'components/elements/LoggedInIdenticon';
import { NftMemo } from 'components/modules/Analytics/NftMemo';
import { Nft, Profile } from 'graphql/generated/types';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useRefreshNftMutation } from 'graphql/hooks/useNftRefreshMutation';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useRefreshNftOrdersMutation } from 'graphql/hooks/useRefreshNftOrdersMutation';
import { useNftProfileTokens } from 'hooks/useNftProfileTokens';
import { Doppler,getEnv, getEnvBool } from 'utils/env';
import { isNullOrEmpty, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { NFTDetailContextProvider } from './NFTDetailContext';

import { BigNumber } from 'ethers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowClockwise } from 'phosphor-react';
import { useCallback } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork } from 'wagmi';
export interface NFTDetailProps {
  nft: PartialDeep<Nft>;
  onRefreshSuccess?: () => void;
}

export const NFTDetail = (props: NFTDetailProps) => {
  const router = useRouter();

  const { chain } = useNetwork();
  const { data: collection } = useCollectionQuery(String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)), props?.nft?.contract);
  const { profileTokens } = useNftProfileTokens(props.nft?.wallet?.address);
  const { profileTokens: creatorTokens } = useNftProfileTokens(collection?.collection?.deployer);
  const { address: currentAddress } = useAccount();

  const { profileData } = useProfileQuery(
    props.nft?.wallet?.preferredProfile == null ?
      profileTokens?.at(0)?.tokenUri?.raw?.split('/').pop() :
      null
  );

  const { profileData: collectionOwnerData } = useProfileQuery(
    creatorTokens?.at(0)?.tokenUri?.raw?.split('/').pop()
  );

  const profileOwnerToShow: PartialDeep<Profile> = props.nft?.wallet?.preferredProfile ?? profileData?.profile;
  const collectionOwnerToShow: PartialDeep<Profile> = collectionOwnerData?.profile ?? null;

  const { refreshNft, loading } = useRefreshNftMutation();
  const { refreshNftOrders } = useRefreshNftOrdersMutation();

  const refreshNftCallback = useCallback(() => {
    (async () => {
      const result = await refreshNft(props.nft?.id);
      await refreshNftOrders(props.nft?.id);
      if (result) {
        props.onRefreshSuccess && props.onRefreshSuccess();
      }
    })();
  }, [props, refreshNft, refreshNftOrders]);
  
  return (
    <div className="flex flex-col w-full max-w-nftcom" id="NFTDetailContainer" key={props.nft?.id}>
      <div className={tw(
        'flex items-center w-full mt-8 py-4 px-4 justify-between',
      )}>
        <div className='flex flex-col'>
          <Link href={`/app/collection/${collection?.collection?.contract}`}>
            <div className="whitespace-nowrap text-lg font-normal font-grotesk leading-6 tracking-wide text-[#1F2127] underline">
              {isNullOrEmpty(collection?.collection?.name) ? 'Unknown Name' : collection?.collection?.name}
            </div>
          </Link>
          <div className='font-grotesk font-bold text-2xl leading-9'>
            {isNullOrEmpty(props.nft?.metadata?.name) ? 'Unknown Name' : `${props.nft?.metadata?.name}`}
          </div>
        </div>
        <div className='flex flex-col pl-12 minmd:pr-12'>
          <div
            id="refreshNftButton"
            onClick={refreshNftCallback}
            className={tw(
              'rounded-full bg-[#F6F6F6] h-8 w-8 flex items-center justify-center cursor-pointer',
              loading ? 'animate-spin' : null
            )}
          >
            <ArrowClockwise className='text-[#6F6F6F] h-5 w-5'/>
          </div>
        </div>
      </div>
      <div className='flex flex-row items-center w-full h-full p-4'>
        <div className='flex flex-col h-full aspect-square'>
          {collectionOwnerToShow?.photoURL ?
            <img
              className='rounded-md aspect-square h-full w-full'
              src={collectionOwnerToShow?.photoURL}
              alt='creator-profile-pic'
            />
            :
            <LoggedInIdenticon round border />
          }
        </div>
        <div className='flex flex-col w-1/2 h-full'>
          <div className='flex flex-col h-full'>
            <span className='flex flex-col pl-3 font-grotesk text-[10px] not-italic font-bold leading-5 tracking-widest text-[#6F6F6F]'>
              CREATOR
            </span>
            {
              creatorTokens?.length > 0 ?
                <div
                  className={tw(
                    'flex px-3 items-center',
                    collectionOwnerToShow?.url != null && 'cursor-pointer'
                  )}
                  onClick={() => {
                    if (collectionOwnerToShow?.url == null) {
                      return;
                    }
                    router.push('/' + collectionOwnerToShow?.url);
                  }}
                >
                  <span className='text-base font-medium leading-5 font-grotesk text-link font-dm-mono'>
                    {collectionOwnerToShow?.url == null ?
                      shortenAddress(collectionOwnerToShow?.owner?.address, 2) :
                      collectionOwnerToShow?.url
                    }
                  </span>
                </div> :
                <span className="text-[#1F2127] text-base font-medium leading-5 font-dm-mono pl-3 pt-1">
                  {shortenAddress(collection?.collection?.contract, 2) ?? 'Unknown'}
                </span>
            }
          </div>
        </div>
        <div className='flex flex-col h-full'>
          <div className='flex flex-col h-[42px] w-[42px]'>
            {profileOwnerToShow?.photoURL ?
              <img
                className='rounded-md aspect-square h-full w-full'
                src={profileOwnerToShow?.photoURL}
                alt='owner-profile-pic'
              />
              :
              <LoggedInIdenticon round border />
            }
          </div>
        </div>
        <div className='flex flex-col h-full'>
          <span className='flex flex-col pl-3 font-grotesk text-[10px] not-italic font-bold leading-5 tracking-widest text-[#6F6F6F]'>
            OWNER
          </span>
          {
            profileTokens?.length > 0 ?
              <div
                className={tw(
                  'flex px-3 items-center',
                  profileOwnerToShow?.url != null && 'cursor-pointer'
                )}
                onClick={() => {
                  if (profileOwnerToShow?.url == null) {
                    return;
                  }
                  router.push('/' + profileOwnerToShow?.url);
                }}
              >
                <span className="text-base font-medium leading-5 font-grotesk text-link">
                  {!profileOwnerToShow?.url == null ?
                    shortenAddress(props.nft?.wallet?.address, 0) :
                    profileOwnerToShow?.url
                  }
                </span>
              </div> :
              <span className="text-[#1F2127] text-base font-medium leading-5 font-grotesk pl-3">
                {shortenAddress(props.nft?.wallet?.address, 2) ?? 'Unknown'}
              </span>
          }
        </div>
      </div>
      {
        ((getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED)) &&
          (currentAddress === props.nft?.wallet?.address) ||
          (currentAddress !== props.nft?.wallet?.address && !isNullOrEmpty(props.nft?.memo)))
          &&
          <div className="flex minxl:basis-1/2">
            <NFTDetailContextProvider nft={props.nft} >
              <NftMemo nft={props.nft} />
            </NFTDetailContextProvider>
          </div>
      }
    </div>
  );
};
