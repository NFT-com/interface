import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Nft, TxActivity } from 'graphql/generated/types';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { Doppler, getEnv } from 'utils/env';
import { getGenesisKeyThumbnail, isNullOrEmpty, processIPFSURL, sameAddress, sliceString } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';

import { useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';

export type DetailedNft = Nft & { hidden?: boolean };

export interface CollectionCardProps {
  contract?: string
  title?: string;
  countOfElements?: number | string;
  contractAddress?: string;
  contractName?: string;
  description?: string;
  userName?: string;
  userAvatar?: string;
  isVerified?: boolean;
  redirectTo?: string;
  maxSymbolsInString?: number;
  contractAddr?: string;
  listings?: PartialDeep<TxActivity>[]
  nft?: PartialDeep<DetailedNft>;
  tokenId?: string;
  images?: Array<string | null>,
}

export function CollectionCard(props: CollectionCardProps) {
  const { chain } = useNetwork();
  const [isStringCut, toggleStringLength] = useState(false);
  const { data: collection } = useCollectionQuery(String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)), props?.contract);
  const collectionName = collection?.collection?.name ?? props.contractName;
  const defaultChainId = useDefaultChainId();
  const { data: nft } = useNftQuery(props.contractAddr, (props?.listings || props?.nft) ? null : props.tokenId);
  const processedImageURLs = sameAddress(props.contractAddr, getAddress('genesisKey', defaultChainId)) && !isNullOrEmpty(props.tokenId) ?
    [getGenesisKeyThumbnail(props.tokenId)]
    : props.images.length > 0 ? props.images?.map(processIPFSURL) : [nft?.metadata?.imageURL].map(processIPFSURL);

  return (
    <a href={props.redirectTo && props.redirectTo !== '' ? props.redirectTo : '#'} className="sm:mb-4 min-h-[100%] block hover:scale-105 transition-all cursor-pointer rounded-[16px] shadow-lg overflow-hidden cursor-p">
      <div className="h-44 relative ">
        <RoundedCornerMedia
          variant={RoundedCornerVariant.None}
          width={600}
          height={600}
          containerClasses='w-[100%] object-cover h-[100%]'
          src={processedImageURLs[0]}
          extraClasses="hover:scale-105 transition"
        />
        {/*<div className="absolute w-[48px] h-[48px] bg-[rgba(0,0,0,0.70)] rounded-[50%] top-3 right-2"></div>*/}
      </div>
      <div className="pt-4 pr-[20px] pb-5 pl-[30px] min-h-51rem">
        <div className="border-b-[1px] border-[#F2F2F2] pb-[11px] mb-[16px]">
          <div className="flex justify-between items-start">
            <span className="pr-[20px] text-xl leading-7 text-[#000000] font-[600] max-w-[60%]">{collectionName}</span>
            {props.userName && (
              <button className="bg-white pl-2 pr-[12px] py-[6px] flex items-center shadow-lg rounded-[16px] text-base leading-6 text-[#000000] font-[400] ">
                <div className="w-6 h-6 bg-black rounded-[50%] mr-[6px]"></div>
                <span className="text-ellipsis overflow-hidden block max-w-[100px] min-w-[100px] whitespace-nowrap">{props.userName}</span>
              </button>
            )}
          </div>
          {
            props.countOfElements && (
              <div className="text-base leading-[25px] text-[#6A6A6A] font-[400] mt-[6px]">
                {props.countOfElements + (props.countOfElements > 1 ? ' Elements' : ' Element')}
              </div>
            )
          }
        </div>
        {
          props.description && (
            <div onClick={(event) => event.preventDefault()} className="leading-[23.2px] text-[#959595] font-[400]">
              <p className="text-base">
                {sliceString(props.description, props.maxSymbolsInString, isStringCut)}
                {
                  props.description.length > props.maxSymbolsInString && (
                    <button onClick={() => toggleStringLength(!isStringCut)} className="text-[#000000] font-[600] ml-[5px]">{isStringCut ? 'less' : 'more'}</button>
                  )
                }
              </p>
            </div>
          )
        }
      </div>
    </a>
  );
}
