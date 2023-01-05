/* eslint-disable @next/next/no-img-element */
import LoggedInIdenticon from 'components/elements/LoggedInIdenticon';
import { RoundedCornerAmount, RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { NftMemo } from 'components/modules/Analytics/NftMemo';
import { Nft, Profile } from 'graphql/generated/types';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useRefreshNftMutation } from 'graphql/hooks/useNftRefreshMutation';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useRefreshNftOrdersMutation } from 'graphql/hooks/useRefreshNftOrdersMutation';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useNftProfileTokens } from 'hooks/useNftProfileTokens';
import { getContractMetadata } from 'utils/alchemyNFT';
import { getEtherscanLink, isNullOrEmpty, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { NFTDetailContextProvider } from './NFTDetailContext';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowClockwise } from 'phosphor-react';
import { useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';
export interface NFTDetailProps {
  nft: PartialDeep<Nft>;
  onRefreshSuccess?: () => void;
}

export const NFTDetail = (props: NFTDetailProps) => {
  const router = useRouter();

  const defaultChainId = useDefaultChainId();
  
  const { data: collection } = useCollectionQuery(String(defaultChainId), props?.nft?.contract);
  const { data: collectionMetadata } = useSWR('ContractMetadata' + props.nft?.contract, async () => {
    return await getContractMetadata(props.nft?.contract, defaultChainId);
  });
  const collectionName = collectionMetadata?.contractMetadata?.name;

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

  const { profileData: collectionPreferredOwnerData } = useProfileQuery(
    collectionOwnerData?.profile?.owner?.preferredProfile?.url
  );

  const profileOwnerToShow: PartialDeep<Profile> = props.nft?.wallet?.preferredProfile ?? profileData?.profile;
  const collectionOwnerToShow: PartialDeep<Profile> = collectionPreferredOwnerData?.profile ?? null;

  const { refreshNft, loading, success } = useRefreshNftMutation();
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
        'flex minmd:items-center w-full mt-8 py-4 px-4 justify-between',
      )}>
        <div className='flex flex-col'>
          <Link href={`/app/collection/${collection?.collection?.contract}`}>
            <div className="minmd:whitespace-nowrap text-[18px] font-medium font-noi-grotesk mb-2 minmd:mb-0 minmd:leading-[3rem] tracking-wide text-[#6A6A6A] cursor-pointer">
              {isNullOrEmpty(collectionName) ?
                (<div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center">
                  <div className="w-full">
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-36 mb-4"></div>
                  </div>
                  <span className="sr-only">Loading...</span>
                </div>)
                : collectionName}
            </div>
          </Link>
          <div className='font-noi-grotesk font-semibold text-[28px] leading-9 tracking-[-2px]'>
            {isNullOrEmpty(props.nft?.metadata?.name) ?
              (<div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center">
                <div className="w-full">
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-36 mb-4"></div>
                </div>
                <span className="sr-only">Loading...</span>
              </div>)
              : `${props.nft?.metadata?.name}`}
          </div>
        </div>
        <div className='flex flex-col pl-4 minmd:pl-12'>
          {success ?
            <span className='font-noi-grotesk text-[#26AA73]'>Refreshed!</span> :
            <div
              id="refreshNftButton"
              onClick={refreshNftCallback}
              className={tw(
                'rounded-full bg-[#F6F6F6] h-8 w-8 flex items-center justify-center cursor-pointer',
                loading && !success ? 'animate-spin' : null,
              )}
            >
              <ArrowClockwise className='text-[#6F6F6F] h-5 w-5'/>
            </div>
          }
        </div>
      </div>
      <div className='flex flex-row items-center w-full p-4'>
        <div className="grid grid-cols-2 md:gap-x-10 gap-x-32 gap-y-1">
          <span className='flex flex-col font-noi-grotesk text-[16px] not-italic font-medium mb-3 leading-5 text-[#6A6A6A]'>
            Creator
          </span>
          <span className='flex flex-col font-noi-grotesk text-[16px] not-italic font-medium mb-3 leading-5 text-[#6A6A6A]'>
            Owner
          </span>

          <div className='flex items-center'>
            <div className='flex flex-col h-full aspect-square'>
              {collectionOwnerToShow?.photoURL ?
                <RoundedCornerMedia
                  containerClasses='w-full aspect-square'
                  variant={RoundedCornerVariant.All}
                  amount={RoundedCornerAmount.Medium}
                  src={collectionOwnerToShow?.photoURL}
                />
                :
                <div className='rounded-full overflow-hidden shadow-xl border-2 border-white'>
                  <LoggedInIdenticon customString={collection?.collection?.contract} round border />
                </div>
              }
            </div>

            <div className=''>
              <div className='flex flex-col h-full'>
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
                      <span className={tw('text-base font-noi-grotesk font-medium leading-5',
                        'text-black'
                      )}>
                        {collectionOwnerToShow?.url == null ?
                          shortenAddress(collectionOwnerToShow?.owner?.address, 2) :
                          collectionOwnerToShow?.url
                        }
                      </span>
                    </div> :
                    <Link href={getEtherscanLink(Number(defaultChainId), collection?.collection?.contract, 'address')}>
                      <span className="cursor-pointer text-base hover:underline font-medium leading-5 font-noi-grotesk pl-3 pt-1">
                        {shortenAddress(collection?.collection?.contract, isMobile ? 4 : 6) ?? 'Unknown'}
                      </span>
                    </Link>
                }
              </div>
            </div>
          </div>

          <div className='flex items-center'>
            {profileOwnerToShow?.photoURL ?
              <RoundedCornerMedia
                containerClasses='w-[34px] height-[34px] aspect-square'
                variant={RoundedCornerVariant.All}
                amount={RoundedCornerAmount.Medium}
                src={profileOwnerToShow?.photoURL}
              />
              :
              <div className='flex flex-col h-full aspect-square'>
                <div className='rounded-full overflow-hidden shadow-xl border-2 border-white'>
                  <LoggedInIdenticon round border />
                </div>
              </div>
            }

            <div className=''>
              <div className='flex flex-col h-full'>
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
                      <span className="text-base font-medium leading-5 font-noi-grotesk text-link">
                        {!profileOwnerToShow?.url == null ?
                          shortenAddress(props.nft?.wallet?.address, 0) :
                          profileOwnerToShow?.url
                        }
                      </span>
                    </div> :
                    <Link href={getEtherscanLink(Number(defaultChainId), props.nft?.wallet?.address, 'address')}>
                      <span className="text-[#1F2127] text-base cursor-pointer hover:underline font-medium leading-5 font-noi-grotesk pl-3">
                        {shortenAddress(props.nft?.wallet?.address, isMobile ? 4 : 6) ?? 'Unknown'}
                      </span>
                    </Link>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        (
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
