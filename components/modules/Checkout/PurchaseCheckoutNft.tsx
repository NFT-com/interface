import { getContractMetadata } from 'utils/alchemyNFT';
import { processIPFSURL } from 'utils/helpers';
import { tw } from 'utils/tw';

import { NFTPurchasesContext, StagedPurchase } from './NFTPurchaseContext';

import { BigNumber, ethers } from 'ethers';
import { MinusCircle } from 'phosphor-react';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import { useCallback, useContext } from 'react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';

export interface PurchaseCheckoutNftProps {
  purchase: PartialDeep<StagedPurchase>
}

export function PurchaseCheckoutNft(props: PurchaseCheckoutNftProps) {
  const { chain } = useNetwork();

  const { removePurchase } = useContext(NFTPurchasesContext);

  const { data: collection } = useSWR('ContractMetadata' + props.purchase?.nft?.contract, async () => {
    return await getContractMetadata(props.purchase?.nft?.contract, chain?.id);
  });

  const getMarketplaceIcon = useCallback((purchase: PartialDeep<StagedPurchase>) => {
    switch(purchase.marketplace) {
    case 'seaport':
      return <OpenseaIcon className='h-9 w-9 relative shrink-0' alt="Opensea logo redirect" layout="fill"/>;
    case 'looksrare':
      return <LooksrareIcon className='h-9 w-9 relative shrink-0' alt="Looksrare logo redirect" layout="fill"/>;
    default:
      return null;
    }
  }, []);

  return (
    <div className='flex items-center w-full h-32 px-8'>
      <div className='h-full flex items-center'>
        <div className='relative h-2/4 aspect-square'>
          <MinusCircle
            size={20}
            color={'red'}
            className="absolute right-1 top-1 cursor-pointer z-40"
            onClick={() => {
              removePurchase(props.purchase?.nft);
            }}
          />
          <video
            autoPlay
            muted
            loop
            key={props.purchase.nft?.metadata?.imageURL}
            src={processIPFSURL(props.purchase.nft?.metadata?.imageURL)}
            poster={processIPFSURL(props.purchase.nft?.metadata?.imageURL)}
            className={tw(
              'flex object-fit w-full justify-center rounded-md',
            )}
          />
        </div>
        <div className='flex flex-col ml-4'>
          <span>{props.purchase?.nft?.metadata?.name}</span>
          <span>{collection?.contractMetadata?.name}</span>
        </div>
      </div>
      <div className='flex items-center ml-8'>
        {getMarketplaceIcon(props.purchase)}
      </div>
      <div className="flex items-center text-lg ml-8">
        {ethers.utils.formatEther(BigNumber.from(props.purchase?.price ?? 0))}{' WETH'}
      </div>
    </div>
  );
}