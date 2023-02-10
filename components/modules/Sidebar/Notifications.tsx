import { NotificationContext } from 'components/modules/Notifications/NotificationContext';
import { useSidebar } from 'hooks/state/useSidebar';
import { useUser } from 'hooks/state/useUser';
import { filterNulls } from 'utils/helpers';

import { NotificationButton } from './NotificationButton';

import moment from 'moment';
import { useRouter } from 'next/router';
import { useContext } from 'react';

type NotificationsProps = {
  setVisible: (input:boolean) => void;
};

export const Notifications = ({ setVisible }: NotificationsProps) => {
  const { user } = useUser();
  const {
    count,
    activeNotifications,
    pendingAssociationCount,
    hasUnclaimedProfiles,
    totalClaimableForThisAddress,
    setRemovedAssociationNotifClicked,
    setAddedAssociatedNotifClicked,
    soldActivityDate,
    expiredActivityDate,
    profileExpiringSoon
  } = useContext(NotificationContext);
  const router = useRouter();
  const { setSidebarOpen } = useSidebar();

  const notificationData = [
    profileExpiringSoon ?
      {
        text: `Your licensing for your Profile ${user?.currentProfileUrl} is going to expire soon! Renew here`,
        onClick: () => {
          setVisible(false);
          setSidebarOpen(false);
          router.push('/app/settings');
        },
        date:  null
      }
      : null,
    activeNotifications.hasSoldActivity ?
      {
        text: 'NFT Sold! View My Activity',
        onClick: () => {
          setVisible(false);
          setSidebarOpen(false);
          router.push('/app/activity');
        },
        date:  soldActivityDate
      }
      : null,
    activeNotifications.hasExpiredListings ?
      {
        text: 'Listing Expired. View My Activity',
        onClick: () => {
          setVisible(false);
          setSidebarOpen(false);
          router.push('/app/activity');
        },
        date:  expiredActivityDate
      }
      : null,
    activeNotifications.hasPendingAssociatedProfiles && pendingAssociationCount > 0 ?
      {
        text: `${pendingAssociationCount} NFT Profile Connection request${pendingAssociationCount > 1 ? 's' : ''}`,
        onClick: () => {
          setVisible(false);
          setSidebarOpen(false);
          router.push('/app/settings');
        },
        date:  null
      }
      : null,
    activeNotifications.associatedProfileRemoved ?
      {
        text: 'Associated Profile Removed',
        onClick: () => {
          setRemovedAssociationNotifClicked(true);
          setVisible(false);
        },
        date: null
      }
      : null,
    activeNotifications.associatedProfileAdded ?
      {
        text: 'Associated Profile Added',
        onClick: () => {
          setAddedAssociatedNotifClicked(true);
          setVisible(false);
        },
        date: null
      }
      : null,
    activeNotifications.profileNeedsCustomization ?
      {
        text: 'Your NFT Profile needs attention',
        onClick: () => {
          console.log('profile customization click');
          setVisible(false);
        },
        date: '09/15/2022'
      }
      : null,
    hasUnclaimedProfiles ?
      {
        text: `${totalClaimableForThisAddress} Profile${totalClaimableForThisAddress > 1 ? 's' : ''} Available to Mint`,
        onClick: () => {
          setVisible(false);
          setSidebarOpen(false);
          router.push('/app/mint-profiles');
        },
        date: '09/15/2022'
      }
      : null,
  ];

  return (
    <>
      <div className='w-full text-4xl font-bold mb-12'>
        Notifications
      </div>

      {!count ?
        <p>
          No new notifications
        </p>
        :
        <div className='flex flex-col w-full items-center space-y-4'>
          {filterNulls(notificationData).sort((a, b) => moment(b.date, 'MM-DD-YYYY').diff(moment(a.date, 'MM-DD-YYYY'))).map((item, index) => (
            <NotificationButton
              key={index}
              buttonText={item.text}
              date={item.date}
              onClick={item.onClick}
              bgColor={index % 2 === 0 ? 'grey' : 'white' }
            />
          ))}
        </div>
      }
    </>
  );
};