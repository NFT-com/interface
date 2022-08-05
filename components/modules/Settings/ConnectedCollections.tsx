import { Modal } from 'components/elements/Modal';
import { useAssociatedAddressesForContractQuery } from 'graphql/hooks/useAssociatedAddressesForContractQuery';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { getContractMetadata } from 'utils/alchemyNFT';

import AssociatedProfile from './AssociatedProfile';
import SettingsForm from './SettingsForm';

import { GasPump, XCircle } from 'phosphor-react';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

type ConnectedCollectionsProps = {
  selectedProfile: string;
};

export default function ConnectedCollections({ selectedProfile }: ConnectedCollectionsProps) {
  const { address: currentAddress } = useAccount();
  const { nftResolver } = useAllContracts();
  const [connectedCollection, setConnectedCollection] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [notAuthorized, setNotAuthorized] = useState(false);
  const { data, mutate: mutateContract } = useAssociatedAddressesForContractQuery({ contract: inputVal });

  const fetchAssociatedCollection = useCallback(
    async (profile) => {
      await nftResolver.associatedContract(profile).then((res) => setConnectedCollection(res));
    },
    [nftResolver],
  );

  useEffect(() => {
    if(selectedProfile && currentAddress) {
      fetchAssociatedCollection(selectedProfile).catch(console.error);
    }
    if(!currentAddress){
      setConnectedCollection([]);
    }
  }, [fetchAssociatedCollection, selectedProfile, currentAddress]);

  useEffect(() => {
    fetchCollectionName(connectedCollection?.chainAddr).then((res) => {setCollectionName(res?.contractMetadata?.name);});
  }, [connectedCollection, currentAddress]);

  const fetchCollectionName = async (address) => {
    return await getContractMetadata(address);
  };

  const openModal = async () => {
    await fetchCollectionName(inputVal).then(() => setVisible(true));
  };

  const changeHandler = async (e) => {
    setInputVal(e);
    mutateContract();
  };

  const removeHandler = async () => {
    await nftResolver.clearAssociatedContract(selectedProfile).then((res) => console.log(res));
  };

  const getModalContent = useCallback(() => {
    const submitHandler = async () => {
      const address = inputVal;
      if(data?.associatedAddressesForContract?.deployerIsAssociated){
        await nftResolver.setAssociatedContract( { cid: 0, chainAddr: address } , selectedProfile)
          .then(() => {setSuccess(true);});
      } else {
        setNotAuthorized(true);
      }
    };
    if(success) {
      return (
        <>
          <h2 className='text-4xl tracking-wide font-bold mb-10'>Success!</h2>
          <p className='font-mono text-black text-xl break-words mt-2'>{inputVal}</p>
           
          <p className='mt-2 text-[#6F6F6F]'>Your collection will now display on your profile.</p>
          <p className='text-[#6F6F6F] mt-6'>You can always change the collection anytime by visiting your profile’s settings.</p>
          <button onClick={() => {setVisible(false); setSuccess(false);}} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-6" type="button">
              Return to Settings
          </button>
        </>
      );}

    if(notAuthorized){
      return (
        <>
          <h2 className='text-4xl tracking-wide font-bold mb-10'>Not Authorized</h2>
          <p className='font-mono text-black text-xl break-words mt-2'>{inputVal}</p>
           
          <p className='mt-2 text-[#6F6F6F]'>It looks like the collection was not deployed by a wallet associated to your profile.</p>
          <p className='text-[#6F6F6F] mt-6'>Please try another collection.</p>
          <button onClick={() => {setVisible(false); setNotAuthorized(false);}} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-6" type="button">
              Return to Settings
          </button>
        </>
      );
    }

    return (
      <>
        <h2 className='text-4xl tracking-wide font-bold mb-10'>Confirm Collection</h2>
        <p className='font-mono text-black text-xl break-words mt-2'>{inputVal}</p>
           
        <p className='mt-2 text-[#6F6F6F]'>The address you have entered represents <span className='text-black font-bold'>{collectionName === '' ? inputVal : collectionName}</span></p>
        <p className='text-[#6F6F6F] mt-6'>Please confirm this is the collection you want to display on your profile. Displaying this collection will require you to authorize a transaction in your wallet.</p>
        <button onClick={() => submitHandler()} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-6" type="button">
              Display Collection
        </button>
        <div className='flex items-center font-grotesk text-blog-text-reskin justify-center mt-2 text-sm'>
          <GasPump size={20} weight="fill" />
          <p className='ml-1'>This action will require a gas fee.</p>
        </div>
      </>
    );
  }, [success, inputVal, notAuthorized, collectionName, nftResolver, selectedProfile, data]);

  return (
    <>
      <div className='mt-8 font-grotesk'>
        <h3 className='text-base font-semibold tracking-wide mb-1'>NFT Collection</h3>
        <p className='text-blog-text-reskin mb-4'>Enter the NFT collection you want to display on your profile.</p>

        {!connectedCollection?.chainAddr? <SettingsForm submitHandler={openModal} buttonText='Display Collection' inputVal={inputVal} changeHandler={changeHandler} /> : null}

        {connectedCollection?.chainAddr
          ? <div className='mt-4 md:w-full w-3/4'>
            <AssociatedProfile
              profile={{
                url: collectionName || connectedCollection.chainAddr,
                addr: connectedCollection.chainAddr
              }}
              remove={removeHandler} />
          </div>
          : null}
      </div>

      <Modal
        visible={visible}
        loading={false}
        title={''}
        onClose={() => {
          setVisible(false);
          setInputVal('');
        }}
        bgColor='white'
        hideX
      >
        <div className='max-w-[458px] h-max bg-white text-left px-4 pb-10 rounded-[10px]'>
          <div className='pt-28 font-grotesk lg:max-w-md max-w-lg m-auto relative'>
            <XCircle onClick={() => setVisible(false)} className='absolute top-3 right-0 hover:cursor-pointer' size={32} color="#B6B6B6" weight="fill" />
            {getModalContent()}
          </div>
        </div>
      </Modal>
    </>
  );
}
  