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
  const [inputVal, setInputVal] = useState<string>('');
  const { data, mutate: mutateContract } = useAssociatedAddressesForContractQuery({ contract: inputVal });
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [changeCollection, setChangeCollection] = useState(false);
  const [lookupInProgress, setLookupInProgress] = useState(true);
  const [collectionNameModal, setCollectionNameModal] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [isAssociatedOrSelf, setIsAssociatedOrSelf] = useState(false);

  const fetchAssociatedCollection = useCallback(
    async (profile) => {
      await nftResolver.associatedContract(profile)
        .then((res) => {setConnectedCollection(res);
          lookupCollectionName(res.chainAddr)
            .then((res2) => setCollectionName(res2?.contractMetadata?.name || res.chainAddr));
        });
    },
    [nftResolver],
  );

  useEffect(() => {
    if(connectedCollection?.chainAddr === inputVal || inputVal === currentAddress){
      setIsAssociatedOrSelf(true);
    } else {
      setIsAssociatedOrSelf(false);
    }
  }, [inputVal, currentAddress, connectedCollection]);

  useEffect(() => {
    if(selectedProfile && currentAddress) {
      fetchAssociatedCollection(selectedProfile).catch(console.error);
    }
    if(!currentAddress){
      setConnectedCollection([]);
    }
  }, [fetchAssociatedCollection, selectedProfile, currentAddress]);

  useEffect(() => {
    if(data && !data?.associatedAddressesForContract?.deployerIsAssociated){
      setNotAuthorized(true);
    }
    if(data !== undefined){
      setLookupInProgress(false);
    }
  }, [data]);

  const openModal = async () => {
    setVisible(true);
    await lookupCollectionName(inputVal)
      .then((res) => {
        setCollectionName(res?.contractMetadata?.name);
        setVisible(true);
      });
  };

  const changeHandler = async (e) => {
    setInputVal(e);
    mutateContract();
  };

  const removeHandler = async () => {
    setVisible(true);
    setChangeCollection(true);
  };

  const lookupCollectionName = async (addr): Promise<any> => {
    return await getContractMetadata(addr);
  };

  const getModalContent = useCallback(() => {
    const submitHandler = async () => {
      const address = inputVal;
      await nftResolver.setAssociatedContract( { cid: 0, chainAddr: address } , selectedProfile).then(() => setSuccess(true));
    };

    const changeHandlerModal = async (e) => {
      setInputVal(e);
      mutateContract();
    };

    if(changeCollection){
      return (
        <>
          <h2 className='text-4xl tracking-wide font-bold mb-10'>Change Collection</h2>
           
          <p className='mt-2 mb-4 text-[#6F6F6F]'>Enter the new address of the NFT collection you want to display on your profile.</p>
          <SettingsForm submitHandler={async () => {
            setChangeCollection(false);
            await getContractMetadata(inputVal)
              .then((res) => {
                setVisible(true);
                setCollectionNameModal(res?.contractMetadata?.name);
              });
          }} buttonText='Display Collection' inputVal={inputVal} changeHandler={changeHandlerModal} {...{ isAssociatedOrSelf }} />
        </>
      );
    }

    if(notAuthorized){
      return (
        <>
          <h2 className='text-4xl tracking-wide font-bold mb-10'>Not Authorized</h2>
           
          <p className='mt-2 text-[#6F6F6F]'>It looks like the collection was not deployed by a wallet associated to your profile.</p>
          <p className='text-[#6F6F6F] mt-3'>Please try another collection.</p>
          <button onClick={() => {setVisible(false); setNotAuthorized(false); setLookupInProgress(true); setInputVal(''); setCollectionNameModal('');}} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-6" type="button">
              Return to Settings
          </button>
        </>
      );
    }

    if(!lookupInProgress && !success){
      return (
        <>
          <h2 className='text-4xl tracking-wide font-bold mb-10'>Confirm Collection</h2>
          <p className='font-mono text-black text-xl break-words mt-2'>{inputVal}</p>
             
          <p className='mt-2 text-[#6F6F6F]'>The address you have entered represents <span className='text-black font-bold'>{collectionName === '' ? inputVal : collectionNameModal}</span></p>
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
    }

    if(success) {
      return (
        <>
          <h2 className='text-4xl tracking-wide font-bold mb-10'>Success!</h2>
          <p className='font-mono text-black text-xl break-words mt-2'>{inputVal}</p>
           
          <p className='mt-2 text-[#6F6F6F]'>Your collection will now display on your profile.</p>
          <p className='text-[#6F6F6F] mt-6'>You can always change the collection anytime by visiting your profile’s settings.</p>
          <button onClick={() => {setVisible(false); setSuccess(false); setLookupInProgress(true); setInputVal('');}} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full mt-6" type="button">
              Return to Settings
          </button>
        </>
      );}

    return (
      <>
        <h2 className='text-4xl tracking-wide font-bold mb-10'>One Second...</h2>
        <p className='mt-2 text-[#6F6F6F] mb-10'>We’re making sure everything looks good on our end.</p>
      </>
    );
  }, [success, inputVal, notAuthorized, collectionName, lookupInProgress, nftResolver, selectedProfile, changeCollection, mutateContract, collectionNameModal, isAssociatedOrSelf]);

  return (
    <>
      <div className='mt-8 font-grotesk'>
        <h3 className='text-base font-semibold tracking-wide mb-1'>NFT Collection</h3>
        <p className='text-blog-text-reskin mb-4'>Enter the NFT collection you want to display on your profile.</p>

        {!connectedCollection?.chainAddr? <SettingsForm {...{ isAssociatedOrSelf }} submitHandler={openModal} buttonText='Display Collection' inputVal={inputVal} changeHandler={changeHandler} /> : null}

        {connectedCollection?.chainAddr
          ? <div className='mt-4 md:w-full w-3/4'>
            <AssociatedProfile
              profile={{
                url: collectionName || connectedCollection.chainAddr,
                addr: connectedCollection.chainAddr
              }}
              remove={removeHandler}
            />
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
          setLookupInProgress(true);
          setNotAuthorized(false);
          setCollectionNameModal('');
        }}
        bgColor='white'
        hideX
      >
        <div className='max-w-[458px] h-max bg-white text-left px-4 pb-10 rounded-[10px]'>
          <div className='pt-28 font-grotesk lg:max-w-md max-w-lg m-auto relative'>
            <XCircle
              onClick={() => {
                setVisible(false);
                setLookupInProgress(true);
                setInputVal('');
                setNotAuthorized(false);
              }} className='absolute top-3 right-0 hover:cursor-pointer' size={32} color="#B6B6B6" weight="fill" />
            {getModalContent()}
          </div>
        </div>
      </Modal>
    </>
  );
}
  