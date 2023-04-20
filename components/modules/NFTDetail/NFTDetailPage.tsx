import { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { useAccount } from 'wagmi';

import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Tabs } from 'components/elements/Tabs';
import { NFTAnalyticsContainer } from 'components/modules/NFTDetail/NFTAnalyticsContainer';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useRefreshNftMutation } from 'graphql/hooks/useNftRefreshMutation';
import { useRefreshNftOrdersMutation } from 'graphql/hooks/useRefreshNftOrdersMutation';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { getContractMetadata } from 'utils/alchemyNFT';
import { isNullOrEmpty } from 'utils/format';
import { filterValidListings } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import { DescriptionDetail } from './DescriptionDetail';
import { ExternalListings } from './ExternalListings';
import { NftChainInfo } from './NftChainInfo';
import { NFTDetail } from './NFTDetail';
import { NFTDetailFeaturedBy } from './NFTDetailFeaturedBy';
import { NFTDetailMoreFromCollection } from './NFTDetailMoreFromCollection';
import { Properties } from './Properties';

export interface NFTDetailPageProps {
  collection: string;
  tokenId: string;
}

export function NFTDetailPage(props: NFTDetailPageProps) {
  const { address: currentAddress } = useAccount();
  const defaultChainId = useDefaultChainId();

  const { data: nft, mutate: mutateNft } = useNftQuery(props.collection, props.tokenId);
  const { data: collection } = useSWR(
    () => (props.collection ? ['ContractMetadata', props.collection] : null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ([url, contract]) => {
      return getContractMetadata(contract, defaultChainId);
    }
  );
  const { refreshNft } = useRefreshNftMutation();
  const { refreshNftOrders } = useRefreshNftOrdersMutation();

  useEffect(() => {
    refreshNftOrders(nft?.id);
  }, [nft?.id, refreshNftOrders]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      refreshNft(nft?.id);
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [nft?.id, refreshNft]);

  const showListings = useMemo(() => {
    return !isNullOrEmpty(filterValidListings(nft?.listings?.items));
  }, [nft]);

  const tabs = [
    {
      label: 'Info',
      content: (
        <>
          <div className='flex w-full p-4 font-noi-grotesk'>
            <DescriptionDetail nft={nft} />
          </div>
          <div className='flex w-full p-4 font-noi-grotesk'>
            <NftChainInfo nft={nft} />
          </div>
        </>
      )
    },
    {
      label: 'Traits',
      content: (
        <>
          <div className='flex w-full p-4'>
            <div className='w-full py-4 font-noi-grotesk'>
              <Properties nft={nft} />
            </div>
          </div>
        </>
      )
    }
  ];

  const DetailTabsComponent = () => {
    return (
      <div>
        <div className='flex w-full flex-col'>
          <div className={tw('flex w-full flex-col minxl:hidden')}>
            {defaultChainId === '1' && (
              <div className='w-full pb-6 pt-4 md:px-4'>
                <ExternalListings nft={nft} collectionName={collection?.contractMetadata?.name} />
                <NFTAnalyticsContainer data={nft} />
              </div>
            )}
          </div>
          <div className='flex w-full items-center justify-start p-4 pb-0'>
            <div className='w-full justify-start'>
              <Tabs tabOptions={tabs} customTabWidth={'w-max'} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='flex min-h-screen w-full flex-col items-center pt-20 md:pt-0'>
      {nft?.metadata?.imageURL && (
        <div className='minlg:py minmd:px-auto flex w-full justify-around bg-[#F2F2F2] minmd:py-3 minxl:py-10'>
          <div className='flex aspect-square h-full max-h-[600px] w-full max-w-nftcom rounded object-contain drop-shadow-lg'>
            <RoundedCornerMedia
              key={nft?.id}
              src={nft?.metadata?.imageURL}
              videoOverride={true}
              variant={RoundedCornerVariant.None}
              objectFit='contain'
              extraClasses='rounded'
              containerClasses='h-full w-full'
            />
          </div>
        </div>
      )}
      <div className='flex w-full flex-col pb-16 minlg:max-w-[650px] minxl:-mb-8 minxl:max-w-nftcom minxl:flex-row md:pb-0'>
        <div className='flex w-full minxl:w-1/2 minxl:flex-col'>
          <NFTDetail
            nft={nft}
            onRefreshSuccess={() => {
              mutateNft();
            }}
            key={nft?.id}
          />
          <div className='hidden minxl:block minxl:pt-5'>
            <DetailTabsComponent />
          </div>
        </div>
        {showListings ||
        (nft?.wallet?.address ?? nft?.owner) === currentAddress ||
        (!isNullOrEmpty(nft?.owner) && !isNullOrEmpty(nft?.wallet?.address)) ? (
          <div className='flex w-full items-end minxl:w-1/2 minxl:flex-col minxl:items-start minxl:p-4 minxl:pt-12'>
            <div className='flex w-full items-start minxl:flex-row lg:hidden'>
              <ExternalListings nft={nft} collectionName={collection?.contractMetadata?.name} />
            </div>
            <div className='hidden w-full minxl:flex minxl:items-end'>
              <NFTAnalyticsContainer data={nft} />
            </div>
          </div>
        ) : (
          defaultChainId === '1' && (
            <div className='flex w-full items-end minxl:w-1/2 minxl:flex-col minxl:items-start minxl:p-4 minxl:pt-12 md:hidden'>
              <div className='hidden w-full minxl:flex minxl:items-end'>
                <NFTAnalyticsContainer data={nft} />
              </div>
            </div>
          )
        )}
      </div>
      <div className='flex w-full flex-col minlg:max-w-[650px] minxl:hidden minxl:max-w-nftcom minxl:flex-row md:mb-6'>
        <DetailTabsComponent />
      </div>
      <NFTDetailMoreFromCollection
        hideTokenId={nft?.tokenId}
        collectionName={
          nft?.contract?.toLowerCase() === '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85'.toLowerCase()
            ? 'ENS: Ethereum Name Service'
            : collection?.contractMetadata?.name
        }
        contract={nft?.contract}
      />
      <div className='-px-4 my-10 flex w-full items-center minlg:max-w-[650px] minxl:max-w-nftcom'>
        <NFTDetailFeaturedBy contract={nft?.contract} tokenId={nft?.tokenId} />
      </div>
    </div>
  );
}
