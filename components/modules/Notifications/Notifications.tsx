import { useCallback, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';
import moment from 'moment';
import { useRouter } from 'next/router';
import { PartialObjectDeep } from 'type-fest/source/partial-deep';
import { useAccount } from 'wagmi';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import {
  ActivityType,
  TxActivity,
  TxLooksrareProtocolData,
  TxSeaportProtocolData,
  TxX2Y2ProtocolData
} from 'graphql/generated/types';
import { useUpdateReadByIdsMutation } from 'graphql/hooks/useUpdateReadByIdsMutation';
import { useSidebar } from 'hooks/state/useSidebar';
import { useUser } from 'hooks/state/useUser';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { Doppler, getEnvBool } from 'utils/env';
import { filterNulls, isNullOrEmpty } from 'utils/format';

import { ExternalProtocol } from 'types';

import NoActivityIcon from 'public/icons/no_activity.svg?svgr';

import { NotificationItem } from './NotificationItem';
import { useNotifications } from './useNotifications';

type NotificationsProps = {
  setVisible: (input: boolean) => void;
};

export const Notifications = ({ setVisible }: NotificationsProps) => {
  const { user } = useUser();
  const context = useNotifications();
  const {
    count,
    activeNotifications,
    pendingAssociationCount,
    hasUnclaimedProfiles,
    totalClaimableForThisAddress,
    setRemovedAssociationNotifClicked,
    setAddedAssociatedNotifClicked,
    expiredActivityDate,
    profileExpiringSoon,
    purchasedNfts,
    soldNfts
  } = context;
  const router = useRouter();
  const { setSidebarOpen } = useSidebar();
  const { getByContractAddress } = useSupportedCurrencies();
  const { address: currentAddress } = useAccount();
  const { updateReadbyIds } = useUpdateReadByIdsMutation();

  const getPriceFields = useCallback(
    (item: PartialObjectDeep<TxActivity, unknown>, type: 'price' | 'currency') => {
      const sale = item.transaction;
      if (sale.protocol === ExternalProtocol.Seaport) {
        const protocolData = sale?.protocolData as TxSeaportProtocolData;
        const sum = protocolData.consideration.reduce((acc, o) => acc + parseInt(o.startAmount), 0);
        const ethAmount = ethers.utils.formatEther(BigInt(sum).toString());
        const currencyData = getByContractAddress(protocolData?.consideration[0].token);
        if (type === 'price') {
          return ethAmount;
        }
        return currencyData.name;
      }
      if (sale.protocol === ExternalProtocol.LooksRare) {
        const protocolData = sale?.protocolData as TxLooksrareProtocolData;
        const ethAmount = ethers.utils.formatEther(protocolData?.price);
        const currencyData = getByContractAddress(protocolData?.currencyAddress);
        if (type === 'price') {
          return ethAmount;
        }
        return currencyData.name;
      }
      if (sale.protocol === ExternalProtocol.X2Y2) {
        const protocolData = sale?.protocolData as TxX2Y2ProtocolData;
        const ethAmount = ethers.utils.formatEther(protocolData?.amount);
        const currencyData = getByContractAddress(protocolData?.currency);
        if (type === 'price') {
          return ethAmount;
        }
        return currencyData.name;
      }
      if (sale.protocol === ExternalProtocol.NFTCOM) {
        const protocolData = sale.protocolData as any;
        const ethAmount = ethers.utils.formatEther(protocolData?.takeAsset[0]?.value ?? 0);
        const currencyData = getByContractAddress(protocolData?.takeAsset[0]?.standard?.contractAddress);
        if (type === 'price') {
          return Number(ethAmount) > 0 ? ethAmount : '';
        }
        return currencyData?.name ?? '';
      }
      if (type === 'price') {
        return null;
      }
      return null;
    },
    [getByContractAddress]
  );

  const purchaseNotifications = !isNullOrEmpty(purchasedNfts)
    ? purchasedNfts.map(nft => {
        const nftId = nft?.nftId[0]?.split('/')[2] ? BigNumber.from(nft?.nftId[0]?.split('/')[2]).toString() : null;
        return {
          text: null,
          nft: {
            nftId,
            collection: nft?.nftContract,
            price: getPriceFields(nft, 'price'),
            currency: getPriceFields(nft, 'currency'),
            type: ActivityType.Purchase
          },
          onClick: () => {
            setVisible(false);
            setSidebarOpen(false);
            !isNullOrEmpty(nftId)
              ? router.push(`/app/nft/${nft.nftContract}/${nftId}`)
              : window.open(`https://etherscan.io/tx/${nft.transaction.transactionHash?.split(':')?.[0]}`, '_blank');
          },
          date: nft?.timestamp
        };
      })
    : [];

  const soldNotifications = !isNullOrEmpty(soldNfts)
    ? soldNfts.map(nft => {
        const nftId = nft?.nftId[0]?.split('/')[2] ? BigNumber.from(nft?.nftId[0]?.split('/')[2]).toString() : null;
        return {
          text: null,
          nft: {
            nftId,
            collection: nft?.nftContract,
            price: getPriceFields(nft, 'price'),
            currency: getPriceFields(nft, 'currency'),
            type: ActivityType.Sale
          },
          onClick: () => {
            setVisible(false);
            setSidebarOpen(false);
            !isNullOrEmpty(nftId)
              ? router.push(`/app/nft/${nft.nftContract}/${nftId}`)
              : window.open(`https://etherscan.io/tx/${nft.transaction.transactionHash?.split(':')?.[0]}`, '_blank');
          },
          date: nft.timestamp
        };
      })
    : [];

  const notificationData = [
    profileExpiringSoon
      ? {
          text: `Your licensing for your Profile ${user?.currentProfileUrl} is going to expire soon! Renew here`,
          nft: null,
          onClick: () => {
            setVisible(false);
            setSidebarOpen(false);
            router.push('/app/settings');
          },
          date: null
        }
      : null,
    activeNotifications.hasExpiredListings
      ? {
          text: getEnvBool(Doppler.NEXT_PUBLIC_ACTIVITY_PAGE_ENABLED)
            ? 'Listing Expired. View My Activity'
            : 'Listing Expired.',
          nft: null,
          onClick: () => {
            setVisible(false);
            setSidebarOpen(false);
            getEnvBool(Doppler.NEXT_PUBLIC_ACTIVITY_PAGE_ENABLED) && router.push('/app/activity');
          },
          date: expiredActivityDate
        }
      : null,
    activeNotifications.hasPendingAssociatedProfiles && pendingAssociationCount > 0
      ? {
          text: `${pendingAssociationCount} NFT Profile Connection request${pendingAssociationCount > 1 ? 's' : ''}`,
          nft: null,
          onClick: () => {
            setVisible(false);
            setSidebarOpen(false);
            router.push('/app/settings');
          },
          date: null
        }
      : null,
    activeNotifications.associatedProfileRemoved
      ? {
          text: 'Associated Profile Removed',
          nft: null,
          onClick: () => {
            setRemovedAssociationNotifClicked(true);
            setVisible(false);
          },
          date: null
        }
      : null,
    activeNotifications.associatedProfileAdded
      ? {
          text: 'Associated Profile Added',
          nft: null,
          onClick: () => {
            setAddedAssociatedNotifClicked(true);
            setVisible(false);
          },
          date: null
        }
      : null,
    activeNotifications.profileNeedsCustomization
      ? {
          text: 'Your NFT Profile needs attention',
          nft: null,
          onClick: () => {
            setVisible(false);
            router.push(`/${user?.currentProfileUrl}`);
          },
          date: null
        }
      : null,
    hasUnclaimedProfiles
      ? {
          text: `${totalClaimableForThisAddress} Profile${
            totalClaimableForThisAddress > 1 ? 's' : ''
          } Available to Mint`,
          nft: null,
          onClick: () => {
            setVisible(false);
            setSidebarOpen(false);
            router.push('/app/mint-profiles');
          },
          date: null
        }
      : null
  ];

  // Sets activities to read
  useEffect(() => {
    if (soldNfts.length || purchasedNfts?.length || activeNotifications.hasExpiredListings) {
      updateReadbyIds({ ids: [] });
    }
  }, [updateReadbyIds, soldNfts.length, purchasedNfts?.length, activeNotifications.hasExpiredListings, currentAddress]);

  return (
    <>
      <div className='mb-5 w-full font-noi-grotesk text-3xl'>Notifications</div>

      {!count ? (
        <div className='flex flex-col items-center justify-center'>
          <NoActivityIcon className='mx-auto my-2 w-[80%]' />
          <div className='my-5 text-[22px] font-semibold text-[#4D4D4D]'>No activity so far</div>
          <div className='text-center text-[14px] font-medium text-[#4D4D4D]'>
            You’ll see here the offers to your listed NFTs and when other owners accept of decline your made offers.
          </div>
          <div className='my-8 w-[100px] border-b border-[#ECECEC]' />
          <div className='font-semi-bold mb-6 text-center text-[16px] text-black'>
            Start your collection by buying your first NFT
          </div>
          <Button
            type={ButtonType.PRIMARY}
            size={ButtonSize.LARGE}
            label='Start your collection'
            onClick={() => router.push('/app/discover/nfts')}
          />
        </div>
      ) : (
        <div className='flex max-h-screen w-full flex-col items-center overflow-auto minlg:max-h-[350px]'>
          {filterNulls([...notificationData, ...purchaseNotifications, ...soldNotifications])
            .sort((a, b) => moment(b.date).diff(a.date))
            .map((item, index) => (
              <NotificationItem
                key={index}
                buttonText={item.text}
                date={item.date}
                onClick={item.onClick}
                nft={item?.nft ?? null}
              />
            ))}
        </div>
      )}
    </>
  );
};
