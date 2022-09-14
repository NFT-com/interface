import { NftPortTxByContractTransactions } from 'graphql/generated/types';
import { shorten, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import moment from 'moment';
import { useCallback } from 'react';

export interface DetailPageTableRowProps {
  tx: NftPortTxByContractTransactions;
  index: number;
  isNftDetailPage?: boolean;
}

export default function DetailPageTableRow({ tx, index, isNftDetailPage }: DetailPageTableRowProps) {
  const formatMarketplaceName = (name) => {
    if(name === 'opensea'){
      return 'OpenSea';
    } else if (name === 'looksrare') {
      return 'LooksRare';
    } else {
      return name;
    }
  };

  const getRowContent = useCallback(() => {
    if(tx.type === 'mint'){
      return (
        <>
          <td className="font-normal text-base leading-6 text-[#1F2127] p-4">{'0x0000...0000' || '—'}</td>
          <td className="font-normal text-base leading-6 text-[#1F2127] p-4">{shortenAddress(tx.owner_address, 4) || '—'}</td>
        </>
      );
    }
    
    if(tx.type === 'sale'){
      return (
        <>
          <td className="font-normal text-base leading-6 text-[#1F2127] p-4">{shortenAddress(tx.seller_address, 4) || '—'}</td>
          <td className="font-normal text-base leading-6 text-[#1F2127] p-4">{shortenAddress(tx.buyer_address, 4) || '—'}</td>
        </>
      );
    }
        
    return (
      <>
        <td className="font-normal text-base leading-6 text-[#1F2127] p-4">{shortenAddress(tx.transfer_from, 4) || '—'}</td>
        <td className="font-normal text-base leading-6 text-[#1F2127] p-4">{shortenAddress(tx.transfer_to, 4) || '—'}</td>
      </>
    );
  }, [tx]);
  
  return (
    <tr key={index} className={tw(
      'font-normal text-base leading-6 text-[#1F2127] overflow-auto',
      index % 2 === 0 && 'bg-[#F8F8F8]'
    )}
    >
      <td className="font-normal text-base leading-6 text-[#1F2127] p-4 capitalize">{tx?.type || '—'}</td>
      {!isNftDetailPage ?
        tx?.type === 'sale' ?
          <td className="font-normal text-base leading-6 text-[#1F2127] p-4">{tx?.nft.token_id?.length > 10 ? shorten(tx?.nft.token_id, true) || '—' : tx?.nft.token_id || '—'}</td>
          :
          <td className="font-normal text-base leading-6 text-[#1F2127] p-4">{tx?.token_id?.length > 10 ? shorten(tx?.token_id, true) || '—' : tx?.token_id || '—'}</td>
        : null
      }
        
      {getRowContent()}
        
      <td className="font-normal text-base leading-6 text-[#1F2127] p-4 capitalize">{
        formatMarketplaceName(tx.marketplace) || '—'
      }
      </td>
      <td className="font-normal text-base leading-6 text-[#1F2127] p-4">
        {moment.utc(tx.transaction_date).format('lll').toString() || '—'}
      </td>
      <td className="font-normal text-base leading-6 text-[#B59007] p-4">
        <a
          target="_blank"
          rel="noreferrer" href={`https://etherscan.io/tx/${tx.transaction_hash}`} className='font-bold tracking-wide'>
          {shorten(tx?.transaction_hash, true) || '—'}
        </a>
      </td>
    </tr>
  );
}
