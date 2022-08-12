import { useIgnoredEventsQuery } from 'graphql/hooks/useIgnoredEventsQuery';
import { useUpdateHideIgnored } from 'graphql/hooks/useUpdateHideIgnored';
import { useAllContracts } from 'hooks/contracts/useAllContracts';

import AssociatedAddress from './AssociatedAddress';
import RequestModal from './RequestModal';
import SettingsForm from './SettingsForm';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';

type Address = {
  chainAddr: string;
}

export type RejectedEvent = {
  id: string;
  destinationAddress: string;
  txHash: string;
  hideIgnored: boolean
}

type ConnectedAccountsProps = {
  selectedProfile: string;
  associatedAddresses : {
    pending: Address[];
    accepted: Address[];
    denied: RejectedEvent[]
  };
};

export default function ConnectedAccounts({ selectedProfile, associatedAddresses }: ConnectedAccountsProps) {
  const { address: currentAddress } = useAccount();
  const { mutate: mutateHidden } = useIgnoredEventsQuery({ profileUrl: selectedProfile, walletAddress: currentAddress });
  const { nftResolver } = useAllContracts();
  const [inputVal, setInputVal] = useState('');
  const [isOpen, setIsOpen] = useState(null);
  const [transaction, setTransaction] = useState('');
  const [isAssociatedOrSelf, setIsAssociatedOrSelf] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const { updateHideIgnored } = useUpdateHideIgnored();

  const submitHandler = async (input?: string) => {
    const address = input || inputVal;
    const deniedEvent = associatedAddresses?.denied?.find((evt) => evt.destinationAddress === address);
    if(deniedEvent){
      updateHideIgnored({ hideIgnored: false, eventIdArray: [deniedEvent.id] })
        .then(() => {
          mutateHidden();
          setTransaction(deniedEvent.txHash);
          setSuccess(true);
          setModalVisible(true);
        });
    } else {
      const tx = await nftResolver.addAssociatedAddresses([{ cid: 0, chainAddr: address }], selectedProfile);
      setTransactionPending(true);
      if(tx){
        tx.wait(1).then(() => {
          setSuccess(true);
          setTransaction(tx.hash);
          setModalVisible(true);
          setTransactionPending(false);
        });
      }
    }
  };

  const removeHandler = async (action, input) => {
    if(action === 'address'){
      await nftResolver.removeAssociatedAddress({ cid: 0, chainAddr: input }, selectedProfile)
        .then(() => {
          toast.success('Removed');
          setIsOpen(false);
        })
        .catch(() => toast.error('Error'));
    } else if (action === 'address-hideRejected') {
      const deniedEvent = associatedAddresses?.denied.find((evt) => evt.destinationAddress === input);
      updateHideIgnored({ hideIgnored: true, eventIdArray: [deniedEvent.id] })
        .then(() => {
          mutateHidden();
          toast.success('Removed');
        })
        .catch(() => toast.error('Error'));
    } else {
      toast.error('Error');
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    if(associatedAddresses.pending.find(element => element.chainAddr === inputVal) || associatedAddresses.accepted.find(element => element.chainAddr === inputVal) || inputVal === currentAddress){
      setIsAssociatedOrSelf(true);
    } else {
      setIsAssociatedOrSelf(false);
    }
  }, [inputVal, associatedAddresses, currentAddress]);
  
  return (
    <div id="wallets" className='mt-10 font-grotesk'>
      <h3 className='text-base font-semibold tracking-wide mb-1'>Connected Wallets</h3>
      <p className='text-blog-text-reskin mb-4'>Display NFTs from your Ethereum addresses on your NFT Profile.</p>
      
      <SettingsForm buttonText='Request Connection' submitHandler={openModal} {...{ inputVal, isAssociatedOrSelf }} changeHandler={setInputVal} />

      {associatedAddresses?.accepted?.length || associatedAddresses?.pending?.length
        ? (
          <div className='mt-4 w-full'>
            <div className='p-1 flex  justify-between mb-1'>
              <p className='w-1/2 mr-[3.1rem] text-blog-text-reskin text-sm'>Address</p>
              <p className='w-1/2 text-blog-text-reskin text-sm'>Network</p>
            </div>

            {associatedAddresses?.accepted.map((address, index)=> (
              <AssociatedAddress key={index} address={address.chainAddr} remove={removeHandler} isOpen={isOpen} setIsOpen={setIsOpen} />
            ))}
            {associatedAddresses?.pending.map((address, index)=> (
              <AssociatedAddress pending key={index} address={address.chainAddr} remove={removeHandler} isOpen={isOpen} setIsOpen={setIsOpen} />
            ))}
            {associatedAddresses?.denied?.map((address)=> (
              !address.hideIgnored &&
              <AssociatedAddress rejected key={address.id} address={address.destinationAddress} remove={removeHandler} submit={submitHandler} isOpen={isOpen} setIsOpen={setIsOpen}/>
            ))}
          </div>
        )
        : null}
      <RequestModal {...{ submitHandler, success }} isPending={transactionPending} address={inputVal} transaction={transaction} visible={modalVisible} setVisible={setModalVisible} setAddressVal={setInputVal} />
    </div>
  );
}