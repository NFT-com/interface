/* eslint-disable react-hooks/exhaustive-deps */
import { Footer } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import { Sidebar } from 'components/elements/Sidebar';
import HomeLayout from 'components/layouts/HomeLayout';
import { SearchModal } from 'components/modules/Search/SearchModal';
import ConnectedAccounts from 'components/modules/Settings/ConnectedAccounts';
import ConnectedProfiles from 'components/modules/Settings/ConnectedProfiles';
import DisplayMode from 'components/modules/Settings/DisplayMode';
import NftOwner from 'components/modules/Settings/NftOwner';
import SettingsForm from 'components/modules/Settings/SettingsForm';
import SettingsSidebar from 'components/modules/Settings/SettingsSidebar';
import { useIgnoreAssociationsMutation } from 'graphql/hooks/useIgnoreAssociationsMutation';
import { usePendingAssociationQuery } from 'graphql/hooks/usePendingAssociationQuery';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useUser } from 'hooks/state/useUser';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import NotFoundPage from 'pages/404';
import ClientOnly from 'utils/ClientOnly';
import { Doppler, getEnvBool } from 'utils/env';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

export default function Settings() {
  const { nftResolver } = useAllContracts();
  const { address: currentAddress } = useAccount();
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const { data: pendingAssociatedProfiles, mutate } = usePendingAssociationQuery();
  const { ignoreAssociations } = useIgnoreAssociationsMutation();
  const { getCurrentProfileUrl }= useUser();
  const result = getCurrentProfileUrl();
  const [selectedProfile, setSelectedProfile] = useState(result);
  const [associatedAddresses, setAssociatedAddresses] = useState({ pending: [], accepted: [] });
  const [associatedProfiles, setAssociatedProfiles] = useState({ pending: [], accepted: [] });
  const profileRef = useRef(null);

  const fetchAddresses = useCallback(
    async (profile) => {
      const data = await nftResolver.associatedAddresses(profile) || [];
      const allData = await nftResolver.getAllAssociatedAddr(currentAddress, profile) || [];
      const result = allData.filter(a => !data.some(b => a.chainAddr === b.chainAddr));
      setAssociatedAddresses({ pending: result, accepted: data });
    },
    [nftResolver, currentAddress],
  );

  useEffect(() => {
    if(selectedProfile && currentAddress) {
      fetchAddresses(selectedProfile).catch(console.error);
    }
    if(!currentAddress){
      setAssociatedAddresses({ pending: [], accepted: [] });
    }
  }, [selectedProfile, fetchAddresses, currentAddress]);

  useEffect(() => {
    getCurrentProfileUrl();
    setSelectedProfile(result);
  }, [result, getCurrentProfileUrl]);

  const fetchProfiles = useCallback(
    async () => {
      const evm = await nftResolver.getApprovedEvm(currentAddress);
      if(!pendingAssociatedProfiles?.getMyPendingAssociations){
        mutate();
      }
      const result = pendingAssociatedProfiles?.getMyPendingAssociations.filter(a => !evm.some(b => a.url === b.profileUrl));
      setAssociatedProfiles({ pending: result, accepted: evm });
    },
    [nftResolver, currentAddress, pendingAssociatedProfiles],
  );

  useEffect(() => {
    fetchProfiles().catch(console.error);
    if(!currentAddress){
      setAssociatedProfiles({ pending: [], accepted: [] });
    }
  }, [nftResolver, currentAddress, fetchProfiles]);
  
  if (!getEnvBool(Doppler.NEXT_PUBLIC_ON_CHAIN_RESOLVER_ENABLED)) {
    return <NotFoundPage />;
  }

  const removeHandler = async (action, input) => {
    if(action === 'address'){
      const selectedProfile = profileRef.current.value;
      await nftResolver.removeAssociatedAddress({ cid: 0, chainAddr: input }, selectedProfile).then((res) => console.log(res));
    } else if (action === 'profile') {
      await nftResolver.removeAssociatedProfile(input).then((res) => console.log(res));
    } else if (action === 'profile-pending') {
      await ignoreAssociations({ eventIdArray: input }).then((res) => console.log(res));
    } else {
      console.log('error');
    }
  };

  const ownsProfilesAndSelectedProfile = myOwnedProfileTokens.length && myOwnedProfileTokens.some(t => t.title === selectedProfile);
  
  return (
    <>
      <ClientOnly>
        <Header bgLight />
        <Sidebar />
        <SearchModal /> 
      </ClientOnly>
      <div className='min-h-screen flex flex-col justify-between overflow-x-hidden'>
        <div className='flex'>
          <SettingsSidebar isOwner={ownsProfilesAndSelectedProfile} />
          <div className='px-5 w-3/5 md:w-full pt-28 pb-20 bg-white mx-auto'>
            <h2 className='mb-2 font-bold text-black text-4xl font-grotesk md:block hidden'>
              <span className='text-[#F9D963]'>/</span>
            Settings
            </h2>
            {ownsProfilesAndSelectedProfile
              ? (
                <>
                  <NftOwner {...{ selectedProfile }} />
                  <DisplayMode/>
                  <ConnectedAccounts {...{ associatedAddresses, removeHandler, selectedProfile }} />
                </>
              )
              : null}
          
            <ConnectedProfiles {...{ associatedProfiles, removeHandler }} />
          
            {ownsProfilesAndSelectedProfile
              ? (<div id="transfer" className='mt-10'>
                <h2 className='font-grotesk tracking-wide font-bold text-black md:text-2xl text-4xl mb-1'>Transfer Profile</h2>
                <p className='text-blog-text-reskin mb-4'>Send this profile to another wallet.</p>
                <SettingsForm selectedProfile={selectedProfile} buttonText='Transfer Profile' type='transfer' />
              </div>)
              : null }
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

Settings.getLayout = function getLayout(page) {
  return (
    <HomeLayout>
      { page }
    </HomeLayout>
  );
};