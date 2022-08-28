import { RoundedCornerAmount, RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { useFetchCollectionNFTs } from 'graphql/hooks/useFetchCollectionNFTs';
import { Doppler, getEnv } from 'utils/env';
import { getChainIdString, processIPFSURL } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useNetwork } from 'wagmi';

export interface NFTDetailMoreFromCollectionProps {
  contract: string
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
    <div className='flex items-center overflow-x-scroll py-2'>
      {data?.map((nft, index) => {
        return <div className={tw(
          'flex flex-col h-full w-72 shrink-0 p-2 border border-[#D5D5D5] rounded-md cursor-pointer mr-4',
        )}
        key={index}
        onClick={() => {
          router.push('/app/nft/' + props.contract + '/' + nft?.tokenId);
        }}
        >
          <RoundedCornerMedia
            containerClasses='w-full aspect-square'
            variant={RoundedCornerVariant.All}
            amount={RoundedCornerAmount.Medium}
            src={processIPFSURL(nft?.metadata?.imageURL)}
          />
          <div className="flex w-full font-grotesk font-semibold m-2">
            {nft?.metadata?.name}
          </div>
        </div>;
      })}
    </div>
  </div>;
}