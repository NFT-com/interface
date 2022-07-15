import { PageWrapper } from 'components/layouts/PageWrapper';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import NotFoundPage from 'pages/404';
import { Doppler, getEnvBool } from 'utils/env';

import { CheckCircle, Clock, Trash } from 'phosphor-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

export default function Settings() {
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [associatedAddresses, setAssociatedAddresses] = useState({ pending: [], accepted: [] });
  const { nftResolver } = useAllContracts();
  const { data: account } = useAccount();
  const addressRef = useRef(null);
  const profileRef = useRef(null);

  const fetchAddresses = useCallback(
    async (profile) => {
      const data = await nftResolver.associatedAddresses(profile) || [];
      const allData = await nftResolver.getAllAssociatedAddr(account.address , profile) || [];
      const result = allData.filter(a => !data.some(b => a.chainAddr === b.chainAddr));
      setAssociatedAddresses({ pending: result, accepted: data });
    },
    [account?.address, nftResolver],
  );

  useEffect(() => {
    if(selectedProfile) {
      fetchAddresses(selectedProfile).catch(console.error);
    }
  }, [selectedProfile, fetchAddresses]);
  
  if (!getEnvBool(Doppler.NEXT_PUBLIC_ON_CHAIN_RESOLVER_ENABLED)) {
    return <NotFoundPage />;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const selectedProfile = profileRef.current.value;
    const address = addressRef.current.value;
    await nftResolver.addAssociatedAddresses([{ cid: 0, chainAddr: address }], selectedProfile).then((res) => console.log(res));
  };

  const removeHandler = async (address) => {
    const selectedProfile = profileRef.current.value;
    await nftResolver.removeAssociatedAddress({ cid: 0, chainAddr: address }, selectedProfile).then((res) => console.log(res));
  };
  
  return (
    <PageWrapper>
      <div className='p-5 w-1/2 md:w-3/4 sm:w-full mt-36 mb-20 dark:bg-dark-overlay mx-auto rounded-md'>
        <h1 className='mb-2 font-bold  text-black dark:text-white'>Settings</h1>
        <div className='mb-5 w-1/2'>
          <label htmlFor="countries" className="block mb-2 text-white">Select a profile</label>
          <select defaultValue='Select A Profile' ref={profileRef} onChange={(e) => setSelectedProfile(e.target.value)} id="countries" className="bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-[#F9D963] focus:border-[#F9D963] block w-full p-2.5">
            <option disabled key='selectAProfile' value='Select A Profile'>Select A Profile</option>
            { myOwnedProfileTokens?.map((profileToken, index) => {
              const shortURI = profileToken?.tokenUri?.raw?.split('/').pop();
              return (
                <option key={index} value={shortURI}>{shortURI}</option>
              );
            })}
          </select>
        </div>

        <div className="mb-4">
          <form className="bg-white  dark:bg-modal-overlay-dk shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <label className="block text-gray-700 dark:text-white  text-sm font-bold mb-2" htmlFor="account">
            Add Associated Account
            </label>
           
            <div className='flex'>
              <input ref={addressRef} className="shadow appearance-none border rounded-l-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="account" type="text" placeholder="0x0000...0000" />

              <button onClick={(e) => submitHandler(e)} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-r-md focus:outline-none focus:shadow-outline" type="button">
              Submit
              </button>
            </div>
          </form>
        </div>

        <div className='mt-5 dark:bg-modal-overlay-dk p-8 rounded-md'>
          <h2 className='mb-2 font-bold text-black dark:text-white'>Associated Accounts</h2>
          <div>
            {associatedAddresses?.accepted.map((address, index)=> (
              <div key={index} className='shadow-md rounded p-3 flex  justify-between mb-3 bg-white dark:bg-dark-overlay'>
                <div className='flex items-center truncate'>
                  <CheckCircle size={25} className='mr-3 rounded-full' color='green' weight="fill" />
                  <p className='truncate text-black dark:text-white'>{address?.chainAddr}</p>
                </div>
                
                <div className='flex items-center'>
                  <Trash weight='fill' className='ml-2 hover:cursor-pointer text-black dark:text-white' onClick={() => removeHandler(address?.chainAddr)} size={20}/>
                </div>
              </div>
            ))}
            {associatedAddresses?.pending.map((address, index)=> (
              <div key={index} className='shadow-md rounded p-3 flex  justify-between mb-3 bg-white dark:bg-dark-overlay'>
                <div className='flex items-center truncate'>
                  <Clock size={25} className='mr-3' color='orange' weight='fill' />
                  <p className='truncate text-black dark:text-white'>{address?.chainAddr}</p>
                </div>

                <div className='flex items-center'>
                  <Trash weight='fill' className='ml-2 hover:cursor-pointer text-black dark:text-white' onClick={() => removeHandler(address?.chainAddr)} size={20}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
