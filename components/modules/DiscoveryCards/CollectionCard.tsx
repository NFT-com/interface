import { PartialDeep } from 'type-fest';

import LikeCount from 'components/elements/LikeCount';
import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { LikeableType, Nft, TxActivity } from 'graphql/generated/types';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { isNullOrEmpty } from 'utils/format';
import { getGenesisKeyThumbnail, sameAddress } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';

import VerifiedIcon from 'public/icons/verifiedIcon.svg?svgr';
import VolumeIcon from 'public/icons/volumeIcon.svg?svgr';

export type DetailedNft = Nft & { hidden?: boolean };

export interface LikeInfo {
  isLikedBy: boolean;
  likeCount: number;
}
export interface CollectionCardProps {
  contractName: string;
  redirectTo: string;
  floorPrice: string | number;
  contractAddr: string;
  likeInfo: LikeInfo;
  totalVolume?: number;
  listings?: PartialDeep<TxActivity>[];
  nft?: PartialDeep<DetailedNft>;
  tokenId?: string;
  images?: Array<string | null>;
  isOfficial?: boolean;
  collectionId?: string;
}

export function CollectionCard(props: CollectionCardProps) {
  const defaultChainId = useDefaultChainId();

  const { data: nft } = useNftQuery(props.contractAddr, props?.listings || props?.nft ? null : props.tokenId);

  const processedImageURLs =
    sameAddress(props.contractAddr, getAddress('genesisKey', defaultChainId)) && !isNullOrEmpty(props.tokenId)
      ? [getGenesisKeyThumbnail(props.tokenId)]
      : props?.images?.length > 0
      ? props?.images
      : [nft?.metadata?.imageURL];

  const checkMinPrice = price => {
    if (!price) {
      return '';
    }
    if (price < 0.01) {
      return '< 0.1 ETH';
    }
    return `${ethFormatting(price)} ETH`;
  };
  const ethFormatting = value => {
    if (!value) return;
    const convertedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol'
    }).format(value);
    return convertedValue.slice(1);
  };
  return (
    <a
      href={props.redirectTo}
      className='block min-h-[100%] cursor-pointer overflow-hidden rounded-[16px] bg-white shadow-lg transition-all sm:mb-4'
    >
      <div className='relative h-44 '>
        <div className='absolute right-4 top-4 z-50'>
          <LikeCount
            count={props?.likeInfo?.likeCount}
            isLiked={props?.likeInfo?.isLikedBy}
            likeData={{
              id: props?.collectionId,
              type: LikeableType.Collection
            }}
          />
        </div>

        <RoundedCornerMedia
          variant={RoundedCornerVariant.None}
          width={600}
          height={600}
          sizes='(max-width: 768px) 300px, 500px'
          containerClasses='w-[100%] object-cover h-[100%]'
          src={processedImageURLs[0]}
          extraClasses='hover:scale-105 transition'
        />
      </div>
      <div className='min-h-51rem min-h-[143px] bg-white pb-5 pl-[30px] pr-[20px] pt-4'>
        <div className='mb-[16px] border-b-[1px] border-[#F2F2F2] pb-[11px]'>
          <div className='flex items-start justify-between'>
            <span className='pr-[20px] text-xl font-[600] leading-7 text-[#000000]'>
              {props?.contractName}
              {props.isOfficial && <VerifiedIcon className='ml-3 inline' />}
            </span>
          </div>
        </div>
        <div
          onClick={event => event.preventDefault()}
          className='font-[400 w-full] flex flex-row leading-[23.2px] text-[#959595]'
        >
          {props.floorPrice && props.floorPrice !== 0 ? (
            <div className='flex min-w-[45%] flex-col '>
              <span className='mr-12 flex w-full items-center justify-start text-xl font-[500] text-[#000]'>
                <VolumeIcon className='mr-2' />
                {checkMinPrice(props.floorPrice)}
              </span>
              <span>Floor Price</span>
            </div>
          ) : null}
          {props.totalVolume && props.totalVolume !== 0 ? (
            <div className='flex flex-col '>
              <span className='text-xl font-[500] text-[#000]'>{checkMinPrice(props.totalVolume)}</span>
              <span>Total Volume</span>
            </div>
          ) : null}
        </div>
      </div>
    </a>
  );
}
