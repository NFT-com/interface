import { Nft } from 'graphql/generated/types';
import { getContractMetadata } from 'utils/alchemyNFT';
import { processIPFSURL } from 'utils/helpers';
import { tw } from 'utils/tw';

import { NFTListingsContext } from './NFTListingsContext';

import { MinusCircle } from 'phosphor-react';
import { useContext } from 'react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';

export interface CartSidebarNftProps {
  nft: PartialDeep<Nft>
}

export function CartSidebarNft(props: CartSidebarNftProps) {
  const { chain } = useNetwork();
  const { data: collection } = useSWR('CartSidebarNftCollectionDetail' + props.nft.contract, async () => {
    return await getContractMetadata(props.nft?.contract, chain?.id);
  });

  const { removeListing } = useContext(NFTListingsContext);

  return (
    <div className='flex items-center w-full h-32 px-8'>
      <div className='relative h-2/4 aspect-square'>
        <MinusCircle
          size={20}
          color={'red'}
          className="absolute right-1 top-1 cursor-pointer z-40"
          onClick={() => {
            removeListing(props.nft);
          }}
        />
        <video
          autoPlay
          muted
          loop
          key={processIPFSURL(props.nft?.metadata?.imageURL)}
          src={processIPFSURL(props.nft?.metadata?.imageURL)}
          poster={processIPFSURL(props.nft?.metadata?.imageURL)}
          className={tw(
            'flex object-fit w-full justify-center rounded-md',
          )}
        />
      </div>
      <div className='flex flex-col ml-4'>
        <span>{props?.nft?.metadata?.name}</span>
        <span>{collection?.contractMetadata?.name}</span>
      </div>
    </div>
  );
}