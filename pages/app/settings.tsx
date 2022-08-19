import { Footer } from 'components/elements/Footer';
import { Header } from 'components/elements/Header';
import { Sidebar } from 'components/elements/Sidebar';
import Toast from 'components/elements/Toast';
import HomeLayout from 'components/layouts/HomeLayout';
import { SearchModal } from 'components/modules/Search/SearchModal';
import ConnectedAccounts from 'components/modules/Settings/ConnectedAccounts';
import ConnectedProfiles from 'components/modules/Settings/ConnectedProfiles';
import DisplayMode from 'components/modules/Settings/DisplayMode';
import NftOwner from 'components/modules/Settings/NftOwner';
import SettingsSidebar from 'components/modules/Settings/SettingsSidebar';
import TransferProfile from 'components/modules/Settings/TransferProfile';
import { AddressTupleStructOutput, RelatedProfilesStructOutput } from 'constants/typechain/Nft_resolver';
import { Event as OCREvent, PendingAssociationOutput, RemovedAssociationsForReceiverOutput } from 'graphql/generated/types';
import { useFetchIgnoredEvents } from 'graphql/hooks/useFetchIgnoredEvents';
import { useGetRemovedAssociationsForReceiver } from 'graphql/hooks/useGetRemovedAssociationsForReceiverQuery';
import { usePendingAssociationQuery } from 'graphql/hooks/usePendingAssociationQuery';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useUser } from 'hooks/state/useUser';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import NotFoundPage from 'pages/404';
import ClientOnly from 'utils/ClientOnly';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { filterNulls, getChainIdString, isNullOrEmpty, shortenAddress } from 'utils/helpers';

import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork } from 'wagmi';

export type AssociatedAddresses = {
  pending: AddressTupleStructOutput[];
  accepted: AddressTupleStructOutput[];
  denied: PartialDeep<OCREvent>[];
}

export type AssociatedProfiles = {
  pending: PartialDeep<PendingAssociationOutput>[];
  accepted: RelatedProfilesStructOutput[];
  removed: PartialDeep<RemovedAssociationsForReceiverOutput>[];
}

export default function Settings() {
  const router = useRouter();
  const { nftResolver } = useAllContracts();
  const { address: currentAddress } = useAccount();
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const { data: pendingAssociations } = usePendingAssociationQuery();
  const { data: removedAssociationsForReceiver } = useGetRemovedAssociationsForReceiver();
  const { getCurrentProfileUrl }= useUser();
  const { chain } = useNetwork();
  const { fetchEvents } = useFetchIgnoredEvents();

  const selectedProfile = getCurrentProfileUrl();

  // TODO: move settings page state/data management into Context
  const { data: associatedAddresses } = useSWR<AssociatedAddresses>(
    'SettingsAssociatedAddresses' + selectedProfile + currentAddress,
    async () => {
      if (isNullOrEmpty(selectedProfile) || isNullOrEmpty(currentAddress)) {
        return { pending: [], accepted: [], denied: [] };
      }
      const [
        data,
        allData,
        events
      ] = await Promise.all([
        nftResolver.associatedAddresses(selectedProfile),
        nftResolver.getAllAssociatedAddr(currentAddress, selectedProfile),
        fetchEvents({
          chainId: getChainIdString(chain?.id) ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
          profileUrl: selectedProfile,
          walletAddress: currentAddress
        })
      ]);
      const result = allData.filter(a => !data.some(b => a.chainAddr === b.chainAddr));
      const filterPending = result.reverse().filter(a => !events?.ignoredEvents.some(b => a.chainAddr === b.destinationAddress && b.ignore));
      return {
        pending: filterPending,
        accepted: data,
        denied: events?.ignoredEvents
      };
    });

  const getAssociatedProfiles = useCallback(async () => {
    if (isNullOrEmpty(currentAddress)) {
      return { pending: [], accepted: [], removed: [] };
    }
    const evm = await nftResolver.getApprovedEvm(currentAddress).catch(() => []);

    const approvedProfiles = await Promise.all(evm.map(async (relatedProfile: RelatedProfilesStructOutput) => {
      const assocAddress = await nftResolver.associatedAddresses(relatedProfile.profileUrl);
      const isAssociated = assocAddress.some((item) => item.chainAddr === currentAddress);
      return isAssociated ? relatedProfile : null;
    }));
    const result = pendingAssociations?.getMyPendingAssociations.filter(a => !evm.some(b => a.url === b.profileUrl));
    const removed = removedAssociationsForReceiver?.getRemovedAssociationsForReceiver?.filter(a => a.hidden !== true);
    return {
      pending: result,
      accepted: filterNulls(approvedProfiles),
      removed
    };
  }, [
    currentAddress,
    nftResolver,
    pendingAssociations?.getMyPendingAssociations,
    removedAssociationsForReceiver?.getRemovedAssociationsForReceiver
  ]);

  // TODO: move settings page state/data management into Context
  const { data: associatedProfiles } = useSWR<AssociatedProfiles>(
    'SettingsAssociatedProfiles' + currentAddress,
    getAssociatedProfiles
  );

  useEffect(() => {
    if(!currentAddress){
      router.push('/');
    }
  }, [currentAddress, router]);

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
          <div className='w-full bg-white mx-auto pt-28 minlg:pl-80 max-w-[900px]'>
            <div className='pl-5 pr-5 minmd:pr-28 minmd:pl-28 minlg:pr-0 minlg:pl-0'>
              <h2 className='font-bold text-black text-[40px] font-grotesk block minlg:hidden'>
                <span className='text-[#F9D963]'>/</span>
                Settings
              </h2>
              {ownsProfilesAndSelectedProfile
                ? (
                  <>
                    <h3 className='mt-10 minlg:mt-24 mb-4 text-xs uppercase font-extrabold font-grotesk text-[#6F6F6F] tracking-wide flex items-center relative'>Profile Settings for {selectedProfile}</h3>
                    <ConnectedAccounts associatedAddresses={associatedAddresses} selectedProfile={selectedProfile} />
                    <DisplayMode selectedProfile={selectedProfile}/>
                    <TransferProfile selectedProfile={selectedProfile} />
                  </>
                )
                : null }
            </div>

            <div className='bg-[#F8F8F8] pl-5 pr-5 minmd:pr-28 minmd:pl-28 minlg:pr-5 minlg:pl-5 pb-10 minlg:mb-24 minmd:rounded-[10px]'>
              <h3 className='mt-10 pt-10 minlg:mt-10 mb-4 text-xs uppercase font-extrabold font-grotesk text-[#6F6F6F] tracking-wide flex items-center relative'>
                Address Settings for {shortenAddress(currentAddress, 4)}
              </h3>
              {ownsProfilesAndSelectedProfile
                ? (
                  <>
                    <NftOwner selectedProfile={selectedProfile} isSidebar={false} showToastOnSuccess={true} />
                  </>
                )
                : null}
          
              <ConnectedProfiles associatedProfiles={associatedProfiles} />
            </div>
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