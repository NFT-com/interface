import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { Doppler, getEnv } from 'utils/env';
import { tw } from 'utils/tw';

import { DotsThreeVertical } from 'phosphor-react';

export default function AssetTableRow({ item, index }: any) {
  const { data: collectionData } = useCollectionQuery(String( getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)), item?.contract);
  return (
    <tr
      className={tw('cursor-pointer min-w-[5.5rem] h-20',
        index > 0 && '',
        index % 2 !== 0 && 'bg-[#F8F8F8]'
      )}
    >
      <td className="font-bold minmd:text-body text-sm leading-body" >
        <div >
          <input type='checkbox' />
        </div>
      </td>
      <td className="font-bold minmd:text-body text-sm leading-body" >
        <div >
          <p>{collectionData?.collection.name}</p>
          <p>{item.metadata.name}</p>
        </div>
      </td>
      <td className="minmd:text-body text-sm leading-body" >
        <div >
          <div>Listed</div>
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
          <div>/luc</div>
        </div>
      </td>
      <td >
        <DotsThreeVertical data-cy="ProfileDropdown" size={25} weight='fill' className='ml-2 hover:cursor-pointer text-black' />
      </td>
    </tr>
  );
}
