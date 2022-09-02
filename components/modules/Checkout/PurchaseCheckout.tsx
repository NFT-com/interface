import { Button, ButtonType } from 'components/elements/Button';
import { NULL_ADDRESS } from 'constants/addresses';
import { getAddressForChain, nftAggregator } from 'constants/contracts';
import { ActivityStatus, Maybe } from 'graphql/generated/types';
import { useUpdateActivityStatusMutation } from 'graphql/hooks/useUpdateActivityStatusMutation';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { filterDuplicates, filterNulls, isNullOrEmpty, sameAddress } from 'utils/helpers';

import { CheckoutSuccessView } from './CheckoutSuccessView';
import { NFTPurchasesContext } from './NFTPurchaseContext';
import { PurchaseCheckoutNft } from './PurchaseCheckoutNft';
import { ProgressBarItem, VerticalProgressBar } from './VerticalProgressBar';

import { ethers } from 'ethers';
import { CheckCircle, SpinnerGap, X } from 'phosphor-react';
import { useCallback, useContext, useState } from 'react';
import { useAccount, useNetwork, useSigner } from 'wagmi';

export function PurchaseCheckout() {
  const {
    toBuy,
    clear,
    buyAll,
    updateCurrencyApproval
  } = useContext(NFTPurchasesContext);
  const { getByContractAddress } = useSupportedCurrencies();
  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const { updateActivityStatus } = useUpdateActivityStatusMutation();

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Maybe<'ApprovalError' | 'PurchaseError' | 'ConnectionError'>>(null);

  const getNeedsApprovals = useCallback(() => {
    return filterDuplicates(
      toBuy?.filter(purchase => !sameAddress(NULL_ADDRESS, purchase?.currency)),
      (first, second) => first?.currency === second?.currency
    ).some(purchase => !purchase?.isApproved);
  }, [toBuy]);

  const getTotalPriceUSD = useCallback(() => {
    return toBuy?.reduce((acc, curr) => {
      const currencyData = getByContractAddress(curr.currency);
      const formattedPrice = Number(ethers.utils.formatUnits(curr.price, currencyData.decimals));
      return acc + currencyData.usd(formattedPrice);
    }, 0);
  }, [toBuy, getByContractAddress]);

  const getSummaryContent = useCallback(() => {
    if (success) {
      return <div className="my-8">
        <CheckoutSuccessView subtitle={`Congratulations! You have successfully purchased ${toBuy?.length } NFT${toBuy.length > 1 ? 's' : ''}`}/>
      </div>;
    } else if (loading) {
      return (<div>
        <VerticalProgressBar
          nodes={filterNulls([
            {
              label: 'Initialize Wallet',
            },
            {
              label: 'Approve Tokens',
              error: error === 'ApprovalError',
              items: filterDuplicates(
                toBuy?.filter(purchase => !sameAddress(NULL_ADDRESS, purchase?.currency)),
                (first, second) => first?.currency === second?.currency
              ).map(purchase => {
                const currencyData = getByContractAddress(purchase?.currency);
                return {
                  label: 'Approve ' + currencyData.name,
                  endIcon: purchase?.isApproved ?
                    <CheckCircle size={16} className="text-green-500 mx-2" /> :
                    error === 'ApprovalError' ?
                      <X size={16} className="text-red-400 mx-2" /> :
                      <SpinnerGap size={16} className="text-yellow-500 animate-spin mx-2" />
                } as ProgressBarItem;
              })
            },
            {
              label: 'Complete Transaction',
              error: error === 'PurchaseError',
            }
          ])}
          activeNodeIndex={getNeedsApprovals() || error === 'ApprovalError' ? 1 : success ? 3 : 2}
        />
      </div>);
    } else {
      // Cost Summary, Default view
      return (
        <div className="flex flex-col w-full px-8">
          <p className="text-xl font-bold">
            Summary and fees for {toBuy?.length ?? 0} NFT{toBuy?.length > 1 && 's'}
          </p>
          <div className="mx-8 my-4 flex items-center w-full">
            <span>Total Cost: {' '}</span>
            <span className='ml-2'>
              {'$' + getTotalPriceUSD()}
            </span>
          </div>
        </div>
      );
    }
  }, [error, getByContractAddress, getNeedsApprovals, getTotalPriceUSD, loading, success, toBuy]);
    
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
          {getSummaryContent()}
        </div>}
      </div>
      {toBuy?.length > 0 && <div className='mt-16'>
        <Button
          disabled={loading && !error && !success}
          loading={loading && !error && !success}
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
                toBuy?.filter(purchase => !sameAddress(NULL_ADDRESS, purchase?.currency)),
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

            const result = await buyAll();
            if (result) {
              setSuccess(true);
              updateActivityStatus(toBuy?.map(stagedPurchase => stagedPurchase.activityId), ActivityStatus.Executed);
            } else {
              setError('PurchaseError');
            }
          }}
          type={ButtonType.PRIMARY} />
      </div>}
    </div>
  );
}