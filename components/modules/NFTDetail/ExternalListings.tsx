import { Button, ButtonType } from 'components/elements/Button';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { Nft, TxActivity } from 'graphql/generated/types';
import { useListingActivitiesQuery } from 'graphql/hooks/useListingActivitiesQuery';
import { TransferProxyTarget, useNftCollectionAllowance } from 'hooks/balances/useNftCollectionAllowance';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ExternalListingTile } from './ExternalListingTile';

import { useContext } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export interface ExternalListingsProps {
  nft: PartialDeep<Nft>;
  collectionName: string;
}

export function ExternalListings(props: ExternalListingsProps) {
  const { address: currentAddress } = useAccount();
  const { stageListing, toggleCartSidebar } = useContext(NFTListingsContext);
  
  const { data: listings } = useListingActivitiesQuery(
    props?.nft?.contract,
    props?.nft?.tokenId,
    String(props.nft?.wallet.chainId || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID))
  );

  const {
    allowedAll: openseaAllowed,
  } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.Opensea
  );

  const {
    allowedAll: looksRareAllowed,
  } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.LooksRare
  );
  
  if (isNullOrEmpty(listings)) {
    return (
      getEnvBool(Doppler.NEXT_PUBLIC_ROUTER_ENABLED) &&
        currentAddress === props.nft?.wallet?.address &&
        <div className={tw('w-full flex py-4 pb-8 px-4',
          'minmd:px-[17.5px]',
          'minlg:px-[128px]',
          'minxl:w-1/2 minxl:px-4 minxl:ml-[50%] minxl:-mt-[170px] minxl:clear-left'
        )}>
          <div className="flex flex-col items-center bg-[#F6F6F6] rounded-[10px] w-full p-4 minmd:py-8 minmd:px-20">
            <span className='font-grotesk font-semibold text-base leading-6 items-center text-[#1F2127] mb-4'>This item is in your wallet</span>
            <Button
              stretch
              label={'List item'}
              onClick={() => {
                stageListing({
                  nft: props.nft,
                  collectionName: props.collectionName,
                  isApprovedForSeaport: openseaAllowed,
                  isApprovedForLooksrare: looksRareAllowed,
                  targets: []
                });
                toggleCartSidebar('sell');
              }}
              type={ButtonType.PRIMARY}
            />
          </div>
        </div>
    );
  }
  
  return <div className={tw(
    'flex w-full px-4',
    'flex-col minlg:flex-row flex-wrap'
  )}>
    {listings?.map((listing: PartialDeep<TxActivity>, index) => (
      <div className='w-full minlg:w-2/4 pr-2' key={index}>
        <ExternalListingTile
          listing={listing}
          nft={props.nft}
          collectionName={props.collectionName}
        />
      </div>
    ))}
  </div>;
}