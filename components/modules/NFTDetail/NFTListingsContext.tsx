import { Button, ButtonType } from 'components/elements/Button';
import { Nft } from 'graphql/generated/types';
import { useListNFTMutations } from 'graphql/hooks/useListNFTMutation';
import { useLooksrareRoyaltyFeeRegistryContractContract } from 'hooks/contracts/useLooksrareRoyaltyFeeRegistryContract';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { useSeaportCounter } from 'hooks/useSeaportCounter';
import { useSignLooksrareOrder } from 'hooks/useSignLooksrareOrder';
import { useSignSeaportOrder } from 'hooks/useSignSeaportOrder';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { Fee, SeaportOrderParameters } from 'types';
import { Doppler, getEnv } from 'utils/env';
import { filterNulls, getChainIdString, processIPFSURL } from 'utils/helpers';
import { getLooksrareNonce, getOpenseaCollection } from 'utils/listings';
import { createLooksrareParametersForNFTListing } from 'utils/looksrareHelpers';
import { convertDurationToSec, SaleDuration } from 'utils/marketplaceUtils';
import { createSeaportParametersForNFTListing } from 'utils/seaportHelpers';
import { tw } from 'utils/tw';

import { MakerOrder } from '@looksrare/sdk';
import { BigNumber, BigNumberish } from 'ethers';
import { useRouter } from 'next/router';
import { XCircle } from 'phosphor-react';
import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork, useProvider } from 'wagmi';

export type TargetMarketplace = 'looksrare' | 'seaport';

export type StagedListing = {
  targets: TargetMarketplace[],
  nft: PartialDeep<Nft>;
  startingPrice: BigNumberish;
  endingPrice: BigNumberish;
  currency: string;
  duration: BigNumberish;
  // takerAddress: string;
}

interface NFTListingsContextType {
  toList: StagedListing[];
  stageListing: (listing: PartialDeep<StagedListing>) => void;
  clear: () => void;
  listAll: () => void;
  submitting: boolean;
  toggleCartSidebar: () => void;
  toggleTargetMarketplace: (marketplace: TargetMarketplace) => void;
  setDuration: (duration: SaleDuration) => void;
  setPrice: (listing: PartialDeep<StagedListing>, price: BigNumberish) => void;
}

// initialize with default values
export const NFTListingsContext = React.createContext<NFTListingsContextType>({
  toList: [],
  stageListing: () => null,
  clear: () => null,
  listAll: () => null,
  submitting: false,
  toggleCartSidebar: () => null,
  toggleTargetMarketplace: () => null,
  setDuration: () => null,
  setPrice: () => null,
});

/**
 * This context provides state management and helper functions for the NFT listings cart.
 */
export function NFTListingsContextProvider(
  props: PropsWithChildren<any>
) {
  const [toList, setToList] = useState<Array<StagedListing>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const { data: supportedCurrencyData } = useSupportedCurrencies();

  const sidebarRef = useRef();
  useOutsideClickAlerter(sidebarRef, () => setSidebarVisible(false));

  useEffect(() => {
    if (window != null) {
      setToList(JSON.parse(localStorage.getItem('stagedNftListings')) ?? []);
    }
  }, []);

  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();
  const router = useRouter();

  const signOrderForLooksrare = useSignLooksrareOrder();
  const looksrareRoyaltyFeeRegistry = useLooksrareRoyaltyFeeRegistryContractContract(provider);
  const looksrareStrategy = useLooksrareStrategyContract(provider);

  const seaportCounter = useSeaportCounter(currentAddress);
  const signOrderForSeaport = useSignSeaportOrder();
  const { listNftSeaport, listNftLooksrare } = useListNFTMutations();

  const stageListing = useCallback((
    listing: StagedListing
  ) => {
    if (toList.find(l => l.nft.id === listing.nft.id)) {
      setSidebarVisible(true);
      return;
    }
    setToList([...toList, listing]);
    localStorage.setItem('stagedNftListings', JSON.stringify(filterNulls([...toList, listing])));
  }, [toList]);

  const clear = useCallback(() => {
    setToList([]);
    localStorage.setItem('stagedNftListings', null);
  }, []);

  const toggleCartSidebar = useCallback(() => {
    setSidebarVisible(!sidebarVisible);
  }, [sidebarVisible]);

  const toggleTargetMarketplace = useCallback((targetMarketplace: TargetMarketplace) => {
    const targetFullyEnabled = toList.find(listing => listing.targets?.includes(targetMarketplace)) != null;
    if (targetFullyEnabled) {
      // removing the target marketplace from all nfts
      setToList(toList.slice().map(listing => {
        return {
          ...listing,
          targets: listing.targets?.filter(t => t !== targetMarketplace) ?? [],
        };
      }));
    } else {
      // adding a new marketplace to any nft that doesn't have it.
      setToList(toList.slice().map(listing => {
        return {
          ...listing,
          targets: listing.targets?.includes(targetMarketplace) ? listing.targets : [...listing.targets ?? [], targetMarketplace],
        };
      }));
    }
  }, [toList]);

  const setDuration = useCallback((duration: SaleDuration) => {
    setToList(toList.slice().map(listing => {
      return {
        ...listing,
        duration: convertDurationToSec(duration),
      };
    }));
  }, [toList]);

  const setPrice = useCallback((listing: PartialDeep<StagedListing>, price: BigNumberish) => {
    setToList(toList.slice().map(l => {
      if (listing?.nft?.id === l.nft?.id) {
        return {
          ...l,
          startingPrice: price,
          currency: supportedCurrencyData['WETH'].contract
        };
      }
      return l;
    }));
  }, [supportedCurrencyData, toList]);

  const listAll = useCallback(async () => {
    setSubmitting(true);
    let nonce: number = await getLooksrareNonce(currentAddress);
    await Promise.all(toList.map(async (listing) => {
      await Promise.all(listing.targets?.map(async (target: TargetMarketplace) => {
        if (target === 'looksrare') {
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
          await listNftLooksrare({ ...order, signature });
          // todo: check success/failure and maybe mutate external listings query.
        } else {
          const contract = await getOpenseaCollection(listing?.nft?.contract);
          const collectionFee: Fee = contract?.['payout_address'] && contract?.['dev_seller_fee_basis_points']
            ? {
              recipient: contract?.['payout_address'],
              basisPoints: contract?.['dev_seller_fee_basis_points'],
            }
            : null;
          const parameters: SeaportOrderParameters = createSeaportParametersForNFTListing(
            currentAddress,
            listing.nft,
            listing.startingPrice,
            listing.endingPrice ?? listing.startingPrice,
            listing.currency,
            listing.duration,
            collectionFee,
            getChainIdString(chain?.id) ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
            // listing.takerAddress
          );
          const signature = await signOrderForSeaport(parameters, seaportCounter);
          await listNftSeaport(signature , { ...parameters, counter: seaportCounter });
          // todo: check success/failure and maybe mutate external listings query.
          localStorage.setItem('stagedNftListings', null);
        }
      }));
    }));
    setSubmitting(false);
    clear();
  }, [
    listNftSeaport,
    listNftLooksrare,
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
    clear,
    listAll,
    submitting,
    toggleCartSidebar,
    toggleTargetMarketplace,
    setDuration,
    setPrice
  }}>

    {
      toList.length > 0 &&
      sidebarVisible &&
      <div ref={sidebarRef} className={tw(
        'z-50 absolute pt-20 right-0 w-full h-full minmd:w-60 bg-white flex flex-col grow',
        'drop-shadow-md'
      )}>
        <div className='flex flex-row items-center px-8 my-8'>
          <p className='w-full text-2xl'>
            Listings
          </p>
          <XCircle onClick={() => setSidebarVisible(false)} className='hover:cursor-pointer' size={32} color="black" weight="fill" />
        </div>
        <div className='flex px-8 mb-4'>
          <span>
            {filterNulls(toList).length} NFT{filterNulls(toList).length > 1 ? 's' : ''}
          </span>
          <span
            className='ml-8 cursor-pointer hover:underline text-link'
            onClick={() => {
              clear();
            }}
          >
            Clear
          </span>
        </div>
        {filterNulls(toList).map((listing, index) => {
          return <div key={index} className='flex items-center w-full h-32 px-8'>
            <div className='relative h-2/4 aspect-square'>
              <video
                autoPlay
                muted
                loop
                key={processIPFSURL(listing.nft?.metadata?.imageURL)}
                src={processIPFSURL(listing.nft?.metadata?.imageURL)}
                poster={processIPFSURL(listing.nft?.metadata?.imageURL)}
                className={tw(
                  'flex object-fit w-full justify-center rounded-md',
                )}
              />
            </div>
            <div className='flex flex-col ml-4'>
              <span>{listing?.nft?.metadata?.name}</span>
              <span>{'#' + BigNumber.from(listing?.nft?.tokenId ?? 0).toNumber()}</span>
            </div>
          </div>;
        })}
        <div className="mx-8 my-4 flex">
          <Button
            stretch
            label={'Proceed to List'}
            onClick={() => {
              setSidebarVisible(false);
              router.push('/app/checkout');
            }}
            type={ButtonType.PRIMARY}
          />
        </div>
      </div>
    }
    {props.children}
  </NFTListingsContext.Provider>;
}
