import { Button, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';
import { NULL_ADDRESS } from 'constants/addresses';
import { getAddressForChain, nftAggregator } from 'constants/contracts';
import { ActivityStatus, Maybe } from 'graphql/generated/types';
import { useUpdateActivityStatusMutation } from 'graphql/hooks/useUpdateActivityStatusMutation';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { SupportedCurrency } from 'hooks/useSupportedCurrencies';
import { filterDuplicates, filterNulls, isNullOrEmpty, sameAddress } from 'utils/helpers';
import { getTotalFormattedPriceUSD, getTotalMarketplaceFeesUSD, getTotalRoyaltiesUSD, hasSufficientBalances, needsApprovals } from 'utils/marketplaceUtils';

import { CheckoutSuccessView, SuccessType } from './CheckoutSuccessView';
import { NFTPurchasesContext } from './NFTPurchaseContext';
import { ProgressBarItem, VerticalProgressBar } from './VerticalProgressBar';

import { BigNumber } from 'ethers';
import { CheckCircle, SpinnerGap, X } from 'phosphor-react';
import { useCallback, useContext, useState } from 'react';
import useSWR from 'swr';
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';

export interface OfferSummaryModalProps {
  visible: boolean;
  selectedCurrency: SupportedCurrency;
  selectedPrice: BigNumber;
  selectedExpirationOption: number;
  expirationOptions: string[];
  onClose: () => void;
}

export function OfferSummaryModal(props: OfferSummaryModalProps) {
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
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();

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
    
  const getSummaryContent = useCallback(() => {
    if (success) {
      return <CheckoutSuccessView
        userAddress={currentAddress}
        type={SuccessType.Purchase}
        subtitle={`Congratulations! You have successfully purchased ${toBuy?.length } NFT${toBuy.length > 1 ? 's' : ''}`}
      />;
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
    }
    
    // Cost Summary, Default view
    return <div className="flex flex-col w-full py-5">
      <p className="text-[24px] mx-4 text-center font-semibold">
        Review Bid
      </p>
      <div className="mx-4 my-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className='text-[16px] flex text-[#4D4D4D]'>Bid Amount</span>
        </div>
        <div className="flex flex-col align-end">
          <span className='text-[16px] flex text-[#4D4D4D]'>{Number(props.selectedPrice) / 10 ** 18 || '-'} {props.selectedCurrency}</span>
        </div>
      </div>
      <div className="mx-4 my-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className='text-[16px] flex text-[#4D4D4D]'>Bid Expiration</span>
        </div>
        <div className="flex flex-col align-end">
          <span className='text-[16px] flex text-[#4D4D4D]'>{props.expirationOptions?.[props.selectedExpirationOption]}</span>
        </div>
      </div>

      <div className='border-b-[1px] border-dashed border-[#ECECEC] w-full my-3' />

      <div className='px-4 flex items-center justify-between w-full'>
        <div className='text-[16px] flex text-[#4D4D4D] mb-1 mt-3'>Subtotal</div>
        <div className='text-[16px] flex text-[#4D4D4D] mb-1 mt-3'>{Number(props.selectedPrice) / 10 ** 18 || '-'} {props.selectedCurrency}</div>
      </div>

      <div className='border-b-[1px] border-dashed border-[#ECECEC] w-full my-3' />

      <div className='px-4 flex items-center justify-between w-full'>
        <div className='text-[16px] flex text-[#4D4D4D] mb-1 mt-3'>Total</div>
        <div className='text-[16px] flex text-[#4D4D4D] font-medium mb-1 mt-3'>{Number(props.selectedPrice) / 10 ** 18 || '-'} {props.selectedCurrency}</div>
      </div>
    </div>;
  }, [currentAddress, error, props.expirationOptions, props.selectedCurrency, props.selectedExpirationOption, props.selectedPrice, success, toBuy.length]);

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
      bgColor='bg-transparent'
      hideX
      fullModal
      pure
    >
      <div className='max-w-full overflow-hidden minlg:max-w-[500px] px-4 pb-5 h-screen minlg:h-max maxlg:h-max bg-white text-left rounded-none minlg:rounded-[20px] minlg:mt-24 minlg:m-auto'>
        <div className='font-noi-grotesk pt-3 w-full m-auto minlg:relative'>
          <X onClick={() => {
            setSuccess(false);
            setLoading(false);
            setError(null);
            props.onClose();
          }} className='absolute top-5 right-5 z-50 hover:cursor-pointer closeButton' size={24} color="#B2B2B2" weight="fill" />
          {getSummaryContent()}
          {!success && <Button
            stretch
            disabled={loading && !error && !success}
            loading={loading && !error && !success}
            label={success ? 'Finish' : error ? 'Try Again' : 'Approve'}
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
            type={ButtonType.PRIMARY} />}
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
        </div>
      </div>
    </Modal>
  );
}