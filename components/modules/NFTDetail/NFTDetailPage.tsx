import { PageWrapper } from 'components/layouts/PageWrapper';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { Doppler, getEnvBool } from 'utils/env';

import { DescriptionDetail } from './DescriptionDetail';
import { ExternalListings } from './ExternalListings';
import { NftApprovals } from './NftApprovals';
import { NftChainInfo } from './NftChainInfo';
import { NFTDetail } from './NFTDetail';
import { Properties } from './Properties';

export interface NFTDetailPageProps {
  collection: string;
  tokenId: string;
}

export function NFTDetailPage(props: NFTDetailPageProps) {
  const { data: nft, mutate } = useNftQuery(props.collection, props.tokenId);

  return (
    <PageWrapper
      bgColorClasses='bg-pagebg dark:bg-secondary-dk pt-20'
    >
      <div className="flex flex-col pt-20 items-center w-full max-w-7xl mx-auto">
        <NFTDetail nft={nft} onRefreshSuccess={mutate} key={nft?.id} />
        {getEnvBool(Doppler.NEXT_PUBLIC_ROUTER_ENABLED) && <NftApprovals nft={nft} />}
        <ExternalListings nft={nft} />
        <div className='w-full flex flex-row md:flex-col p-4'>
          <div className='flex flex-col w-2/4 md:w-full pr-4 md:pr-0'>
            <div className='w-full border-b dark:border-accent-border-dk border-accent-border pb-5'>
              <DescriptionDetail nft={nft} />
            </div>
            <div className='w-full border-b dark:border-accent-border-dk border-accent-border pb-5'>
              <NftChainInfo nft={nft} />
            </div>
          </div>
          <div className="w-2/4 md:w-full border-b dark:border-accent-border-dk border-accent-border pb-5 mb-20">
            <Properties nft={nft} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
