import { Nft } from 'graphql/generated/types';
import { useGetTxByNFTQuery } from 'graphql/hooks/useGetTxByNFTQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';

import DetailPageTableRow from './DetailPageTableRow';

import { useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';

export type TxHistoryProps = {
  data: PartialDeep<Nft>;
}
export const NFTActivity = ({ data }: TxHistoryProps) => {
  const defaultChainId = useDefaultChainId();
  const nftTransactionHistory = useGetTxByNFTQuery(data?.contract, parseInt(data?.tokenId, 16).toString(), 'all');
  const [nftData, setNftdata] = useState(null);

  useEffect(() => {
    if(defaultChainId !== '1' || !nftTransactionHistory) {
      return;
    } else {
      if(!nftData && nftTransactionHistory) {
        setNftdata(nftTransactionHistory?.data?.transactions);
      }
    }
  }, [defaultChainId, nftData, nftTransactionHistory]);

  return (
    <div className="shadow-sm overflow-x-scroll my-8 font-grotesk rounded-md p-4 border-2 border-[#D5D5D5] max-h-80 overflow-y-scroll whitespace-nowrap">
      {!nftData ?
        <span className='bg-white flex justify-center px-auto mx-auto w-full whitespace-nowrap font-normal text-base leading-6 text-[#1F2127] text-center items-center'>
          No Activity for this NFT yet
        </span>
        :
        <table className="border-collapse table-auto w-full overflow-x-auto">
          <thead className='text-[#6F6F6F] text-sm font-medium leading-6'>
            <tr className='p-4 pt-0 pb-3 text-left ...'>
              <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>Event</th>
              <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>From</th>
              <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>To</th>
              <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>Marketplace</th>
              <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>Price</th>
              <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>USD Value</th>
              <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>Timestamp</th>
              <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>Transaction Hash</th>
            </tr>
          </thead>
          <tbody className='p-4'>
            {nftData?.map((tx, index) => (
              <DetailPageTableRow tx={tx} index={index} key={tx?.id} isNftDetailPage={true} />
            ))}
          </tbody>
        </table>
      }
    </div>
  );
};