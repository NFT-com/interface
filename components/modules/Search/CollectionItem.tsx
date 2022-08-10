import { NFTCollectionCard } from 'components/elements/NFTCollectionCard';
import { useFetchCollectionNFTs } from 'graphql/hooks/useFetchCollectionNFTs';
import { Doppler, getEnv } from 'utils/env';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

export const CollectionItem = ({ contractAddr, contractName }: {contractAddr: string; contractName: string} ) => {
  const router = useRouter();
  const { fetchCollectionsNFTs } = useFetchCollectionNFTs();
  const [imageArray, setImageArray] = useState([]);
  const [count, setCount] = useState(0);
  const { chain } = useNetwork();
  
  useEffect(() => {
    const images = [];
    contractAddr && fetchCollectionsNFTs({
      chainId: chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
      collectionAddress: contractAddr,
      pageInput:{
        first: 3,
        afterCursor: null, }
    }).then((collectionsData => {
      setCount(collectionsData?.collectionNFTs.items.length);
      images.push(collectionsData?.collectionNFTs.items[0]?.metadata.imageURL);
      images.push(collectionsData?.collectionNFTs.items[1]?.metadata.imageURL);
      images.push(collectionsData?.collectionNFTs.items[2]?.metadata.imageURL);
      setImageArray([...images]);
    }));
  }, [fetchCollectionsNFTs, contractAddr, chain?.id]);
  
  return (
    imageArray.length > 0 && <NFTCollectionCard
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