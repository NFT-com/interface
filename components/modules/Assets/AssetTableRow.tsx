import { CustomTooltip } from 'components/elements/CustomTooltip';
import { DropdownPickerModal } from 'components/elements/DropdownPickerModal';
import { Nft } from 'graphql/generated/types';
import { useGetTxByNFTQuery } from 'graphql/hooks/useGetTxByNFTQuery';
import { useProfilesByDisplayedNft } from 'graphql/hooks/useProfilesByDisplayedNftQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { getContractMetadata } from 'utils/alchemyNFT';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import { filterValidListings } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import { BigNumber } from 'ethers';
import Link from 'next/link';
import { DotsThreeVertical } from 'phosphor-react';
import { useCallback } from 'react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export interface AssetTableRowProps {
  item: PartialDeep<Nft>;
  index: number;
  onChange: (listing: PartialDeep<Nft>) => void;
  isChecked: boolean;
}

export default function AssetTableRow({
  item,
  index,
  onChange,
  isChecked,
}: AssetTableRowProps) {
  const defaultChainId = useDefaultChainId();
  const { address: currentAddress } = useAccount();
  const { data: collectionMetadata } = useSWR('ContractMetadata' + item?.contract, async () => {
    return await getContractMetadata(item?.contract, defaultChainId);
  });
  const collectionName = collectionMetadata?.contractMetadata?.name;

  const { data: profiles } = useProfilesByDisplayedNft(
    item?.contract,
    item?.tokenId,
    defaultChainId,
    true
  );
  const nftSaleHistory = useGetTxByNFTQuery(item?.contract, parseInt(item?.tokenId, 16).toString(), 'sale');

  const getDisplayedProfiles = useCallback(() => {
    if(!profiles?.length){
      return <p className='text-[#B6B6B6]'>hidden</p>;
    }
    if (profiles?.length === 1){
      return <Link href={`/${profiles[0].url}`}><p className='text-[#B59007] font-bold hover:cursor-pointer'><span className='text-black'>/ </span>{profiles[0].url}</p></Link>;
    }
    return (
      <div className='font-medium flex items-center relative underline text-[#1F2127] decoration-[#B59007] underline-offset-2'>
        <CustomTooltip
          rightPostion={0}
          mode="hover"
          tooltipComponent={
            <div
              className="rounded-xl p-3 bg-white text-black w-[200px] flex flex-col space-y-3"
            >
              {profiles.map((profile) => (
                <Link key={profile.url} href={`/${profile.url}`}>
                  <p className='text-[#B59007] font-bold hover:cursor-pointer'>
                    <span className='text-black'>/ </span>{profile.url}</p>
                </Link>
              ))}
            </div>
          }>
          {profiles.length} Profiles
        </CustomTooltip>
      </div>
    );
  }, [profiles]);
  
  return (
    <tr
      className={tw('min-w-[5.5rem] h-20',
        index > 0 && '',
        index % 2 === 0 && 'bg-[#F8F8F8]'
      )}
    >
      <td className="font-bold text-body leading-body pr-8 minmd:pr-4" >
        <div className='flex justify-center'>
          <input
            checked={isChecked}
            onChange={() => onChange(item)}
            className='border-2 border-[#6F6F6F] text-[#6F6F6F] form-checkbox focus:ring-[#F9D963]' type='checkbox' />
        </div>
      </td>
      <td className="font-bold text-body leading-body pr-8 minmd:pr-4" >
        <Link href={`/app/nft/${item?.contract}/${BigNumber.from(item?.tokenId).toString()}`}>
          <div className='hover:cursor-pointer'>
            <p className='-mt-1 font-bold text-[#B59007]'>{item.metadata?.name}</p>
          </div>
        </Link>
      </td>
      <td className="font-bold text-body leading-body pr-8 minmd:pr-4" >
        <Link href={`/app/collection/${item?.contract}`}>
          <div className='hover:cursor-pointer'>
            <p className='-mt-1 font-bold text-[#B59007]'>{collectionName}</p>
          </div>
        </Link>
      </td>
      <td className="minmd:text-body text-sm leading-body pr-8 minmd:pr-4" >
        <div >
          {!isNullOrEmpty(filterValidListings(item?.listings?.items)) ? <p>Listed</p> : <p>—</p>}
        </div>
      </td>
      <td className="minmd:text-body text-sm leading-body pr-8 minmd:pr-4" >
        <div >
          {nftSaleHistory?.data?.transactions[0]?.price_details ? <p>{nftSaleHistory?.data?.transactions[0]?.price_details?.price}</p> : <p>—</p>}
        </div>
      </td>
      <td className="minmd:text-body text-sm leading-body pr-8 minmd:pr-4" >
        <div >
          {nftSaleHistory?.data?.transactions[0]?.price_details?.price_usd ? <p>${nftSaleHistory?.data?.transactions[0]?.price_details?.price_usd?.toFixed(2)}</p> : <p>—</p>}
        </div>
      </td>
      <td className="minmd:text-body text-sm leading-body pr-8 minmd:pr-4" >
        <div>
          {getDisplayedProfiles()}
        </div>
      </td>
      <td className='pr-8 minmd:pr-4'>
        <DropdownPickerModal
          constrain
          selectedIndex={0}
          options={filterNulls([
            currentAddress === item?.wallet?.address
              ? {
                label: 'List NFT',
                onSelect: () => {
                  onChange(item);
                },
                icon: null,
              }
              : null,
            {
              label: 'Share on Twitter',
              onSelect: () => window.open('https://twitter.com/share?url='+ encodeURIComponent(`https://www.nft.com/app/nft/${item?.contract}/${BigNumber.from(item?.tokenId).toString()}`)+'&text='+document.title, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'),
              icon: null,
            },
          ])
          }>
          <DotsThreeVertical data-cy="RowDropdown" size={25} weight='fill' className='ml-2 hover:cursor-pointer text-black' />
        </DropdownPickerModal>
      </td>
    </tr>
  );
}
