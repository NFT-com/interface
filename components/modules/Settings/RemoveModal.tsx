import { Modal } from 'components/elements/Modal';

import { XCircle } from 'phosphor-react';

type RemoveModalProps = {
  visible: boolean;
  setVisible: (input:boolean) => void;
  address: string;
  rejected?: boolean;
  remove: (action: string, address: string) => void;
};

export default function RemoveModal({ visible, setVisible, address, rejected, remove }: RemoveModalProps) {
  return (
    <Modal
      visible={visible}
      loading={false}
      title={''}
      onClose={() => {
        setVisible(false);
      }}
      bgColor='white'
      hideX
    >
      <div className='max-w-[458px] h-max bg-white text-left px-4 pb-10 rounded-[10px]'>
        <div className='pt-28 font-grotesk lg:max-w-md max-w-lg m-auto relative'>
          <XCircle onClick={() => {setVisible(false);}} className='absolute top-3 right-0 hover:cursor-pointer' size={32} color="#B6B6B6" weight="fill" />
          <h2 className='text-4xl tracking-wide font-bold mb-10'>Are your sure?</h2>
          {!rejected
            ? (
              <>
                <p className='text-[#6F6F6F]'>You are about to remove the following address from your profile. </p>
                <p className='font-mono text-black text-xl break-words mt-2'>{address}</p>
                
                <p className='mt-6 text-[#6F6F6F]'>If you remove this address, you will not be able to display their NFTs on your profile, and must pay gas to complete this action.</p>
                <p className='mt-6 text-[#6F6F6F]'>To reconnect this wallet in the future, you must pay the gas fee again.</p>
                <button onClick={() => remove('address', address)} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-6" type="button">
                  Remove
                </button>
                <p
                  className='underline text-center font-bold tracking-wide hover:cursor-pointer mt-6'
                  onClick={() => setVisible(false)}>
                    Cancel
                </p>
              </>
            )
            :
            (
              <>
                <p className='text-[#6F6F6F]'>You are about to remove the following <span className='text-black font-bold'>rejected</span> address from your profile.</p>
                <p className='font-mono text-black text-xl break-words mt-2'>{address}</p>
                
                <p className='mt-6 text-[#6F6F6F]'>If you send another connection request, you <span className='text-black font-bold'>will not pay</span> the gas fee again.</p>
                <button onClick={() => remove('address-hideRejected', address)} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-6" type="button">
                  Remove
                </button>
                <p
                  className='underline text-center font-bold tracking-wide hover:cursor-pointer mt-6'
                  onClick={() => setVisible(false)}>
                    Cancel
                </p>
              </>
            )
          }
        </div>
      </div>
    </Modal>
  );
}
    