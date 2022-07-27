import { shortenAddress } from 'utils/helpers';

import { CheckCircle, Clock, Trash } from 'phosphor-react';

type AssociatedAddressProps = {
  address: {
    chainAddr: string;
  }
  pending?: boolean;
  key: number | string;
  remove: (type: string, address: string) => void
};

export default function AssociatedAddress({ address, pending, remove }: AssociatedAddressProps) {
  return (
    <div className='p-1 flex  justify-between mb-1 font-mono text-sm'>
      {pending ?
        <Clock size={25} className='mr-3' color='orange' weight='fill' />
        :
        <CheckCircle size={25} className='mr-3 rounded-full' color='green' weight="fill" />
      }
      
      <div className='flex items-center truncate w-1/2 mr-4'>
        <p className='truncate text-black'>{shortenAddress(address?.chainAddr)}</p>
      </div>
                
      <div className='flex items-center w-1/2 justify-between'>
        <p>Ethereum</p>
        <Trash weight='fill' className='ml-2 hover:cursor-pointer text-black' onClick={() => remove('address', address?.chainAddr)} size={25}/>
      </div>
    </div>
  );
}
    