import { useHiddenEventsQuery } from 'graphql/hooks/useHiddenEventsQuery';
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
  const { mutate: mutateHidden } = useHiddenEventsQuery({ profileUrl: selectedProfile, walletAddress: currentAddress });
  const { nftResolver } = useAllContracts();
  const [inputVal, setInputVal] = useState('');
  
  const [transaction, setTransaction] = useState('');
  const [isAssociatedOrSelf, setIsAssociatedOrSelf] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const { updateHideIgnored } = useUpdateHideIgnored();

  const submitHandler = async () => {
    const address = inputVal;
    const deniedEvent = associatedAddresses?.denied.find((evt) => evt.destinationAddress === address);
    if(deniedEvent){
      updateHideIgnored({ hideIgnored: false, eventIdArray: [deniedEvent.id] }).then(() => {mutateHidden(); setTransaction(deniedEvent.txHash); setSuccess(true); setModalVisible(true);});
    } else {
      await nftResolver.addAssociatedAddresses([{ cid: 0, chainAddr: address }], selectedProfile).then((res) => setTransaction(res.hash)).then(() => {setSuccess(true); setModalVisible(true);});
    }
  };

  const removeHandler = async (action, input) => {
    if(action === 'address'){
      await nftResolver.removeAssociatedAddress({ cid: 0, chainAddr: input }, selectedProfile)
        .then(() => toast.error('Error'));
    } else if (action === 'address-hideRejected') {
      const deniedEvent = associatedAddresses?.denied.find((evt) => evt.destinationAddress === input);
      updateHideIgnored({ hideIgnored: true, eventIdArray: [deniedEvent.id] })
        .then(() => {
          mutateHidden();
          toast.success('Removed');
        });
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
    <div id="wallets" className='mt-8 font-grotesk'>
      <h3 className='text-base font-semibold tracking-wide mb-1'>Connected Wallets</h3>
      <p className='text-blog-text-reskin mb-4'>Display NFTs from other Ethereum wallets on your profile.</p>
      
      <SettingsForm buttonText='Request Connection' submitHandler={openModal} {...{ inputVal, isAssociatedOrSelf }} changeHandler={setInputVal} />

      {associatedAddresses?.accepted?.length || associatedAddresses?.pending?.length
        ? (
          <div className='mt-4 md:w-full w-3/4'>
            <div className='p-1 flex  justify-between mb-1'>
              <p className='w-1/2 mr-[3.1rem] text-blog-text-reskin text-sm'>Address</p>
              <p className='w-1/2 text-blog-text-reskin text-sm'>Network</p>
            </div>

            {associatedAddresses?.accepted.map((address, index)=> (
              <AssociatedAddress key={index} address={address.chainAddr} remove={removeHandler} />
            ))}
            {associatedAddresses?.pending.map((address, index)=> (
              <AssociatedAddress pending key={index} address={address.chainAddr} remove={removeHandler} />
            ))}
            {associatedAddresses?.denied?.map((address)=> (
              !address.hideIgnored &&
              <AssociatedAddress rejected key={address.id} address={address.destinationAddress} remove={removeHandler} />
            ))}
          </div>
        )
        : null}
      <RequestModal {...{ submitHandler, success }} address={inputVal} transaction={transaction} visible={modalVisible} setVisible={setModalVisible} setAddressVal={setInputVal} />
    </div>
  );
}