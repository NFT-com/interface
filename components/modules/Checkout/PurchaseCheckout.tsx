import { Button, ButtonType } from 'components/elements/Button';
import { NULL_ADDRESS } from 'constants/addresses';
import { Maybe } from 'graphql/generated/types';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { filterDuplicates, filterNulls, isNullOrEmpty, sameAddress } from 'utils/helpers';

import { NFTPurchasesContext } from './NFTPurchaseContext';
import { PurchaseCheckoutNft } from './PurchaseCheckoutNft';
import { VerticalProgressBar } from './VerticalProgressBar';

import { CheckCircle, SpinnerGap, X } from 'phosphor-react';
import { useContext, useState } from 'react';

export function PurchaseCheckout() {
  const {
    toBuy,
  } = useContext(NFTPurchasesContext);
  const { getByContractAddress } = useSupportedCurrencies();

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Maybe<'ApprovalError' | 'PurchaseError'>>(null);
    
  return (
    <div className="flex flex-col w-full items-center">
      <div className='flex w-full minmd:flex-row flex-col'>
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
        {toBuy?.length > 0 && <div className='flex flex-col items-center w-full mx-16'>
          {loading
            ? <VerticalProgressBar
              nodes={filterNulls([
                {
                  label: 'Initialize Wallet',
                },
                {
                  label: 'Approve Tokens',
                  items: filterDuplicates(
                    toBuy.filter(purchase => !sameAddress(NULL_ADDRESS, purchase?.currency)),
                    (first, second) => first?.currency === second?.currency
                  ).map(purchase => {
                    const currencyData = getByContractAddress(purchase?.currency);
                    return {
                      label: 'Approve ' + currencyData.name,
                      icon: purchase?.isApproved ?
                        <CheckCircle size={16} className="text-green-500" /> :
                        error === 'ApprovalError' ?
                          <X size={16} className="text-red-400" /> :
                          <SpinnerGap size={16} className="text-yellow-500 animate-spin" />
                    };
                  })
                },
                {
                  label: 'Complete Transaction'
                }
              ])}
              activeNodeIndex={success ? 2 : 1}
            />
            : <div>
              todo: cost summary and fees
            </div>}
        </div>}
      </div>
      {toBuy?.length > 0 && <div className='mt-16'>
        <Button
          disabled={loading}
          loading={loading}
          label={'Buy Now'}
          onClick={async () => {
            setLoading(true);
          // todo
          }}
          type={ButtonType.PRIMARY} />
      </div>}
    </div>
  );
}