import { Nft } from 'graphql/generated/types';
import { useGetTransactionsByNFT } from 'hooks/analytics/nftport/nfts/useGetTransactionsByNFT';
import { Doppler, getEnv } from 'utils/env';

import { useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';

export type TxHistoryProps = {
  data: PartialDeep<Nft>;
}
export const NFTActivity = ({ data }: TxHistoryProps) => {
  const { chain } = useNetwork();
  const nftTransactionHistory = useGetTransactionsByNFT(data?.contract, parseInt(data?.tokenId, 16).toString());
  const [nftData, setNftdata] = useState(null);

  useEffect(() => {
    if((chain?.id === 1 || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID) === '1') && !nftData && !!nftTransactionHistory) {
      setNftdata(nftTransactionHistory);
    }
  }, [chain?.id, nftData, nftTransactionHistory]);

  return (
    <div className="shadow-sm overflow-x-auto my-8 font-grotesk rounded-md p-4 border-2 border-[#D5D5D5] whitespace-nowrap">
      {!nftData ?
        <span className='bg-white flex justify-center px-auto mx-auto w-full whitespace-nowrap font-normal text-base leading-6 text-[#1F2127] text-center items-center'>
          No Activity for this NFT yet
        </span>
        :
        <table className="border-collapse table-auto w-full overflow-x-auto">
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
            {nftData?.transactions?.map((tx) => (
              <tr key={tx} className="bg-white font-normal text-base leading-6 text-[#1F2127] w-full">
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