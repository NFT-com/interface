import moment from 'moment';
import useSWR from 'swr';

import { ActivityType } from 'graphql/generated/types';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { getNftMetadata } from 'utils/alchemyNFT';
import { isNullOrEmpty } from 'utils/format';
import { tw } from 'utils/tw';

type NotificationButtonProps = {
  buttonText: string;
  onClick: () => void;
  date: string;
  nft: {
    nftId: string;
    collection: string;
    price: number;
    currency: string;
    type: ActivityType;
  };
};

export const NotificationItem = ({ buttonText, onClick, date, nft }: NotificationButtonProps) => {
  const defaultChainId = useDefaultChainId();
  const { data: nftMetadata } = useSWR(`NFTMetadata${nft?.collection}${nft?.nftId}`, async () => {
    if (isNullOrEmpty(nft?.collection) || isNullOrEmpty(nft?.nftId)) {
      return null;
    }
    return getNftMetadata(nft?.collection, nft?.nftId, defaultChainId);
  });

  return (
    <div className='flex w-full flex-row border-t border-[#EFEFEF] font-noi-grotesk'>
      <button
        className={tw(
          'flex h-full w-full flex-col',
          'text-md text-left text-black',
          'leading-6',
          'bg-white font-semibold',
          'py-4'
        )}
        onClick={onClick}
      >
        {isNullOrEmpty(nft?.nftId) ? (
          <p className='w-full'>{buttonText}</p>
        ) : nft?.type === ActivityType.Purchase ? (
          <p className='w-full truncate'>
            You purchased {nftMetadata?.title} for {nft?.price} {nft?.currency}
          </p>
        ) : (
          <p className='w-full truncate'>
            You sold {nftMetadata?.title} for {nft?.price} {nft?.currency}
          </p>
        )}
        {!isNullOrEmpty(date) && <p className='-mt-1 text-[10px] uppercase text-[#6F6F6F]'>{moment(date).fromNow()}</p>}
      </button>
    </div>
  );
};
