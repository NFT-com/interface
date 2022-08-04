import { Modal } from 'components/elements/Modal';

import { XCircle } from 'phosphor-react';

type RequestModalProps = {
  visible: boolean;
  setVisible: (input:boolean) => void;
  address: string;
  transaction: string
  setAddressVal: (input: string) => void
};

export default function RequestModal({ visible, setVisible, address, transaction, setAddressVal }: RequestModalProps) {
  return (
    <Modal
      visible={visible}
      loading={false}
      title={''}
      onClose={() => {
        setVisible(false);
        setAddressVal('');
      }}
      bgColor='white'
      hideX
    >
      <div className='max-w-[458px] h-max bg-white text-left px-4 pb-10 rounded-[10px]'>
        <div className='pt-28 font-grotesk lg:max-w-md max-w-lg m-auto relative'>
          <XCircle onClick={() => setVisible(false)} className='absolute top-3 right-0 hover:cursor-pointer' size={32} color="#B6B6B6" weight="fill" />
          <h2 className='text-4xl tracking-wide font-bold mb-10'>Request Sent</h2>
          <p className='text-[#6F6F6F]'>You have sent a wallet connection request to <span className='font-mono text-black text-xl break-words mt-2'>{address}</span></p>
          <p className='mt-6'>View the transaction on {' '}
            <a
              target="_blank"
              rel="noreferrer" href={`https://goerli.etherscan.io/tx/${transaction}`} className='font-bold underline tracking-wide'>Etherscan
            </a>
          </p>
          <p className='mt-6'>Please inform the owner of this wallet to connect to NFT.com to approve your request.</p>
          <button onClick={() => {setVisible(false); setAddressVal(''); }} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-6" type="button">
              Return to Settings
          </button>
        </div>
      </div>
    </Modal>
  );
}
    