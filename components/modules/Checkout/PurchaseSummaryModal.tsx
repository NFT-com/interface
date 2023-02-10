import { Button, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';
import { NULL_ADDRESS } from 'constants/addresses';
import { getAddressForChain, nftAggregator } from 'constants/contracts';
import { ActivityStatus, Maybe } from 'graphql/generated/types';
import { useUpdateActivityStatusMutation } from 'graphql/hooks/useUpdateActivityStatusMutation';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { filterDuplicates, filterNulls, isNullOrEmpty, sameAddress } from 'utils/helpers';
import { getTotalFormattedPriceUSD, getTotalMarketplaceFeesUSD, getTotalRoyaltiesUSD, hasSufficientBalances, needsApprovals } from 'utils/marketplaceUtils';

import { CheckoutSuccessView } from './CheckoutSuccessView';
import { NFTPurchasesContext } from './NFTPurchaseContext';
import { ProgressBarItem, VerticalProgressBar } from './VerticalProgressBar';

import { CheckCircle, SpinnerGap, X, XCircle } from 'phosphor-react';
import { useCallback, useContext, useState } from 'react';
import useSWR from 'swr';
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';

export interface PurchaseSummaryModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PurchaseSummaryModal(props: PurchaseSummaryModalProps) {
  const {
    toBuy,
    buyAll,
    updateCurrencyApproval,
    clear
  } = useContext(NFTPurchasesContext);

  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const { updateActivityStatus } = useUpdateActivityStatusMutation();
  const provider = useProvider();
  const looksrareStrategy = useLooksrareStrategyContract(provider);

  const { getByContractAddress, getBalanceMap } = useSupportedCurrencies();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Maybe<'ApprovalError' | 'PurchaseUnknownError' | 'PurchaseBalanceError' | 'ConnectionError'>>(null);
  
  const { data: looksrareProtocolFeeBps } = useSWR(
    'LooksrareProtocolFeeBps' + String(looksrareStrategy == null),
    async () => {
      return await looksrareStrategy.viewProtocolFee();
    },
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    });

  const getNeedsApprovals = useCallback(() => {
    return needsApprovals(toBuy);
  }, [toBuy]);

  const getHasSufficientBalance = useCallback(async () => {
    const balances = await getBalanceMap(currentAddress, ['WETH', 'ETH', 'USDC', 'DAI']);
    return hasSufficientBalances(toBuy, balances);
  }, [currentAddress, getBalanceMap, toBuy]);
    
  const getTotalPriceUSD = useCallback(() => {
    return getTotalFormattedPriceUSD(toBuy, getByContractAddress);
  }, [toBuy, getByContractAddress]);

  const getTotalMarketplaceFees = useCallback(() => {
    return getTotalMarketplaceFeesUSD(toBuy, looksrareProtocolFeeBps, getByContractAddress);
  }, [toBuy, looksrareProtocolFeeBps, getByContractAddress]);
 
  const getTotalRoyalties = useCallback(() => {
    return getTotalRoyaltiesUSD(toBuy, looksrareProtocolFeeBps, getByContractAddress);
  }, [getByContractAddress, looksrareProtocolFeeBps, toBuy]);

  const getSummaryContent = useCallback(() => {
    if (success) {
      return <div className="my-8">
        <CheckoutSuccessView subtitle={`Congratulations! You have successfully purchased ${toBuy?.length } NFT${toBuy.length > 1 ? 's' : ''}`}/>
      </div>;
    } else if (!isNullOrEmpty(error)) {
      return <div className='flex flex-col w-full'>
        <div className="text-3xl mx-4 font-bold">
          {error === 'ApprovalError' ? 'Approval' : 'Transaction'} Failed
          <div className='w-full my-8'>
            <span className='font-medium text-[#6F6F6F] text-base'>
              {error === 'ConnectionError' && 'Your wallet is not connected. Please connect your wallet and try again.'}
              {error === 'ApprovalError' && 'The approval was not accepted in your wallet. If you would like to continue your purchase, please try again.'}
              {error === 'PurchaseBalanceError' && 'The purchase failed because your token balance is too low.'}
              {error === 'PurchaseUnknownError' && 'The transaction failed for an unknown reason. Please verify that your cart is valid and try again.'}
            </span>
          </div>
        </div>
      </div>;
    } if (loading) {
      const tokens = filterDuplicates(
        toBuy?.filter(purchase => !sameAddress(NULL_ADDRESS, purchase?.currency)),
        (first, second) => first?.currency === second?.currency
      );
      return (<div className='flex flex-col w-full'>
        <p className="text-3xl mx-4 font-bold">
            Purchase Progress
        </p>
        <div className='w-full m-8'>
          <VerticalProgressBar
            nodes={filterNulls([
              {
                label: 'Initialize Wallet',
              },
              isNullOrEmpty(tokens) ?
                null :
                {
                  label: 'Approve Tokens',
                  error: error === 'ApprovalError',
                  items: tokens?.map(purchase => {
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
                error: error === 'PurchaseUnknownError' || error === 'PurchaseBalanceError',
              }
            ])}
            activeNodeIndex={getNeedsApprovals() || isNullOrEmpty(tokens) || error === 'ApprovalError' ? 1 : success ? 3 : 2}
          />
        </div>
      </div>);
    } else {
      // Cost Summary, Default view
      return (
        <div className="flex flex-col w-full">
          <p className="text-3xl mx-4 font-bold">
            Fee Summary
          </p>
          <p className='text-2xl text-[#6F6F6F] mx-4 font-bold'>
            {toBuy?.length ?? 0} NFT{toBuy?.length > 1 && 's'}
          </p>
          <div className="mx-4 my-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className='font-semibold'>Total NFT Price</span>
              <span className='font-medium text-[#6F6F6F] text-sm'>
                Estimated Amount
              </span>
            </div>
            <div className="flex flex-col align-end">
              <span className='font-semibold'>{'$' + getTotalPriceUSD()}</span>
            </div>
          </div>
          <div className="mx-4 my-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className='font-semibold'>Marketplace Fees</span>
              <span className='font-medium text-[#6F6F6F] text-sm'>
                Estimated Amount
              </span>
            </div>
            <div className="flex flex-col align-end">
              <span className='font-semibold'>{'$' + getTotalMarketplaceFees()}</span>
            </div>
          </div>
          <div className="mx-4 my-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className='font-semibold'>Creator Royalties</span>
              <span className='font-medium text-[#6F6F6F] text-sm'>
                Estimated Amount
              </span>
            </div>
            <div className="flex flex-col align-end">
              <span className='font-semibold'>{'$' + getTotalRoyalties()}</span>
            </div>
          </div>
          <div className="mx-4 my-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className='font-semibold'>Total Price</span>
              <span className='font-medium text-[#6F6F6F] text-sm'>
                Estimated Amount
              </span>
            </div>
            <div className="flex flex-col align-end">
              <span className='font-semibold'>${Number(getTotalRoyalties()) + Number(getTotalMarketplaceFees()) + Number(getTotalPriceUSD())}</span>
            </div>
          </div>
        </div>
      );
    }
  }, [
    error,
    getByContractAddress,
    getNeedsApprovals,
    getTotalMarketplaceFees,
    getTotalPriceUSD,
    getTotalRoyalties,
    loading,
    success,
    toBuy
  ]);

  return (
    <Modal
      visible={props.visible}
      loading={false}
      title={''}
      onClose={() => {
        setSuccess(false);
        setLoading(false);
        setError(null);
        props.onClose();
      }}
      bgColor='white'
      hideX
      fullModal
      pure
    >
      <div className='max-w-full minlg:max-w-[458px] h-screen minlg:h-max maxlg:h-max bg-white text-left px-4 pb-10 rounded-none minlg:rounded-[10px] minlg:mt-24 minlg:m-auto'>
        <div className='pt-20 font-grotesk lg:max-w-md max-w-lg m-auto minlg:relative flex flex-col items-center'>
          <div className='absolute top-4 right-4 minlg:right-1 hover:cursor-pointer w-6 h-6 bg-[#f9d963] rounded-full'></div>
          <XCircle onClick={() => {
            setSuccess(false);
            setLoading(false);
            setError(null);
            props.onClose();
          }} className='absolute top-3 right-3 minlg:right-0 hover:cursor-pointer closeButton' size={32} color="black" weight="fill" />
          {getSummaryContent()}
          <Button
            stretch
            disabled={loading && !error && !success}
            loading={loading && !error && !success}
            label={success ? 'Finish' : error ? 'Try Again' : 'Confirm & Buy'}
            onClick={async () => {
              if (success) {
                clear();
                setSuccess(false);
                props.onClose();
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
                const hasSuffictientBalance = await getHasSufficientBalance();
                if (!hasSuffictientBalance) {
                  setError('PurchaseBalanceError');
                } else {
                  setError('PurchaseUnknownError');
                }
              }
            }}
            type={ButtonType.PRIMARY} />
          {
            !isNullOrEmpty(error) &&
            <div className='w-full mt-4'>
              <Button
                stretch
                label={'Cancel'}
                onClick={() => {
                  setSuccess(false);
                  setLoading(false);
                  setError(null);
                  props.onClose();
                }}
                type={ButtonType.SECONDARY}
              />
            </div>
          }
        </div>
      </div>
    </Modal>
  );
}