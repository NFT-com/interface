import { useCallback } from 'react';
import { ArrowsClockwise, GasPump, XCircle } from 'phosphor-react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';

type RemoveModalProps = {
  visible: boolean;
  setVisible: (input: boolean) => void;
  address: string;
  rejected?: boolean;
  remove: () => void;
  isProfile?: boolean;
  profileUrl?: string;
  isRemoved?: boolean;
  isTxPending?: boolean;
};

export default function RemoveModal({
  visible,
  setVisible,
  address,
  rejected,
  remove,
  isProfile,
  profileUrl,
  isRemoved,
  isTxPending
}: RemoveModalProps) {
  const getModalContent = useCallback(() => {
    if (isTxPending) {
      return (
        <>
          <div className='mb-10 flex items-center'>
            <ArrowsClockwise size={32} color='#6f6f6f' weight='fill' className='mr-2 animate-spin-slow' />
            <h2 className='text-4xl font-bold tracking-wide'>One second...</h2>
          </div>
          <p className='text-[#6F6F6F]'>We’re waiting for the transaction to complete.</p>
        </>
      );
    }
    if ((isProfile && rejected) || (isProfile && isRemoved)) {
      return (
        <>
          <p className='text-[#6F6F6F]'>
            You are about to reject the profile <span className='font-bold text-black'>{profileUrl}</span> with the
            following address from your account.
          </p>
          <p className='mt-2 break-words font-mono text-xl text-black'>{address}</p>

          <p className='mt-6 text-[#6F6F6F]'>
            If you reject this NFT Profile, they will not be able to display your NFTs on their NFT Profile.
          </p>
          <p className='mb-6 mt-3 text-[#6F6F6F]'>
            To associate this profile in the future, you must pay the gas fee again.
          </p>
          <Button type={ButtonType.PRIMARY} size={ButtonSize.LARGE} label='Remove' onClick={() => remove()} stretch />
          <p
            className='mt-6 text-center font-bold tracking-wide underline hover:cursor-pointer'
            onClick={() => setVisible(false)}
          >
            Cancel
          </p>
        </>
      );
    }

    if (isProfile) {
      return (
        <>
          <p className='text-[#6F6F6F]'>
            You are about to remove the NFT Profile <span className='font-bold text-black'>{profileUrl}</span> with the
            following address from your account.
          </p>
          <p className='mb-6 mt-2 break-words font-mono text-xl text-black'>{address}</p>

          <Button type={ButtonType.PRIMARY} size={ButtonSize.LARGE} label='Remove' onClick={() => remove()} stretch />
          <div className='mb-6 mt-2 flex items-center justify-center font-noi-grotesk text-sm text-blog-text-reskin'>
            <GasPump size={20} weight='fill' />
            <p className='ml-1'>
              This action will require a <span className='border-b	border-dashed border-[#6F6F6F]'> gas fee.</span>
            </p>
          </div>
          <p
            className='mt-6 text-center font-bold tracking-wide underline hover:cursor-pointer'
            onClick={() => setVisible(false)}
          >
            Cancel
          </p>
        </>
      );
    }

    if (rejected) {
      return (
        <>
          <p className='text-[#6F6F6F]'>
            You are about to remove the following <span className='font-bold text-black'> rejected </span> address from
            your NFT Profile.
          </p>
          <p className='mt-2 break-words font-mono text-xl text-black'>{address}</p>

          <p className='my-6 text-[#6F6F6F]'>
            If you send another association request, you <span className='font-bold text-black'>will not pay</span> the
            gas fee again.
          </p>
          <Button type={ButtonType.PRIMARY} size={ButtonSize.LARGE} label='Remove' onClick={() => remove()} stretch />
          <p
            className='mt-6 text-center font-bold tracking-wide underline hover:cursor-pointer'
            onClick={() => setVisible(false)}
          >
            Cancel
          </p>
        </>
      );
    }

    return (
      <>
        <p className='text-[#6F6F6F]'>
          You are about to remove the following <span className='font-semibold text-black'>accepted</span> or{' '}
          <span className='font-semibold text-black'>pending</span> address from your NFT Profile.
        </p>
        <p className='mt-2 break-words font-mono text-xl text-black'>{address}</p>

        <p className='mt-6 text-[#6F6F6F]'>
          If you remove this address, you will not be able to display their NFTs on your NFT Profile, and must pay gas
          to complete this action.
        </p>
        <p className='my-6 text-[#6F6F6F]'>To associate this address in the future, you must pay the gas fee again.</p>
        <Button type={ButtonType.PRIMARY} size={ButtonSize.LARGE} label='Remove' onClick={() => remove()} stretch />
        <div className='mb-6 mt-2 flex items-center justify-center font-noi-grotesk text-sm text-blog-text-reskin'>
          <GasPump size={20} weight='fill' />
          <p className='ml-1'>
            This action will require a<span className='border-b	border-dashed border-[#6F6F6F]'> gas fee.</span>
          </p>
        </div>
        <p
          className='mt-6 text-center font-bold tracking-wide underline hover:cursor-pointer'
          onClick={() => setVisible(false)}
        >
          Cancel
        </p>
      </>
    );
  }, [address, isProfile, rejected, remove, setVisible, profileUrl, isRemoved, isTxPending]);

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
      fullModal
      pure
    >
      <div className='maxlg:h-max h-screen max-w-full rounded-none bg-white px-4 pb-10 text-left minlg:m-auto minlg:mt-24 minlg:h-max minlg:max-w-[458px] minlg:rounded-[10px]'>
        <div className='m-auto max-w-lg pt-28 font-noi-grotesk minlg:relative lg:max-w-md'>
          <div className='absolute right-4 top-4 h-6 w-6 rounded-full bg-[#f9d963] hover:cursor-pointer minlg:right-1'></div>
          <XCircle
            onClick={() => setVisible(false)}
            className='absolute right-3 top-3 hover:cursor-pointer minlg:right-0'
            size={32}
            color='black'
            weight='fill'
          />
          {!isTxPending && <h2 className='mb-10 text-4xl font-bold tracking-wide'>Are you sure?</h2>}
          {getModalContent()}
        </div>
      </div>
    </Modal>
  );
}
