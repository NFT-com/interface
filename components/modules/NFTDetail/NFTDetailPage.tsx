import { PageWrapper } from 'components/layouts/PageWrapper';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';

import { DescriptionDetail } from './DescriptionDetail';
import { NftChainInfo } from './NftChainInfo';
import { NFTDetail } from './NFTDetail';
import { Properties } from './Properties';

export interface NFTDetailPageProps {
  collection: string;
  tokenId: string;
}

export function NFTDetailPage(props: NFTDetailPageProps) {
  const { data: nft } = useNftQuery(props.collection, props.tokenId);
  return (
    <PageWrapper bgColorClasses='bg-pagebg dark:bg-pagebg-dk pt-20'>
      <div className="flex flex-col mx-12 pt-20">
        <NFTDetail nft={nft} />
        <DescriptionDetail nft={nft} />
        <NftChainInfo nft={nft} />
        <Properties nft={nft} />
      </div>
    </PageWrapper>
  );
}
