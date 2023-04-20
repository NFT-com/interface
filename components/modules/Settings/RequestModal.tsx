import { ArrowsClockwise, GasPump, XCircle } from 'phosphor-react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';

type RequestModalProps = {
  visible: boolean;
  setVisible: (input: boolean) => void;
  address: string;
  transaction: string;
  setAddressVal: (input: string) => void;
  success?: boolean;
  submitHandler: () => void;
  isPending?: boolean;
};

export default function RequestModal({
  visible,
  setVisible,
  address,
  transaction,
  setAddressVal,
  success,
  submitHandler,
  isPending
}: RequestModalProps) {
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
      fullModal
      pure
    >
      <div className='maxlg:h-max h-screen max-w-full rounded-none bg-white px-4 pb-10 text-left minlg:m-auto minlg:mt-24 minlg:h-max minlg:max-w-[458px] minlg:rounded-[10px]'>
        <div className='m-auto max-w-lg pt-28 font-noi-grotesk minlg:relative lg:max-w-md'>
          <div className='absolute right-4 top-4 h-6 w-6 rounded-full bg-[#F9D963] hover:cursor-pointer minlg:right-1'></div>
          <XCircle
            onClick={() => {
              setVisible(false);
              setAddressVal('');
            }}
            className='absolute right-3 top-3 hover:cursor-pointer minlg:right-0'
            size={32}
            color='black'
            weight='fill'
          />
          {!success ? (
            isPending ? (
              <>
                <div className='mb-10 flex items-center'>
                  <ArrowsClockwise size={32} color='#6f6f6f' weight='fill' className='mr-2 animate-spin-slow' />
                  <h2 className='text-4xl font-bold tracking-wide'>One second...</h2>
                </div>
                <p className='text-[#6F6F6F]'>We{"'"}re waiting for the transaction to complete.</p>
              </>
            ) : (
              <>
                <h2 className='mb-10 text-4xl font-bold tracking-wide'>Confirm Request</h2>
                <p className='text-[#6F6F6F]'>You are about to send an address association request to</p>
                <p className='mt-2 break-words font-mono text-xl text-black'>{address}</p>
                <p className='mt-6'>
                  View the address on{' '}
                  <a
                    target='_blank'
                    rel='noreferrer'
                    href={`https://etherscan.io/address/${address}`}
                    className='font-bold tracking-wide underline'
                  >
                    Etherscan
                  </a>
                </p>
                <p className='my-6'>
                  Please sign the transaction in your wallet. If you have changed your mind and do not wish to send this
                  request, simply cancel.
                </p>
                <Button
                  type={ButtonType.PRIMARY}
                  size={ButtonSize.LARGE}
                  label='Request Association'
                  onClick={() => submitHandler()}
                  stretch
                />
                <div className='mb-6 mt-2 flex items-center justify-center font-noi-grotesk text-sm text-blog-text-reskin'>
                  <GasPump size={20} weight='fill' />
                  <p className='ml-1'>
                    This action will require a <span className='border-b	border-dashed border-[#6F6F6F]'> gas fee.</span>
                  </p>
                </div>
                <p
                  className='mt-6 text-center font-bold tracking-wide underline hover:cursor-pointer'
                  onClick={() => {
                    setVisible(false);
                    setAddressVal('');
                  }}
                >
                  Cancel
                </p>
              </>
            )
          ) : (
            <>
              <h2 className='mb-10 text-4xl font-bold tracking-wide'>Request Sent</h2>
              <p className='text-[#6F6F6F]'>
                You have sent an address association request to{' '}
                <span className='mt-2 break-words font-mono text-xl text-black'>{address}</span>
              </p>
              <p className='mt-6'>
                View the transaction on{' '}
                <a
                  target='_blank'
                  rel='noreferrer'
                  href={`https://goerli.etherscan.io/tx/${transaction}`}
                  className='font-bold tracking-wide underline'
                >
                  Etherscan
                </a>
              </p>
              <p className='my-6'>
                Please inform the owner of this address to connect to NFT.com to approve your request. You will receive
                a notification once approved.
              </p>
              <Button
                type={ButtonType.PRIMARY}
                size={ButtonSize.LARGE}
                label='Return to Settings'
                onClick={() => {
                  setVisible(false);
                  setAddressVal('');
                }}
                stretch
              />
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
