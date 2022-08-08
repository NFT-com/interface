/* eslint-disable react-hooks/exhaustive-deps */
import { Footer } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import { Sidebar } from 'components/elements/Sidebar';
import Toast from 'components/elements/Toast';
import HomeLayout from 'components/layouts/HomeLayout';
import ConnectedProfiles from 'components/modules/Settings/ConnectedProfiles';
import DisplayMode from 'components/modules/Settings/DisplayMode';
import NftOwner from 'components/modules/Settings/NftOwner';
import SettingsSidebar from 'components/modules/Settings/SettingsSidebar';
import TransferProfile from 'components/modules/Settings/TransferProfile';
import { useHiddenEventsQuery } from 'graphql/hooks/useHiddenEventsQuery';
import { useIgnoreAssociationsMutation } from 'graphql/hooks/useIgnoreAssociationsMutation';
import { usePendingAssociationQuery } from 'graphql/hooks/usePendingAssociationQuery';
import { useUpdateHideIgnored } from 'graphql/hooks/useUpdateHideIgnored';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useUser } from 'hooks/state/useUser';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import NotFoundPage from 'pages/404';
import ClientOnly from 'utils/ClientOnly';
import { Doppler, getEnvBool } from 'utils/env';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';

export default function Settings() {
  const { nftResolver } = useAllContracts();
  const { address: currentAddress } = useAccount();
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const { data: pendingAssociatedProfiles, mutate: mutatePending } = usePendingAssociationQuery();
  const { getCurrentProfileUrl }= useUser();
  const result = getCurrentProfileUrl();
  const [selectedProfile, setSelectedProfile] = useState(result);
  const [associatedAddresses, setAssociatedAddresses] = useState({ pending: [], accepted: [], denied: [] });
  const [associatedProfiles, setAssociatedProfiles] = useState({ pending: [], accepted: [] });
  const { data: events, mutate: mutateHidden } = useHiddenEventsQuery({ profileUrl: selectedProfile, walletAddress: currentAddress });
  const { updateHideIgnored } = useUpdateHideIgnored();

  const fetchAddresses = useCallback(
    async (profile) => {
      const data = await nftResolver.associatedAddresses(profile) || [];
      const allData = await nftResolver.getAllAssociatedAddr(currentAddress, profile) || [];
      const result = allData.filter(a => !data.some(b => a.chainAddr === b.chainAddr));
      const filterPending = result.filter(a => !events?.hiddenEvents.some(b => a.chainAddr === b.destinationAddress && b.ignore));
      setAssociatedAddresses({ pending: filterPending, accepted: data, denied: events?.hiddenEvents });
    },
    [nftResolver, currentAddress, events?.hiddenEvents],
  );

  useEffect(() => {
    if(selectedProfile && currentAddress) {
      fetchAddresses(selectedProfile).catch(console.error);
    }
    if(!currentAddress){
      setAssociatedAddresses({ pending: [], accepted: [], denied: [] });
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
        mutatePending();
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

  const ownsProfilesAndSelectedProfile = myOwnedProfileTokens.length && myOwnedProfileTokens.some(t => t.title === selectedProfile);
  
  return (
    <>
      <ClientOnly>
        <Header bgLight />
        <Sidebar />
      </ClientOnly>
      <Toast />
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
                  <DisplayMode {...{ associatedAddresses, selectedProfile }}/>
                </>
              )
              : null}
          
            <ConnectedProfiles {...{ associatedProfiles }} />
          
            {ownsProfilesAndSelectedProfile
              ? (
                <TransferProfile {...{ selectedProfile }} />
              )
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