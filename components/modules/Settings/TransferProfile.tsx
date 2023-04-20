import { useState } from 'react';
import { BigNumber } from 'ethers';
import { ArrowsClockwise, GasPump, XCircle } from 'phosphor-react';
import { useAccount } from 'wagmi';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useSidebar } from 'hooks/state/useSidebar';
import { useUser } from 'hooks/state/useUser';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';

import SettingsForm from './SettingsForm';

type TransferProfileProps = {
  selectedProfile: string;
};

export default function TransferProfile({ selectedProfile }: TransferProfileProps) {
  const { setCurrentProfileUrl, setHiddenProfileWithExpiry } = useUser();
  const { toggleSidebar } = useSidebar();
  const { nftProfile } = useAllContracts();
  const { address: currentAddress } = useAccount();
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transaction, setTransaction] = useState('');
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const profileToken = myOwnedProfileTokens.find(a => a.title === selectedProfile)?.id?.tokenId;
  const [inputVal, setInputVal] = useState('');
  const [transactionPending, setTransactionPending] = useState(false);

  const submitHandler = async () => {
    const tx = await nftProfile.transferFrom(currentAddress, inputVal, BigNumber.from(profileToken));
    setVisible(true);
    setTransactionPending(true);
    if (tx) {
      tx.wait(1)
        .then(() => {
          gtag('event', 'Profile Transferred', {
            ethereumAddress: currentAddress,
            profile: selectedProfile,
            destinationAddress: inputVal
          });
          setTransaction(tx.hash);
          setTransactionPending(false);
          setSuccess(true);
          setInputVal('');
        })
        .catch(() => null);
    }
  };

  const closeModal = () => {
    if (success) {
      toggleSidebar();
      setCurrentProfileUrl('');
      setHiddenProfileWithExpiry(selectedProfile);
    }
    setVisible(false);
  };

  const setModalOpen = () => {
    setVisible(true);
  };

  return (
    <div id='transfer' className='mt-10 rounded-[10px] bg-[#FFF1F1] p-4'>
      <h2 className='mb-1 font-noi-grotesk text-2xl font-bold tracking-wide text-black'>Transfer Profile</h2>
      <p className='mb-4 text-blog-text-reskin'>
        Send this profile to another wallet. You will lose access to this profile.
      </p>

      <SettingsForm
        buttonText='Transfer Profile'
        changeHandler={setInputVal}
        submitHandler={setModalOpen}
        {...{ inputVal }}
      />

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
            <div className='absolute right-4 top-4 h-6 w-6 rounded-full bg-[#F9D963] hover:cursor-pointer minlg:right-1'></div>
            <XCircle
              onClick={() => closeModal()}
              className='absolute right-3 top-3 hover:cursor-pointer minlg:right-0'
              size={32}
              color='black'
              weight='fill'
            />
            {transactionPending ? (
              <>
                <div className='mb-10 flex items-center'>
                  <ArrowsClockwise size={32} color='#6f6f6f' weight='fill' className='mr-2 animate-spin-slow' />
                  <h2 className='text-4xl font-bold tracking-wide'>One second...</h2>
                </div>

                <p className='text-[#6F6F6F]'>We’re waiting for the transaction to complete.</p>
              </>
            ) : success ? (
              <>
                <h2 className='mb-10 text-4xl font-bold tracking-wide'>Transfer In Progress</h2>

                <p className='mb-6 text-[#6F6F6F]'>
                  You can confirm this transaction on{' '}
                  <a
                    target='_blank'
                    rel='noreferrer'
                    href={`https://goerli.etherscan.io/tx/${transaction}`}
                    className='font-bold tracking-wide text-black underline'
                  >
                    Etherscan.
                  </a>
                  You can safely navigate away from this screen and return to NFT.com
                </p>
                <Button
                  type={ButtonType.PRIMARY}
                  size={ButtonSize.LARGE}
                  label='Return to NFT.com'
                  onClick={() => {
                    closeModal();
                  }}
                  stretch
                />
              </>
            ) : (
              <>
                <h2 className='mb-10 text-4xl font-bold tracking-wide'>Confirm Transfer</h2>
                <p className='text-[#6F6F6F]'>
                  You’re about to transfer <span className='font-bold tracking-wide text-black'>{selectedProfile}</span>{' '}
                  to <span className='mt-2 break-words font-mono text-xl text-black'>{inputVal}</span>
                </p>

                <p className='my-6 text-[#6F6F6F]'>
                  Please confirm this address is correct. Once the transfer process begins, you will lose access to this
                  profile.
                </p>
                <Button
                  type={ButtonType.PRIMARY}
                  size={ButtonSize.LARGE}
                  label='Transfer Profile'
                  onClick={() => submitHandler()}
                  stretch
                />
                <div className='mt-2 flex items-center justify-center font-noi-grotesk text-sm text-blog-text-reskin'>
                  <GasPump size={20} weight='fill' />
                  <p className='ml-1'>
                    This action will require a <span className='border-b	border-dashed border-[#6F6F6F]'>gas fee.</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
