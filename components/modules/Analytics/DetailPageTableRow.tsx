/* eslint-disable @next/next/no-img-element */
import { MouseEvent, useCallback } from 'react';
import { BigNumber, ethers } from 'ethers';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { NftPortTxByContractTransactions } from 'graphql/generated/types';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useERC20Symbol } from 'hooks/useERC20Symbol';
import { useNftProfileTokens } from 'hooks/useNftProfileTokens';
import { shorten } from 'utils/format';
import { shortenAddress } from 'utils/helpers';
import { getLooksrareAssetPageUrl } from 'utils/looksrareHelpers';
import { tw } from 'utils/tw';

import LooksrareIcon from 'public/icons/looksrare-icon.svg?svgr';
import OpenseaIcon from 'public/icons/opensea-icon.svg?svgr';
import X2Y2Icon from 'public/icons/x2y2-icon.svg?svgr';

const BlurImage = dynamic(import('components/elements/BlurImage'));

export interface DetailPageTableRowProps {
  tx: NftPortTxByContractTransactions;
  index: number;
  isNftDetailPage?: boolean;
}

type GetAssetProps = {
  price: string;
  asset_type: string;
  contract_address: string;
};

const getSymbol = (contract_address: string, symbol: string, price: string) => {
  switch (symbol) {
    case 'USDC':
      return (
        <div className='flex items-center'>
          <BlurImage
            alt='USDC Logo'
            localImage
            width={20}
            height={20}
            src='/icons/usdc.svg'
            className='relative mr-1.5 h-5 w-5 shrink-0'
          />
          {Number(price)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} USDC
        </div>
      );
    case 'DAI':
      return (
        <div className='flex items-center'>
          <BlurImage
            alt='Dai Logo'
            localImage
            width={20}
            height={20}
            src='/icons/dai.svg'
            className='relative mr-1.5 h-5 w-5 shrink-0'
          />
          {Number(price)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} DAI
        </div>
      );
    case 'ETH':
      return (
        <div className='flex items-center'>
          <BlurImage
            alt='Ethereum Logo'
            localImage
            width={20}
            height={20}
            src='/icons/eth.svg'
            className='relative mr-1.5 h-5 w-5 shrink-0'
          />{' '}
          {Number(price)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ETH
        </div>
      );
    default:
      if (!contract_address) {
        return (
          <div>
            {Number(price)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {symbol}
          </div>
        );
      }
      // TODO: migrate to BlurImage component
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <div className='flex items-center'>
          <img
            className='relative mr-1.5 h-6 w-6 shrink-0'
            src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${ethers.utils.getAddress(
              contract_address
            )}/logo.png`}
            alt={symbol}
          />
          {Number(price)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {symbol}
        </div>
      );
  }
};

function GetAsset({ price, asset_type, contract_address }: GetAssetProps) {
  const symbol = useERC20Symbol(contract_address);

  switch (asset_type) {
    case 'ETH':
      return (
        <div className='flex items-center'>
          <BlurImage
            width={20}
            height={20}
            src='/icons/eth.svg'
            alt='ethereum logo'
            className='relative mr-1.5 h-5 w-5 shrink-0'
            localImage
          />
          {Number(price)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ETH
        </div>
      );
    case 'ERC20':
      return <div className='flex items-center'>{getSymbol(contract_address, symbol, price)}</div>;
    default:
      return (
        <div>
          {Number(price)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}{' '}
          {asset_type}
        </div>
      );
  }
}

export default function DetailPageTableRow({ tx, index, isNftDetailPage }: DetailPageTableRowProps) {
  const formatMarketplaceName = name => {
    if (name === 'opensea') {
      return (
        <div className='flex items-center'>
          <OpenseaIcon className='relative h-6 w-6 shrink-0 hover:opacity-70 ' alt='Opensea logo' layout='fill' />
          <div className='ml-1.5 font-noi-grotesk text-[16px] text-[#6A6A6A]'>Opensea</div>
        </div>
      );
    }
    if (name === 'looksrare') {
      return (
        <div
          className='flex items-center hover:cursor-pointer'
          onClick={(e: MouseEvent<any>) => {
            e.preventDefault();
            window.open(
              getLooksrareAssetPageUrl(tx?.nft?.contractAddress, BigNumber.from(tx?.nft?.tokenId).toString()),
              '_blank'
            );
            e.stopPropagation();
          }}
        >
          <LooksrareIcon className='relative h-6 w-6 shrink-0 hover:opacity-70 ' alt='Looksrare logo' layout='fill' />
          <div className='ml-1.5 font-noi-grotesk text-[16px] text-[#6A6A6A]'>Looksrare</div>
        </div>
      );
    }
    if (name === 'cryptopunks') {
      return (
        <div className='flex items-center'>
          <BlurImage
            localImage
            width={20}
            height={20}
            src='/larva_labs.webp'
            className='relative h-5 w-5 shrink-0 rounded-full hover:opacity-70'
            alt='Larva labs logo'
          />
          <div className='ml-2 font-noi-grotesk text-[16px] text-[#6A6A6A]'>CryptoPunks</div>
        </div>
      );
    }
    if (name === 'nftcom') {
      return (
        <div className='flex items-center'>
          <BlurImage
            localImage
            width={20}
            height={20}
            src='/nft_logo_yellow.webp'
            className='relative h-5 w-5 shrink-0 hover:opacity-70'
            alt='NFT.com logo'
          />
          <div className='ml-2 font-noi-grotesk text-[16px] text-[#6A6A6A]'>NFT.com</div>
        </div>
      );
    }
    if (name === 'x2y2') {
      return (
        <div className='flex items-center'>
          <X2Y2Icon className='relative ml-0.5 h-5 w-5 shrink-0 hover:opacity-70 ' alt='X2Y2 logo' layout='fill' />
          <div className='ml-2 font-noi-grotesk text-[16px] text-[#6A6A6A]'>X2Y2</div>
        </div>
      );
    }
    return name;
  };

  const { profileTokens: tx_owner_tokens } = useNftProfileTokens(tx.ownerAddress);
  const { profileData: tx_owner } = useProfileQuery(
    tx.ownerAddress == null ? tx_owner_tokens?.at(0)?.tokenUri?.raw?.split('/').pop() : null
  );

  const { profileTokens: tx_seller_tokens } = useNftProfileTokens(tx.sellerAddress);
  const { profileData: tx_seller } = useProfileQuery(
    tx.ownerAddress == null ? tx_seller_tokens?.at(0)?.tokenUri?.raw?.split('/').pop() : null
  );

  const { profileTokens: tx_buyer_tokens } = useNftProfileTokens(tx.buyerAddress);
  const { profileData: tx_buyer } = useProfileQuery(
    tx.ownerAddress == null ? tx_buyer_tokens?.at(0)?.tokenUri?.raw?.split('/').pop() : null
  );

  const { profileTokens: tx_from_tokens } = useNftProfileTokens(tx.transferFrom);
  const { profileData: tx_from } = useProfileQuery(
    tx.ownerAddress == null ? tx_from_tokens?.at(0)?.tokenUri?.raw?.split('/').pop() : null
  );

  const { profileTokens: tx_to_tokens } = useNftProfileTokens(tx.transferTo);
  const { profileData: tx_to } = useProfileQuery(
    tx.ownerAddress == null ? tx_to_tokens?.at(0)?.tokenUri?.raw?.split('/').pop() : null
  );

  const styledProfile = (url: string) => (
    <Link href={`/${url}`} passHref>
      <div className='my-4 w-full cursor-pointer items-center px-4 font-noi-grotesk text-[16px] font-medium hover:font-bold'>
        <span className='font-dm-mono text-primary-yellow'>/</span>
        <span className='ml-1 overflow-hidden text-ellipsis whitespace-nowrap text-[#4D4D4D]'>{url}</span>
      </div>
    </Link>
  );

  const getRowContent = useCallback(() => {
    if (tx.type === 'mint') {
      return (
        <>
          <td className='p-4 font-noi-grotesk text-[16px] font-medium leading-6 text-black'>
            {'0x0000...0000' || '—'}
          </td>
          {tx_owner?.profile?.owner?.preferredProfile?.url ? (
            <td>{styledProfile(tx_owner?.profile?.owner?.preferredProfile?.url)}</td>
          ) : (
            <td className='p-4 font-noi-grotesk text-[16px] font-medium leading-6 text-black'>
              {shortenAddress(tx.ownerAddress, 4) || '—'}
            </td>
          )}
        </>
      );
    }

    if (tx.type === 'sale') {
      return (
        <>
          {tx_seller?.profile?.owner?.preferredProfile?.url ? (
            <td>{styledProfile(tx_seller?.profile?.owner?.preferredProfile?.url)}</td>
          ) : (
            <td className='p-4 font-noi-grotesk text-[16px] font-medium leading-6 text-black'>
              {shortenAddress(tx.sellerAddress, 4) || '—'}
            </td>
          )}
          {tx_buyer?.profile?.owner?.preferredProfile?.url ? (
            <td>{styledProfile(tx_buyer?.profile?.owner?.preferredProfile?.url)}</td>
          ) : (
            <td className='p-4 font-noi-grotesk text-[16px] font-medium leading-6 text-black'>
              {shortenAddress(tx.buyerAddress, 4) || '—'}
            </td>
          )}
        </>
      );
    }

    return (
      <>
        {tx_from?.profile?.owner?.preferredProfile?.url ? (
          <td>{styledProfile(tx_from?.profile?.owner?.preferredProfile?.url)}</td>
        ) : (
          <td className='p-4 font-noi-grotesk text-[16px] font-medium leading-6 text-black'>
            {shortenAddress(tx.transferFrom, 4) || '—'}
          </td>
        )}
        {tx_to?.profile?.owner?.preferredProfile?.url ? (
          <td>{styledProfile(tx_to?.profile?.owner?.preferredProfile?.url)}</td>
        ) : (
          <td className='p-4 font-noi-grotesk text-[16px] font-medium leading-6 text-black'>
            {shortenAddress(tx.transferTo, 4) || '—'}
          </td>
        )}
      </>
    );
  }, [tx, tx_owner, tx_seller, tx_buyer, tx_from, tx_to]);

  return (
    <tr key={index} className={tw('overflow-auto font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A]')}>
      <td className='p-4 font-noi-grotesk text-[16px] capitalize leading-6 text-[#6A6A6A]'>{tx?.type || '—'}</td>
      {!isNftDetailPage ? (
        tx?.type === 'sale' ? (
          <td className='p-4 font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A]'>
            {tx?.nft.tokenId?.length > 10 ? shorten(tx?.nft.tokenId, true) || '—' : tx?.nft.tokenId || '—'}
          </td>
        ) : (
          <td className='p-4 font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A]'>
            {tx?.tokenId?.length > 10 ? shorten(tx?.tokenId, true) || '—' : tx?.tokenId || '—'}
          </td>
        )
      ) : null}

      {getRowContent()}

      <td className='p-4 font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A]'>
        {formatMarketplaceName(tx.marketplace?.toLowerCase()) || '—'}
      </td>
      {tx?.priceDetails ? (
        <>
          <td className='whitespace-nowrap p-4 font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A]'>
            <GetAsset
              price={tx.priceDetails.price}
              asset_type={tx.priceDetails.assetType}
              contract_address={tx.priceDetails.contractAddress}
            />
          </td>
          <td className='p-4 font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A]'>
            {tx.priceDetails.priceUSD
              ? `$${Number(tx.priceDetails.priceUSD)?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`
              : '-'}
          </td>
        </>
      ) : (
        <>
          <td className='p-4 font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A]'>—</td>
          <td className='p-4 font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A]'>—</td>
        </>
      )}
      <td className='p-4 font-noi-grotesk text-[16px] leading-6 text-[#6A6A6A]'>
        {moment(tx.transactionDate).format('lll').toString() || '—'}
      </td>
      <td className='bg-gradient-to-br from-[#FAC213] to-[#FF9B37] bg-clip-text p-4 font-noi-grotesk text-[16px] leading-6 text-transparent'>
        <a
          target='_blank'
          rel='noreferrer'
          href={`https://etherscan.io/tx/${tx.transactionHash?.split(':')?.[0]}`}
          className={tw(
            'tracking-wide',
            shorten(tx?.transactionHash, true) && 'underline decoration-[#FAC213] underline-offset-2'
          )}
        >
          {shorten(tx?.transactionHash, true) || '—'}
        </a>
      </td>
    </tr>
  );
}
