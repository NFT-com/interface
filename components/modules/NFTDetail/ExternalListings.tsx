import { Button, ButtonType } from 'components/elements/Button';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { Nft } from 'graphql/generated/types';
import { useExternalListingsQuery } from 'graphql/hooks/useExternalListingsQuery';
import { TransferProxyTarget, useNftCollectionAllowance } from 'hooks/balances/useNftCollectionAllowance';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { getLooksrareOrders, getSeaportOrders } from 'utils/marketplaceHelpers';
import { tw } from 'utils/tw';

import { ExternalListingTile } from './ExternalListingTile';

import { BigNumber } from 'ethers';
import { useContext } from 'react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export interface ExternalListingsProps {
  nft: PartialDeep<Nft>;
  collectionName: string;
}

export function ExternalListings(props: ExternalListingsProps) {
  const { address: currentAddress } = useAccount();
  const { stageListing, toggleCartSidebar } = useContext(NFTListingsContext);
  const { data: listings } = useExternalListingsQuery(
    props?.nft?.contract,
    props?.nft?.tokenId,
    String(props.nft?.wallet.chainId || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID))
  );

  const { data: seaportListings } = useSWR('SeaportListings' + props.nft?.contract + props.nft?.tokenId, async () => {
    return await getSeaportOrders(props.nft?.contract, BigNumber.from(props.nft?.tokenId));
  });

  const { data: looksrareListings } = useSWR('LooksrareListings' + props.nft?.contract + props.nft?.tokenId, async () => {
    const result = await getLooksrareOrders(props.nft?.contract, BigNumber.from(props.nft?.tokenId));
    return result ?? [];
  });

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
  
  if (isNullOrEmpty(listings?.filter((l) => !isNullOrEmpty(l.url)))) {
    return (
      getEnvBool(Doppler.NEXT_PUBLIC_ROUTER_ENABLED) &&
        currentAddress === props.nft?.wallet?.address &&
        <div className='w-full flex py-4 pb-8 px-4 minmd:px-[17.5px] minlg:px-[128px]'>
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
    {listings?.filter((l) => !isNullOrEmpty(l.url))?.map((listing, index) => (
      <div className='w-full minlg:w-2/4 pr-2' key={index}>
        <ExternalListingTile
          listing={listing}
          nft={props.nft}
          collectionName={props.collectionName}
          protocolData={seaportListings?.length > 0 ? seaportListings[0] : looksrareListings?.length > 0 ? looksrareListings[0] : null} // todo: fix this, get from the backend entity
        />
      </div>
    ))}
  </div>;
}