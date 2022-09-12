import { NFTCollectionCard } from 'components/elements/NFTCollectionCard';

import { useRouter } from 'next/router';

interface CollectionItemProps {
  contractAddr: string;
  contractName?: string;
  images?: string[],
  count?: number
}

export const CollectionItem = ({ contractAddr, contractName, images, count }: CollectionItemProps) => {
  const router = useRouter();
  
  return (
    <NFTCollectionCard
      contract={contractAddr}
      count={count}
      images={images}
      onClick={() => {
        router.push(`/app/collection/${contractAddr}/`);
      }}
      customBackground={'white'}
      customBorder={'border border-grey-200'}
      contractName={contractName}
    />
  );
};