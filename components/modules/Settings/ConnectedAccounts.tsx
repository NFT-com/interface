import { useAllContracts } from 'hooks/contracts/useAllContracts';

import AssociatedAddress from './AssociatedAddress';
import RequestModal from './RequestModal';
import SettingsForm from './SettingsForm';

import { useState } from 'react';

type Address = {
  chainAddr: string;
}

export type RejectedEvent = {
  id: string;
  destinationAddress: string;
}

type ConnectedAccountsProps = {
  selectedProfile: string;
  associatedAddresses : {
    pending: Address[];
    accepted: Address[];
    denied: RejectedEvent[]
  };
  removeHandler: (type: string, address: string) => void
};

export default function ConnectedAccounts({ selectedProfile, associatedAddresses, removeHandler }: ConnectedAccountsProps) {
  const { nftResolver } = useAllContracts();
  const [inputVal, setInputVal] = useState('');
  const [transaction, setTransaction] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const submitHandler = async () => {
    const address = inputVal;
    await nftResolver.addAssociatedAddresses([{ cid: 0, chainAddr: address }], selectedProfile).then((res) => setTransaction(res.hash)).then(() => setModalVisible(true));
  };
  return (
    <div id="wallets" className='mt-8 font-grotesk'>
      <h3 className='text-base font-semibold tracking-wide mb-1'>Connected Wallets</h3>
      <p className='text-blog-text-reskin mb-4'>Display NFTs from other Ethereum wallets on your profile.</p>
      
      <SettingsForm buttonText='Request Connection' submitHandler={submitHandler} {...{ inputVal }} changeHandler={setInputVal} />

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
              <AssociatedAddress rejected key={address.id} address={address.destinationAddress} remove={removeHandler} />
            ))}
          </div>
        )
        : null}
      <RequestModal address={inputVal} transaction={transaction} visible={modalVisible} setVisible={setModalVisible} setAddressVal={setInputVal} />
    </div>
  );
}
  