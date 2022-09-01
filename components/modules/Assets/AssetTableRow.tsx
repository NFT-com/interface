import { DropdownPickerModal } from 'components/elements/DropdownPickerModal';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useListingActivitiesQuery } from 'graphql/hooks/useListingActivitiesQuery';
// import { useProfilesByDisplayedNft } from 'graphql/hooks/useProfilesByDisplayedNftQuery';
import { Doppler, getEnv } from 'utils/env';
import { filterNulls } from 'utils/helpers';
import { tw } from 'utils/tw';

import { BigNumber } from 'ethers';
import Link from 'next/link';
import { DotsThreeVertical } from 'phosphor-react';

export default function AssetTableRow({ item, index, isVisibile, profile, onChange, isChecked }: any) {
  const { data: collectionData } = useCollectionQuery(String( getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)), item?.contract);
  const { data: listings } = useListingActivitiesQuery(
    item?.contract,
    item?.tokenId,
    String(getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID))
  );
  // const { data: profiles } = useProfilesByDisplayedNft(
  //   item?.contract,
  //   item?.tokenId,
  //   String(getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID))
  // );
  return (
    <tr
      className={tw('min-w-[5.5rem] h-20',
        index > 0 && '',
        index % 2 === 0 && 'bg-[#F8F8F8]'
      )}
    >
      <td className="font-bold minmd:text-body text-sm leading-body" >
        <div className='flex justify-center'>
          <input checked={isChecked} onChange={() => onChange(item)} className='border-2 border-[#6F6F6F]' type='checkbox' />
        </div>
      </td>
      <td className="font-bold text-body leading-body" >
        <Link href={`/app/nft/${item?.contract}/${BigNumber.from(item?.tokenId).toNumber()}`}>
          <div className='hover:cursor-pointer'>
            <p className='uppercase text-[#6F6F6F] text-[10px]'>{collectionData?.collection.name}</p>
            <p className='-mt-1 font-bold text-[#B59007]'>{item.metadata.name}</p>
          </div>
        </Link>
      </td>
      <td className="minmd:text-body text-sm leading-body" >
        <div >
          {listings.length ? <p>Listed</p> : <p>—</p>}
        </div>
      </td>
      <td className="minmd:text-body text-sm leading-body" >
        <div >
          <div>12.3 ETH</div>
        </div>
      </td>
      <td className="minmd:text-body text-sm leading-body" >
        <div >
          <div>190K</div>
        </div>
      </td>
      <td className="minmd:text-body text-sm leading-body" >
        <div >
          {isVisibile ? <Link href={`/${profile}`}><p className='text-[#B59007] font-bold hover:cursor-pointer'><span className='text-black'>/ </span>{profile}</p></Link> : <p>Hidden</p>}
        </div>
      </td>
      <td >
        <DropdownPickerModal
          constrain
          selectedIndex={0}
          options={filterNulls([
            {
              label: 'List NFT',
              onSelect: () => onChange(item),
              icon: null,
            },
            {
              label: 'Share on Twitter',
              onSelect: () => window.open('https://twitter.com/share?url='+ encodeURIComponent(`${getEnv(Doppler.NEXT_PUBLIC_BASE_URL)}/app/nft/${item?.contract}/${BigNumber.from(item?.tokenId).toNumber()}`)+'&text='+document.title, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'),
              icon: null,
            },
          ])
          }>
          <DotsThreeVertical size={25} weight='fill' className='ml-2 hover:cursor-pointer text-black' />
        </DropdownPickerModal>
       
      </td>
    </tr>
  );
}
