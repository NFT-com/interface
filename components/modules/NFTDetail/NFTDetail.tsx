/* eslint-disable @next/next/no-img-element */
import { useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowClockwise } from 'phosphor-react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

import LikeCount from 'components/elements/LikeCount';
import LoggedInIdenticon from 'components/elements/LoggedInIdenticon';
import { RoundedCornerAmount, RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { NftMemo } from 'components/modules/Analytics/NftMemo';
import { getAddressForChain, nftProfile } from 'constants/contracts';
import { LikeableType, Nft, NftType, Profile } from 'graphql/generated/types';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useNftLikeQuery } from 'graphql/hooks/useNFTLikeQuery';
import { useRefreshNftMutation } from 'graphql/hooks/useNftRefreshMutation';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useRefreshNftOrdersMutation } from 'graphql/hooks/useRefreshNftOrdersMutation';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useNftProfileTokens } from 'hooks/useNftProfileTokens';
import { getContractMetadata } from 'utils/alchemyNFT';
import { isNullOrEmpty } from 'utils/format';
import { getEtherscanLink, isOfficialCollection, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import GK from 'public/icons/Badge_Key.svg?svgr';
import MultipleOwners from 'public/icons/multiple_owners.svg?svgr';
import Owner from 'public/icons/owner.svg?svgr';

import { NFTDetailContextProvider } from './NFTDetailContext';

export interface NFTDetailProps {
  nft: PartialDeep<Nft>;
  onRefreshSuccess?: () => void;
}

export const NFTDetail = (props: NFTDetailProps) => {
  const router = useRouter();

  const defaultChainId = useDefaultChainId();

  const { data: collection } = useCollectionQuery({ chainId: String(defaultChainId), contract: props?.nft?.contract });
  const { data: collectionMetadata } = useSWR(
    () => (props?.nft?.contract ? ['ContractMetadata', props?.nft?.contract] : null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([url, contract]) => {
      return getContractMetadata(contract, defaultChainId);
    }
  );

  const collectionName =
    collectionMetadata?.contractMetadata?.name || collectionMetadata?.contractMetadata?.openSea?.collectionName;

  const { profileData: nftProfileData } = useProfileQuery(
    props.nft?.contract === getAddressForChain(nftProfile, defaultChainId) ? props.nft?.metadata?.name : null
  );

  const { profileTokens } = useNftProfileTokens(props.nft?.owner ?? props.nft?.wallet?.address);
  const { profileTokens: creatorTokens } = useNftProfileTokens(collection?.collection?.deployer);
  const { address: currentAddress } = useAccount();

  const { data: nftLikeData, mutate: mutateNftLike } = useNftLikeQuery(props?.nft?.contract, props?.nft?.tokenId);

  const { profileData } = useProfileQuery(
    props.nft?.wallet?.preferredProfile == null ? profileTokens?.at(0)?.tokenUri?.raw?.split('/').pop() : null
  );

  const { profileData: collectionOwnerData } = useProfileQuery(creatorTokens?.at(0)?.tokenUri?.raw?.split('/').pop());

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
    <div className='flex w-full max-w-nftcom flex-col' id='NFTDetailContainer' key={props.nft?.id}>
      <div className={tw('mt-8 flex w-full justify-between px-4 py-4 minmd:items-center')}>
        <div className='flex flex-col overflow-hidden text-ellipsis whitespace-nowrap'>
          <Link href={`/app/collection/${isOfficialCollection(collection?.collection)}`}>
            <div className='mb-2 cursor-pointer font-noi-grotesk text-[18px] font-medium tracking-wide text-[#6A6A6A]'>
              {isNullOrEmpty(collectionName) ? (
                <div
                  role='status'
                  className='animate-pulse space-y-8 md:flex md:items-center md:space-x-8 md:space-y-0'
                >
                  <div className='w-full'>
                    <div className='mb-4 h-2.5 w-36 rounded-full bg-gray-200 dark:bg-gray-700'></div>
                  </div>
                  <span className='sr-only'>Loading...</span>
                </div>
              ) : (
                collectionName
              )}
            </div>
          </Link>
          <div className='flex items-center'>
            {isNullOrEmpty(props.nft?.metadata?.name) ? (
              <div role='status' className='animate-pulse space-y-8 md:flex md:items-center md:space-x-8 md:space-y-0'>
                <div className='w-full'>
                  <div className='mb-4 h-2.5 w-36 rounded-full bg-gray-200 dark:bg-gray-700'></div>
                </div>
                <span className='sr-only'>Loading...</span>
              </div>
            ) : (
              <>
                <div className='overflow-hidden text-ellipsis whitespace-nowrap font-noi-grotesk text-[28px] font-semibold leading-9 tracking-[-2px]'>
                  {props.nft?.metadata?.name}
                </div>
                {nftProfileData?.profile?.isGKMinted && (
                  <div className='ml-2 h-5 w-5 minlg:h-6 minlg:w-6'>
                    <GK />
                  </div>
                )}

                <div className='ml-3'>
                  <LikeCount
                    mutate={mutateNftLike}
                    count={nftLikeData?.likeCount}
                    isLiked={nftLikeData?.isLikedBy}
                    likeData={{
                      id: props?.nft?.id,
                      type: LikeableType.Nft
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className='flex flex-col pl-4 minlg:pl-12'>
          {success ? (
            <span className='font-noi-grotesk text-[#26AA73]'>Refreshed!</span>
          ) : (
            <div
              id='refreshNftButton'
              onClick={refreshNftCallback}
              className={tw(
                'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F6F6F6]',
                loading && !success ? 'animate-spin' : null
              )}
            >
              <ArrowClockwise className='h-5 w-5 text-[#6F6F6F]' />
            </div>
          )}
        </div>
      </div>
      <div className='flex w-full flex-row items-center p-4'>
        <div className='grid grid-cols-2 gap-x-32 gap-y-1 md:gap-x-10'>
          <span className='mb-3 flex flex-col font-noi-grotesk text-[16px] font-medium not-italic leading-5 text-[#6A6A6A]'>
            Creator
          </span>
          <span className='mb-3 flex flex-col font-noi-grotesk text-[16px] font-medium not-italic leading-5 text-[#6A6A6A]'>
            Owner
          </span>

          <div className='flex items-center'>
            <div className='flex aspect-square h-[42px] w-[42px] flex-col'>
              {collectionOwnerToShow?.photoURL ? (
                <RoundedCornerMedia
                  containerClasses='shadow-xl border-2 border-white aspect-square'
                  variant={RoundedCornerVariant.Full}
                  amount={RoundedCornerAmount.Medium}
                  src={collectionOwnerToShow?.photoURL}
                />
              ) : (
                <div className='overflow-hidden rounded-full border-2 border-white shadow-xl'>
                  <LoggedInIdenticon customSize={36} customString={collection?.collection?.contract} round border />
                </div>
              )}
            </div>

            <div className=''>
              <div className='flex h-full flex-col'>
                {creatorTokens?.length > 0 ? (
                  <div
                    className={tw('flex items-center px-3', collectionOwnerToShow?.url != null && 'cursor-pointer')}
                    onClick={() => {
                      if (collectionOwnerToShow?.url == null) {
                        return;
                      }
                      router.push(`/${collectionOwnerToShow?.url}`);
                    }}
                  >
                    <span className={tw('font-noi-grotesk text-base font-medium leading-5', 'text-black')}>
                      {collectionOwnerToShow?.url == null
                        ? shortenAddress(collectionOwnerToShow?.owner?.address, 2)
                        : collectionOwnerToShow?.url}
                    </span>
                  </div>
                ) : (
                  <Link href={getEtherscanLink(Number(defaultChainId), collection?.collection?.contract, 'address')}>
                    <span className='cursor-pointer pl-3 pt-1 font-noi-grotesk text-base font-medium leading-5 hover:underline'>
                      {shortenAddress(collection?.collection?.contract, isMobile ? 4 : 6) ?? 'Unknown'}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className='flex items-center'>
            {isNullOrEmpty(props.nft?.owner) && isNullOrEmpty(props.nft?.wallet?.address) ? (
              props?.nft?.type === NftType.Erc1155 ? (
                <div className='h-9 w-9 rounded-full'>
                  <MultipleOwners className='rounded-full shadow-lg' />
                </div>
              ) : (
                <div className='h-9 w-9 rounded-full'>
                  <Owner className='rounded-full shadow-lg' />
                </div>
              )
            ) : profileOwnerToShow?.photoURL ? (
              <RoundedCornerMedia
                containerClasses='w-[42px] shadow-xl border-2 border-white h-[42px] aspect-square'
                variant={RoundedCornerVariant.Full}
                amount={RoundedCornerAmount.Medium}
                src={profileOwnerToShow?.photoURL}
              />
            ) : (
              <div className='overflow-hidden rounded-full border-2 border-white shadow-xl'>
                <LoggedInIdenticon customSize={36} round border />
              </div>
            )}

            <div className='overflow-hidden'>
              <div className='flex h-full flex-col'>
                {profileTokens?.length > 0 ? (
                  <div
                    className={tw('flex items-center px-3', profileOwnerToShow?.url != null && 'cursor-pointer')}
                    onClick={() => {
                      if (profileOwnerToShow?.url == null) {
                        return;
                      }
                      router.push(`/${profileOwnerToShow?.url}`);
                    }}
                  >
                    <span className='overflow-hidden text-ellipsis font-noi-grotesk text-base font-medium leading-5 text-link'>
                      {!profileOwnerToShow?.url == null
                        ? shortenAddress(props.nft?.owner ?? props.nft?.wallet?.address, 0)
                        : profileOwnerToShow?.url}
                    </span>
                  </div>
                ) : (
                  <Link
                    href={getEtherscanLink(
                      Number(defaultChainId),
                      props.nft?.owner ?? props.nft?.wallet?.address,
                      'address'
                    )}
                  >
                    <span className='cursor-pointer pl-3 font-noi-grotesk text-base font-medium leading-5 text-[#1F2127] hover:underline'>
                      {!isNullOrEmpty(props.nft?.owner) || !isNullOrEmpty(props.nft?.wallet?.address) ? (
                        shortenAddress(props.nft?.owner ?? props.nft?.wallet?.address, isMobile ? 4 : 6) ?? 'Unknown'
                      ) : (
                        <div className='h-3 w-20 animate-pulse rounded-full bg-[#E6E6E6]'></div>
                      )}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {((currentAddress === props.nft?.wallet?.address && !isNullOrEmpty(currentAddress)) ||
        (currentAddress !== props.nft?.wallet?.address &&
          !isNullOrEmpty(props.nft?.wallet?.address) &&
          !isNullOrEmpty(props.nft?.memo))) && (
        <div className='flex minxl:basis-1/2'>
          <NFTDetailContextProvider nft={props.nft}>
            <NftMemo nft={props.nft} />
          </NFTDetailContextProvider>
        </div>
      )}
    </div>
  );
};
