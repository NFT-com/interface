import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork } from 'wagmi';

import ClientOnly from 'components/elements/ClientOnly';
import Toast from 'components/elements/Toast';
import DefaultLayout from 'components/layouts/DefaultLayout';
import MintPaidProfileCard from 'components/modules/ProfileFactory/MintPaidProfileCard';
import ConnectedAccounts from 'components/modules/Settings/ConnectedAccounts';
import ConnectedProfiles from 'components/modules/Settings/ConnectedProfiles';
import DisplayMode from 'components/modules/Settings/DisplayMode';
import NftOwner from 'components/modules/Settings/NftOwner';
import SettingsSidebar from 'components/modules/Settings/SettingsSidebar';
import TransferProfile from 'components/modules/Settings/TransferProfile';
import { AddressTupleStructOutput, RelatedProfilesStructOutput } from 'constants/typechain/Nft_resolver';
import {
  Event as OCREvent,
  PendingAssociationOutput,
  RemovedAssociationsForReceiverOutput
} from 'graphql/generated/types';
import { useFetchIgnoredEvents } from 'graphql/hooks/useFetchIgnoredEvents';
import { useGetRemovedAssociationsForReceiver } from 'graphql/hooks/useGetRemovedAssociationsForReceiverQuery';
import { usePendingAssociationQuery } from 'graphql/hooks/usePendingAssociationQuery';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useUser } from 'hooks/state/useUser';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useProfileExpiryDate } from 'hooks/useProfileExpiryDate';
import { Doppler, getEnv } from 'utils/env';
import { filterNulls, isNullOrEmpty } from 'utils/format';
import { getChainIdString, shortenAddress } from 'utils/helpers';

export type AssociatedAddresses = {
  pending: AddressTupleStructOutput[];
  accepted: AddressTupleStructOutput[];
  denied: PartialDeep<OCREvent>[];
};

export type AssociatedProfiles = {
  pending: PartialDeep<PendingAssociationOutput>[];
  accepted: RelatedProfilesStructOutput[];
  removed: PartialDeep<RemovedAssociationsForReceiverOutput>[];
};

export default function Settings() {
  const router = useRouter();
  const { nftResolver } = useAllContracts();
  const { address: currentAddress } = useAccount();
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const { data: pendingAssociations } = usePendingAssociationQuery();
  const { data: removedAssociationsForReceiver } = useGetRemovedAssociationsForReceiver();
  const { getCurrentProfileUrl } = useUser();
  const { chain } = useNetwork();
  const { fetchEvents } = useFetchIgnoredEvents();
  const selectedProfile = getCurrentProfileUrl();
  const { expiry } = useProfileExpiryDate(selectedProfile);

  // TODO: move settings page state/data management into Context
  const { data: associatedAddresses } = useSWR<AssociatedAddresses>(
    `SettingsAssociatedAddresses${selectedProfile}${currentAddress}`,
    async () => {
      if (isNullOrEmpty(selectedProfile) || isNullOrEmpty(currentAddress)) {
        return { pending: [], accepted: [], denied: [] };
      }
      const [data, allData, events] = await Promise.all([
        nftResolver.associatedAddresses(selectedProfile),
        nftResolver.getAllAssociatedAddr(currentAddress, selectedProfile),
        fetchEvents({
          chainId: getChainIdString(chain?.id) ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
          profileUrl: selectedProfile,
          walletAddress: currentAddress
        })
      ]);
      const result = allData.filter(a => !data.some(b => a.chainAddr === b.chainAddr));
      const filterPending = result
        .reverse()
        .filter(a => !events?.ignoredEvents.some(b => a.chainAddr === b.destinationAddress && b.ignore));
      return {
        pending: filterPending,
        accepted: data,
        denied: events?.ignoredEvents
      };
    }
  );

  const getAssociatedProfiles = useCallback(async () => {
    if (isNullOrEmpty(currentAddress)) {
      return { pending: [], accepted: [], removed: [] };
    }
    const evm = await nftResolver.getApprovedEvm(currentAddress).catch(() => []);

    const approvedProfiles = await Promise.all(
      evm.map(async (relatedProfile: RelatedProfilesStructOutput) => {
        const assocAddress = await nftResolver.associatedAddresses(relatedProfile.profileUrl);
        const isAssociated = assocAddress.some(item => item.chainAddr === currentAddress);
        return isAssociated ? relatedProfile : null;
      })
    );
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
    `SettingsAssociatedProfiles${currentAddress}`,
    getAssociatedProfiles
  );

  useEffect(() => {
    if (!currentAddress) {
      router.push('/');
    }
  }, [currentAddress, router]);

  const ownsProfilesAndSelectedProfile =
    myOwnedProfileTokens.length && myOwnedProfileTokens.some(t => t.title === selectedProfile);

  return (
    <ClientOnly>
      <Toast />
      <div className='flex min-h-screen flex-col justify-between overflow-x-hidden'>
        <div className='flex'>
          <SettingsSidebar isOwner={ownsProfilesAndSelectedProfile} />
          <div className='mx-auto w-full max-w-[900px] bg-white minlg:pl-80 minlg:pt-28'>
            <div className='px-5 minmd:px-28 minlg:px-0'>
              <h2 className='block font-noi-grotesk text-[40px] font-bold text-black minlg:hidden'>
                <span className='text-[#F9D963]'>/</span>
                Settings
              </h2>
              {ownsProfilesAndSelectedProfile ? (
                <>
                  <h3 className='relative mb-4 mt-10 flex items-center font-noi-grotesk text-xs font-extrabold uppercase tracking-wide text-[#6F6F6F] minlg:mt-24'>
                    Profile Settings for {selectedProfile}
                  </h3>
                  <ConnectedAccounts associatedAddresses={associatedAddresses} selectedProfile={selectedProfile} />
                  <DisplayMode selectedProfile={selectedProfile} />
                  <div className='mt-10 font-noi-grotesk' id='licensing'>
                    <h2 className='mb-2 font-noi-grotesk text-2xl font-bold tracking-wide text-black'>
                      Profile Licensing
                    </h2>
                    {expiry && (
                      <p>
                        {selectedProfile} expires: {expiry}
                      </p>
                    )}
                    <MintPaidProfileCard profile={selectedProfile} type='renew' />
                  </div>
                  <TransferProfile selectedProfile={selectedProfile} />
                </>
              ) : null}
            </div>
            <div className='bg-[#F8F8F8] px-5 pb-10 minmd:rounded-[10px] minmd:px-28 minlg:mb-24 minlg:px-5'>
              <h3 className='relative mb-4 mt-10 flex items-center pt-10 font-noi-grotesk text-xs font-extrabold uppercase tracking-wide text-[#6F6F6F] minlg:mt-10'>
                Address Settings for {shortenAddress(currentAddress, 4)}
              </h3>
              {ownsProfilesAndSelectedProfile ? (
                <>
                  <NftOwner selectedProfile={selectedProfile} isSidebar={false} showToastOnSuccess={true} />
                </>
              ) : null}

              <ConnectedProfiles associatedProfiles={associatedProfiles} />
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}

Settings.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
