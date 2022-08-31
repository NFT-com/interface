import { useGetTransactionsByContract } from 'hooks/analytics/nftport/collections/useGetTransactionsByContract';
import { Doppler,getEnv } from 'utils/env';
import { shorten, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

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

  const formatMarketplaceName = (name) => {
    if(name === 'opensea'){
      return 'OpenSea';
    } else if (name === 'looksrare') {
      return 'LooksRare';
    } else {
      return name;
    }
  };

  //TODO: @anthony - add tx history from indexer
  return (
    <div className="shadow-sm overflow-x-auto my-8 font-grotesk rounded-md p-4 border-2 border-[#D5D5D5]">
      <table className="border-collapse table-auto w-full">
        <thead className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>
          <tr className='p-4 pt-0 pb-3 text-left ...'>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>Type</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>Token ID</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>From</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>To</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>Marketplace</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>Timestamp</th>
            <th className='text-[#6F6F6F] text-sm font-medium leading-6 p-4'>Transaction Hash</th>
          </tr>
        </thead>
        <tbody className='p-4'>
          {collectionData?.map((tx , index) => (
            <tr key={index} className={tw(
              'font-normal text-base leading-6 text-[#1F2127] overflow-auto',
              index % 2 === 0 && 'bg-[#F8F8F8]'
            )}
            >
              <td className="font-normal text-base leading-6 text-[#1F2127] p-4 capitalize">{tx?.type || '—'}</td>
              <td className="font-normal text-base leading-6 text-[#1F2127] p-4">{tx?.token_id || '—'}</td>
              <td className="font-normal text-base leading-6 text-[#1F2127] p-4">{shortenAddress(tx.transfer_from, 4) || '—'}</td>
              <td className="font-normal text-base leading-6 text-[#1F2127] p-4">{shortenAddress(tx.transfer_to, 4) || '—'}</td>
              <td className="font-normal text-base leading-6 text-[#1F2127] p-4 capitalize">{
                formatMarketplaceName(tx.marketplace) || '—'
              }
              </td>
              <td className="font-normal text-base leading-6 text-[#1F2127] p-4">{moment.utc(tx.transaction_date).format('MMM-YY-DD:HH:MM').toString() || '—'}</td>
              <td className="font-normal text-base leading-6 text-[#B59007] p-4">
                <a
                  target="_blank"
                  rel="noreferrer" href={`https://etherscan.io/tx/${tx.transaction_hash}`} className='font-bold tracking-wide'>
                  {shorten(tx?.transaction_hash, true) || '—'}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};