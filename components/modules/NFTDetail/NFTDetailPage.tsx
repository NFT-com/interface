import { NFTAnalyticsContainer } from 'components/modules/NFTDetail/NFTAnalyticsContainer';
import { useExternalListingsQuery } from 'graphql/hooks/useExternalListingsQuery';
import { useListingActivitiesQuery } from 'graphql/hooks/useListingActivitiesQuery';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useRefreshNftOrdersMutation } from 'graphql/hooks/useRefreshNftOrdersMutation';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { getContractMetadata } from 'utils/alchemyNFT';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty, processIPFSURL } from 'utils/helpers';
import { tw } from 'utils/tw';

import { DescriptionDetail } from './DescriptionDetail';
import { ExternalListings } from './ExternalListings';
import { NftChainInfo } from './NftChainInfo';
import { NFTDetail } from './NFTDetail';
import { NFTDetailFeaturedBy } from './NFTDetailFeaturedBy';
import { NFTDetailMoreFromCollection } from './NFTDetailMoreFromCollection';
import { Properties } from './Properties';

import { Tab } from '@headlessui/react';
import { useEffect, useMemo,useState } from 'react';
import useSWR from 'swr';
import { useAccount } from 'wagmi';

export interface NFTDetailPageProps {
  collection: string;
  tokenId: string;
}

const detailTabTypes = {
  0: 'Info',
  1: 'Traits'
};

export function NFTDetailPage(props: NFTDetailPageProps) {
  const { data: nft, mutate: mutateNft } = useNftQuery(props.collection, props.tokenId);

  const { address: currentAddress } = useAccount();
  const defaultChainId = useDefaultChainId();

  const { data: collection } = useSWR('ContractMetadata' + nft?.contract, async () => {
    return await getContractMetadata(nft?.contract, defaultChainId);
  });
  
  const { data: legacyListings, mutate: mutateLegacyListings } = useExternalListingsQuery(
    nft?.contract,
    nft?.tokenId,
    defaultChainId
  );

  const { data: listings } = useListingActivitiesQuery(
    nft?.contract,
    nft?.tokenId,
    defaultChainId,
    nft?.wallet?.address
  );

  const { refreshNftOrders } = useRefreshNftOrdersMutation();

  useEffect(() => {
    refreshNftOrders(nft?.id);
  }, [refreshNftOrders, nft]);

  const [selectedDetailTab, setSelectedDetailTab] = useState(detailTabTypes[0]);

  const showListings = useMemo(() => {
    if (getEnvBool(Doppler.NEXT_PUBLIC_ROUTER_ENABLED)) {
      return !isNullOrEmpty(listings);
    } else {
      return !isNullOrEmpty(legacyListings.filter(x => !isNullOrEmpty(x.url)));
    }
  }, [legacyListings, listings]);

  return (
    <div className="flex flex-col pt-20 items-center w-full">
      {nft?.metadata?.imageURL &&
        <div className='flex w-full bg-[#F0F0F0] justify-around minmd:py-3 minlg:py minxl:py-10 minmd:px-auto'>
          <div className="flex w-full max-w-[600px] h-full object-contain drop-shadow-lg rounded aspect-square">
            <video
              autoPlay
              muted
              loop
              poster={processIPFSURL(nft?.metadata?.imageURL)}
              className='rounded aspect-square'
              src={processIPFSURL(nft?.metadata?.imageURL)}
              key={nft?.id}
            />
          </div>
        </div>
      }
      <div className="flex flex-col minxl:flex-row w-full minxl:max-w-nftcom minlg:max-w-[650px] pb-8 minxl:-mb-8">
        <div className='flex minxl:w-1/2 w-full'>
          <NFTDetail nft={nft} onRefreshSuccess={() => {
            mutateNft();
            mutateLegacyListings();
          }} key={nft?.id} />
        </div>
        {(showListings || nft?.wallet?.address === currentAddress) ?
          <div className='flex minxl:w-1/2 w-full items-end minxl:items-start minxl:flex-col minxl:p-4'>
            <div className="flex minxl:flex-row w-full items-start">
              <ExternalListings nft={nft} collectionName={collection?.contractMetadata?.name} />
            </div>
            <div className="w-full hidden minxl:flex minxl:overflow-hidden minxl:items-end">
              <NFTAnalyticsContainer data={nft} />
            </div>
          </div>
          :
          (defaultChainId === '1') &&
          <div className="minxl:w-1/2 w-full hidden minxl:flex minxl:overflow-hidden">
            <NFTAnalyticsContainer data={nft} />
          </div>
        }
      </div>
      <div className="flex flex-col minxl:flex-row w-full minxl:max-w-nftcom minlg:max-w-[650px]">
        <div className='flex flex-col w-full minxl:w-1/2'>
          <div className='flex w-full items-center p-4 justify-start'>
            <div className='justify-start'>
              <Tab.Group onChange={(index) => {setSelectedDetailTab(detailTabTypes[index]);}}>
                <Tab.List className="flex rounded-3xl bg-[#F6F6F6]">
                  {Object.keys(detailTabTypes).map((detailTab) => (
                    <Tab
                      key={detailTab}
                      className={({ selected }) =>
                        tw(
                          'rounded-3xl py-2.5 px-8 minmd:px-10 text-[#6F6F6F] font-grotesk text-base font-semibold leading-6',
                          selected && 'bg-black text-[#F8F8F8] font-grotesk text-base font-semibold leading-6'
                        )
                      }
                    >
                      {detailTabTypes[detailTab]}
                    </Tab>
                  ))}
                </Tab.List>
              </Tab.Group>
            </div>
          </div>
          {selectedDetailTab === 'Info' &&
            <>
              <div className='flex w-full p-4 font-grotesk'>
                <DescriptionDetail nft={nft} />
              </div>
              <div className='flex w-full p-4 font-grotesk'>
                <NftChainInfo nft={nft} />
              </div>
            </>
          }
          {selectedDetailTab === 'Traits' &&
            <>
              <div className='flex w-full p-4'>
                <div className='border border-[#E1E1E1] rounded-md py-4 font-grotesk w-full'>
                  <Properties nft={nft} />
                </div>
              </div>
            </>
          }
        </div>
        <div className={tw(
          'flex flex-col w-full minxl:hidden',
        )}>
          {(defaultChainId === '1') &&
            <div className="w-full">
              <NFTAnalyticsContainer data={nft} />
            </div>
          }
        </div>
      </div>
      <div className="w-full my-10 flex items-center -px-4 minxl:max-w-nftcom minlg:max-w-[650px]">
        <NFTDetailMoreFromCollection collectionName={collection?.contractMetadata?.name} contract={nft?.contract} />
      </div>
      <div className="w-full my-10 flex items-center -px-4 minxl:max-w-nftcom minlg:max-w-[650px]">
        <NFTDetailFeaturedBy contract={nft?.contract} tokenId={nft?.tokenId} />
      </div>
    </div>
  );
}
