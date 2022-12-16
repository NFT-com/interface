import { NftPortTxByContractTransactions } from 'graphql/generated/types';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useNftProfileTokens } from 'hooks/useNftProfileTokens';
import { shorten, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import moment from 'moment';
import Link from 'next/link';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import { useCallback } from 'react';

export interface DetailPageTableRowProps {
  tx: NftPortTxByContractTransactions;
  index: number;
  isNftDetailPage?: boolean;
}

export default function DetailPageTableRow({ tx, index, isNftDetailPage }: DetailPageTableRowProps) {
  const formatMarketplaceName = (name) => {
    if(name === 'opensea'){
      return <div className='flex items-center'>
        <OpenseaIcon
          className='h-6 w-6 relative shrink-0 hover:opacity-70 '
          alt="Opensea logo"
          layout="fill"
        />
        <div className='font-noi-grotesk text-[16px] text-[#6A6A6A] ml-1.5'>Opensea</div>
      </div>;
    } else if (name === 'looksrare') {
      return <div className='flex items-center'>
        <LooksrareIcon
          className='h-6 w-6 relative shrink-0 hover:opacity-70 '
          alt="Looksrare logo"
          layout="fill"
        />
        <div className='font-noi-grotesk text-[16px] text-[#6A6A6A] ml-1.5'>Looksrare</div>
      </div>;
    } else {
      return name;
    }
  };

  const { profileTokens: tx_owner_tokens } = useNftProfileTokens(tx.owner_address);
  const { profileData: tx_owner } = useProfileQuery(
    tx.owner_address == null ?
      tx_owner_tokens?.at(0)?.tokenUri?.raw?.split('/').pop() :
      null
  );

  const { profileTokens: tx_seller_tokens } = useNftProfileTokens(tx.seller_address);
  const { profileData: tx_seller } = useProfileQuery(
    tx.owner_address == null ?
      tx_seller_tokens?.at(0)?.tokenUri?.raw?.split('/').pop() :
      null
  );

  const { profileTokens: tx_buyer_tokens } = useNftProfileTokens(tx.buyer_address);
  const { profileData: tx_buyer } = useProfileQuery(
    tx.owner_address == null ?
      tx_buyer_tokens?.at(0)?.tokenUri?.raw?.split('/').pop() :
      null
  );

  const { profileTokens: tx_from_tokens } = useNftProfileTokens(tx.transfer_from);
  const { profileData: tx_from } = useProfileQuery(
    tx.owner_address == null ?
      tx_from_tokens?.at(0)?.tokenUri?.raw?.split('/').pop() :
      null
  );

  const { profileTokens: tx_to_tokens } = useNftProfileTokens(tx.transfer_to);
  const { profileData: tx_to } = useProfileQuery(
    tx.owner_address == null ?
      tx_to_tokens?.at(0)?.tokenUri?.raw?.split('/').pop() :
      null
  );

  const styledProfile = (url: string) => <Link href={'/' + url} passHref>
    <a>
      <div className="hover:font-bold lex w-full items-center text-[16px] font-medium cursor-pointer font-noi-grotesk my-4">
        <span className='font-dm-mono text-primary-yellow'>/</span>
        <span className='ml-1 whitespace-nowrap text-[#4D4D4D] text-ellipsis overflow-hidden'>{url}</span>
      </div>
    </a>
  </Link>;

  const getRowContent = useCallback(() => {
    if (tx.type === 'mint'){
      return (
        <>
          <td className="font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A] p-4">{'0x0000...0000' || '—'}</td>
          {tx_owner?.profile?.owner?.preferredProfile?.url ? <td>{styledProfile(tx_owner?.profile?.owner?.preferredProfile?.url)}</td> : <td className="font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A] p-4">{shortenAddress(tx.owner_address, 4) || '—'}</td>}
        </>
      );
    }
    
    if(tx.type === 'sale'){
      return (
        <>
          {tx_seller?.profile?.owner?.preferredProfile?.url ? <td>{styledProfile(tx_seller?.profile?.owner?.preferredProfile?.url)}</td> : <td className="font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A] p-4">{shortenAddress(tx.seller_address, 4) || '—'}</td>}
          {tx_buyer?.profile?.owner?.preferredProfile?.url ? <td>{styledProfile(tx_buyer?.profile?.owner?.preferredProfile?.url)}</td> : <td className="font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A] p-4">{shortenAddress(tx.buyer_address, 4) || '—'}</td>}
        </>
      );
    }
        
    return (
      <>
        {tx_from?.profile?.owner?.preferredProfile?.url ? <td>{styledProfile(tx_from?.profile?.owner?.preferredProfile?.url)}</td> : <td className="font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A] p-4">{shortenAddress(tx.transfer_from, 4) || '—'}</td>}
        {tx_to?.profile?.owner?.preferredProfile?.url ? <td>{styledProfile(tx_to?.profile?.owner?.preferredProfile?.url)}</td> : <td className="font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A] p-4">{shortenAddress(tx.transfer_to, 4) || '—'}</td>}
      </>
    );
  }, [tx, tx_owner, tx_seller, tx_buyer, tx_from, tx_to]);
  
  return (
    <tr key={index} className={tw(
      'font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A] overflow-auto'
    )}
    >
      <td className="font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A] p-4 capitalize">{tx?.type || '—'}</td>
      {!isNftDetailPage ?
        tx?.type === 'sale' ?
          <td className="font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A] p-4">{tx?.nft.token_id?.length > 10 ? shorten(tx?.nft.token_id, true) || '—' : tx?.nft.token_id || '—'}</td>
          :
          <td className="font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A] p-4">{tx?.token_id?.length > 10 ? shorten(tx?.token_id, true) || '—' : tx?.token_id || '—'}</td>
        : null
      }
        
      {getRowContent()}
        
      <td className="font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A] p-4 capitalize">{
        formatMarketplaceName(tx.marketplace) || '—'
      }
      </td>
      {tx?.price_details ?
        <>
          <td className="font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A] p-4 whitespace-nowrap">
            {tx.price_details.price} {tx.price_details.asset_type}
          </td>
          <td className="font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A] p-4">
            {tx.price_details.price_usd?.toFixed(2) ? `$${tx.price_details.price_usd?.toFixed(2)}` : '-'}
          </td></>
        :
        <>
          <td className="font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A] p-4">—</td>
          <td className="font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A] p-4">—</td>
        </>
      }
      <td className="font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A] p-4">
        {moment.utc(tx.transaction_date).format('lll').toString() || '—'}
      </td>
      <td className="font-noi-grotesk text-[16px] leading-6 underline text-transparent bg-clip-text bg-gradient-to-br from-[#FAC213] to-[#FF9B37] p-4">
        <a
          target="_blank"
          rel="noreferrer" href={`https://etherscan.io/tx/${tx.transaction_hash}`} className='tracking-wide underline'>
          {shorten(tx?.transaction_hash, true) || '—'}
        </a>
      </td>
    </tr>
  );
}
