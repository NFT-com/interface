import { Button, ButtonType } from 'components/elements/Button';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { filterNulls } from 'utils/helpers';
import { tw } from 'utils/tw';

import { CartSidebarNft } from './CartSidebarNft';
import { NFTListingsContext, StagedListing } from './NFTListingsContext';
import { NFTPurchasesContext, StagedPurchase } from './NFTPurchaseContext';
import { PurchaseSummary } from './PurchaseSummary';

import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import { X } from 'phosphor-react';
import { useContext, useRef, useState } from 'react';

export type CartSidebarTab = 'Buy' | 'Sell';

const cartTabTypes = {
  0: 'Buy',
  1: 'Sell'
};

export interface NFTCartSidebarProps {
  selectedTab: CartSidebarTab;
  onChangeTab: (selectedTab: CartSidebarTab) => void;
}

export function NFTCartSidebar(props: NFTCartSidebarProps) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(true);

  const {
    toggleCartSidebar,
    toList,
    clear: clearListings,
    removeListing
  } = useContext(NFTListingsContext);

  const {
    toBuy,
    clear: clearPurchases,
    removePurchase,
    togglePurchaseSummaryModal
  } = useContext(NFTPurchasesContext);

  const stagedNFTs = filterNulls<StagedListing | StagedPurchase>(props.selectedTab === 'Sell' ? toList : toBuy);

  const sidebarRef = useRef();
  useOutsideClickAlerter(sidebarRef, () => toggleCartSidebar());

  return (
    <>
      <div className='fixed inset-0 z-[105] w-screen h-screen backdrop-blur bg-gray-900 bg-opacity-20 '></div>
      <div ref={sidebarRef} className={tw(
        'z-[106] fixed pt-20 right-0 w-full h-full minmd:max-w-sm bg-white flex flex-col grow drop-shadow-md',
        !showAll ? 'overflow-y-scroll' : ''
      )}>
        <div className='flex items-center justify-between w-full px-5 py-9'>
          <span className="text-xl font-semibold font-noi-grotesk">My Cart</span>
          <div className='w-6'>
            <X onClick={() => toggleCartSidebar()} className='hover:cursor-pointer' weight="fill" size={27} color="black" />
          </div>
        </div>
        <div className='w-full px-5'>
          <Tab.Group onChange={(index) => props.onChangeTab(cartTabTypes[index])} selectedIndex={props.selectedTab === 'Buy' ? 0 : 1}>
            <Tab.List className="flex rounded-3xl bg-[#F6F6F6]">
              {['Buy', 'Sell'].map((detailTab, index) => (
                <Tab
                  key={detailTab}
                  className={({ selected }) =>
                    tw(
                      'flex items-center justify-center w-1/2 rounded-3xl py-2.5 text-[#6F6F6F] font-grotesk text-base font-semibold leading-6',
                      selected && 'bg-black text-[#F8F8F8]'
                    )
                  }
                >
                  <span className='font-semibold ml-2'>{cartTabTypes[index]}</span>
                  <div
                    className={tw(
                      'rounded-full h-5 w-5 flex items-center justify-center text-sm ml-2 justify-self-center',
                      cartTabTypes[index] === props.selectedTab ? 'bg-white text-black' : 'bg-[#6F6F6F] text-white'
                    )}>
                    {(cartTabTypes[index] === 'Buy' ? toBuy : toList).length}
                  </div>
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
        </div>
        <div className='flex items-center justify-between w-full font-semibold font-noi-grotesk px-5 py-6'>
          <span>{stagedNFTs.length} items</span>
          <div className="flex font-semibold font-noi-grotesk items-end justify-between">
            {stagedNFTs?.length > 0 && <span
              className="text-base cursor-pointer hover:underline"
              onClick={() => {
                if (props.selectedTab === 'Sell') {
                  clearListings();
                } else {
                  clearPurchases();
                }
              }}
            >
              {props.selectedTab === 'Buy' ? 'Clear Buy' : 'Clear Sell'}
            </span>}
          </div>
        </div>
        <div className={tw(
          'pr-2',
          !showAll ? 'max-h-[30rem] min-h-[24rem] overflow-y-scroll hideScroll' : 'max-h-[17.3rem] overflow-y-hidden')}>
          {stagedNFTs.map((stagedItem, index) => {
            return <CartSidebarNft
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
            />;
          })}
        </div>
        {stagedNFTs?.length > 3 && <span
          className="text-base cursor-pointer hover:underline font-medium font-noi-grotesk self-center mt-2"
          onClick={() => {
            setShowAll(!showAll);
          }}
        >
          {showAll ? 'Show all' : 'Show less'}
        </span>}
        {stagedNFTs.length > 0 && props.selectedTab === 'Buy' ? <PurchaseSummary /> : null}
        {(stagedNFTs.length > 0 && props.selectedTab === 'Sell' &&
      !(router.pathname.includes('/app/list') && props.selectedTab === 'Sell')
        ) && <div className="mx-7 my-4 flex">
          <Button
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
        </div>}
      </div>
    </>
  );
}