import { Button, ButtonType } from 'components/elements/Button';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';

import { NFTPurchasesContext } from './NFTPurchaseContext';
import { PurchaseCheckoutNft } from './PurchaseCheckoutNft';
import { PurchaseSummaryModal } from './PurchaseSummaryModal';

import { useContext, useState } from 'react';

export function PurchaseCheckout() {
  const {
    toBuy,
  } = useContext(NFTPurchasesContext);

  const [showSummaryModal, setShowSummaryModal] = useState(false);
    
  return (
    <div className="flex flex-col w-full items-center">
      <PurchaseSummaryModal visible={showSummaryModal} onClose={() => setShowSummaryModal(false)} />
      <div className="flex flex-col items-center w-full">
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
      </div>
      {toBuy?.length > 0 && <div className='mt-16'>
        <Button
          label={'Start Purchasing'}
          onClick={() => {
            setShowSummaryModal(true);
          }}
          type={ButtonType.PRIMARY}
        />
      </div>}
    </div>
  );
}