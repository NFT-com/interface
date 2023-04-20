import { useRouter } from 'next/router';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';

import { RoundedCornerAmount, RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Collection } from 'graphql/generated/types';
import { getNftsForCollection } from 'utils/alchemyNFT';
import { filterNulls } from 'utils/format';
import { tw } from 'utils/tw';

import { AlchemyNFTMetaDataResponse } from 'types/alchemy';

export interface DeployedCollectionCardProps {
  collection: PartialDeep<Collection>;
}

export function DeployedCollectionCard(props: DeployedCollectionCardProps) {
  const router = useRouter();

  const { data } = useSWR(`DeployedCollectionCard${props.collection?.contract}`, async () => {
    const response = await getNftsForCollection(props.collection.contract, 3);
    return response?.nfts as PartialDeep<AlchemyNFTMetaDataResponse>[];
  });

  return (
    <div
      className={tw(
        'flex flex-col rounded-[10px]',
        'min-h-[inherit] w-full',
        'transform cursor-pointer hover:scale-105',
        'overflow-hidden border border-[#D5D5D5] p-4'
      )}
      onClick={() => {
        router.push(`/app/collection/${props.collection?.contract}`);
      }}
    >
      <div className='min-h-XL min-h-2XL flex w-full justify-center'>
        {filterNulls(data ?? [])
          .map((nft: PartialDeep<AlchemyNFTMetaDataResponse>) => nft?.metadata?.image)
          .slice(0, 3)
          .map((image: string, index: number) => {
            const variants = [RoundedCornerVariant.Left, RoundedCornerVariant.None, RoundedCornerVariant.Right];
            return (
              <RoundedCornerMedia
                key={image + index}
                src={image}
                variant={variants[index]}
                amount={RoundedCornerAmount.Medium}
                containerClasses='w-1/3'
              />
            );
          })}
      </div>
      <div className='mt-3 flex flex-col'>
        <span className='font-noi-grotesk text-sm text-secondary-txt'>Collection</span>
        <span className={tw('truncate font-noi-grotesk text-base font-semibold', 'text-primary-txt')}>
          {props.collection?.name ?? 'Unknown Name'}
        </span>
      </div>
    </div>
  );
}
