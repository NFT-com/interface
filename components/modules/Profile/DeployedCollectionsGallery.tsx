import { useDeployedCollectionsQuery } from 'graphql/hooks/useDeployedCollectionsQuery';
import { filterDuplicates } from 'utils/format';
import { tw } from 'utils/tw';

import { DeployedCollectionCard } from './DeployedCollectionCard';

export interface DeployedCollectionsGalleryProps {
  address: string;
}

export function DeployedCollectionsGallery(props: DeployedCollectionsGalleryProps) {
  const { collections } = useDeployedCollectionsQuery(props.address?.toLowerCase());

  if (collections?.length === 0) {
    return (
      <div className='customHeight flex w-full items-center justify-center'>
        <div className='flex flex-col items-center text-primary-txt dark:text-primary-txt-dk'>
          <div className=''>No Created Collections</div>
        </div>
      </div>
    );
  }
  return (
    <div className='w-full px-8'>
      <div className={'grid w-full grid-cols-3 lg:grid-cols-2 md:grid-cols-1'}>
        {filterDuplicates(Array.from(collections ?? []), (first, second) => first?.contract === second?.contract).map(
          collection => (
            <div
              key={collection.contract}
              className={tw('mb-10 flex items-center justify-center p-3', 'NFTCollectionCardContainer')}
            >
              <DeployedCollectionCard collection={collection} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
