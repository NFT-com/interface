import { Button, ButtonType } from 'components/elements/Button';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';

import { NFTPurchasesContext } from './NFTPurchaseContext';
import { PurchaseCheckoutNft } from './PurchaseCheckoutNft';

import { useContext } from 'react';

export function PurchaseCheckout() {
  const {
    toBuy,
  } = useContext(NFTPurchasesContext);
    
  return (
    <>
      <div className='my-8 w-full'>
        {filterNulls(toBuy).map((purchase, index) => {
          return <PurchaseCheckoutNft key={index} purchase={purchase} />;
        })}
      </div>
      {
        isNullOrEmpty(toBuy) && <div className='flex flex-col items-center justify-center my-12'>
          No NFTs in your Cart
        </div>
      }
      <Button
        // disabled={!allListingsConfigured()}
        // loading={loading}
        label={'Buy Now'}
        onClick={async () => {
          // todo
        }}
        type={ButtonType.PRIMARY} />
    </>
  );
}