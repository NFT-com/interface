import { CustomTooltip } from 'components/elements/CustomTooltip';
import { DropdownPickerModal } from 'components/elements/DropdownPickerModal';
import { NFTListingsContext, StagedListing } from 'components/modules/Checkout/NFTListingsContext';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useGetTxByNFTQuery } from 'graphql/hooks/useGetTxByNFTQuery';
import { useListingActivitiesQuery } from 'graphql/hooks/useListingActivitiesQuery';
import { useProfilesByDisplayedNft } from 'graphql/hooks/useProfilesByDisplayedNftQuery';
import { TransferProxyTarget, useNftCollectionAllowance } from 'hooks/balances/useNftCollectionAllowance';
import { Doppler, getEnv } from 'utils/env';
import { filterNulls } from 'utils/helpers';
import { tw } from 'utils/tw';

import { BigNumber } from 'ethers';
import Link from 'next/link';
import { DotsThreeVertical } from 'phosphor-react';
import { useCallback, useContext, useEffect } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

type NftItem = {
  contract?: string;
  tokenId?: string;
  metadata?: {
    name?: string
  }
}

export interface AssetTableRowProps {
  item: NftItem;
  index: number;
  onChange: (listing: PartialDeep<StagedListing>, addAll: boolean) => void;
  selectAll: boolean;
  isChecked: boolean;
}

export default function AssetTableRow({ item, index, onChange, isChecked, selectAll }: AssetTableRowProps) {
  const { address: currentAddress } = useAccount();
  const { data: collectionData } = useCollectionQuery(String( getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)), item?.contract);
  const { stageListing, toggleCartSidebar } = useContext(NFTListingsContext);
  const {
    allowedAll: openseaAllowed,
  } = useNftCollectionAllowance(
    item?.contract,
    currentAddress,
    TransferProxyTarget.Opensea
  );

  const {
    allowedAll: looksRareAllowed,
  } = useNftCollectionAllowance(
    item?.contract,
    currentAddress,
    TransferProxyTarget.LooksRare
  );
  const { data: listings } = useListingActivitiesQuery(
    item?.contract,
    item?.tokenId,
    String(getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID))
  );
  const { data: profiles } = useProfilesByDisplayedNft(
    item?.contract,
    item?.tokenId,
    String(getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)),
    true
  );
  const nftSaleHistory = useGetTxByNFTQuery(item?.contract, parseInt(item?.tokenId, 16).toString(), 'sale');

  useEffect(() => {
    if(selectAll){
      onChange({
        nft: item,
        collectionName: item.contract,
        isApprovedForSeaport: openseaAllowed,
        isApprovedForLooksrare: looksRareAllowed,
        targets: []
      }, true);
    }
  }, [selectAll, onChange, item, openseaAllowed, looksRareAllowed]);

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
            onChange={() => onChange({
              nft: item,
              collectionName: item.contract,
              isApprovedForSeaport: openseaAllowed,
              isApprovedForLooksrare: looksRareAllowed,
              targets: []
            }, false)}
            className='border-2 border-[#6F6F6F] text-[#6F6F6F] form-checkbox focus:ring-[#F9D963]' type='checkbox' />
        </div>
      </td>
      <td className="font-bold text-body leading-body pr-8 minmd:pr-4" >
        <Link href={`/app/nft/${item?.contract}/${BigNumber.from(item?.tokenId).toNumber()}`}>
          <div className='hover:cursor-pointer'>
            <p className='-mt-1 font-bold text-[#B59007]'>{item.metadata?.name}</p>
          </div>
        </Link>
      </td>
      <td className="font-bold text-body leading-body pr-8 minmd:pr-4" >
        <Link href={`/app/collection/${item?.contract}`}>
          <div className='hover:cursor-pointer'>
            <p className='-mt-1 font-bold text-[#B59007]'>{collectionData?.collection?.name}</p>
          </div>
        </Link>
      </td>
      <td className="minmd:text-body text-sm leading-body pr-8 minmd:pr-4" >
        <div >
          {listings.length ? <p>Listed</p> : <p>—</p>}
        </div>
      </td>
      <td className="minmd:text-body text-sm leading-body pr-8 minmd:pr-4" >
        <div >
          {nftSaleHistory?.data ? <p>{nftSaleHistory?.data[0]?.price_details?.price}</p> : <p>—</p>}
        </div>
      </td>
      <td className="minmd:text-body text-sm leading-body pr-8 minmd:pr-4" >
        <div >
          {nftSaleHistory?.data ? <p>${nftSaleHistory?.data[0]?.price_details?.price_usd.toFixed(2)}</p> : <p>—</p>}
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
            {
              label: 'List NFT',
              onSelect: () => {
                stageListing({
                  nft: item,
                  collectionName: item.contract,
                  isApprovedForSeaport: openseaAllowed,
                  isApprovedForLooksrare: looksRareAllowed,
                  targets: []
                });
                toggleCartSidebar();
              },
              icon: null,
            },
            {
              label: 'Share on Twitter',
              onSelect: () => window.open('https://twitter.com/share?url='+ encodeURIComponent(`${getEnv(Doppler.NEXT_PUBLIC_BASE_URL)}/app/nft/${item?.contract}/${BigNumber.from(item?.tokenId).toNumber()}`)+'&text='+document.title, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'),
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
