import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Nft, TxActivity } from 'graphql/generated/types';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import {
  getGenesisKeyThumbnail,
  isNullOrEmpty,
  processIPFSURL,
  sameAddress,
  sliceString
} from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';

import VerifiedIcon from 'public/verifiedIcon.svg';
import VolumeIcon from 'public/volumeIcon.svg';
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
  timePeriod?: string;
  index?: number;
  userName?: string;
  userAvatar?: string;
  isVerified?: boolean;
  isLeaderBoard?: boolean;
  redirectTo?: string;
  floorPrice?: string;
  totalVolume?: number;
  maxSymbolsInString?: number;
  contractAddr?: string;
  listings?: PartialDeep<TxActivity>[]
  nft?: PartialDeep<DetailedNft>;
  tokenId?: string;
  images?: Array<string | null>,
  isOfficial?: boolean;
}

export function CollectionCard(props: CollectionCardProps) {
  const newFiltersEnabled = getEnvBool(Doppler.NEXT_PUBLIC_DISCOVER2_PHASE3_ENABLED);

  const { chain } = useNetwork();
  const [isStringCut, toggleStringLength] = useState(false);
  const { data: collection } = useCollectionQuery(String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)), props?.contract);
  const defaultChainId = useDefaultChainId();
  const { data: nft } = useNftQuery(props.contractAddr, (props?.listings || props?.nft) ? null : props.tokenId);

  const processedImageURLs = sameAddress(props.contractAddr, getAddress('genesisKey', defaultChainId)) && !isNullOrEmpty(props.tokenId) ?
    [getGenesisKeyThumbnail(props.tokenId)]
    : props?.images?.length > 0 ? props?.images?.map(processIPFSURL) : [nft?.metadata?.imageURL].map(processIPFSURL);

  const checkMinPrice = (price) => {
    if(!price){
      return '';
    }
    if(price < 0.01){
      return '< 0.1 ETH';
    }else {
      return `${ethFormatting(price)} ETH`;
      // return `${price.toFixed(3).replaceAll('.', ',')} ETH`;
    }
  };
  const ethFormatting = (value) => {
    if(!value) return;
    const convertedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol' }).format(value);
    return convertedValue.slice(1);
  };
  return (
    <a href={props.redirectTo} className="sm:mb-4 min-h-[100%] block transition-all cursor-pointer rounded-[16px] shadow-lg overflow-hidden">
      <div className="h-44 relative ">
        <RoundedCornerMedia
          variant={RoundedCornerVariant.None}
          width={600}
          height={600}
          containerClasses='w-[100%] object-cover h-[100%]'
          src={processedImageURLs[0]}
          extraClasses="hover:scale-105 transition"
        />
      </div>
      <div className="pt-4 pr-[20px] pb-5 pl-[30px] min-h-51rem">
        <div className="border-b-[1px] border-[#F2F2F2] pb-[11px] mb-[16px]">
          <div className="flex justify-between items-start">
            {
              newFiltersEnabled
                ? (
                  <span className="pr-[20px] text-xl leading-7 text-[#000000] font-[600]">
                    {props?.contractName}
                    {props.isOfficial && <VerifiedIcon className='inline ml-3'/>}
                  </span>
                )
                : (
                  <span className="pr-[20px] text-xl leading-7 text-[#000000] font-[600]">
                    {collection?.collection?.name ? collection?.collection?.name : props.contractName}
                  </span>
                )
            }
          </div>
        </div>
        {
          newFiltersEnabled
            ? (
              <div onClick={(event) => event.preventDefault()} className="flex flex-row leading-[23.2px] text-[#959595] font-[400 w-full]">
                {
                  props.totalVolume
                    ? (
                      <div className='flex flex-col '>
                        <span className='flex items-center justify-center text-xl text-[#000] font-[500] mr-12'>
                          <VolumeIcon className='mr-2'/>
                          {checkMinPrice(props.floorPrice)}
                        </span>
                        <span>Floor Price</span>
                      </div>
                    )
                    : null
                }
                {
                  props.totalVolume
                    ? (
                      <div className='flex flex-col '>
                        <span className='text-xl text-[#000] font-[500]'>{checkMinPrice(props.totalVolume)}</span>
                        <span>Total Volume</span>
                      </div>
                    )
                    : null
                }
              </div>
            )
            : (
              <div onClick={(event) => event.preventDefault()} className="leading-[23.2px] text-[#959595] font-[400]">
                <p className="text-base">
                  {sliceString(collection?.collection?.description ? collection?.collection?.description : props.description, props.maxSymbolsInString, isStringCut)}
                  {
                    ((collection?.collection?.description && collection?.collection?.description?.length) || props.description) > props.maxSymbolsInString && (
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
