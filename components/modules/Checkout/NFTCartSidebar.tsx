import { Button, ButtonType } from 'components/elements/Button';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { CartSidebarNft } from './CartSidebarNft';
import { NFTListingsContext, StagedListing } from './NFTListingsContext';
import { NFTPurchasesContext, StagedPurchase } from './NFTPurchaseContext';

import { useRouter } from 'next/router';
import { XCircle } from 'phosphor-react';
import { useContext, useRef } from 'react';

export type CartSidebarTab = 'buy' | 'sell';

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

  const stagedNFTs = filterNulls<StagedListing | StagedPurchase>(props.selectedTab === 'sell' ? toList : toBuy);

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
            onClick={() => {props.onChangeTab('buy');}}
            className={tw(
              'text-2xl mr-4 cursor-pointer',
              props.selectedTab === 'buy' ? 'text-primary-txt underline' : 'text-secondary-txt'
            )}>
            Buy
          </p>
          <p
            onClick={() => {props.onChangeTab('sell');}}
            className={tw(
              'text-2xl cursor-pointer',
              props.selectedTab === 'sell' ? 'text-primary-txt underline' : 'text-secondary-txt'
            )}>
            Sell
          </p>
        </div>
        <XCircle onClick={() => toggleCartSidebar()} className='hover:cursor-pointer' size={32} color="black" weight="fill" />
      </div>
      <div className='flex px-8 mb-4'>
        {isNullOrEmpty(stagedNFTs) ? <span>No NFTs in cart</span> : stagedNFTs?.length + ' NFT' + (stagedNFTs.length === 1 ? '' : 's')}
        {stagedNFTs?.length > 0 && <span
          className='ml-8 cursor-pointer hover:underline text-link'
          onClick={() => {
            if (props.selectedTab === 'sell') {
              clearListings();
            } else {
              clearPurchases();
            }
          }}
        >
          Clear
        </span>}
      </div>
      {stagedNFTs.map((stagedItem, index) => {
        return <CartSidebarNft
          nft={stagedItem?.nft}
          key={index}
          onRemove={() => {
            if (props.selectedTab === 'sell') {
              removeListing(stagedItem.nft);
            } else {
              removePurchase(stagedItem.nft);
            }
          }}
        />;
      })}
      {(stagedNFTs.length > 0 &&
        !(router.pathname.includes('/app/list') && props.selectedTab === 'sell')
      ) && <div className="mx-8 my-4 flex">
        <Button
          stretch
          label={`Proceed to ${props.selectedTab === 'sell' ? 'List' : 'Buy'}`}
          onClick={() => {
            toggleCartSidebar();
            router.push(props.selectedTab === 'sell' ? '/app/list' : '/app/buy');
          }}
          type={ButtonType.PRIMARY}
        />
      </div>}
    </div>
  );
}