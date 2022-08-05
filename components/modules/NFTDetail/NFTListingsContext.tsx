import { Button, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';
import { Nft } from 'graphql/generated/types';
import { useLooksrareRoyaltyFeeRegistryContractContract } from 'hooks/contracts/useLooksrareRoyaltyFeeRegistryContract';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { useSeaportCounter } from 'hooks/useSeaportCounter';
import { useSignLooksrareOrder } from 'hooks/useSignLooksrareOrder';
import { useSignSeaportOrder } from 'hooks/useSignSeaportOrder';
import { filterNulls, processIPFSURL } from 'utils/helpers';
import { getLooksrareNonce, listLooksrare, listSeaport } from 'utils/listings';
import { createLooksrareParametersForNFTListing } from 'utils/looksrareHelpers';
import { createSeaportParametersForNFTListing } from 'utils/seaportHelpers';
import { tw } from 'utils/tw';

import { ListingBuilder } from './ListingBuilder';

import { MakerOrder } from '@looksrare/sdk';
import { BigNumber, BigNumberish } from 'ethers';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { SeaportOrderParameters } from 'types';
import { useAccount, useNetwork, useProvider } from 'wagmi';

export type ListingType = 'looksrare' | 'seaport';

export type StagedListing = {
  type: ListingType;
  nft: PartialDeep<Nft>;
  startingPrice: BigNumberish;
  endingPrice: BigNumberish;
  currency: string;
  duration: BigNumberish;
  // takerAddress: string;
}

interface NFTListingsContextType {
  toList: StagedListing[];
  stageListing: (listing: StagedListing) => void;
  openListingBuilder: (type: ListingType, nft: PartialDeep<Nft>) => void;
  clear: () => void;
  listAll: () => void;
  submitting: boolean;
}

// initialize with default values
export const NFTListingsContext = React.createContext<NFTListingsContextType>({
  toList: [],
  stageListing: () => null,
  openListingBuilder: () => null,
  clear: () => null,
  listAll: () => null,
  submitting: false
});

/**
 * This context provides state management and helper functions for the NFT listings cart.
 */
export function NFTListingsContextProvider(
  props: PropsWithChildren<any>
) {
  const [toList, setToList] = useState<Array<StagedListing>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [listingBuilderData, setListingBuilderData] = useState<PartialDeep<StagedListing>>(null);

  useEffect(() => {
    if (window != null) {
      setToList(JSON.parse(localStorage.getItem('stagedNftListings')) ?? []);
    }
  }, []);

  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();

  const signOrderForLooksrare = useSignLooksrareOrder();
  const looksrareRoyaltyFeeRegistry = useLooksrareRoyaltyFeeRegistryContractContract(provider);
  const looksrareStrategy = useLooksrareStrategyContract(provider);

  const seaportCounter = useSeaportCounter(currentAddress);
  const signOrderForSeaport = useSignSeaportOrder();

  const openListingBuilder = useCallback((type: ListingType, nft: PartialDeep<Nft>) => {
    setListingBuilderData({ type, nft });
  }, []);

  const stageListing = useCallback((
    listing: StagedListing
  ) => {
    if (toList.find(l => l.nft.id === listing.nft.id && l.type === listing.type)) {
      return;
    }
    setToList([...toList, listing]);
    localStorage.setItem('stagedNftListings', JSON.stringify(filterNulls([...toList, listing])));
  }, [toList]);

  const clear = useCallback(() => {
    setToList([]);
    setListingBuilderData(null);
    localStorage.setItem('stagedNftListings', null);
  }, []);

  const listAll = useCallback(async () => {
    setSubmitting(true);
    let nonce: number = await getLooksrareNonce(currentAddress);
    await Promise.all(toList.map(async (listing) => {
      if (listing.type === 'looksrare') {
        const order: MakerOrder = await createLooksrareParametersForNFTListing(
          currentAddress, // offerer
          listing.nft,
          listing.startingPrice,
          listing.currency,
          chain?.id,
          nonce,
          looksrareStrategy,
          looksrareRoyaltyFeeRegistry,
          listing.duration,
          // listing.takerAddress
        );
        nonce++;
        const signature = await signOrderForLooksrare(order);
        await listLooksrare({ ...order, signature });
        // todo: check success/failure and maybe mutate external listings query.
      } else {
        const parameters: SeaportOrderParameters = createSeaportParametersForNFTListing(
          currentAddress,
          listing.nft,
          listing.startingPrice,
          listing.endingPrice,
          listing.currency,
          listing.duration,
          // listing.takerAddress
        );
        const signature = await signOrderForSeaport(parameters, seaportCounter);
        await listSeaport(signature , { ...parameters, counter: seaportCounter });
        // todo: check success/failure and maybe mutate external listings query.
        localStorage.setItem('stagedNftListings', null);
      }
    }));
    setSubmitting(false);
    clear();
  }, [
    currentAddress,
    chain?.id,
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
    openListingBuilder,
    clear,
    listAll,
    submitting
  }}>
    <Modal
      fullModal
      visible={listingBuilderData != null}
      loading={false}
      title={''}
      onClose={() => {
        setListingBuilderData(null);
      }}
    >
      <ListingBuilder
        nft={listingBuilderData?.nft}
        type={listingBuilderData?.type}
        onCancel={() => {
          setListingBuilderData(null);
        }}
        onSuccessfulCreate={() => {
          setListingBuilderData(null);
        }}
      />
    </Modal>
    {
      toList.length > 0 && <div className='z-50 absolute top-20 right-0 h-full w-40 bg-white flex flex-col'>
        {filterNulls(toList).map((listing, index) => {
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
