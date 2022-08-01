import { NFTCard } from 'components/elements/NFTCard';
import { useDeployedCollectionsQuery } from 'graphql/hooks/useDeployedCollectionsQuery';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';

export interface DeployedCollectionsGalleryProps {
  address: string;
}

export function DeployedCollectionsGallery(props: DeployedCollectionsGalleryProps) {
  const { collections } = useDeployedCollectionsQuery(props.address?.toLowerCase());
  const router = useRouter();
  if (collections?.length === 0) {
    return <div className="w-full flex items-center justify-center customHeight">
      <div className="flex flex-col items-center text-primary-txt dark:text-primary-txt-dk">
        <div className="">No Created Collections</div>
      </div>
    </div>;
  }
  return <div className="w-full px-8">
    <div className={'grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 w-full'}>
      {Array.from(collections ?? []).map((collection) => (
        <div
          key={collection.contract}
          className={tw(
            'flex mb-10 items-center justify-center p-3',
            'NFTCollectionCardContainer'
          )}
        >
          <NFTCard
            title={collection?.name}
            imageLayout="row"
            images={[
              // todo: get 3 random NFT images from this collection
            ]}
            onClick={() => {
              router.push(`/app/collection/${collection.contract}`);
            }}
            contractAddress={collection?.contract}
          />
        </div>
      ))}
    </div>
  </div>;
}