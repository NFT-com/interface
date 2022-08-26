import { NftMemo } from 'components/modules/Analytics/NftMemo';
import { NFTAnalyticsContainer } from 'components/modules/NFTDetail/NFTAnalyticsContainer';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { getContractMetadata } from 'utils/alchemyNFT';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';

import { DescriptionDetail } from './DescriptionDetail';
import { ExternalListings } from './ExternalListings';
import { NftChainInfo } from './NftChainInfo';
import { NFTDetail } from './NFTDetail';
import { NFTDetailContextProvider } from './NFTDetailContext';
import { Properties } from './Properties';

import useSWR from 'swr';
import { useAccount, useNetwork } from 'wagmi';

export interface NFTDetailPageProps {
  collection: string;
  tokenId: string;
}

export function NFTDetailPage(props: NFTDetailPageProps) {
  const { address: currentAddress } = useAccount();
  const { data: nft, mutate } = useNftQuery(props.collection, props.tokenId);
  const { chain } = useNetwork();
  const { data: collection } = useSWR('ContractMetadata' + nft?.contract, async () => {
    return await getContractMetadata(nft?.contract, chain?.id);
  });

  return (
    <div className="flex flex-col pt-20 items-center w-full max-w-7xl mx-auto">
      <NFTDetail nft={nft} onRefreshSuccess={mutate} key={nft?.id} />
      {
        ((getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED)) &&
        (currentAddress === nft?.wallet?.address) ||
        (currentAddress !== nft?.wallet?.address && !isNullOrEmpty(nft?.memo)))
        &&
        <NFTDetailContextProvider nft={nft} >
          <NftMemo nft={nft} />
        </NFTDetailContextProvider>
      }
      <ExternalListings nft={nft} collectionName={collection?.contractMetadata?.name} />
      <div className='w-full flex flex-col minlg:flex-row p-4'>
        <div className='flex flex-col minlg:w-1/2 w-full minlg:pr-4 pr-0'>
          <div className='w-full border-b dark:border-accent-border-dk border-accent-border pb-5'>
            <DescriptionDetail nft={nft} />
          </div>
          <div className='w-full border-b dark:border-accent-border-dk border-accent-border pb-5'>
            <NftChainInfo nft={nft} />
          </div>
        </div>
        <div className="minlg:w-1/2 w-full border-b dark:border-accent-border-dk border-accent-border pb-5 mb-20">
          <Properties nft={nft} />
        </div>
        {
          //TODO: @anthony - get data from indexer
          getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED) &&
            <div className="minlg:w-1/2 w-full border-b dark:border-accent-border-dk border-accent-border pb-5 mb-20">
              <NFTAnalyticsContainer data={nft} />
            </div>
        }
      </div>
    </div>
  );
}
