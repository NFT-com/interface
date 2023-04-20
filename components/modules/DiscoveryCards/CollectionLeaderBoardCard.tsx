import { PartialDeep } from 'type-fest';

import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Nft, TxActivity } from 'graphql/generated/types';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { convertValue } from 'utils/format';

import VolumeIcon from 'public/icons/volumeIcon.svg?svgr';

export type DetailedNft = Nft & { hidden?: boolean };

export interface CollectionLeaderBoardCardProps {
  contract?: string;
  title?: string;
  countOfElements?: number | string;
  contractAddress?: string;
  contractName?: string;
  description?: string;
  stats?: any;
  logoUrl?: any;
  timePeriod?: string;
  index?: number;
  userName?: string;
  userAvatar?: string;
  isVerified?: boolean;
  isLeaderBoard?: boolean;
  redirectTo?: string;
  maxSymbolsInString?: number;
  contractAddr?: string;
  listings?: PartialDeep<TxActivity>[];
  nft?: PartialDeep<DetailedNft>;
  tokenId?: string;
  images?: Array<string | null>;
}

export function CollectionLeaderBoardCard(props: CollectionLeaderBoardCardProps) {
  const ethPriceUSD = useEthPriceUSD();

  const checkDataByPeriod = () => {
    const all = {
      volume: props.stats.total_volume,
      sales: props.stats.total_sales,
      supply: props.stats.total_supply,
      average_price: '',
      change: '',
      minted: props.stats.total_minted,
      floor_price: props.stats.floor_price
    };
    switch (props.timePeriod) {
      case 'all':
        return all;
      case '24h':
        return {
          volume: props.stats.one_day_volume,
          change: props.stats.one_day_change,
          sales: props.stats.one_day_sales,
          average_price: props.stats.one_day_average_price,
          minted: props.stats.total_minted,
          floor_price: props.stats.floor_price
        };
      case '7d':
        return {
          volume: props.stats.seven_day_volume,
          change: props.stats.seven_day_change,
          sales: props.stats.seven_day_sales,
          average_price: props.stats.seven_day_average_price,
          minted: props.stats.total_minted,
          floor_price: props.stats.floor_price
        };
      case '30d':
        return {
          volume: props.stats.thirty_day_volume,
          change: props.stats.thirty_day_change,
          sales: props.stats.thirty_day_sales,
          average_price: props.stats.thirty_day_average_price,
          minted: props.stats.total_minted,
          floor_price: props.stats.floor_price
        };
      default:
        return all;
    }
  };
  const checkMinPrice = price => {
    if (!price) {
      return '';
    }
    if (price < 0.01) {
      return '< 0.1 ETH';
    }
    return `${ethFormatting(price)} ETH`;
    // return `${price.toFixed(3).replaceAll('.', ',')} ETH`;
  };

  const checkSalesValue = value => {
    if (!value) return;
    const stringValue = value.toString().split('');
    const valueLength = stringValue.length;
    if (value > 1e9) {
      return '> 1B';
    }
    if (valueLength >= 5 && valueLength < 6) {
      const string = convertValue(value, 2, 5);
      return `${string.start},${string.end}`;
    }
    if (valueLength >= 6) {
      if (valueLength >= 6 && valueLength < 7) {
        const string = convertValue(value, 3, 5);
        return `${string.start}.${string.end}k`;
      }
      if (valueLength >= 7 && valueLength < 8) {
        const string = convertValue(value, 1, 3);
        return `${string.start}.${string.end}M`;
      }

      if (valueLength >= 8 && valueLength < 9) {
        const string = convertValue(value, 2, 4);
        return `${string.start}.${string.end}M`;
      }
      if (valueLength >= 9 && valueLength < 10) {
        const string = convertValue(value, 3, 5);
        return `${string.start}.${string.end}M`;
      }
    }
    return value;
  };
  const convertCurrency = value => {
    if (!value) return;
    const convertedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol'
    }).format(ethPriceUSD * Number(value));
    if (Number(convertedValue.slice(1)) < 1) {
      return `$${convertedValue.slice(2)}`;
    }
    return convertedValue;
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
  const statsData = checkDataByPeriod();
  return (
    <>
      <a
        href={props.redirectTo}
        className='mb-3 flex flex-col overflow-hidden rounded-[16px] p-3 shadow-lg minlg:hidden'
      >
        <div className='mb-3 flex flex-row items-center justify-center text-2xl font-[500] text-[#000000]'>
          #{props.index + 1}
          <div className='ml-2 w-14 overflow-hidden rounded-[16px]'>
            <RoundedCornerMedia
              variant={RoundedCornerVariant.None}
              width={600}
              height={600}
              containerClasses='w-[100%] object-cover h-[100%]'
              src={props?.logoUrl}
              extraClasses='hover:scale-105 transition'
            />
          </div>
        </div>
        <div className='mb-3 flex flex-row justify-center px-2 text-xl font-bold text-[#000000]'>
          <span className='text-center'>{props.title}</span>
        </div>
        <div className='mb-3 flex flex-row flex-wrap items-start justify-between'>
          <div className='mb-3 flex w-[33.33%] flex-col justify-between minmd:mb-0 minmd:w-[auto]'>
            <span className='font-[600] leading-6 text-[#B2B2B2]'>VOLUME</span>
            <div className='flex flex-row items-center'>
              <div className='pr-3'>
                <VolumeIcon />
              </div>
              <div>
                <div className='-mb-1 text-lg font-[600] text-[#000000]'>
                  {statsData?.volume?.toFixed(2).replaceAll('.', ',')}
                </div>
                <div className='text-base font-[400] leading-[18px] text-[#747474]'>
                  {checkMinPrice(statsData?.volume)}
                </div>
              </div>
            </div>
          </div>
          <div className='mb-3 flex w-[33.33%] flex-col items-center justify-between minmd:mb-0 minmd:w-[auto]'>
            <span className='font-[600] leading-6 text-[#B2B2B2]'>% CHANGE</span>
            <div
              className={`${
                Math.sign(statsData?.change) === -1 ? 'text-[#ff5454]' : 'text-[#26AA73]'
              } text-lg font-[500]`}
            >
              {statsData && statsData?.change ? `${(statsData.change * 10)?.toFixed(2)}%` : null}
            </div>
          </div>
          <div className='mb-3 flex w-[33.33%] flex-col items-end justify-between minmd:mb-0 minmd:w-[auto]'>
            <span className='font-[600] leading-6 text-[#B2B2B2]'>FLOOR PRICE</span>
            <div className='flex flex-row items-center'>
              <div className='pr-3'>{statsData?.floor_price && <VolumeIcon />}</div>
              <div>
                <div className='-mb-1 text-lg font-[600] text-[#000000]'>{checkMinPrice(statsData?.floor_price)}</div>
                <div className='text-base font-[400] leading-[18px] text-[#747474]'>
                  {statsData?.floor_price ? convertCurrency(statsData?.floor_price) : ''}
                </div>
              </div>
            </div>
          </div>
          <div className='flex w-[50%] flex-col justify-between minmd:w-[auto]'>
            <div className='font-[600] leading-6 text-[#B2B2B2]'>ITEMS</div>
            <div className='text-lg font-[500] text-[#B2B2B2]'>{statsData?.minted}</div>
          </div>
          <div className='flex w-[50%] flex-col items-end justify-between minmd:w-[auto]'>
            <div className='font-[600] leading-6 text-[#B2B2B2]'>SALES</div>
            <div className='text-lg font-[500] text-[#000000]'>{checkSalesValue(statsData?.sales)}</div>
          </div>
        </div>
      </a>
      <a
        href={props.redirectTo}
        className='hidden h-[6.25rem] w-full cursor-pointer  items-center justify-start overflow-hidden rounded-[16px] px-6 font-noi-grotesk shadow-lg transition-all hover:scale-[1.01] minlg:flex'
      >
        <div className='flex w-[35%] items-center justify-start'>
          <div className='flex items-center justify-start'>
            <div className='mr-4'>#{props.index + 1}</div>
            <div className='w-20  overflow-hidden rounded-[16px]'>
              <RoundedCornerMedia
                variant={RoundedCornerVariant.None}
                width={600}
                height={600}
                containerClasses='w-[100%] object-cover h-[100%]'
                src={props?.logoUrl}
                extraClasses='hover:scale-105 transition'
              />
            </div>
          </div>
          <div className='flex flex-row items-start justify-start pl-6'>
            <span className='pr-5 text-lg font-[500] text-[#000000]'>{props.title}</span>
            {/* <VerifiedIcon/> */}
            {/* <span className="pr-[20px] text-xl leading-7 text-[#000000] font-[600] max-w-[60%]">{collectionName}</span> */}
          </div>
        </div>
        <div className='flex w-[15%] flex-row items-center justify-center pl-1'>
          <div className='pr-3'>
            <VolumeIcon />
          </div>
          <div>
            <div className='-mb-1 text-lg font-[600] text-[#000000]'>{checkMinPrice(statsData?.volume)}</div>
            <div></div>
            <div className='text-base font-[400] leading-[18px] text-[#747474]'>
              {convertCurrency(statsData?.volume)}
            </div>
          </div>
        </div>
        <div
          className={`${
            Math.sign(statsData?.change) === -1 ? 'text-[#ff5454]' : 'text-[#26AA73]'
          } w-[15%] items-center justify-center pl-1 text-center text-lg  font-[500]`}
        >
          {statsData && statsData?.change ? `${(statsData.change * 10)?.toFixed(2)}%` : null}
        </div>
        <div className='flex w-[15%] flex-row items-center  justify-center  pl-1'>
          <div className='pr-3'>{statsData?.floor_price && <VolumeIcon />}</div>
          <div>
            <div className='-mb-1 text-lg font-[600] text-[#000000]'>{checkMinPrice(statsData?.floor_price)}</div>
            <div className='text-base font-[400] leading-[18px] text-[#747474]'>
              {statsData?.floor_price ? convertCurrency(statsData?.floor_price) : ''}
            </div>
          </div>
        </div>
        <div className='flex w-[10%] items-center justify-center pl-1 text-lg  font-[500] text-[#B2B2B2]'>
          {statsData?.minted}
        </div>
        <div className='flex w-[10%] items-center justify-center pl-1 text-lg font-[500] text-[#000000]'>
          {checkSalesValue(statsData?.sales)}
        </div>
      </a>
    </>
  );
}
