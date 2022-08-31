import { useGetTransactionsByContract } from 'hooks/analytics/nftport/collections/useGetTransactionsByContract';
import { Doppler,getEnv } from 'utils/env';

import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

export type CollectionActivityProps = {
  contract: string;
}
export const CollectionActivity = ({ contract }: CollectionActivityProps) => {
  const { chain } = useNetwork();
  const txs = useGetTransactionsByContract(contract);
  const [collectionData, setCollectionData] = useState(null);

  useEffect(() => {
    if((chain?.id !== 1 && getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID) !== '1') || !txs) {
      return;
    } else {
      if(!collectionData && txs) {
        setCollectionData(txs.transactions);
      }
    }}, [chain?.id, collectionData, txs]);

  //TODO: @anthony - add tx history from indexer
  return (
    <div className="shadow-sm overflow-x-auto my-8 font-grotesk rounded-md p-4 border-2 border-[#D5D5D5]">
      <table className="border-collapse table-auto w-full">
        <thead className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>
          <tr className='p-4 pt-0 pb-3 text-left ...'>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>Name</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>From</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>To</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>Marketplace</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>Timestamp</th>
          </tr>
        </thead>
        <tbody className='p-4'>
          {collectionData?.map((tx) => (
            <tr key={tx} className="bg-white font-normal text-base leading-6 text-[#1F2127] overflow-auto">
              <td className="bg-white font-normal text-base leading-6 text-[#1F2127] p-4">{tx?.type}</td>
              <td className="bg-white font-normal text-base leading-6 text-[#1F2127] p-4">{tx.transfer_from}</td>
              <td className="bg-white font-normal text-base leading-6 text-[#1F2127] p-4">{tx.transfer_to}</td>
              <td className="bg-white font-normal text-base leading-6 text-[#1F2127] p-4">{tx.marketplace}</td>
              <td className="bg-white font-normal text-base leading-6 text-[#1F2127] p-4">{moment(tx.transaction_date).format('MMM-YY-DD:HH:MM').toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};