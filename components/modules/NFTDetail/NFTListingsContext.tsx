import { Button, ButtonType } from 'components/elements/Button';
import { Nft } from 'graphql/generated/types';
import { useLooksrareRoyaltyFeeRegistryContractContract } from 'hooks/contracts/useLooksrareRoyaltyFeeRegistryContract';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { useSeaportCounter } from 'hooks/useSeaportCounter';
import { useSignLooksrareOrder } from 'hooks/useSignLooksrareOrder';
import { useSignSeaportOrder } from 'hooks/useSignSeaportOrder';
import { processIPFSURL } from 'utils/helpers';
import { getLooksrareNonce, listLooksrare, listSeaport } from 'utils/listings';
import { createLooksrareParametersForNFTListing } from 'utils/looksrareHelpers';
import { createSeaportParametersForNFTListing } from 'utils/seaportHelpers';
import { tw } from 'utils/tw';

import { MakerOrder } from '@looksrare/sdk';
import { BigNumber, BigNumberish } from 'ethers';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import React, { PropsWithChildren, useCallback, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { SeaportOrderParameters } from 'types';
import { useAccount, useNetwork, useProvider } from 'wagmi';

export type StagedListing = {
  type: 'looksrare' | 'seaport';
  nft: PartialDeep<Nft>;
  price: BigNumberish;
  currency: string;
}

interface NFTListingsContextType {
  toList: StagedListing[];
  stageListing: (listing: StagedListing) => void;
  clear: () => void;
  listAll: () => void;
}

// initialize with default values
export const NFTListingsContext = React.createContext<NFTListingsContextType>({
  toList: [],
  stageListing: () => null,
  clear: () => null,
  listAll: () => null
});

/**
 * This context provides state management and helper functions for editing Profiles.
 * 
 * This context does _not_ return the server-provided values for all fields. You should
 * check this context for drafts, and fallback on the server-provided values at the callsite.
 * 
 */
export function NFTListingsContextProvider(
  props: PropsWithChildren<any>
) {
  const [toList, setToList] = useState<Array<StagedListing>>([]);

  const { data: account } = useAccount();
  const { activeChain } = useNetwork();
  const provider = useProvider();

  const signOrderForLooksrare = useSignLooksrareOrder();
  const looksrareRoyaltyFeeRegistry = useLooksrareRoyaltyFeeRegistryContractContract(provider);
  const looksrareStrategy = useLooksrareStrategyContract(provider);

  const seaportCounter = useSeaportCounter(account?.address);
  const signOrderForSeaport = useSignSeaportOrder();

  const stageListing = useCallback((
    listing: StagedListing
  ) => {
    if (toList.find(l => l.nft.id === listing.nft.id && l.type === listing.type)) {
      return;
    }
    setToList([...toList, listing]);
  }, [toList]);

  const clear = useCallback(() => {
    setToList([]);
  }, []);

  const listAll = useCallback(async () => {
    let nonce: number = await getLooksrareNonce(account?.address);
    toList.forEach(async (listing) => {
      if (listing.type === 'looksrare') {
        const order: MakerOrder = await createLooksrareParametersForNFTListing(
          account?.address, // offerer
          listing.nft,
          listing.price,
          listing.currency,
          activeChain?.id,
          nonce,
          looksrareStrategy,
          looksrareRoyaltyFeeRegistry,
        );
        nonce++;
        const signature = await signOrderForLooksrare(order);
        await listLooksrare({ ...order, signature });
        // todo: check success/failure and maybe mutate external listings query.
      } else {
        const parameters: SeaportOrderParameters = createSeaportParametersForNFTListing(
          account?.address,
          listing.nft,
          listing.price,
          listing.currency,
        );
        const signature = await signOrderForSeaport(parameters, seaportCounter);
        await listSeaport(signature , { ...parameters, counter: seaportCounter });
        // todo: check success/failure and maybe mutate external listings query.
      }
    });
    clear();
  }, [
    account?.address,
    activeChain?.id,
    looksrareRoyaltyFeeRegistry,
    looksrareStrategy,
    seaportCounter,
    signOrderForLooksrare,
    signOrderForSeaport,
    toList,
    clear
  ]);
  
  return <NFTListingsContext.Provider value={{
    toList,
    stageListing,
    clear,
    listAll
  }}>
    {
      toList.length > 0 && <div className='z-50 absolute top-20 right-0 h-full w-40 bg-white flex flex-col'>
        {toList.map((listing, index) => {
          return <div key={index} className='flex items-center border w-full'>
            <div className='relative h-2/4 aspect-square'>
              <video
                autoPlay
                muted
                loop
                key={processIPFSURL(listing.nft?.metadata?.imageURL)}
                src={processIPFSURL(listing.nft?.metadata?.imageURL)}
                poster={processIPFSURL(listing.nft?.metadata?.imageURL)}
                className={tw(
                  'flex object-fit w-full justify-center',
                )}
              />
            </div>
            {'#' + BigNumber.from(listing?.nft?.tokenId ?? 0).toNumber()}
            {
              listing.type === 'looksrare' ?
                <LooksrareIcon className='h-9 w-9 relative shrink-0 hover:opacity-70' alt="Looksrare logo redirect" layout="fill"/> :
                <OpenseaIcon className='h-9 w-9 relative shrink-0 hover:opacity-70' alt="Opensea logo redirect" layout="fill"/>
            }
          </div>;
        })}
        <div className="mx-2 mt-4 flex">
          <Button
            stretch
            label={'List All'}
            onClick={listAll}
            type={ButtonType.PRIMARY}
          />
        </div>
        <div className="mx-2 mt-4 flex">
          <Button
            stretch
            label={'Clear'}
            onClick={clear}
            type={ButtonType.PRIMARY}
          />
        </div>
      </div>
    }
    {props.children}
  </NFTListingsContext.Provider>;
}
