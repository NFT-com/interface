import { useIsProfileCustomized } from 'graphql/hooks/useIsProfileCustomized';
import { usePendingAssociationQuery } from 'graphql/hooks/usePendingAssociationQuery';
import { useSidebar } from 'hooks/state/useSidebar';
import { useUser } from 'hooks/state/useUser';
import { useClaimableProfileCount } from 'hooks/useClaimableProfileCount';

import { NotificationButton } from './NotificationButton';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

export const Notifications = () => {
  const router = useRouter();
  const { setSidebarOpen } = useSidebar();
  const { user, setUserNotificationActive } = useUser();
  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();

  const { data: pendingAssociatedProfiles } = usePendingAssociationQuery();
  const { data: profileCustomizationStatus } = useIsProfileCustomized(user?.currentProfileUrl, chain?.id.toString());

  const { totalClaimable: totalClaimableForThisAddress } = useClaimableProfileCount(currentAddress);
  const hasUnclaimedProfiles = totalClaimableForThisAddress > 0;
  const [removedAssociationNotifClicked, setRemovedAssociationNotifClicked] = useState(false);
  const [addedAssociatedNotifClicked, setAddedAssociatedNotifClicked] = useState(false);

  useEffect(() => {
    if(hasUnclaimedProfiles) {
      setUserNotificationActive('hasUnclaimedProfiles', true);
    }
    if(pendingAssociatedProfiles && pendingAssociatedProfiles.getMyPendingAssociations.length > 0 ) {
      setUserNotificationActive('hasPendingAssociatedProfiles', true);
    }
    if(profileCustomizationStatus && !profileCustomizationStatus.isProfileCustomized) {
      setUserNotificationActive('profileNeedsCustomization', true);
    }
    if(removedAssociationNotifClicked) {
      setUserNotificationActive('associatedProfileRemoved', false);
    }
    if(addedAssociatedNotifClicked) {
      setUserNotificationActive('associatedProfileAdded', false);
    }
  }, [addedAssociatedNotifClicked, hasUnclaimedProfiles, pendingAssociatedProfiles, profileCustomizationStatus, removedAssociationNotifClicked, setUserNotificationActive]);

  return (
    <div className='flex flex-col w-full items-center space-y-4'>
      {
        pendingAssociatedProfiles && pendingAssociatedProfiles.getMyPendingAssociations.length > 0 && (
          <NotificationButton
            buttonText={`${pendingAssociatedProfiles.getMyPendingAssociations.length} NFT Profile Connection request${pendingAssociatedProfiles.getMyPendingAssociations.length > 1 ? 's' : ''}`}
            onClick={() => {setSidebarOpen(false); router.push('/app/settings');}}
            notificationType='pendingAssociatedProfiles'
          />
        )
      }
      {
        user.activeNotifications.associatedProfileRemoved && (
          <NotificationButton
            buttonText={'Associated Profile Removed'}
            onClick={() => {setRemovedAssociationNotifClicked(true);}}
            notificationType='removedAssociatedProfile'
          />
        )
      }
      {
        user.activeNotifications.associatedProfileAdded && (
          <NotificationButton
            buttonText={'Associated Profile Added'}
            onClick={() => {setAddedAssociatedNotifClicked(true);}}
            notificationType='addedAssociatedProfile'
          />
        )
      }
      {
        profileCustomizationStatus && !profileCustomizationStatus.isProfileCustomized && (
          <NotificationButton
            buttonText='Your NFT Profile needs attention'
            onClick={() => {console.log('profile customization click');}}
            notificationType='profileCustomizationStatus'
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
            notificationType='hasUnclaimedProfiles'
          />
        )
      }
    </div>
  );
};