import { NFTCard } from 'components/elements/NFTCard';
import { useFetchCollectionNFTs } from 'graphql/hooks/useFetchCollectionNFTs';
import { Doppler, getEnv } from 'utils/env';
import { getChainIdString } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useNetwork } from 'wagmi';

export interface NFTDetailMoreFromCollectionProps {
  contract: string;
  collectionName: string;
}

export function NFTDetailMoreFromCollection(props: NFTDetailMoreFromCollectionProps) {
  const { fetchCollectionsNFTs } = useFetchCollectionNFTs();
  const router = useRouter();
  const { chain } = useNetwork();
  const { data } = useSWR('NFTDetailMoreFromCollection' + props.contract, async () => {
    const result = await fetchCollectionsNFTs({
      chainId: getChainIdString(chain?.id) ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
      collectionAddress: props.contract,
      pageInput: {
        first: 50
      }
    });
    return result?.collectionNFTs?.items;
  });

  if (data == null) {
    return null;
  }

  return <div className='flex flex-col w-full'>
    <span className="text-2xl font-bold font-grotesk mb-2">More from collection</span>
    <div className='flex py-2 snap-x overflow-x-auto sm:no-scrollbar h-full items-stretch'>
      {data?.map((nft, index) => {
        return (
          <div className={tw(
            'NftCollectionItem flex flex-col snap-always snap-center sm:no-scrollbar w-72 shrink-0 cursor-pointer mr-4 self-stretch',
          )} key={index}>
            <NFTCard
              contractAddress={props.contract}
              tokenId={nft.tokenId}
              title={nft.metadata.name}
              subtitle={nft.metadata.name}
              images={[nft.metadata.imageURL]}
              collectionName={props.collectionName}
              onClick={() => {
                if (nft.metadata.name) {
                  router.push(`/app/nft/${props.contract}/${nft.tokenId}`);
                }
              }}
              customBorderRadius={'rounded-tl rounded-tr'}
            />
          </div>
        );
      })}
    </div>
  </div>;
}