import { NotificationContext } from 'components/modules/Notifications/NotificationContext';
import { useSidebar } from 'hooks/state/useSidebar';
import { useUser } from 'hooks/state/useUser';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';

import { NotificationButton } from './NotificationButton';

import { BigNumber, ethers } from 'ethers';
import moment from 'moment';
import { useRouter } from 'next/router';
import NoActivityIcon from 'public/no_activity.svg';
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
    profileExpiringSoon,
    purchasedNfts,
    setPurchasedNfts
  } = useContext(NotificationContext);
  const router = useRouter();
  const { setSidebarOpen } = useSidebar();
  const { getByContractAddress } = useSupportedCurrencies();

  const purchaseNotifications = !isNullOrEmpty(purchasedNfts) ?
    purchasedNfts.map((purchase) => (
      {
        text: `You purchased ${purchase.nft.metadata.name} for ${ethers.utils.formatEther(BigNumber.from(purchase.price))} ${getByContractAddress(purchase.currency)?.name}.`,
        onClick: () => {
          setVisible(false);
          setSidebarOpen(false);
          router.push(`/app/nft/${purchase.nft.contract}/${purchase.nft.tokenId}`);
          setPurchasedNfts([]);
        },
        date: null
      }
    ))
    : [];

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
        date: null
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
        date: null
      }
      : null,
  ];

  return (
    <>
      <div className='w-full text-3xl font-noi-grotesk mb-5'>
        Notifications
      </div>

      {!count ?
        <div className='flex flex-col items-center justify-center'>
          <NoActivityIcon className='mx-auto w-[80%] my-2' />
          <div className='text-[#4D4D4D] font-semibold text-[22px] my-5'>No activity so far</div>
          <div className='text-center text-[#4D4D4D] text-[14px] font-medium'>
            You’ll see here the offers to your listed NFTs and when other owners accept of decline your made offers.
          </div>
          <div className='w-[100px] border-b border-[#ECECEC] my-8' />
          <div className='text-center text-black text-[16px] font-semi-bold'>Start your collection by buying your first NFT</div>
          <button onClick={() => router.push('/app/discover/nfts')} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[12px] focus:outline-none w-full mt-6" type="button">
            Start your collection
          </button>
        </div>
        :
        <div className='flex flex-col w-full items-center'>
          {filterNulls([...notificationData, ...purchaseNotifications]).sort((a, b) => moment(b.date, 'MM-DD-YYYY').diff(moment(a.date, 'MM-DD-YYYY'))).map((item, index) => (
            <NotificationButton
              key={index}
              buttonText={item.text}
              date={item.date}
              onClick={item.onClick}
            />
          ))}
        </div>
      }
    </>
  );
};