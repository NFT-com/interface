
import { useGetTxByContractQuery } from 'graphql/hooks/useGetTxByContractQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';

import DetailPageTableRow from './DetailPageTableRow';

import { useEffect, useState } from 'react';

export type CollectionActivityProps = {
  contract: string;
}
export const CollectionActivity = ({ contract }: CollectionActivityProps) => {
  const defaultChainId = useDefaultChainId();
  const txs = useGetTxByContractQuery(contract);
  const [collectionData, setCollectionData] = useState(null);
  
  useEffect(() => {
    if(defaultChainId !== '1' || !txs) {
      return;
    } else {
      if(!collectionData && txs) {
        setCollectionData(txs?.data?.transactions);
      }
    }}, [defaultChainId, collectionData, txs]);

  return (
    <div className="overflow-x-auto my-8 font-grotesk rounded-md p-4">
      {!collectionData && <p className='text-[#6F6F6F] flex items-center justify-center border h-[200px] rounded-[10px]'>No activity available</p>}
      {collectionData &&
      <table className="border-collapse table-auto w-full">
        <thead className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>
          <tr className='p-4 pt-0 pb-3 text-left ...'>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>Type</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4 whitespace-nowrap'>Token ID</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>From</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>To</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>Marketplace</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>Price</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4 whitespace-nowrap'>USD Value</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4 whitespace-nowrap'>Timestamp</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4 whitespace-nowrap'>Transaction Hash</th>
          </tr>
        </thead>
        <tbody className='p-4'>
          {collectionData?.map((tx , index) => (
            <DetailPageTableRow key={tx?.id} tx={tx} index={index} />
          ))}
        </tbody>
      </table>
      }
    </div>
  );
};