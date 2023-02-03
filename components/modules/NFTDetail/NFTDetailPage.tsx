import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { NFTAnalyticsContainer } from 'components/modules/NFTDetail/NFTAnalyticsContainer';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useRefreshNftOrdersMutation } from 'graphql/hooks/useRefreshNftOrdersMutation';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { getContractMetadata } from 'utils/alchemyNFT';
import { isNullOrEmpty, processIPFSURL } from 'utils/helpers';
import { filterValidListings } from 'utils/marketplaceUtils';
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
  const { address: currentAddress } = useAccount();
  const defaultChainId = useDefaultChainId();

  const { data: nft, mutate: mutateNft } = useNftQuery(props.collection, props.tokenId);

  const { data: collection } = useSWR('ContractMetadata' + nft?.contract, async () => {
    return await getContractMetadata(nft?.contract, defaultChainId);
  });

  const { refreshNftOrders } = useRefreshNftOrdersMutation();

  useEffect(() => {
    refreshNftOrders(nft?.id);
  }, [refreshNftOrders, nft]);

  const [selectedDetailTab, setSelectedDetailTab] = useState(0);

  const showListings = useMemo(() => {
    return !isNullOrEmpty(filterValidListings(nft?.listings?.items));
  }, [nft]);

  const DetailTabsComponent = () => {
    return (
      <div>
        <div className='flex flex-col w-full'>
          <div className={tw(
            'flex flex-col w-full minxl:hidden',
          )}>
            {(defaultChainId === '1') &&
            <div className="w-full md:px-4 pt-4 pb-6">
              <ExternalListings nft={nft} collectionName={collection?.contractMetadata?.name} />
              <NFTAnalyticsContainer data={nft} />
            </div>
            }
          </div>
          <div className='flex w-full items-center p-4 pb-0 justify-start'>
            <div className='justify-start'>
              <Tab.Group selectedIndex={selectedDetailTab} onChange={(index) => {setSelectedDetailTab(index);}}>
                <Tab.List className="flex rounded-3xl bg-[#F6F6F6]">
                  {Object.keys(detailTabTypes).map((detailTab) => (
                    <Tab key={detailTab}>
                      {({ selected }) =>
                        <div
                          className={
                            tw(
                              'rounded-3xl py-2.5 md:px-5 px-8 text-[#6F6F6F] font-medium font-noi-grotesk text-[16px] md:w-[110px] w-[150px] leading-6',
                              selected && 'bg-black text-[#F8F8F8] font-noi-grotesk text-[16px] leading-6'
                            )
                          }
                        >
                          {detailTabTypes[detailTab]}
                        </div>
                      }
                    </Tab>
                  ))}
                </Tab.List>
              </Tab.Group>
            </div>
          </div>
          {selectedDetailTab == 0 &&
            <>
              <div className='flex w-full p-4 font-noi-grotesk'>
                <DescriptionDetail nft={nft} />
              </div>
              <div className='flex w-full p-4 font-noi-grotesk'>
                <NftChainInfo nft={nft} />
              </div>
            </>
          }
          {selectedDetailTab == 1 &&
            <>
              <div className='flex w-full p-4'>
                <div className='py-4 font-noi-grotesk w-full'>
                  <Properties nft={nft} />
                </div>
              </div>
            </>
          }
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:pt-0 pt-20 items-center w-full">
      {nft?.metadata?.imageURL &&
        <div className='flex w-full bg-[#F2F2F2] justify-around minmd:py-3 minlg:py minxl:py-10 minmd:px-auto'>
          <div className="flex w-full max-h-[600px] h-full max-w-nftcom object-contain drop-shadow-lg rounded aspect-square">
            <RoundedCornerMedia
              key={nft?.id}
              src={processIPFSURL(nft?.metadata?.imageURL)}
              videoOverride={true}
              variant={RoundedCornerVariant.None}
              objectFit='contain'
              extraClasses='rounded'
              containerClasses='h-full w-full' />
          </div>
        </div>
      }
      <div className="flex flex-col minxl:flex-row w-full minxl:max-w-nftcom minlg:max-w-[650px] md:pb-0 pb-16 minxl:-mb-8">
        <div className='flex minxl:w-1/2 w-full minxl:flex-col'>
          <NFTDetail nft={nft} onRefreshSuccess={() => {
            mutateNft();
          }} key={nft?.id} />
          <div className="hidden minxl:block minxl:pt-5">
            <DetailTabsComponent />
          </div>
        </div>
        {(showListings || nft?.wallet?.address === currentAddress) ?
          <div className='flex minxl:w-1/2 w-full items-end minxl:items-start minxl:flex-col minxl:p-4 minxl:pt-12'>
            <div className="lg:hidden flex minxl:flex-row w-full items-start">
              <ExternalListings nft={nft} collectionName={collection?.contractMetadata?.name} />
            </div>
            <div className="w-full hidden minxl:flex minxl:items-end">
              <NFTAnalyticsContainer data={nft} />
            </div>
          </div>
          :
          (defaultChainId === '1') &&
          <div className='md:hidden flex minxl:w-1/2 w-full items-end minxl:items-start minxl:flex-col minxl:p-4 minxl:pt-12'>
            <div className="w-full hidden minxl:flex minxl:items-end">
              <NFTAnalyticsContainer data={nft} />
            </div>
          </div>
        }
      </div>
      <div className="minxl:hidden flex flex-col minxl:flex-row w-full md:mb-6 minxl:max-w-nftcom minlg:max-w-[650px]">
        <DetailTabsComponent />
      </div>
      <NFTDetailMoreFromCollection hideTokenId={nft?.tokenId} collectionName={nft?.contract?.toLowerCase() === '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85'.toLowerCase() ? 'ENS: Ethereum Name Service' : collection?.contractMetadata?.name} contract={nft?.contract} />
      <div className="w-full my-10 flex items-center -px-4 minxl:max-w-nftcom minlg:max-w-[650px]">
        <NFTDetailFeaturedBy contract={nft?.contract} tokenId={nft?.tokenId} />
      </div>
    </div>
  );
}
