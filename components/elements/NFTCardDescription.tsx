import { Nft, TxActivity } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/format';

import { NFTCardTrait } from './NFTCard';
import { NFTCardListingIcons as StaticNFTCardListingIcons } from './NFTCardListingIcons';

import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { PartialObjectDeep } from 'type-fest/source/partial-deep';

const DynamicNFTCardListingIcons = dynamic<React.ComponentProps<typeof StaticNFTCardListingIcons>>(() => import('components/elements/NFTCardListingIcons').then(mod => mod.NFTCardListingIcons));

export const NFTCardDescription = (props: {
  imageLayout?: string;
  collectionName?: string | any;
  title?: string;
  traits?: NFTCardTrait[];
  description?: string;
  cta?: string;
  showListingIcons?: boolean;
  nft: PartialObjectDeep<Nft, unknown>;
  lowestListing?: PartialObjectDeep<TxActivity, unknown>
}) => {
  const { secondaryText, pink, link } = useThemeColors();

  const makeTrait = useCallback((pair: NFTCardTrait, key: any) => {
    return <div key={key} className="flex mt-2">
      <span className='text-xs minmd:text-sm' style={{ color: pink }}>
        {pair.key}{isNullOrEmpty(pair.key) ? '' : ' '}
      </span>
      {pair.value !== 'undefined item' ?
        (<span
          className='text-xs minmd:text-sm ml-1'
          style={{ color: secondaryText }}
        >
          {pair.value}
        </span>):
        (<div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center">
          <div className="w-full">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>)}
    </div>;
  }, [pink, secondaryText]);

  return (
    <div className="flex flex-col">
      {props.imageLayout !== 'row' && <span className='text-[#6F6F6F] text-sm pt-[10px]'>{props.collectionName}</span>}
      {props.title ?
        <span className={`whitespace-nowrap text-ellipsis overflow-hidden font-medium ${props.imageLayout === 'row' ? 'pt-[10px]' : ''}`}>
          {props.title}
        </span> :
        (<div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center">
          <div className="w-full">
            <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>)}

      {props.imageLayout !== 'row' && (props.traits ?? []).map((pair, index) => makeTrait(pair, index))}

      {!isNullOrEmpty(props.description) && (
        <div className='mt-4 text-secondary-txt text-xs minmd:text-sm'>
          {props.description}
        </div>
      )}
      {
        props.cta &&
          <div
            className="mt-4 text-xs minmd:text-sm cursor-pointer hover:underline"
            style={{ color: link }}
          >
            {props.cta}
          </div>
      }
      {props.showListingIcons && !props.nft?.isOwnedByMe && <DynamicNFTCardListingIcons lowestListing={props.lowestListing} collectionName={props.collectionName} nft={props.nft}/>}
    </div>
  );
};
