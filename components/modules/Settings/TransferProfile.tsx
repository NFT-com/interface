import { Modal } from 'components/elements/Modal';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';

import SettingsForm from './SettingsForm';

import { BigNumber } from 'ethers';
import { GasPump, XCircle } from 'phosphor-react';
import { useRef, useState } from 'react';
import { useAccount } from 'wagmi';

type TransferProfileProps = {
  selectedProfile: string
}

export default function TransferProfile({ selectedProfile }: TransferProfileProps ) {
  const { nftProfile } = useAllContracts();
  const { address: currentAddress } = useAccount();
  const addressRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transaction, setTransaction] = useState('');
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const profileToken = myOwnedProfileTokens.find(a => a.title === selectedProfile)?.id?.tokenId;
  const [inputVal, setInputVal] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    const address = addressRef.current.value;
    await nftProfile.transferFrom(currentAddress, address, BigNumber.from(profileToken)).then((res) => setTransaction(res.hash)).then(() => setSuccess(true));
  };

  const setModalOpen = () => {
    setVisible(true);
  };

  return (
    <div id="transfer" className='mt-10'>
      <h2 className='font-grotesk tracking-wide font-bold text-black md:text-2xl text-4xl mb-1'>Transfer Profile</h2>
      <p className='text-blog-text-reskin mb-4'>Send this profile to another wallet.</p>

      <SettingsForm buttonText='Transfer Profile' changeHandler={setInputVal} submitHandler={setModalOpen} {...{ inputVal }} />

      <Modal
        visible={visible}
        loading={false}
        title={'Request Modal'}
        onClose={() => {
          setVisible(false);
        }}
        fullModal
        bgColor='white'
        pure
      >
        <div className='w-full h-screen bg-white text-left px-4'>
          <XCircle onClick={() => setVisible(false)} className='absolute top-5 right-3 hover:cursor-pointer' size={32} color="black" weight="fill" />
          <div className='pt-28 font-grotesk lg:max-w-md max-w-lg m-auto'>
            {success
              ?
              (
                <>
                  <h2 className='text-4xl tracking-wide font-bold mb-10'>Transfer In Progress</h2>
                  
                  <p className='text-[#6F6F6F]'>
                    You can confirm this transaction on{' '}
                    <a
                      target="_blank"
                      rel="noreferrer" href={`https://goerli.etherscan.io/tx/${transaction}`} className='font-bold underline tracking-wide text-black'>Etherscan.
                    </a>
                  You can safely navigate away from this screen and return to NFT.com</p>
                  <button onClick={() => setVisible(false)} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-6" type="button">
                    Return to NFT.com
                  </button>
                </>
              )
              :
              (
                <>
                  <h2 className='text-4xl tracking-wide font-bold mb-10'>Confirm Transfer</h2>
                  <p className='text-[#6F6F6F]'>You’re about to transfer <span className='font-bold text-black tracking-wide'>{selectedProfile}</span> to  <span className='font-mono text-black text-xl break-words mt-2'>{inputVal}</span></p>
            
                  <p className='mt-6 text-[#6F6F6F]'>Please confirm this wallet address is correct. Once the transfer process begins, you will lose access to this profile.</p>
                  <button onClick={(e) => submitHandler(e)} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-6" type="button">
                    Transfer Profile
                  </button>
                  <div className='flex items-center font-grotesk text-blog-text-reskin justify-center mt-2 text-sm'>
                    <GasPump size={20} weight="fill" />
                    <p className='ml-1'>This action will require a gas fee.</p>
                  </div>
                </>
              )
            }
          </div>
        </div>
      </Modal>
    </div>
  );
}