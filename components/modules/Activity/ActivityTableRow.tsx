import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { ExternalProtocol } from 'types';
import { getContractMetadata, getNftMetadata } from 'utils/alchemyNFT';
import { isNullOrEmpty, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { BigNumber, ethers } from 'ethers';
import moment from 'moment';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

export interface ActivityTableRowProps {
  item: any;
  index: number;
}

export default function ActivityTableRow({ item, index }: ActivityTableRowProps) {
  const { getByContractAddress } = useSupportedCurrencies();
  const [type, setType] = useState('');
  const defaultChainId = useDefaultChainId();
  const nftId = BigNumber.from(item?.nftId[0].split('/')[2]).toString();
  const ethPriceUSD = useEthPriceUSD();
  const { data: collectionMetadata } = useSWR('ContractMetadata' + item?.nftContract, async () => {
    return await getContractMetadata(item?.nftContract, defaultChainId);
  });
  const { data: nftMetadata } = useSWR('NFTMetadata' + item?.nftContract, async () => {
    return await getNftMetadata(item?.nftContract, nftId, defaultChainId);
  });
  const nftName = nftMetadata?.metadata?.name;
  const collectionName = collectionMetadata?.contractMetadata?.name;

  const getPriceColumns = useCallback(() => {
    if(item[type]?.protocol === 'LooksRare'){
      if(type === 'transaction' || type === 'order'){
        const ethAmount = ethers.utils.formatEther(item[type]?.protocolData?.price);
        const currencyData = getByContractAddress(item[type]?.protocolData?.currencyAddress);
        return (
          <>
            <td className="text-body leading-body pr-8 minmd:pr-4 w-max" >
              {ethAmount ? <p>{ethAmount} {currencyData.name}</p> : <p>—</p>}
            </td>
            <td className="text-body leading-body pr-8 minmd:pr-4" >
              {ethAmount && ethPriceUSD ? <p>${(ethPriceUSD * Number(ethAmount)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p> : <p>—</p>}
            </td>
          </>
        );
      }
      
      return (
        <>
          <td className="text-body leading-body pr-8 minmd:pr-4" >
            <p>—</p>
          </td>
          <td className="text-body leading-body pr-8 minmd:pr-4" >
            <p>—</p>
          </td>
        </>
      );
    }

    if(item[type]?.protocol === 'Seaport'){
      if(type === 'order'){
        const sum = item[type]?.protocolData?.parameters?.consideration.reduce((acc, o) => acc + parseInt(o.startAmount), 0).toString();
        const ethAmount = ethers.utils.formatEther(sum);
        const currencyData = getByContractAddress(item[type]?.protocolData?.parameters?.consideration[0].token);
        return (
          <>
            <td className="text-body leading-body pr-8 minmd:pr-4 whitespace-nowrap">
              {ethAmount ? <p>{ethAmount} {currencyData.name}</p> : <p>—</p>}
            </td>
            <td className="text-body leading-body pr-8 minmd:pr-4" >
              {ethAmount && ethPriceUSD ? <p>${(ethPriceUSD * Number(ethAmount)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p> : <p>—</p>}
            </td>
          </>
        );
      }

      if(type === 'transaction'){
        if(!isNullOrEmpty(item?.transaction?.protocolData?.consideration[0].startAmount)) {
          const sum = item[type]?.protocolData?.consideration.reduce((acc, o) => acc + parseInt(o.startAmount), 0).toString();
          const ethAmount = ethers.utils.formatEther(sum);
          const currencyData = getByContractAddress(item[type]?.protocolData?.consideration[0].token);
          return (
            <>
              <td className="text-body leading-body pr-8 minmd:pr-4 whitespace-nowrap">
                {ethAmount ? <p>{ethAmount} {currencyData.name}</p> : <p>—</p>}
              </td>
              <td className="text-body leading-body pr-8 minmd:pr-4" >
                {ethAmount && ethPriceUSD ? <p>${(ethPriceUSD * Number(ethAmount)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p> : <p>—</p>}
              </td>
            </>
          );
        }
        return (
          <>
            <td className="text-body leading-body pr-8 minmd:pr-4" >
              <p>—</p>
            </td>
            <td className="text-body leading-body pr-8 minmd:pr-4" >
              <p>—</p>
            </td>
          </>
        );
      }

      return (
        <>
          <td className="text-body leading-body pr-8 minmd:pr-4" >
            <p>—</p>
          </td>
          <td className="text-body leading-body pr-8 minmd:pr-4" >
            <p>—</p>
          </td>
        </>
      );
    }

    if(item[type]?.protocol === ExternalProtocol.X2Y2){
      if(type === 'transaction' || type === 'order'){
        const ethAmount = ethers.utils.formatEther(item[type]?.protocolData?.price);
        const currencyData = getByContractAddress(item[type]?.protocolData?.currencyAddress);
        return (
          <>
            <td className="text-body leading-body pr-8 minmd:pr-4 w-max" >
              {ethAmount ? <p>{ethAmount} {currencyData.name}</p> : <p>—</p>}
            </td>
            <td className="text-body leading-body pr-8 minmd:pr-4" >
              {ethAmount && ethPriceUSD ? <p>${(ethPriceUSD * Number(ethAmount)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p> : <p>—</p>}
            </td>
          </>
        );
      }
      
      return (
        <>
          <td className="text-body leading-body pr-8 minmd:pr-4" >
            <p>—</p>
          </td>
          <td className="text-body leading-body pr-8 minmd:pr-4" >
            <p>—</p>
          </td>
        </>
      );
    }

    return (
      <>
        <td className="text-body leading-body pr-8 minmd:pr-4" >
          <p>—</p>
        </td>
        <td className="text-body leading-body pr-8 minmd:pr-4" >
          <p>—</p>
        </td>
      </>
    );
  }, [
    item,
    type,
    ethPriceUSD,
    getByContractAddress
  ]);
  
  useEffect(() => {
    if(!isNullOrEmpty(item.transaction)){
      setType('transaction');
    } else if(!isNullOrEmpty(item.cancel)) {
      setType('cancel');
    } else {
      setType('order');
    }
  }, [item]);

  return (
    <tr
      className={tw('min-w-[5.5rem] h-20',
        index > 0 && '',
        index % 2 === 0 && 'bg-[#F8F8F8]'
      )}
    >
      <td className="font-bold text-body leading-body pl-8 pr-8 minmd:pr-4 whitespace-nowrap" >

        {!collectionName && !nftName ?
          <p>—</p>
          :
          <>
            <p className='text-[#6F6F6F] uppercase text-[10px]'>{collectionName}</p>
            <Link href={`/app/nft/${item?.nftContract}/${nftId}`}>
              <p className='text-[#B59007] hover:cursor-pointer -mt-1'>{nftName}</p>
            </Link>
          </>
        }
      </td>
      <td className="text-body leading-body pr-8 minmd:pr-4">
        {item.activityType || <p>—</p>}
      </td>
      <td className="text-body leading-body pr-8 minmd:pr-4" >
        {item[type]?.exchange || <p>—</p>}
      </td>

      {getPriceColumns()}

      <td className="text-body leading-body pr-8 minmd:pr-4 whitespace-nowrap" >
        {moment(item.timestamp).fromNow() || <p>—</p>}
      </td>

      {type === 'transaction' &&
      <>
        <td className="text-body leading-body pr-8 minmd:pr-4" >
          {shortenAddress(item?.transaction?.maker, 4) || <p>—</p>}
        </td>
        <td className="text-body leading-body pr-8 minmd:pr-4" >
          {shortenAddress(item?.transaction?.taker, 4) || <p>—</p>}
        </td>
      </>
      }

      {type === 'order' &&
      <>
        <td className="text-body leading-body pr-8 minmd:pr-4" >
          {shortenAddress(item?.order?.makerAddress, 4) || <p>—</p>}
        </td>
        <td className="text-body leading-body pr-8 minmd:pr-4" >
          {shortenAddress(item?.order?.takerAddress, 4) || <p>—</p>}
        </td>
      </>
      }

      {type === 'cancel' &&
      <>
        <td className="text-body leading-body pr-8 minmd:pr-4" >
          <p>—</p>
        </td>
        <td className="text-body leading-body pr-8 minmd:pr-4" >
          <p>—</p>
        </td>
      </>
      }
    </tr>
  );
}
