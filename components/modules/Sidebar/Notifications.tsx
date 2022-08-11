import { useIsProfileCustomized } from 'graphql/hooks/useIsProfileCustomized';
import { usePendingAssociationQuery } from 'graphql/hooks/usePendingAssociationQuery';
import { useSidebar } from 'hooks/state/useSidebar';
import { useUser } from 'hooks/state/useUser';
import { useClaimableProfileCount } from 'hooks/useClaimableProfileCount';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';

type NotificationButtonProps = {
  buttonText: string;
  onClick: () => void;
}

const NotificationButton = ({ buttonText, onClick }: NotificationButtonProps) => {
  return (
    <div className='flex flex-row w-full px-4 h-10 rounded-2xl'>
      {//TODO: return notifications from endpoint
      }
      <button className={tw(
        'inline-flex w-full h-full',
        'text-md',
        'leading-6',
        'items-center',
        'justify-center',
        'bg-[#F9D963]',
        'rounded-lg',
        'p-4'
      )}
      onClick={onClick}
      >
        {buttonText}
      </button>
    </div>
  );
};

export const Notifications = () => {
  const router = useRouter();
  const { setSidebarOpen } = useSidebar();
  const { user, setNotificationCount } = useUser();
  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();

  const { data: pendingAssociatedProfiles } = usePendingAssociationQuery();
  const { data: profileCustomizationStatus } = useIsProfileCustomized(user?.currentProfileUrl, chain?.id.toString());

  const { totalClaimable: totalClaimableForThisAddress } = useClaimableProfileCount(currentAddress);
  const hasUnclaimedProfiles = totalClaimableForThisAddress > 0;

  useEffect(() => {
    if(hasUnclaimedProfiles) {
      setNotificationCount(user?.notificationCount + 1);
    }
    if(pendingAssociatedProfiles && pendingAssociatedProfiles.getMyPendingAssociations.length > 0 ) {
      setNotificationCount(user?.notificationCount + 1);
    }
    if(profileCustomizationStatus && !profileCustomizationStatus.isProfileCustomized) {
      setNotificationCount(user?.notificationCount + 1);
    }
    if(hasUnclaimedProfiles) {
      setNotificationCount(user?.notificationCount + 1);
    }
  }, [hasUnclaimedProfiles, pendingAssociatedProfiles, profileCustomizationStatus, setNotificationCount, user]);

  return (
    <div className='flex flex-col w-full items-center space-y-4'>
      {
        pendingAssociatedProfiles && pendingAssociatedProfiles.getMyPendingAssociations.length > 0 && (
          <NotificationButton
            buttonText={`${pendingAssociatedProfiles.getMyPendingAssociations.length} NFT Profile Connection request${pendingAssociatedProfiles.getMyPendingAssociations.length > 1 ? 's' : ''}`}
            onClick={() => {console.log('pending association click');}}
          />
        )
      }
      {
        profileCustomizationStatus && !profileCustomizationStatus.isProfileCustomized && (
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