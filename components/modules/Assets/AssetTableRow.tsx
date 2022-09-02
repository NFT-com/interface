import { CustomTooltip } from 'components/elements/CustomTooltip';
import { DropdownPickerModal } from 'components/elements/DropdownPickerModal';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useListingActivitiesQuery } from 'graphql/hooks/useListingActivitiesQuery';
import { useProfilesByDisplayedNft } from 'graphql/hooks/useProfilesByDisplayedNftQuery';
import { useGetSalesByNFT } from 'hooks/analytics/nftport/nfts/useGetSalesByNFT';
import { Doppler, getEnv } from 'utils/env';
import { filterNulls } from 'utils/helpers';
import { tw } from 'utils/tw';

import { BigNumber } from 'ethers';
import Link from 'next/link';
import { DotsThreeVertical } from 'phosphor-react';
import { useContext } from 'react';

type NftItem = {
  contract?: string;
  tokenId?: string;
  metadata?: {
    name?: string
  }
}

export interface AssetTableRowProps {
  item: NftItem;
  index: number
  onChange: (asset: NftItem) => void;
  isChecked: boolean;
}

export default function AssetTableRow({ item, index, onChange, isChecked }: AssetTableRowProps) {
  const { data: collectionData } = useCollectionQuery(String( getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)), item?.contract);
  const { stageListing, toggleCartSidebar } = useContext(NFTListingsContext);
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
  const nftSaleHistory = useGetSalesByNFT(item?.contract, parseInt(item?.tokenId, 16).toString());

  const getDisplayedProfiles = () => {
    if(!profiles?.length){
      return <p>Hidden</p>;
    } else if (profiles?.length === 1){
      return <Link href={`/${profiles[0].url}`}><p className='text-[#B59007] font-bold hover:cursor-pointer'><span className='text-black'>/ </span>{profiles[0].url}</p></Link>;
    } else {
      return (
        <div className='font-medium text-[#6F6F6F] flex items-center relative'>
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
    }
  };
  
  return (
    <tr
      className={tw('min-w-[5.5rem] h-20',
        index > 0 && '',
        index % 2 === 0 && 'bg-[#F8F8F8]'
      )}
    >
      <td className="font-bold text-body leading-body pr-8 minmd:pr-4" >
        <div className='flex justify-center'>
          <input checked={isChecked} onChange={() => onChange(item)} className='border-2 border-[#6F6F6F] text-[#6F6F6F] form-checkbox focus:ring-[#F9D963]' type='checkbox' />
        </div>
      </td>
      <td className="font-bold text-body leading-body pr-8 minmd:pr-4" >
        <Link href={`/app/nft/${item?.contract}/${BigNumber.from(item?.tokenId).toNumber()}`}>
          <div className='hover:cursor-pointer'>
            <p className='-mt-1 font-bold text-[#B59007]'>{item.metadata.name}</p>
          </div>
        </Link>
      </td>
      <td className="font-bold text-body leading-body pr-8 minmd:pr-4" >
        <Link href={`/app/collection/${item?.contract}`}>
          <div className='hover:cursor-pointer'>
            <p className='-mt-1 font-bold text-[#B59007]'>{collectionData?.collection.name}</p>
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
          {nftSaleHistory?.transactions ? <p>{nftSaleHistory?.transactions[0]?.price_details?.price}</p> : <p>—</p>}
        </div>
      </td>
      <td className="minmd:text-body text-sm leading-body pr-8 minmd:pr-4" >
        <div >
          {nftSaleHistory?.transactions ? <p>${nftSaleHistory?.transactions[0]?.price_details?.price_usd.toFixed(2)}</p> : <p>—</p>}
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
                  isApprovedForSeaport: true,
                  isApprovedForLooksrare: true,
                  targets: []
                });
                toggleCartSidebar('sell');
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
