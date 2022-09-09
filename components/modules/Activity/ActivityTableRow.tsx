import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useGetNFTDetailsQuery } from 'graphql/hooks/useGetNFTDetailsQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { isNullOrEmpty, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { BigNumber } from 'ethers';
import moment from 'moment';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export interface ActivityTableRowProps {
  item: any;
  index: number;
}

export default function ActivityTableRow({ item, index }: ActivityTableRowProps) {
  const [type, setType] = useState('');
  const defaultChainId = useDefaultChainId();
  const { data: collectionData } = useCollectionQuery(defaultChainId, item?.nftContract);
  const { data: activityNFTInfo } = useGetNFTDetailsQuery(item?.nftContract, !isNullOrEmpty(item?.nftId) ? BigNumber.from(item?.nftId.split('/')[2]).toString() : null);
  const ethPriceUSD = useEthPriceUSD();

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
      <td className="font-bold text-body leading-body pl-8" >

        {!collectionData?.nftPortResults?.name && !activityNFTInfo?.nft?.metadata?.name ?
          <p>—</p>
          :
          <>
            <p className='text-[#6F6F6F] uppercase text-[10px]'>{collectionData?.nftPortResults?.name || activityNFTInfo?.contract?.name}</p>
            <Link href={`/app/nft/${item?.order?.protocolData?.collectionAddress}/${item?.order?.protocolData?.tokenId}`}>
              <p className='text-[#B59007] hover:cursor-pointer -mt-1'>{activityNFTInfo?.nft?.metadata?.name}</p>
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
      <td className="text-body leading-body pr-8 minmd:pr-4" >
        {type === 'order' && item?.order?.protocolData.amount || <p>—</p>}
      </td>
      <td className="text-body leading-body pr-8 minmd:pr-4" >
        {type === 'order' && item?.order?.protocolData.amount && ethPriceUSD ? <p>${(ethPriceUSD * item.order.protocolData.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p> : <p>—</p>}
      </td>
      <td className="text-body leading-body pr-8 minmd:pr-4" >
        {moment(item.timestamp).fromNow() || <p>—</p>}
      </td>

      {type === 'transaction' &&
      <>
        <td className="text-body leading-body pr-8 minmd:pr-4" >
          {item.transaction.sender || <p>—</p>}
        </td>
        <td className="text-body leading-body pr-8 minmd:pr-4" >
          {item.transaction.receiver|| <p>—</p>}
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
