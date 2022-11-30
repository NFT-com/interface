import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Nft, TxActivity } from 'graphql/generated/types';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { Doppler, getEnv } from 'utils/env';
import { getGenesisKeyThumbnail, isNullOrEmpty, processIPFSURL, sameAddress, sliceString } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';

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
  stats?: any;
  logoUrl?: any;
  timePeriod?: string;
  userName?: string;
  userAvatar?: string;
  isVerified?: boolean;
  isLeaderBoard?: boolean;
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
  const ethPriceUSD = useEthPriceUSD();
  const [isStringCut, toggleStringLength] = useState(false);
  const { data: collection } = useCollectionQuery(String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)), props?.contract);
  const collectionName = collection?.collection?.name ?? props.contractName;
  const defaultChainId = useDefaultChainId();
  const { data: nft } = useNftQuery(props.contractAddr, (props?.listings || props?.nft) ? null : props.tokenId);

  const processedImageURLs = sameAddress(props.contractAddr, getAddress('genesisKey', defaultChainId)) && !isNullOrEmpty(props.tokenId) ?
    [getGenesisKeyThumbnail(props.tokenId)]
    : props?.images?.length > 0 ? props?.images?.map(processIPFSURL) : [nft?.metadata?.imageURL].map(processIPFSURL);
  const isLeaderBoard = props.isLeaderBoard;

  const checkDataByPeriod = () => {
    switch (props.timePeriod) {
    case 'all':
      return {
        volume: props.stats.total_volume,
        sales: props.stats.total_sales,
        supply: props.stats.total_supply,
        average_price: '',
        change: '',
        minted: props.stats.total_minted,
        floor_price: props.stats.floor_price
      };
    case '24h':
      return {
        volume: props.stats.one_day_volume,
        change: props.stats.one_day_change,
        sales: props.stats.one_day_sales,
        average_price: props.stats.one_day_average_price,
        minted: props.stats.total_minted,
        floor_price: props.stats.floor_price_historic_one_day
      };
    case '7d':
      return {
        volume: props.stats.seven_day_volume,
        change: props.stats.seven_day_change,
        sales: props.stats.seven_day_sales,
        average_price: props.stats.seven_day_average_price,
        minted: props.stats.total_minted,
        floor_price: props.stats.floor_price_historic_seven_day

      };
    case '30d':
      return {
        volume: props.stats.thirty_day_volume,
        change: props.stats.thirty_day_change,
        sales: props.stats.thirty_day_sales,
        average_price: props.stats.thirty_day_average_price,
        minted: props.stats.total_minted,
        floor_price: props.stats.floor_price_historic_thirty_day
      };
    }
  };
  if(isLeaderBoard){
    const statsData = checkDataByPeriod();
    return (
      <a href={props.redirectTo && props.redirectTo !== '' ? props.redirectTo : '#'} className="px-6 font-noi-grotesk  w-full flex justify-start items-center hover:scale-[1.01] transition-all cursor-pointer rounded-[16px] h-[6.25rem] shadow-lg overflow-hidden">
        <div className="flex justify-start items-center w-[37.5%]">
          <div className="flex justify-start items-center">
            <div className="mr-4">
              #1
            </div>
            <div className="w-20  rounded-[16px] overflow-hidden">
              <RoundedCornerMedia
                variant={RoundedCornerVariant.None}
                width={600}
                height={600}
                containerClasses='w-[100%] object-cover h-[100%]'
                src={props?.logoUrl}
                extraClasses="hover:scale-105 transition"
              />
            </div>
          </div>
          <div className="pl-6 flex flex-row items-start justify-start">
            <span className="pr-5 text-lg text-[#000000] font-[500]">{collection?.collection?.name ? collection?.collection?.name : props.title}</span>
            {/*<VerifiedIcon/>*/}
            {/*<span className="pr-[20px] text-xl leading-7 text-[#000000] font-[600] max-w-[60%]">{collectionName}</span>*/}
          </div>
        </div>
        <div className="flex flex-row items-center  w-[15.3%] pl-1">
          <div className="pr-3">
            <VolumeIcon/>
          </div>
          <div>
            <div className="text-lg text-[#000000] font-[600] -mb-1">{statsData.volume.toFixed(2)}</div>
            <div className="text-base leading-[18px] text-[#747474] font-[400]">${(statsData.volume / ethPriceUSD).toFixed(2)}</div>
          </div>
        </div>
        <div className={`${Math.sign(statsData?.change) === -1 ? 'text-[#ff5454]' : 'text-[#26AA73]' } text-lg font-[500] w-[12%]  pl-1`}>
          {statsData?.change ? `${(statsData?.change * 10)?.toFixed(2)}%` : null}
        </div>
        <div className="flex flex-row items-center  w-[14.9%]  pl-1">
          <div className="pr-3">
            <VolumeIcon/>
          </div>
          <div>
            <div className="text-lg text-[#000000] font-[600] -mb-1">{statsData.floor_price}</div>
            <div className="text-base leading-[18px] text-[#747474] font-[400]">${(statsData.floor_price / ethPriceUSD).toFixed(2)}</div>
          </div>
        </div>
        <div className="text-[#B2B2B2] text-lg font-[500]  w-[13.3%] pl-1">{statsData.minted}</div>
        <div className="text-[#000000] text-lg font-[500]  w-[7%] pl-1">{statsData.sales}</div>
      </a>
    );
  }else {
    return (
      <a href={props.redirectTo && props.redirectTo !== '' ? props.redirectTo : '#'} className="sm:mb-4 min-h-[100%] block transition-all cursor-pointer rounded-[16px] shadow-lg overflow-hidden">
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
}
