import { CustomTooltip } from 'components/elements/CustomTooltip';
import { DropdownPickerModal } from 'components/elements/DropdownPickerModal';
import { filterNulls, getEtherscanLink, shortenAddress } from 'utils/helpers';

import RemoveModal from './RemoveModal';

import { CheckCircle, Clock, DotsThreeOutlineVertical, XCircle } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

type AssociatedAddressProps = {
  address: string;
  pending?: boolean;
  rejected?: boolean;
  remove: (type: string, address: string) => void;
  submit?: (address: string) => void;
  isOpen?: boolean
  setIsOpen?: (input: boolean) => void;
};

export default function AssociatedAddress({ address, pending, rejected, remove, submit, isOpen, setIsOpen }: AssociatedAddressProps) {
  const { chain } = useNetwork();
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  useEffect(() => {
    setRemoveModalVisible(isOpen);
  }, [isOpen]);
  return (
    <>
      <div className='p-1 flex  justify-between mb-1 font-mono text-sm'>
        <div className='flex row items-center'>
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
          <DropdownPickerModal
            forceLightMode
            constrain
            selectedIndex={0}
            options={filterNulls([
              {
                label: 'Remove',
                onSelect: () => {setRemoveModalVisible(true); setIsOpen(null);},
                icon: null,
              },
              {
                label: 'View on Etherscan',
                onSelect: () => {
                  window.open(getEtherscanLink(chain?.id, address, 'address'));
                },
                icon: null,
              },
              rejected && {
                label: 'Resend Request',
                onSelect: () => submit(address),
                icon: null,
              },
            ])
            }>
            <DotsThreeOutlineVertical size={25} weight='fill' className='ml-2 hover:cursor-pointer text-black' />
          </DropdownPickerModal>
        </div>
      </div>
      <RemoveModal {...{ address, remove }} rejected={rejected} visible={removeModalVisible} setVisible={setRemoveModalVisible} />
    </>
  );
}
    