import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useGetNFTDetails } from 'hooks/analytics/nftport/nfts/useGetNFTDetails';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import moment from 'moment';
import Link from 'next/link';

export interface ActivityTableRowProps {
  item: any;
  index: number;
}

export default function ActivityTableRow({ item, index }: ActivityTableRowProps) {
  const defaultChainId = useDefaultChainId();
  const { data: collectionData } = useCollectionQuery(defaultChainId, item?.order?.protocolData?.collectionAddress);
  const activityNFTInfo = useGetNFTDetails(item?.order?.protocolData?.collectionAddress, item?.order?.protocolData?.tokenId);
  const ethPriceUSD = useEthPriceUSD();
  return (
    <tr
      className={tw('min-w-[5.5rem] h-20',
        index > 0 && '',
        index % 2 === 0 && 'bg-[#F8F8F8]'
      )}
    >
      <td className="font-bold text-body leading-body pl-8" >

        {!collectionData?.ubiquityResults?.collection?.name && !activityNFTInfo?.nft?.metadata?.name ?
          <p>—</p>
          :
          <>
            <p className='text-[#6F6F6F] uppercase text-[10px]'>{collectionData?.ubiquityResults?.collection?.name || activityNFTInfo?.contract?.name}</p>
            <Link href={`/app/nft/${item?.order?.protocolData?.collectionAddress}/${item?.order?.protocolData?.tokenId}`}>
              <p className='text-[#B59007] hover:cursor-pointer -mt-1'>{activityNFTInfo?.nft?.metadata?.name}</p>
            </Link>
          </>
        }
      </td>
      <td className="text-body leading-body pr-8 minmd:pr-4" >
        {item.activityType || <p>—</p>}
      </td>
      <td className="text-body leading-body pr-8 minmd:pr-4" >
        {item.order.exchange || <p>—</p>}
      </td>
      <td className="text-body leading-body pr-8 minmd:pr-4" >
        {item.order.protocolData.amount || <p>—</p>}
      </td>
      <td className="text-body leading-body pr-8 minmd:pr-4" >
        {item.order.protocolData.amount && ethPriceUSD ? <p>${(ethPriceUSD * item.order.protocolData.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p> : <p>—</p>}
      </td>
      <td className="text-body leading-body pr-8 minmd:pr-4" >
        {moment(item.timestamp).fromNow() || <p>—</p>}
      </td>
      <td className="text-body leading-body pr-8 minmd:pr-4" >
        {item?.order?.makerAddress ? shortenAddress(item?.order?.makerAddress, 4) : <p>—</p>}
      </td>
      <td className="text-body leading-body pr-8 minmd:pr-4" >
        {item?.order?.takerAddress ? shortenAddress(item?.order?.takerAddress, 4) : <p>—</p>}
      </td>
    </tr>
  );
}
