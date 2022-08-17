import { useIsProfileCustomized } from 'graphql/hooks/useIsProfileCustomized';
import { usePendingAssociationQuery } from 'graphql/hooks/usePendingAssociationQuery';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useSidebar } from 'hooks/state/useSidebar';
import { useUser } from 'hooks/state/useUser';
import { useClaimableProfileCount } from 'hooks/useClaimableProfileCount';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';

import { NotificationButton } from './NotificationButton';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useAccount, useNetwork, useSigner } from 'wagmi';

export const Notifications = () => {
  const router = useRouter();
  const { setSidebarOpen } = useSidebar();
  const { user, setUserNotificationActive } = useUser();
  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const { nftResolver } = useAllContracts();
  const { data: pendingAssociatedProfiles } = usePendingAssociationQuery();
  const { data: profileCustomizationStatus } = useIsProfileCustomized(user?.currentProfileUrl, chain?.id.toString());
  const { data: signer } = useSigner();
  const { totalClaimable: totalClaimableForThisAddress } = useClaimableProfileCount(currentAddress);
  const hasUnclaimedProfiles = totalClaimableForThisAddress > 0;
  const [removedAssociationNotifClicked, setRemovedAssociationNotifClicked] = useState(false);
  const [addedAssociatedNotifClicked, setAddedAssociatedNotifClicked] = useState(false);
  const [pendingAssociationCount, setPendingAssociationCount] = useState(null);

  const { data: acceptedAssociatedProfiles } = useSWR(
    'AcceptedAssociatedProfiles' + currentAddress + user,
    async () => {
      if (!currentAddress) {
        return null;
      }
      return await nftResolver.connect(signer).getApprovedEvm(currentAddress).catch(() => null);
    }
  );
  useEffect(() => {
    const filterAccepted = pendingAssociatedProfiles?.getMyPendingAssociations?.filter(a => !acceptedAssociatedProfiles?.some(b => a.url === b.profileUrl));
    setPendingAssociationCount(filterAccepted?.length || null);
  }, [acceptedAssociatedProfiles, pendingAssociatedProfiles]);

  useEffect(() => {
    if(removedAssociationNotifClicked) {
      setUserNotificationActive('associatedProfileRemoved', false);
    }
    if(addedAssociatedNotifClicked) {
      setUserNotificationActive('associatedProfileAdded', false);
    }
    if(hasUnclaimedProfiles && !user?.activeNotifications.hasUnclaimedProfiles) {
      setUserNotificationActive('hasUnclaimedProfiles', true);
    }
    if(pendingAssociatedProfiles && pendingAssociatedProfiles.getMyPendingAssociations.length > 0 && !user?.activeNotifications.hasPendingAssociatedProfiles ) {
      setUserNotificationActive('hasPendingAssociatedProfiles', true);
    }
    if(profileCustomizationStatus && !profileCustomizationStatus.isProfileCustomized && !user?.activeNotifications.profileNeedsCustomization) {
      setUserNotificationActive('profileNeedsCustomization', true);
    }
  }, [addedAssociatedNotifClicked, hasUnclaimedProfiles, pendingAssociatedProfiles, profileCustomizationStatus, removedAssociationNotifClicked, setUserNotificationActive, user?.activeNotifications, currentAddress, user]);

  return (
    <div className='flex flex-col w-full items-center space-y-4'>
      {
        user?.activeNotifications.hasPendingAssociatedProfiles && !isNullOrEmpty(pendingAssociationCount) && (
          <NotificationButton
            buttonText={`${pendingAssociationCount} NFT Profile Connection request${pendingAssociationCount > 1 ? 's' : ''}`}
            onClick={() => {setSidebarOpen(false); router.push('/app/settings');}}
          />
        )
      }
      {
        user.activeNotifications.associatedProfileRemoved && (
          <NotificationButton
            buttonText={'Associated Profile Removed'}
            onClick={() => {setRemovedAssociationNotifClicked(true);}}
          />
        )
      }
      {
        user.activeNotifications.associatedProfileAdded && (
          <NotificationButton
            buttonText={'Associated Profile Added'}
            onClick={() => {setAddedAssociatedNotifClicked(true);}}
          />
        )
      }
      {
        user?.activeNotifications.profileNeedsCustomization && getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_FACTORY_ENABLED) && (
          <NotificationButton
            buttonText='Your NFT Profile needs attention'
            onClick={() => {console.log('profile customization click');}}
          />
        )
      }
      {
        //TODO: check if user has free mint
      }
      {
        hasUnclaimedProfiles && (
          <NotificationButton
            buttonText={`${totalClaimableForThisAddress} Profile${totalClaimableForThisAddress > 1 ? 's' : ''} Available to Mint`}
            onClick={() => {setSidebarOpen(false); router.push('/app/claim-profiles');}}
          />
        )
      }
    </div>
  );
};