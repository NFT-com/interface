import { NftMemo } from 'components/modules/Analytics/NftMemo';
import { NFTAnalyticsContainer } from 'components/modules/NFTDetail/NFTAnalyticsContainer';
import { useExternalListingsQuery } from 'graphql/hooks/useExternalListingsQuery';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { getContractMetadata } from 'utils/alchemyNFT';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { DescriptionDetail } from './DescriptionDetail';
import { ExternalListings } from './ExternalListings';
import { NftChainInfo } from './NftChainInfo';
import { NFTDetail } from './NFTDetail';
import { NFTDetailContextProvider } from './NFTDetailContext';
import { NFTDetailFeaturedBy } from './NFTDetailFeaturedBy';
import { NFTDetailMoreFromCollection } from './NFTDetailMoreFromCollection';
import { Properties } from './Properties';

import { Tab } from '@headlessui/react';
import { useState } from 'react';
import useSWR from 'swr';
import { useAccount, useNetwork } from 'wagmi';

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
  const { mutate: mutateListings } = useExternalListingsQuery(nft?.contract, nft?.tokenId, String(nft?.wallet.chainId || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)));

  const { address: currentAddress } = useAccount();

  const { chain } = useNetwork();
  const { data: collection } = useSWR('ContractMetadata' + nft?.contract, async () => {
    return await getContractMetadata(nft?.contract, chain?.id);
  });

  const [selectedDetailTab, setSelectedDetailTab] = useState(detailTabTypes[0]);

  return (
    <div className="flex flex-col pt-20 items-center w-full max-w-7xl mx-auto">
      <NFTDetail nft={nft} onRefreshSuccess={() => {
        mutateNft();
        mutateListings();
      }} key={nft?.id} />
      <ExternalListings nft={nft} collectionName={collection?.contractMetadata?.name} />
      {
        ((getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED)) &&
        (currentAddress === nft?.wallet?.address) ||
        (currentAddress !== nft?.wallet?.address && !isNullOrEmpty(nft?.memo)))
        &&
        <NFTDetailContextProvider nft={nft} >
          <NftMemo nft={nft} />
        </NFTDetailContextProvider>
      }
      <div className='flex flex-row w-full items-center pt-4'>
        <div className='w-2/3 justify-start h-[40px] pl-4'>
          <Tab.Group onChange={(index) => {setSelectedDetailTab(detailTabTypes[index]);}}>
            <Tab.List className="flex rounded-3xl bg-[#F6F6F6]">
              {Object.keys(detailTabTypes).map((detailTab) => (
                <Tab
                  key={detailTab}
                  className={({ selected }) =>
                    tw(
                      'w-full rounded-3xl py-2.5 px-7 text-[#6F6F6F] font-grotesk text-base font-semibold leading-6',
                      selected
                      && 'bg-black text-[#F8F8F8] font-grotesk text-base font-semibold leading-6'
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
        <div className='flex flex-col w-full p-4 font-grotesk'>
          <DescriptionDetail nft={nft} />
        </div>
        <div className='flex flex-col w-full p-4 font-grotesk'>
          <NftChainInfo nft={nft} />
        </div>
      </>
      }
      {selectedDetailTab === 'Traits' &&
      <>
        <div className='flex flex-col w-full p-4'>
          <div className='border border-[#E1E1E1] rounded-md py-4 font-grotesk w-full'>
            <Properties nft={nft} />
          </div>
        </div>
      </>}
      <div className='w-full flex flex-col minlg:flex-row p-4 '>
        {(getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED) && chain?.id === 1) &&
            <div className="minlg:w-1/2 w-full border-b dark:border-accent-border-dk border-accent-border pb-5 mb-20">
              <NFTAnalyticsContainer data={nft} />
            </div>
        }
      </div>
      {
        getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED) &&
        <div className="w-full my-10 flex items-center">
          <NFTDetailMoreFromCollection contract={nft?.contract} />
        </div>
      }
      {
        getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED) &&
        <div className="w-full my-10 flex items-center">
          <NFTDetailFeaturedBy contract={nft?.contract} tokenId={nft?.tokenId} />
        </div>
      }
    </div>
  );
}
