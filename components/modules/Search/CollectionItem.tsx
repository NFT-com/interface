import { NFTCollectionCard } from 'components/elements/NFTCollectionCard';

interface CollectionItemProps {
  contractAddr: string;
  contractName?: string;
  images?: string[],
  count?: number
}

export const CollectionItem = ({ contractAddr, contractName, images }: CollectionItemProps) => {
  return (
    <NFTCollectionCard
      contract={contractAddr}
      images={images}
      redirectTo={`/app/collection/${contractAddr}/`}
      customBackground={'white'}
      customBorder={'border border-grey-200'}
      contractName={contractName}
    />
  );
};