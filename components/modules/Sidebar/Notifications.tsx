import { NotificationContext } from 'components/modules/Notifications/NotificationContext';
import { useSidebar } from 'hooks/state/useSidebar';
import { Doppler, getEnvBool } from 'utils/env';

import { NotificationButton } from './NotificationButton';

import { useRouter } from 'next/router';
import { useContext } from 'react';

export const Notifications = () => {
  const {
    count,
    activeNotifications,
    pendingAssociationCount,
    hasUnclaimedProfiles,
    totalClaimableForThisAddress,
    setRemovedAssociationNotifClicked,
    setAddedAssociatedNotifClicked
  } = useContext(NotificationContext);
  const router = useRouter();
  const { setSidebarOpen } = useSidebar();

  return (
    <>
      {count > 0 &&
      <div className='flex flex-row w-full h-8 bg-[#F8F8F8] pr-12 pl-4 mb-4 items-center font-semibold text-base leading-6 text-[#6F6F6F]'>
        Notifications
      </div>
      }
      
      <div className='flex flex-col w-full items-center space-y-4'>
        {
          activeNotifications.hasPendingAssociatedProfiles && pendingAssociationCount > 0 && (
            <NotificationButton
              buttonText={`${pendingAssociationCount} NFT Profile Connection request${pendingAssociationCount > 1 ? 's' : ''}`}
              onClick={() => {setSidebarOpen(false); router.push('/app/settings');}}
            />
          )
        }
        {
          activeNotifications.associatedProfileRemoved && (
            <NotificationButton
              buttonText={'Associated Profile Removed'}
              onClick={() => {setRemovedAssociationNotifClicked(true);}}
            />
          )
        }
        {
          activeNotifications.associatedProfileAdded && (
            <NotificationButton
              buttonText={'Associated Profile Added'}
              onClick={() => {setAddedAssociatedNotifClicked(true);}}
            />
          )
        }
        {
          activeNotifications.profileNeedsCustomization && getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_FACTORY_ENABLED) && (
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
    </>
  );
};