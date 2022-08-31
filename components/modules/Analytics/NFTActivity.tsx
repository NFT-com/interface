import { Nft } from 'graphql/generated/types';
import { useGetTransactionsByNFT } from 'hooks/analytics/nftport/nfts/useGetTransactionsByNFT';
import { useDefaultChainId } from 'hooks/useDefaultChainId';

import { useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';

export type TxHistoryProps = {
  data: PartialDeep<Nft>;
}
export const NFTActivity = ({ data }: TxHistoryProps) => {
  const defaultChainId = useDefaultChainId();
  const nftTransactionHistory = useGetTransactionsByNFT(data?.contract, parseInt(data?.tokenId, 16).toString());
  const [nftData, setNftdata] = useState(null);

  useEffect(() => {
    if(defaultChainId === '1' && !nftData && !!nftTransactionHistory) {
      setNftdata(nftTransactionHistory);
    }
  }, [defaultChainId, nftData, nftTransactionHistory]);

  return (
    <div className="shadow-sm overflow-x-scroll my-8 font-grotesk rounded-md p-4 border-2 border-[#D5D5D5] max-h-96 overflow-y-scroll">
      {!nftData ?
        <span className='bg-white flex justify-center px-auto mx-auto w-full whitespace-nowrap font-normal text-base leading-6 text-[#1F2127] text-center items-center'>
          No Activity for this NFT yet
        </span>
        :
        <table className="border-collapse table-auto w-full">
          <thead className='text-[#6F6F6F] text-sm font-medium leading-6'>
            <tr className='p-4 pt-0 pb-3 text-left ...'>
              <th>Event</th>
              <th>From</th>
              <th>To</th>
              <th>Marketplace</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody className='p-4'>
            {nftData?.transactions?.map((tx, index) => (
              <tr key={index} className="bg-white font-normal text-base leading-6 text-[#1F2127]">
                <td>{tx.type}</td>
                <td>{tx.transfer_from}</td>
                <td>{tx.transfer_to}</td>
                <td>{tx.marketplace}</td>
                <td>{tx.transaction_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
};