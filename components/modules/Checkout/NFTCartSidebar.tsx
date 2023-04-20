import { useContext, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { X } from 'phosphor-react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { Tabs } from 'components/elements/Tabs';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { filterNulls } from 'utils/format';
import { tw } from 'utils/tw';

import { CartSidebarNft } from './CartSidebarNft';
import { NFTListingsContext, StagedListing } from './NFTListingsContext';
import { NFTPurchasesContext, StagedPurchase } from './NFTPurchaseContext';
import { PurchaseSummary } from './PurchaseSummary';

export type CartSidebarTab = 'Buy' | 'Sell';

export interface NFTCartSidebarProps {
  selectedTab: CartSidebarTab;
  onChangeTab: (selectedTab: CartSidebarTab) => void;
}

export function NFTCartSidebar(props: NFTCartSidebarProps) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(true);

  const { toggleCartSidebar, toList, clear: clearListings, removeListing } = useContext(NFTListingsContext);

  const { toBuy, clear: clearPurchases, removePurchase, togglePurchaseSummaryModal } = useContext(NFTPurchasesContext);

  const stagedNFTs = filterNulls<StagedListing | StagedPurchase>(props.selectedTab === 'Sell' ? toList : toBuy);

  const sidebarRef = useRef();
  useOutsideClickAlerter(sidebarRef, () => toggleCartSidebar());

  const initialHeight = stagedNFTs.length < 4 ? 'min-h-fit' : 'min-h-[19rem]';

  const tabs = [
    {
      label: 'Buy',
      labelChild: (
        <span
          className={tw(
            'ml-2 flex h-5 w-5 items-center justify-center justify-self-center rounded-full text-sm',
            props?.selectedTab === 'Buy' ? 'bg-white text-black' : 'bg-[#6F6F6F] text-white'
          )}
        >
          {toBuy.length}
        </span>
      )
    },
    {
      label: 'Sell',
      labelChild: (
        <span
          className={tw(
            'ml-2 flex h-5 w-5 items-center justify-center justify-self-center rounded-full text-sm',
            props?.selectedTab === 'Sell' ? 'bg-white text-black' : 'bg-[#6F6F6F] text-white'
          )}
        >
          {toList.length}
        </span>
      )
    }
  ];

  return (
    <>
      <div className='fixed inset-0 z-[105] h-screen w-screen bg-gray-900 bg-opacity-20 backdrop-blur '></div>
      <div
        ref={sidebarRef}
        className='fixed right-0 z-[106] flex h-full w-full grow flex-col overflow-y-scroll bg-white pt-20 drop-shadow-md minmd:max-w-sm'
      >
        <div className='flex w-full items-center justify-between px-5 py-9'>
          <span className='font-noi-grotesk text-xl font-semibold'>My Cart</span>
          <div className='w-6'>
            <X
              onClick={() => toggleCartSidebar()}
              className='hover:cursor-pointer'
              weight='fill'
              size={27}
              color='black'
            />
          </div>
        </div>
        <div className='w-full px-5'>
          <Tabs onTabChange={props?.onChangeTab} tabOptions={tabs} defaultTab={props.selectedTab === 'Buy' ? 0 : 1} />
        </div>
        <div className='flex w-full items-center justify-between px-5 py-6 font-noi-grotesk font-semibold'>
          <span>{stagedNFTs.length} items</span>
          <div className='flex items-end justify-between font-noi-grotesk font-semibold'>
            {stagedNFTs?.length > 0 && (
              <span
                className='cursor-pointer text-base hover:underline'
                onClick={() => {
                  if (props.selectedTab === 'Sell') {
                    clearListings();
                  } else {
                    clearPurchases();
                  }
                }}
              >
                {props.selectedTab === 'Buy' ? 'Clear Buy' : 'Clear Sell'}
              </span>
            )}
          </div>
        </div>
        <div
          className={tw(
            'pr-2',
            !showAll
              ? 'hideScroll max-h-[30rem] min-h-[24rem] overflow-y-scroll'
              : `${initialHeight} ${stagedNFTs.length > 3 && 'overflow-y-hidden'}`
          )}
        >
          {stagedNFTs.map((stagedItem, index) => {
            return (
              <CartSidebarNft
                item={stagedItem}
                selectedTab={props.selectedTab}
                key={index}
                onRemove={() => {
                  if (props.selectedTab === 'Sell') {
                    removeListing(stagedItem.nft);
                  } else {
                    removePurchase(stagedItem.nft);
                  }
                }}
              />
            );
          })}
        </div>
        {stagedNFTs?.length > 3 && (
          <span
            className='mt-2 cursor-pointer self-center font-noi-grotesk text-base font-medium hover:underline'
            onClick={() => {
              setShowAll(!showAll);
            }}
          >
            {showAll ? 'Show all' : 'Show less'}
          </span>
        )}
        {stagedNFTs.length > 0 && props.selectedTab === 'Buy' ? <PurchaseSummary /> : null}
        {stagedNFTs.length > 0 &&
          props.selectedTab === 'Sell' &&
          !(router.pathname.includes('/app/list') && props.selectedTab === 'Sell') && (
            <div className='mx-7 my-4 flex'>
              <Button
                size={ButtonSize.LARGE}
                stretch
                label={props.selectedTab === 'Sell' ? 'Prepare Listings' : 'Buy now'}
                onClick={() => {
                  if (props.selectedTab === 'Sell') {
                    toggleCartSidebar();
                    router.push('/app/list');
                  } else {
                    togglePurchaseSummaryModal();
                  }
                }}
                type={ButtonType.PRIMARY}
              />
            </div>
          )}
      </div>
    </>
  );
}
