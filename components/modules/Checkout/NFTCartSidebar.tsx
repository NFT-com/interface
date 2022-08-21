import { Button, ButtonType } from 'components/elements/Button';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { filterNulls } from 'utils/helpers';
import { tw } from 'utils/tw';

import { CartSidebarNft } from './CartSidebarNft';
import { NFTListingsCartSidebarSummary } from './NFTListingsCartSidebarSummary';
import { NFTListingsContext, StagedListing } from './NFTListingsContext';
import { NFTPurchasesContext, StagedPurchase } from './NFTPurchaseContext';

import { useRouter } from 'next/router';
import { XCircle } from 'phosphor-react';
import { useContext, useRef, useState } from 'react';

export function NFTCartSidebar() {
  const router = useRouter();

  // todo: remove this page-specific logic, we want to move the summary out of the cart to the main page content now.
  const showSummary = router.pathname.includes('/list');

  const [selectedTab, setSelectedTab] = useState<'sell' | 'buy'>('buy');
  
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

  const stagedNFTs = filterNulls<StagedListing | StagedPurchase>(selectedTab === 'sell' ? toList : toBuy);

  const sidebarRef = useRef();
  useOutsideClickAlerter(sidebarRef, () => toggleCartSidebar());

  return (
    <div ref={sidebarRef} className={tw(
      'z-50 absolute pt-20 right-0 w-full h-full minmd:max-w-md bg-white flex flex-col grow',
      'drop-shadow-md'
    )}>
      <div className='flex flex-row items-center px-8 my-8'>
        <div className='flex items-center w-full'>
          <p
            onClick={() => {setSelectedTab('buy');}}
            className={tw(
              'text-2xl mr-4 cursor-pointer',
              selectedTab === 'buy' ? 'text-primary-txt underline' : 'text-secondary-txt'
            )}>
            Buy
          </p>
          <p
            onClick={() => {setSelectedTab('sell');}}
            className={tw(
              'text-2xl cursor-pointer',
              selectedTab === 'sell' ? 'text-primary-txt underline' : 'text-secondary-txt'
            )}>
            Sell
          </p>
        </div>
        <XCircle onClick={() => toggleCartSidebar()} className='hover:cursor-pointer' size={32} color="black" weight="fill" />
      </div>
      <div className='flex px-8 mb-4'>
        <span>
          {showSummary && 'Summary and fees for '}{stagedNFTs.length} NFT{stagedNFTs.length > 1 || stagedNFTs.length === 0 ? 's' : ''}
        </span>
        {!showSummary && stagedNFTs?.length > 0 && <span
          className='ml-8 cursor-pointer hover:underline text-link'
          onClick={() => {
            if (selectedTab === 'sell') {
              clearListings();
            } else {
              clearPurchases();
            }
          }}
        >
          Clear
        </span>}
      </div>
      {showSummary
        ? <NFTListingsCartSidebarSummary />
        : <>
          {stagedNFTs.map((stagedItem, index) => {
            return <CartSidebarNft
              nft={stagedItem?.nft}
              key={index}
              onRemove={() => {
                if (selectedTab === 'sell') {
                  removeListing(stagedItem.nft);
                } else {
                  removePurchase(stagedItem.nft);
                }
              }}
            />;
          })}
          {(stagedNFTs.length > 0) && <div className="mx-8 my-4 flex">
            <Button
              stretch
              label={`Proceed to ${selectedTab === 'sell' ? 'List' : 'Buy'}`}
              onClick={() => {
                toggleCartSidebar();
                router.push(selectedTab === 'sell' ? '/app/list' : '/app/buy');
              }}
              type={ButtonType.PRIMARY}
            />
          </div>}
        </>}
    </div>
  );
}