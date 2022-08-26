import { Button, ButtonType } from 'components/elements/Button';
import { NULL_ADDRESS } from 'constants/addresses';
import { getAddressForChain, nftAggregator } from 'constants/contracts';
import { Maybe } from 'graphql/generated/types';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { filterDuplicates, filterNulls, isNullOrEmpty, sameAddress } from 'utils/helpers';

import { NFTPurchasesContext } from './NFTPurchaseContext';
import { PurchaseCheckoutNft } from './PurchaseCheckoutNft';
import { VerticalProgressBar } from './VerticalProgressBar';

import { BigNumber, ethers } from 'ethers';
import { CheckCircle, SpinnerGap, X } from 'phosphor-react';
import { useCallback, useContext, useState } from 'react';
import { useAccount, useNetwork, useSigner } from 'wagmi';

export function PurchaseCheckout() {
  const {
    toBuy,
    clear,
    updateCurrencyApproval
  } = useContext(NFTPurchasesContext);
  const { getByContractAddress } = useSupportedCurrencies();
  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Maybe<'ApprovalError' | 'PurchaseError' | 'ConnectionError'>>(null);

  const getNeedsApprovals = useCallback(() => {
    return filterDuplicates(
      toBuy.filter(purchase => !sameAddress(NULL_ADDRESS, purchase?.currency)),
      (first, second) => first?.currency === second?.currency
    ).some(purchase => !purchase?.isApproved);
  }, [toBuy]);

  const getTotalPrice = useCallback(() => {
    return toBuy.reduce((acc, curr) => {
      return acc.add(curr.price);
    }, BigNumber.from(0));
  }, [toBuy]);
    
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
        {toBuy?.length > 0 && <div className='flex flex-col items-center justify-center w-full'>
          {loading ?
            <div>
              <VerticalProgressBar
                nodes={filterNulls([
                  {
                    label: 'Initialize Wallet',
                  },
                  {
                    label: 'Approve Tokens',
                    error: error === 'ApprovalError',
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
                    label: 'Complete Transaction',
                    error: error === 'PurchaseError',
                  }
                ])}
                activeNodeIndex={getNeedsApprovals() || error === 'ApprovalError' ? 1 : success ? 3 : 2}
              />
            </div> :
            <div>
              <div className="mx-8 my-4 flex items-center">
                <span>Total Cost: {' '}</span>
                <span className='ml-2'>
                  {ethers.utils.formatEther(getTotalPrice() ?? 0) + ' WETH'}
                </span>
              </div>
            </div>
          }
        </div>}
      </div>
      {toBuy?.length > 0 && <div className='mt-16'>
        <Button
          disabled={loading && !error}
          loading={loading && !error}
          label={success ? 'Finish' : error ? 'Try Again' : 'Buy Now'}
          onClick={async () => {
            if (success) {
              clear();
              setSuccess(false);
              return;
            }
            setError(null);
            setSuccess(false);
            setLoading(true);

            if (signer == null) {
              setError('ConnectionError');
              return;
            }

            if (getNeedsApprovals()) {
              const missingApprovals = filterDuplicates(
                toBuy.filter(purchase => !sameAddress(NULL_ADDRESS, purchase?.currency)),
                (first, second) => first?.currency === second?.currency
              ).filter(purchase => !purchase?.isApproved);
              for (let i = 0; i < missingApprovals.length; i++) {
                const purchase = missingApprovals[i];
                const currencyData = getByContractAddress(purchase?.currency);
                await currencyData?.setAllowance(currentAddress, getAddressForChain(nftAggregator, chain?.id))
                  .then((result: boolean) => {
                    if (!result) {
                      setError('ApprovalError');
                      return;
                    }
                    updateCurrencyApproval(purchase?.currency, true);
                  })
                  .catch(() => {
                    setError('ApprovalError');
                  });
              }
            }

            // todo complete the purchase transaction
          }}
          type={ButtonType.PRIMARY} />
      </div>}
    </div>
  );
}