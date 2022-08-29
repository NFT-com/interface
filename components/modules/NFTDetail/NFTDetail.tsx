/* eslint-disable @next/next/no-img-element */
import { Nft, Profile } from 'graphql/generated/types';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useRefreshNftMutation } from 'graphql/hooks/useNftRefreshMutation';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useRefreshNftOrdersMutation } from 'graphql/hooks/useRefreshNftOrdersMutation';
import { useNftProfileTokens } from 'hooks/useNftProfileTokens';
import { Doppler,getEnv } from 'utils/env';
import { getEtherscanLink, isNullOrEmpty, processIPFSURL, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { ArrowClockwise } from 'phosphor-react';
import { useCallback } from 'react';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';
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
    <div className="flex flex-col w-screen" id="NFTDetailContainer" key={props.nft?.id}>
      {props.nft?.metadata?.imageURL &&
        <div className="flex w-full h-full object-contain aspect-square drop-shadow-lg">
          <video
            autoPlay
            muted
            loop
            poster={processIPFSURL(props.nft?.metadata?.imageURL)}
            className='rounded-md'
            src={processIPFSURL(props.nft?.metadata?.imageURL)}
            key={props.nft?.id}
          />
        </div>
      }
      <div className={tw(
        'flex flex-row w-full mt-8 py-4 pl-4',
      )}>
        <div className='flex flex-col w-1/2'>
          <div className="whitespace-nowrap text-lg font-normal font-grotesk leading-6 tracking-wide text-[#1F2127]">
            {isNullOrEmpty(collection?.collection?.name) ? 'Unknown Name' : collection?.collection?.name}
          </div>
          <h3 className='font-grotesk font-bold text-2xl leading-9'>
            {isNullOrEmpty(props?.nft?.tokenId) ? 'Unknown token ID' : `#${BigNumber.from(props.nft?.tokenId).toNumber()}`}
          </h3>
        </div>
        <div className='flex flex-col w-1/2 pl-24 -mt-1'>
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

      <div className='flex flex-row items-center w-full h-full py-4 pl-4'>
        {//todo: show collection owner pic
        }
        <div className='flex flex-col h-full'>
          {collectionOwnerToShow?.photoURL && <div className="flex flex-col h-[42px] w-[42px]">
            <img
              className='rounded-md aspect-square h-full w-full'
              src={collectionOwnerToShow?.photoURL}
              alt='creator-profile-pic'
            />
          </div>}
        </div>
        <div className='flex flex-col w-1/2 h-full'>
          <div className='flex flex-col h-full'>
            <span className='flex flex-col pl-[11px] -mt-2 font-grotesk text-[10px] not-italic font-bold leading-5 tracking-widest text-[#6F6F6F]'>
            CREATOR
            </span>
            {
              creatorTokens?.length > 0 ?
                <div
                  className={tw(
                    'flex px-2 items-center',
                    collectionOwnerToShow?.url != null && 'cursor-pointer'
                  )}
                  onClick={() => {
                    if (collectionOwnerToShow?.url == null) {
                      return;
                    }
                    router.push('/' + collectionOwnerToShow?.url);
                  }}
                >
                  <span className='text-[14px] font-medium leading-5 font-grotesk text-link'>
                    {collectionOwnerToShow?.url == null ?
                      shortenAddress(collectionOwnerToShow?.owner?.address) :
                      '@' + collectionOwnerToShow?.url
                    }
                  </span>
                </div> :
                <span className="text-[#1F2127] text-[14px] font-medium leading-5 font-grotesk pl-[11px] pt-2">
                  {shortenAddress(collection?.collection?.contract) ?? 'Unknown'}
                </span>
            }
          </div>
        </div>
        <div className='flex flex-col h-full'>
          {profileOwnerToShow?.photoURL && <div className="flex flex-col h-[42px] w-[42px]">
            <img
              className='rounded-md aspect-square h-full w-full'
              src={profileOwnerToShow?.photoURL}
              alt='owner-profile-pic'
            />
          </div>}
        </div>
        <div className='flex flex-col h-full'>
          <span className='flex flex-col pl-[11px] -mt-2 font-grotesk text-[10px] not-italic font-bold leading-5 tracking-widest text-[#6F6F6F]'>
            OWNER
          </span>
          {
            profileTokens?.length > 0 ?
              <div
                className={tw(
                  'flex px-2 items-center',
                  profileOwnerToShow?.url != null && 'cursor-pointer'
                )}
                onClick={() => {
                  if (profileOwnerToShow?.url == null) {
                    return;
                  }
                  router.push('/' + profileOwnerToShow?.url);
                }}
              >
                <span className="text-[14px] font-medium leading-5 font-grotesk text-link">
                  {profileOwnerToShow?.url == null ?
                    shortenAddress(props.nft?.wallet?.address) :
                    '@' + profileOwnerToShow?.url
                  }
                </span>
              </div> :
              <span className="text-[#1F2127] text-[14px] font-medium leading-5 font-grotesk">
                {shortenAddress(props.nft?.wallet?.address) ?? 'Unknown'}
              </span>
          }
        </div>
      </div>
    </div>
  );
};
