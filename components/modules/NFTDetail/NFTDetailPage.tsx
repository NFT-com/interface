import { Button, ButtonType } from 'components/elements/Button';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { LineChart } from 'components/modules/Analytics/LineChart';
import { NftMemo } from 'components/modules/Analytics/NftMemo';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { Doppler, getEnvBool } from 'utils/env';

import { DescriptionDetail } from './DescriptionDetail';
import { ExternalListings } from './ExternalListings';
import { NftChainInfo } from './NftChainInfo';
import { NFTDetail } from './NFTDetail';
import { NFTListingsContext } from './NFTListingsContext';
import { Properties } from './Properties';

import { useContext } from 'react';
import { useAccount } from 'wagmi';
export interface NFTDetailPageProps {
  collection: string;
  tokenId: string;
}

export function NFTDetailPage(props: NFTDetailPageProps) {
  const { address: currentAddress } = useAccount();
  const { data: nft, mutate } = useNftQuery(props.collection, props.tokenId);
  const { stageListing } = useContext(NFTListingsContext);

  return (
    <PageWrapper
      bgColorClasses='bg-pagebg dark:bg-secondary-dk pt-20'
    >
      <div className="flex flex-col pt-20 items-center w-full max-w-7xl mx-auto">
        <NFTDetail nft={nft} onRefreshSuccess={mutate} key={nft?.id} />
        {
          getEnvBool(Doppler.NEXT_PUBLIC_ROUTER_ENABLED) &&
          currentAddress === nft?.wallet?.address &&
          <div className='w-full'>
            <div className='flex flex-col m-8 p-4 bg-modal-overlay dark:bg-modal-overlay-dk rounded-lg items-center'>
              <span className='dark:text-white mb-4'>This item is in your wallet</span>
              <Button
                label={'LIST ITEM'}
                onClick={() => {
                  stageListing({
                    nft: nft,
                  });
                }}
                type={ButtonType.PRIMARY}
              />
            </div>
          </div>
        }
        {
          //TODO: @anthony - add in memo functionality
          getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED) &&
          <NftMemo nft={nft} />
        }
        <ExternalListings nft={nft} />
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
              <LineChart />
            </div>
          }
        </div>
      </div>
    </PageWrapper>
  );
}
