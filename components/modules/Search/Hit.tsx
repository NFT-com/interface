import { NFTCard } from 'components/elements/NFTCard';
import { shortenAddress } from 'utils/helpers';

import { useRouter } from 'next/router';

export interface HitInnerProps {
  nftName: string;
  url: string;
  id: string;
  imageURL: string;
  contractAddr: string;
  contractName: string;
  nftDescription: string;
  listedPx: number;
  tokenId: string;
}

export const Hit = (hit: { hit: HitInnerProps }) => {
  const router = useRouter();
  return (
    <div data-testid={'NFTCard-' + hit.hit.contractAddr}>
      <NFTCard
        header={{ value: hit.hit.nftName ?? hit.hit.url, key: '' }}
        traits={[{ value: shortenAddress(hit.hit.contractAddr), key: '' }]}
        title={'Price: ' + (hit.hit.listedPx ? (hit.hit.listedPx + 'ETH') : 'Not estimated')}
        subtitle={hit.hit.contractName}
        images={[hit.hit.imageURL]}
        onClick={() => {
          if (hit.hit.url) {
            hit.hit.url && router.push(`/${hit.hit.url}`);
          }

          if (hit.hit.nftName) {
            router.push(`/app/nft/${hit.hit.contractAddr}/${hit.hit.tokenId}`);
          }
        }}
        description={hit.hit.nftDescription ? hit.hit.nftDescription.slice(0,50) + '...': '' }
      />
    </div>
  );
};