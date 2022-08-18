import { PageWrapper } from 'components/layouts/PageWrapper';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { getContractMetadata } from 'utils/alchemyNFT';

import { DescriptionDetail } from './DescriptionDetail';
import { ExternalListings } from './ExternalListings';
import { NftChainInfo } from './NftChainInfo';
import { NFTDetail } from './NFTDetail';
import { Properties } from './Properties';

import useSWR from 'swr';
import { useNetwork } from 'wagmi';

export interface NFTDetailPageProps {
  collection: string;
  tokenId: string;
}

export function NFTDetailPage(props: NFTDetailPageProps) {
  const { data: nft, mutate } = useNftQuery(props.collection, props.tokenId);
  const { chain } = useNetwork();
  const { data: collection } = useSWR('ContractMetadata' + nft?.contract, async () => {
    return await getContractMetadata(nft?.contract, chain?.id);
  });

  return (
    <PageWrapper
      bgColorClasses='bg-pagebg dark:bg-secondary-dk pt-20'
    >
      <div className="flex flex-col pt-20 items-center w-full max-w-7xl mx-auto">
        <NFTDetail nft={nft} onRefreshSuccess={mutate} key={nft?.id} />
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
        </div>
      </div>
    </PageWrapper>
  );
}
