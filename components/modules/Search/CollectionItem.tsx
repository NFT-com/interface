import { NFTCollectionCard } from 'components/elements/NFTCollectionCard';
import { useFetchCollectionNFTs } from 'graphql/hooks/useFetchCollectionNFTs';

import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';

export const CollectionItem = ({ contractAddr, contractName }: {contractAddr: string; contractName?: string} ) => {
  const router = useRouter();
  const { fetchCollectionsNFTs } = useFetchCollectionNFTs();
  const [count, setCount] = useState(0);

  const { data: imageArray } = useSWR(contractAddr, async () => {
    const images = [];
    await fetchCollectionsNFTs({
      collectionAddress: contractAddr,
      pageInput:{
        first: 3,
        afterCursor: null, }
    }).then((collectionsData => {
      setCount(collectionsData?.collectionNFTs.items.length);
      images.push(collectionsData?.collectionNFTs.items[0]?.metadata.imageURL);
      images.push(collectionsData?.collectionNFTs.items[1]?.metadata.imageURL);
      images.push(collectionsData?.collectionNFTs.items[2]?.metadata.imageURL);
    }));
    return images;
  });
  
  return (
    imageArray?.length > 0 && <NFTCollectionCard
      contract={contractAddr}
      count={count}
      images={imageArray}
      onClick={() => {
        router.push(`/app/collection/${contractAddr}/`);
      }}
      customBackground={'white'}
      customBorder={'border border-grey-200'}
      contractName={contractName}
      lightModeForced={true}
    />
  );
};