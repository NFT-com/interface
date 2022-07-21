import { PageWrapper } from 'components/layouts/PageWrapper';
import { usePendingAssociationQuery } from 'graphql/hooks/usePendingAssociationQuery';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import NotFoundPage from 'pages/404';
import { Doppler, getEnvBool } from 'utils/env';

import { CheckCircle, CheckSquare,Clock, Trash } from 'phosphor-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

export default function Settings() {
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const { data: pendingAssociatedProfiles } = usePendingAssociationQuery();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [associatedAddresses, setAssociatedAddresses] = useState({ pending: [], accepted: [] });
  const [associatedProfiles, setAssociatedProfiles] = useState({ pending: [], accepted: [] });
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
    [nftResolver, account?.address],
  );

  useEffect(() => {
    if(selectedProfile && account) {
      fetchAddresses(selectedProfile).catch(console.error);
    }
  }, [selectedProfile, fetchAddresses, account]);

  const fetchProfiles = useCallback(
    async () => {
      const evm = await nftResolver.getApprovedEvm(account?.address);
      const result = pendingAssociatedProfiles?.getMyPendingAssociations.filter(a => !evm.some(b => a.url === b.profileUrl));
      setAssociatedProfiles({ pending: result, accepted: evm });
    },
    [nftResolver, account, pendingAssociatedProfiles?.getMyPendingAssociations],
  );

  useEffect(() => {
    fetchProfiles().catch(console.error);
  }, [nftResolver, account, fetchProfiles]);
  
  if (!getEnvBool(Doppler.NEXT_PUBLIC_ON_CHAIN_RESOLVER_ENABLED)) {
    return <NotFoundPage />;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const selectedProfile = profileRef.current.value;
    const address = addressRef.current.value;
    await nftResolver.addAssociatedAddresses([{ cid: 0, chainAddr: address }], selectedProfile).then((res) => console.log(res));
    addressRef.current.value = '';
  };

  const acceptPendingProfile = async (e, url) => {
    e.preventDefault();
    await nftResolver.associateSelfWithUsers([url]).then((res) => console.log(res));
  };

  const removeHandler = async (action, address) => {
    if(action === 'address'){
      const selectedProfile = profileRef.current.value;
      await nftResolver.removeAssociatedAddress({ cid: 0, chainAddr: address }, selectedProfile).then((res) => console.log(res));
    } else if (action === 'profile') {
      await nftResolver.removeAssociatedProfile(address).then((res) => console.log(res));
    } else {
      console.log('error');
    }
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

        {profileRef?.current?.value !== 'Select A Profile' && (
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
        )}

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
                  <Trash weight='fill' className='ml-2 hover:cursor-pointer text-black dark:text-white' onClick={() => removeHandler('address', address?.chainAddr)} size={20}/>
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
                  <Trash weight='fill' className='ml-2 hover:cursor-pointer text-black dark:text-white' onClick={() => removeHandler('address', address?.chainAddr)} size={20}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-5 dark:bg-modal-overlay-dk p-8 rounded-md'>
          <h2 className='mb-2 font-bold text-black dark:text-white'>Associated Profiles</h2>
          <div>
            {associatedProfiles?.accepted?.map((profile, index)=> (
              <div key={index} className='shadow-md rounded p-3 flex  justify-between mb-3 bg-white dark:bg-dark-overlay'>
                <div className='flex items-center truncate'>
                  <CheckCircle size={25} className='mr-3 rounded-full' color='green' weight="fill" />
                  <p className='truncate text-black dark:text-white'>{profile[1]}</p>
                </div>
                
                <div className='flex items-center'>
                  <Trash weight='fill' className='ml-2 hover:cursor-pointer text-black dark:text-white' onClick={() => removeHandler('profile', profile[1])} size={20}/>
                </div>
              </div>
            ))}
            {associatedProfiles?.pending?.map((profile, index)=> (
              <div key={index} className='shadow-md rounded p-3 flex  justify-between mb-3 bg-white dark:bg-dark-overlay'>
                <div className='flex items-center truncate'>
                  <Clock size={25} className='mr-3' color='orange' weight='fill' />
                  <p className='truncate text-black dark:text-white'>{profile.url}</p>
                </div>
                
                <div className='flex items-center'>
                  <CheckSquare size={25} className='mr-1 hover:cursor-pointer' color='white' weight='fill' onClick={(e) => acceptPendingProfile(e, profile.url)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
