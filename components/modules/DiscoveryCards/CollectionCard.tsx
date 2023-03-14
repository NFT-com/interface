import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Nft, TxActivity } from 'graphql/generated/types';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import {
  getGenesisKeyThumbnail,
  isNullOrEmpty,
  processIPFSURL,
  sameAddress,
} from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { tw } from 'utils/tw';

import VerifiedIcon from 'public/verifiedIcon.svg';
import VolumeIcon from 'public/volumeIcon.svg';
import { useCallback, useEffect, useRef } from 'react';
import { PartialDeep } from 'type-fest';

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
  floorPrice?: string | number;
  totalVolume?: number;
  maxSymbolsInString?: number;
  contractAddr?: string;
  listings?: PartialDeep<TxActivity>[]
  nft?: PartialDeep<DetailedNft>;
  tokenId?: string;
  images?: Array<string | null>,
  isOfficial?: boolean;
  customHeight?: string;
}

export function CollectionCard(props: CollectionCardProps) {
  const defaultChainId = useDefaultChainId();
  const { data: nft } = useNftQuery(props.contractAddr, (props?.listings || props?.nft) ? null : props.tokenId);
  const { setCardHeightForRWGrid } = useSearchModal();
  const refCollectionCard = useRef(null);

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
    }
  };
  const ethFormatting = (value) => {
    if(!value) return;
    const convertedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol' }).format(value);
    return convertedValue.slice(1);
  };
  
  useEffect(() => {
    setCardHeightForRWGrid(refCollectionCard && refCollectionCard?.current?.offsetHeight);
  }, [setCardHeightForRWGrid]);

  return (
    <a href={props.redirectTo} ref={refCollectionCard} className={tw(
      props.customHeight ?? ' min-h-[100%] ',
      'sm:mb-4 block transition-all cursor-pointer rounded-[16px] shadow-lg overflow-hidden')}>
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
            <span className="pr-[20px] text-xl leading-7 text-[#000000] font-[600]">
              {props?.contractName}
              {props.isOfficial && <VerifiedIcon className='inline ml-3'/>}
            </span>
          </div>
        </div>
        <div onClick={(event) => event.preventDefault()} className="flex flex-row leading-[23.2px] text-[#959595] font-[400 w-full]">
          {
            props.floorPrice && props.floorPrice !== 0
              ? (
                <div className='flex flex-col min-w-[45%] '>
                  <span className='flex items-center justify-start text-xl text-[#000] font-[500] mr-12 w-full'>
                    <VolumeIcon className='mr-2'/>
                    {checkMinPrice(props.floorPrice)}
                  </span>
                  <span>Floor Price</span>
                </div>
              )
              : null
          }
          {
            props.totalVolume && props.totalVolume !== 0
              ? (
                <div className='flex flex-col '>
                  <span className='text-xl text-[#000] font-[500]'>{checkMinPrice(props.totalVolume)}</span>
                  <span>Total Volume</span>
                </div>
              )
              : null
          }
        </div>
      </div>
    </a>
  );
}
