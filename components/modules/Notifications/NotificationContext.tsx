import { useIsProfileCustomized } from 'graphql/hooks/useIsProfileCustomized';
import { usePendingAssociationQuery } from 'graphql/hooks/usePendingAssociationQuery';
import { useSaleActivitiesQuery } from 'graphql/hooks/useSaleActivitiesQuery';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useUser } from 'hooks/state/useUser';
import { useClaimableProfileCount } from 'hooks/useClaimableProfileCount';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { UserNotifications } from 'types';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';

import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useAccount } from 'wagmi';

export interface NotificationContextType {
  count: number,
  activeNotifications: {
    hasUnclaimedProfiles: boolean,
    hasPendingAssociatedProfiles: boolean,
    profileNeedsCustomization: boolean,
    associatedProfileAdded: boolean,
    associatedProfileRemoved: boolean,
    hasSoldActivity: boolean
  },
  setUserNotificationActive: (notification: keyof UserNotifications, notificationValue: boolean) => void,
  pendingAssociationCount: number,
  hasUnclaimedProfiles: boolean,
  totalClaimableForThisAddress: number,
  setRemovedAssociationNotifClicked: (input: boolean) => void,
  setAddedAssociatedNotifClicked: (input: boolean) => void,
  soldActivityDate: string,
}

export const NotificationContext = React.createContext<NotificationContextType>({
  count: 0,
  activeNotifications: {
    hasUnclaimedProfiles: false,
    hasPendingAssociatedProfiles: false,
    profileNeedsCustomization: false,
    associatedProfileAdded: false,
    associatedProfileRemoved: false,
    hasSoldActivity: false
  },
  setUserNotificationActive: () => null,
  pendingAssociationCount: 0,
  hasUnclaimedProfiles: false,
  totalClaimableForThisAddress: 0,
  setRemovedAssociationNotifClicked: () => null,
  setAddedAssociatedNotifClicked: () => null,
  soldActivityDate: null
});

export function NotificationContextProvider(
  props: PropsWithChildren
) {
  const { address: currentAddress } = useAccount();
  const { user } = useUser();
  const defaultChainId = useDefaultChainId();
  const { nftResolver } = useAllContracts();
  const { data: pendingAssociatedProfiles } = usePendingAssociationQuery();
  const { data: profileCustomizationStatus } = useIsProfileCustomized(user?.currentProfileUrl, defaultChainId.toString());
  const { totalClaimable: totalClaimableForThisAddress } = useClaimableProfileCount(currentAddress);
  const { data: saleActivities } = useSaleActivitiesQuery(
    currentAddress,
    defaultChainId,
  );
  const hasUnclaimedProfiles = totalClaimableForThisAddress > 0;

  // Notification State
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState({
    hasUnclaimedProfiles: false,
    hasPendingAssociatedProfiles: false,
    profileNeedsCustomization: false,
    associatedProfileAdded: false,
    associatedProfileRemoved: false,
    hasSoldActivity: false
  });
  const [removedAssociationNotifClicked, setRemovedAssociationNotifClicked] = useState(false);
  const [addedAssociatedNotifClicked, setAddedAssociatedNotifClicked] = useState(false);
  const [pendingAssociationCount, setPendingAssociationCount] = useState(null);
  const [soldActivityDate, setSoldActivityDate] = useState(null);

  const setUserNotificationActive = useCallback((notification: keyof UserNotifications, notificationValue: boolean) => {
    setNotifications({
      ...notifications,
      [notification]: notificationValue
    }
    );
  },[notifications]);

  const fetchAssociatedProfiles = useCallback(
    async () => {
      if (!currentAddress) {
        return null;
      }
      return await nftResolver.getApprovedEvm(currentAddress).catch(() => null);
    }
    , [currentAddress, nftResolver]
  );

  const { data: acceptedAssociatedProfiles } = useSWR(
    'AcceptedAssociatedProfiles' + currentAddress + user,
    fetchAssociatedProfiles
  );

  useEffect(() => {
    let amt = 0;
    for (const key in notifications) {
      if (notifications[key]) {
        setCount(amt++);
      }
    }
    setCount(amt);
  }, [notifications]);

  useEffect(() => {
    if(!isNullOrEmpty(pendingAssociatedProfiles?.getMyPendingAssociations) && acceptedAssociatedProfiles !== null){
      const filterAccepted = pendingAssociatedProfiles?.getMyPendingAssociations?.filter(a => !acceptedAssociatedProfiles?.some(b => a.url === b.profileUrl));
      setPendingAssociationCount(filterAccepted?.length || 0);
    }
  }, [acceptedAssociatedProfiles, pendingAssociatedProfiles]);

  useEffect(() => {
    if(removedAssociationNotifClicked) {
      setUserNotificationActive('associatedProfileRemoved', false);
    }
    if(addedAssociatedNotifClicked) {
      setUserNotificationActive('associatedProfileAdded', false);
    }
    if(!hasUnclaimedProfiles && notifications.hasUnclaimedProfiles) {
      setUserNotificationActive('hasUnclaimedProfiles', false);
    }
    if(hasUnclaimedProfiles && !notifications.hasUnclaimedProfiles) {
      setUserNotificationActive('hasUnclaimedProfiles', true);
    }
    if((isNullOrEmpty(pendingAssociationCount) || pendingAssociationCount === 0) && notifications.hasPendingAssociatedProfiles){
      setUserNotificationActive('hasPendingAssociatedProfiles', false);
    }
    if(pendingAssociationCount && pendingAssociationCount > 0 && !notifications.hasPendingAssociatedProfiles ) {
      setUserNotificationActive('hasPendingAssociatedProfiles', true);
    }
    if(profileCustomizationStatus && !profileCustomizationStatus.isProfileCustomized && !notifications.profileNeedsCustomization && getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_FACTORY_ENABLED)) {
      setUserNotificationActive('profileNeedsCustomization', true);
    }
    if(profileCustomizationStatus && profileCustomizationStatus.isProfileCustomized && notifications.profileNeedsCustomization) {
      setUserNotificationActive('profileNeedsCustomization', false);
    }
    if(saleActivities && saleActivities.length > 0 && !notifications.hasSoldActivity && getEnvBool(Doppler.NEXT_PUBLIC_ROUTER_ENABLED)) {
      setUserNotificationActive('hasSoldActivity', true);
      setSoldActivityDate(saleActivities[0].timestamp);
    }
    if((isNullOrEmpty(saleActivities) || saleActivities.length === 0) && notifications.hasSoldActivity && getEnvBool(Doppler.NEXT_PUBLIC_ROUTER_ENABLED)){
      setUserNotificationActive('hasSoldActivity', false);
      setSoldActivityDate(null);
    }
  }, [addedAssociatedNotifClicked, hasUnclaimedProfiles, pendingAssociatedProfiles, profileCustomizationStatus, removedAssociationNotifClicked, setUserNotificationActive, currentAddress, pendingAssociationCount, notifications, saleActivities]);

  return (
    <NotificationContext.Provider
      value={{
        count: count,
        activeNotifications: notifications,
        setUserNotificationActive: (notification: keyof UserNotifications, notificationValue: boolean) => {
          setUserNotificationActive(notification, notificationValue);
        },
        pendingAssociationCount: pendingAssociationCount,
        hasUnclaimedProfiles: hasUnclaimedProfiles,
        totalClaimableForThisAddress: totalClaimableForThisAddress,
        setRemovedAssociationNotifClicked: (input: boolean) => {
          setRemovedAssociationNotifClicked(input);
        },
        setAddedAssociatedNotifClicked: (input: boolean) => {
          setAddedAssociatedNotifClicked(input);
        },
        soldActivityDate: soldActivityDate
      }}>
      {props.children}
    </NotificationContext.Provider>);
}