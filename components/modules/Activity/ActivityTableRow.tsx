import { useCallback, useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import moment from 'moment';
import Link from 'next/link';
import useSWR from 'swr';

import { NULL_ADDRESS } from 'constants/addresses';
import {
  LooksrareProtocolData,
  NftcomProtocolData,
  SeaportProtocolData,
  TxActivity,
  TxSeaportProtocolData,
  X2Y2ProtocolData
} from 'graphql/generated/types';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { getContractMetadata, getNftMetadata } from 'utils/alchemyNFT';
import { isNullOrEmpty, isObjEmpty } from 'utils/format';
import { shortenAddress } from 'utils/helpers';
import { getProtocolDisplayName } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import { ExternalProtocol } from 'types';

export interface ActivityTableRowProps {
  item: TxActivity;
  index: number;
}

export default function ActivityTableRow({ item, index }: ActivityTableRowProps) {
  const { getByContractAddress } = useSupportedCurrencies();
  const [type, setType] = useState('');
  const defaultChainId = useDefaultChainId();
  const nftId = item?.nftId[0]?.split('/')[2] ? BigNumber.from(item?.nftId[0]?.split('/')[2]).toString() : '-';
  const ethPriceUSD = useEthPriceUSD();
  const { data: collectionMetadata } = useSWR(`ContractMetadata${item?.nftContract}`, async () => {
    return getContractMetadata(item?.nftContract, defaultChainId);
  });
  const { data: nftMetadata } = useSWR(`NFTMetadata${item?.nftContract}${item?.nftId}`, async () => {
    return getNftMetadata(item?.nftContract, nftId, defaultChainId);
  });
  const nftName = nftMetadata?.metadata?.name;
  const collectionName = collectionMetadata?.contractMetadata?.name;

  const getPriceColumns = useCallback(() => {
    if (item[type]?.protocol === 'LooksRare') {
      const protocolData = item[type]?.protocolData as LooksrareProtocolData;
      if (type === 'transaction' || type === 'order') {
        const ethAmount = ethers.utils.formatEther(protocolData?.price);
        const currencyData = getByContractAddress(protocolData?.currencyAddress);
        return (
          <>
            <td className='w-max pr-8 text-body leading-body minmd:pr-4'>
              {ethAmount ? (
                <p>
                  {ethAmount} {currencyData.name}
                </p>
              ) : (
                <p>—</p>
              )}
            </td>
            <td className='pr-8 text-body leading-body minmd:pr-4'>
              {ethAmount && ethPriceUSD ? (
                <p>
                  $
                  {(ethPriceUSD * Number(ethAmount)).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              ) : (
                <p>—</p>
              )}
            </td>
          </>
        );
      }

      return (
        <>
          <td className='pr-8 text-body leading-body minmd:pr-4'>
            <p>—</p>
          </td>
          <td className='pr-8 text-body leading-body minmd:pr-4'>
            <p>—</p>
          </td>
        </>
      );
    }

    if (item[type]?.protocol === 'Seaport') {
      if (type === 'order') {
        const protocolData = item[type]?.protocolData as SeaportProtocolData;

        const sum =
          item[type]?.orderType === 'Bid'
            ? protocolData?.parameters.offer?.reduce((acc, o) => acc + parseInt(o.startAmount), 0)
            : protocolData?.parameters?.consideration.reduce((acc, o) => acc + parseInt(o.startAmount), 0);
        const ethAmount = sum && sum > 0 ? ethers.utils.formatEther(BigInt(sum).toString()) : 0;
        const currencyData =
          item[type]?.orderType === 'Bid'
            ? getByContractAddress(protocolData?.parameters?.offer[0].token)
            : getByContractAddress(protocolData?.parameters?.consideration[0].token);
        return (
          <>
            <td className='whitespace-nowrap pr-8 text-body leading-body minmd:pr-4'>
              {ethAmount && currencyData ? (
                <p>
                  {parseFloat(ethAmount)} {currencyData.name}
                </p>
              ) : (
                <p>—</p>
              )}
            </td>
            <td className='pr-8 text-body leading-body minmd:pr-4'>
              {ethAmount && ethPriceUSD ? (
                <p>
                  $
                  {(ethPriceUSD * Number(ethAmount)).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              ) : (
                <p>—</p>
              )}
            </td>
          </>
        );
      }

      if (type === 'transaction') {
        const protocolData = item[type]?.protocolData as TxSeaportProtocolData;
        if (!isNullOrEmpty(protocolData?.consideration[0].startAmount)) {
          const sum = protocolData?.consideration.reduce((acc, o) => acc + parseInt(o.startAmount), 0);
          const ethAmount = ethers.utils.formatEther(BigInt(sum).toString());
          const currencyData = getByContractAddress(protocolData?.consideration[0].token);

          return (
            <>
              <td className='whitespace-nowrap pr-8 text-body leading-body minmd:pr-4'>
                {ethAmount && currencyData ? (
                  <p>
                    {ethAmount} {currencyData.name}
                  </p>
                ) : (
                  <p>—</p>
                )}
              </td>
              <td className='pr-8 text-body leading-body minmd:pr-4'>
                {ethAmount && ethPriceUSD ? (
                  <p>
                    $
                    {(ethPriceUSD * Number(ethAmount)).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                ) : (
                  <p>—</p>
                )}
              </td>
            </>
          );
        }
        return (
          <>
            <td className='pr-8 text-body leading-body minmd:pr-4'>
              <p>—</p>
            </td>
            <td className='pr-8 text-body leading-body minmd:pr-4'>
              <p>—</p>
            </td>
          </>
        );
      }

      return (
        <>
          <td className='pr-8 text-body leading-body minmd:pr-4'>
            <p>—</p>
          </td>
          <td className='pr-8 text-body leading-body minmd:pr-4'>
            <p>—</p>
          </td>
        </>
      );
    }

    if (item[type]?.protocol === ExternalProtocol.X2Y2) {
      const protocolData = item[type]?.protocolData as X2Y2ProtocolData;
      if (
        (type === 'transaction' || type === 'order') &&
        !isNullOrEmpty(protocolData?.price) &&
        !isNullOrEmpty(protocolData?.currencyAddress)
      ) {
        const ethAmount = ethers.utils.formatEther(protocolData?.price);
        const currencyData = getByContractAddress(protocolData?.currencyAddress);
        return (
          <>
            <td className='w-max pr-8 text-body leading-body minmd:pr-4'>
              {ethAmount && currencyData ? (
                <p>
                  {ethAmount} {currencyData.name}
                </p>
              ) : (
                <p>—</p>
              )}
            </td>
            <td className='pr-8 text-body leading-body minmd:pr-4'>
              {ethAmount && ethPriceUSD ? (
                <p>
                  $
                  {(ethPriceUSD * Number(ethAmount)).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              ) : (
                <p>—</p>
              )}
            </td>
          </>
        );
      }

      return (
        <>
          <td className='pr-8 text-body leading-body minmd:pr-4'>
            <p>—</p>
          </td>
          <td className='pr-8 text-body leading-body minmd:pr-4'>
            <p>—</p>
          </td>
        </>
      );
    }

    if (item[type]?.protocol === ExternalProtocol.NFTCOM) {
      const protocolData = item[type]?.protocolData as NftcomProtocolData;
      if (
        (type === 'transaction' || type === 'order') &&
        !isNullOrEmpty(protocolData?.takeAsset?.[0]?.value) &&
        !isNullOrEmpty(protocolData?.takeAsset?.[0]?.standard?.contractAddress)
      ) {
        const ethAmount = ethers.utils.formatEther(protocolData?.takeAsset[0]?.value);
        const currencyData = getByContractAddress(protocolData?.takeAsset[0]?.standard?.contractAddress);
        return (
          <>
            <td className='w-max pr-8 text-body leading-body minmd:pr-4'>
              {ethAmount && currencyData ? (
                <p>
                  {ethAmount} {currencyData.name}
                </p>
              ) : (
                <p>—</p>
              )}
            </td>
            <td className='pr-8 text-body leading-body minmd:pr-4'>
              {ethAmount && ethPriceUSD ? (
                <p>
                  $
                  {(ethPriceUSD * Number(ethAmount)).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              ) : (
                <p>—</p>
              )}
            </td>
          </>
        );
      }

      return (
        <>
          <td className='pr-8 text-body leading-body minmd:pr-4'>
            <p>—</p>
          </td>
          <td className='pr-8 text-body leading-body minmd:pr-4'>
            <p>—</p>
          </td>
        </>
      );
    }

    return (
      <>
        <td className='pr-8 text-body leading-body minmd:pr-4'>
          <p>—</p>
        </td>
        <td className='pr-8 text-body leading-body minmd:pr-4'>
          <p>—</p>
        </td>
      </>
    );
  }, [item, type, ethPriceUSD, getByContractAddress]);

  useEffect(() => {
    if (!isObjEmpty(item?.transaction)) {
      setType('transaction');
    } else if (!isObjEmpty(item.cancel)) {
      setType('cancel');
    } else {
      setType('order');
    }
  }, [item, type]);

  return (
    <tr className={tw('h-20 min-w-[5.5rem]', index > 0 && '', index % 2 === 0 && 'bg-[#F8F8F8]')}>
      <td className='whitespace-nowrap px-8 text-body font-bold leading-body minmd:pr-4'>
        {!collectionName && !nftName ? (
          <p>—</p>
        ) : (
          <>
            <p className='text-[10px] uppercase text-[#6F6F6F]'>{collectionName}</p>
            <Link href={`/app/nft/${item?.nftContract}/${nftId}`}>
              <p className='-mt-1 text-[#B59007] hover:cursor-pointer'>{nftName}</p>
            </Link>
          </>
        )}
      </td>
      <td className='pr-8 text-body leading-body minmd:pr-4'>{item.activityType || <p>—</p>}</td>
      <td className='pr-8 text-body leading-body minmd:pr-4'>
        {getProtocolDisplayName(item[type]?.exchange) || <p>—</p>}
      </td>

      {getPriceColumns()}

      <td className='whitespace-nowrap pr-8 text-body leading-body minmd:pr-4'>
        {moment(item.timestamp).fromNow() || <p>—</p>}
      </td>

      {type === 'transaction' && (
        <>
          <td className='pr-8 text-body leading-body minmd:pr-4'>
            {shortenAddress(item?.transaction?.maker, 4) || <p>—</p>}
          </td>
          <td className='pr-8 text-body leading-body minmd:pr-4'>
            {shortenAddress(item?.transaction?.taker, 4) || <p>—</p>}
          </td>
        </>
      )}

      {type === 'order' && (
        <>
          <td className='pr-8 text-body leading-body minmd:pr-4'>
            {shortenAddress(item?.order?.makerAddress, 4) || <p>—</p>}
          </td>
          <td className='pr-8 text-body leading-body minmd:pr-4'>
            {(item?.order?.takerAddress !== NULL_ADDRESS && shortenAddress(item?.order?.takerAddress, 4)) || <p>—</p>}
          </td>
        </>
      )}

      {type === 'cancel' && (
        <>
          <td className='pr-8 text-body leading-body minmd:pr-4'>
            <p>—</p>
          </td>
          <td className='pr-8 text-body leading-body minmd:pr-4'>
            <p>—</p>
          </td>
        </>
      )}
    </tr>
  );
}
