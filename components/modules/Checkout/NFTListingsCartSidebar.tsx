import { Button, ButtonType } from 'components/elements/Button';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { filterNulls } from 'utils/helpers';
import { tw } from 'utils/tw';

import { CartSidebarNft } from './CartSidebarNft';
import { NFTListingsCartSidebarSummary } from './NFTListingsCartSidebarSummary';
import { NFTListingsContext } from './NFTListingsContext';

import { useRouter } from 'next/router';
import { XCircle } from 'phosphor-react';
import { useContext, useRef } from 'react';

export function NFTListingsCartSidebar() {
  const router = useRouter();
  const showSummary = router.pathname.includes('/list');
  
  const {
    toggleCartSidebar,
    toList,
    clear
  } = useContext(NFTListingsContext);

  const sidebarRef = useRef();
  useOutsideClickAlerter(sidebarRef, () => toggleCartSidebar());

  return (
    <div ref={sidebarRef} className={tw(
      'z-50 absolute pt-20 right-0 w-full h-full minmd:max-w-md bg-white flex flex-col grow',
      'drop-shadow-md'
    )}>
      <div className='flex flex-row items-center px-8 my-8'>
        <p className='w-full text-2xl'>
            Listings
        </p>
        <XCircle onClick={() => toggleCartSidebar()} className='hover:cursor-pointer' size={32} color="black" weight="fill" />
      </div>
      <div className='flex px-8 mb-4'>
        <span>
          {showSummary && 'Summary and fees for '}{filterNulls(toList).length} NFT{filterNulls(toList).length > 1 ? 's:' : ':'}
        </span>
        {!showSummary && <span
          className='ml-8 cursor-pointer hover:underline text-link'
          onClick={() => {
            clear();
          }}
        >
            Clear
        </span>}
      </div>
      {showSummary
        ? <NFTListingsCartSidebarSummary />
        : <>
          {filterNulls(toList).map((listing, index) => {
            return <CartSidebarNft nft={listing?.nft} key={index} />;
          })}
          <div className="mx-8 my-4 flex">
            <Button
              stretch
              label={'Proceed to List'}
              onClick={() => {
                toggleCartSidebar();
                router.push('/app/list');
              }}
              type={ButtonType.PRIMARY}
            />
          </div>
        </>}
    </div>
  );
}