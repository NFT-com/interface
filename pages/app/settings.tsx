import { Footer } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import { Sidebar } from 'components/elements/Sidebar';
import Toast from 'components/elements/Toast';
import HomeLayout from 'components/layouts/HomeLayout';
import { SearchModal } from 'components/modules/Search/SearchModal';
import ConnectedProfiles from 'components/modules/Settings/ConnectedProfiles';
import DisplayMode from 'components/modules/Settings/DisplayMode';
import NftOwner from 'components/modules/Settings/NftOwner';
import SettingsSidebar from 'components/modules/Settings/SettingsSidebar';
import TransferProfile from 'components/modules/Settings/TransferProfile';
import { useHiddenEventsQuery } from 'graphql/hooks/useHiddenEventsQuery';
import { usePendingAssociationQuery } from 'graphql/hooks/usePendingAssociationQuery';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useUser } from 'hooks/state/useUser';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import NotFoundPage from 'pages/404';
import ClientOnly from 'utils/ClientOnly';
import { Doppler, getEnvBool } from 'utils/env';

import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function Settings() {
  const { nftResolver } = useAllContracts();
  const { address: currentAddress } = useAccount();
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const { data: pendingAssociatedProfiles } = usePendingAssociationQuery();
  const { getCurrentProfileUrl }= useUser();
  const result = getCurrentProfileUrl();
  const [selectedProfile, setSelectedProfile] = useState(result);
  const [associatedAddresses, setAssociatedAddresses] = useState({ pending: [], accepted: [], denied: [] });
  const [associatedProfiles, setAssociatedProfiles] = useState({ pending: [], accepted: [] });
  const { data: events } = useHiddenEventsQuery({ profileUrl: selectedProfile, walletAddress: currentAddress });

  const fetchAddresses = useCallback(
    async (profile) => {
      const data = await (await nftResolver.associatedAddresses(profile)) || [];
      const allData = await nftResolver.getAllAssociatedAddr(currentAddress, profile) || [];
      const result = allData.filter(a => !data.some(b => a.chainAddr === b.chainAddr));
      const filterPending = result.reverse().filter(a => !events?.ignoredEvents.some(b => a.chainAddr === b.destinationAddress && b.ignore));
      setAssociatedAddresses({ pending: filterPending, accepted: data, denied: events?.ignoredEvents });
    },
    [nftResolver, currentAddress, events?.ignoredEvents],
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
        <SearchModal />
      </ClientOnly>
      <Toast />
      <div className='min-h-screen flex flex-col justify-between overflow-x-hidden'>
        <div className='flex'>
          <SettingsSidebar isOwner={ownsProfilesAndSelectedProfile} />
          <div className='w-full bg-white mx-auto pt-28 pb-20 pl-5 pr-5 minmd:pr-28 minmd:pl-28 minlg:pl-80 max-w-[900px]'>
            <h2 className='font-bold text-black text-[40px] font-grotesk block minlg:hidden'>
              <span className='text-[#F9D963]'>/</span>
              Settings
            </h2>
            {ownsProfilesAndSelectedProfile
              ? (
                <>
                  <NftOwner {...{ selectedProfile, showHeaderText: true, showToastOnSuccess: true }} />
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