import { CustomTooltip } from 'components/elements/CustomTooltip';
import { shortenAddress } from 'utils/helpers';

import RemoveModal from './RemoveModal';

import { CheckCircle, Clock, Trash, XCircle } from 'phosphor-react';
import { useState } from 'react';

type AssociatedAddressProps = {
  address: string;
  pending?: boolean;
  rejected?: boolean;
  remove: (type: string, address: string) => void;
};

export default function AssociatedAddress({ address, pending, rejected, remove }: AssociatedAddressProps) {
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  return (
    <>
      <div className='p-1 flex  justify-between mb-1 font-mono text-sm'>
        <div className='flex row '>
          {pending || rejected ?
            pending ?
              (
                <CustomTooltip
                  mode="hover"
                  tooltipComponent={
                    <div
                      className="rounded-xl p-3 bg-modal-bg-dk text-white"
                    >
                      <p className='text-[#F2890E] mb-2'>Pending</p>
                      <p>This connection is waiting approval.</p>
                    </div>
                  }
                >
                  <Clock size={25} className='mr-3' color='orange' weight='fill' />
                </CustomTooltip>
              ):
              (
                <CustomTooltip
                  mode="hover"
                  tooltipComponent={
                    <div
                      className="rounded-xl p-3 bg-modal-bg-dk text-white"
                    >
                      <p className='text-[#D50909] mb-2'>Rejected</p>
                      <p>This wallet has rejected the connection. If this was done in error, please resend the request. No gas is required.</p>
                    </div>
                  }
                >
                  <XCircle size={25} className='mr-3' color='#D40909' weight='fill' />
                </CustomTooltip>
              )
            :
            <CustomTooltip
              mode="hover"
              tooltipComponent={
                <div
                  className="rounded-xl p-3 bg-modal-bg-dk text-white"
                >
                  <p className='text-[#00AC30] mb-2'>Connected</p>
                  <p>This wallet has approved the connection.</p>
                </div>
              }
            >
              <CheckCircle size={25} className='mr-3 rounded-full' color='green' weight="fill" />
            </CustomTooltip>
          }
        </div>
      
        <div className='flex items-center truncate w-1/2 mr-4'>
          <p className='truncate text-black'>{shortenAddress(address)}</p>
        </div>
                
        <div className='flex items-center w-1/2 justify-between'>
          <p>Ethereum</p>
          <Trash weight='fill' className='ml-2 hover:cursor-pointer text-black' onClick={() => setRemoveModalVisible(true)} size={25}/>
        </div>
      </div>
      <RemoveModal {...{ address, remove }} rejected={rejected} visible={removeModalVisible} setVisible={setRemoveModalVisible} />
    </>
  );
}
    