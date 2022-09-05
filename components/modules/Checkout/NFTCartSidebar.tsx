import { Button, ButtonType } from 'components/elements/Button';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { filterNulls } from 'utils/helpers';
import { tw } from 'utils/tw';

import { CartSidebarNft } from './CartSidebarNft';
import { NFTListingsContext, StagedListing } from './NFTListingsContext';
import { NFTPurchasesContext, StagedPurchase } from './NFTPurchaseContext';

import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import { XCircle } from 'phosphor-react';
import { useContext, useRef } from 'react';

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
  
  const {
    toggleCartSidebar,
    toList,
    clear: clearListings,
    removeListing
  } = useContext(NFTListingsContext);

  const {
    toBuy,
    clear: clearPurchases,
    removePurchase
  } = useContext(NFTPurchasesContext);

  const stagedNFTs = filterNulls<StagedListing | StagedPurchase>(props.selectedTab === 'Sell' ? toList : toBuy);

  const sidebarRef = useRef();
  useOutsideClickAlerter(sidebarRef, () => toggleCartSidebar());

  return (
    <div ref={sidebarRef} className={tw(
      'z-50 fixed pt-20 right-0 w-full h-full minmd:max-w-md bg-white flex flex-col grow',
      'drop-shadow-md'
    )}>
      <div className="absolute top-24 right-4 h-10 w-10 flex items-center justify-center">
        <div className='absolute hover:cursor-pointer h-8 w-8 bg-[#f9d963] rounded-full'></div>
        <XCircle onClick={() => toggleCartSidebar()} className='absolute hover:cursor-pointer' size={40} color="black" weight="fill" />
      </div>
      <div className="flex px-4 mt-24 font-bold font-grotesk items-end justify-between">
        <span className="text-4xl">My Cart</span>
        {stagedNFTs?.length > 0 && <span
          className="text-base text-link-yellow cursor-pointer hover:underline"
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
      <div className='w-full px-4 mt-10'>
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
                <span className='font-semibold'>{cartTabTypes[index]}</span>
                <div
                  className={tw(
                    'rounded-full h-4 w-4 flex items-center justify-center text-sm ml-2',
                    cartTabTypes[index] === props.selectedTab ? 'bg-white text-black' : 'bg-[#6F6F6F] text-white'
                  )}>
                  {(cartTabTypes[index] === 'Buy' ? toBuy : toList).length}
                </div>
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
      {stagedNFTs.map((stagedItem, index) => {
        return <CartSidebarNft
          item={stagedItem}
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
      {(stagedNFTs.length > 0 &&
        !(router.pathname.includes('/app/list') && props.selectedTab === 'Sell') &&
        !(router.pathname.includes('/app/buy') && props.selectedTab === 'Buy')
      ) && <div className="mx-8 my-4 flex">
        <Button
          stretch
          label={props.selectedTab === 'Sell' ? 'Prepare Listings' : 'Continue to Buy'}
          onClick={() => {
            toggleCartSidebar();
            router.push(props.selectedTab === 'Sell' ? '/app/list' : '/app/buy');
          }}
          type={ButtonType.PRIMARY}
        />
      </div>}
    </div>
  );
}