import { useCallback, useContext } from 'react';
import useSWR from 'swr';
import { useProvider } from 'wagmi';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { useHasGk } from 'hooks/useHasGk';
import { useNftComRoyalties } from 'hooks/useNftComRoyalties';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { getTotalFormattedPriceUSD, getTotalMarketplaceFeesUSD, getTotalRoyaltiesUSD } from 'utils/marketplaceUtils';

import { NFTPurchasesContext } from './NFTPurchaseContext';

export function PurchaseSummary() {
  const { toBuy, togglePurchaseSummaryModal } = useContext(NFTPurchasesContext);
  const provider = useProvider();
  const looksrareStrategy = useLooksrareStrategyContract(provider);
  const { data: nftComRoyalties } = useNftComRoyalties(toBuy, true);
  const { getByContractAddress } = useSupportedCurrencies();
  const hasGk = useHasGk();

  const { data: looksrareProtocolFeeBps } = useSWR(
    `LooksrareProtocolFeeBps${String(looksrareStrategy == null)}`,
    async () => {
      return looksrareStrategy.viewProtocolFee();
    },
    {
      refreshInterval: 0,
      revalidateOnFocus: false
    }
  );

  const getTotalPriceUSD = useCallback(() => {
    return getTotalFormattedPriceUSD(toBuy, getByContractAddress);
  }, [toBuy, getByContractAddress]);

  const getTotalMarketplaceFees = useCallback(() => {
    return getTotalMarketplaceFeesUSD(toBuy, looksrareProtocolFeeBps, getByContractAddress, hasGk);
  }, [toBuy, looksrareProtocolFeeBps, getByContractAddress, hasGk]);

  const getTotalRoyalties = useCallback(() => {
    return getTotalRoyaltiesUSD(toBuy, looksrareProtocolFeeBps, getByContractAddress, nftComRoyalties);
  }, [getByContractAddress, looksrareProtocolFeeBps, toBuy, nftComRoyalties]);

  const getSummaryContent = useCallback(() => {
    // Cost Summary, Default view
    return (
      <div className='mx-2 flex w-full flex-col'>
        <div className='mb-4 flex items-center justify-between text-sm'>
          <div className='flex flex-col'>
            <span className='font-normal'>Subtotal</span>
          </div>
          <div className='align-end flex flex-col'>
            <span className='font-normal'>
              {`$${(
                Number(getTotalPriceUSD()) -
                Number(getTotalRoyalties()) -
                Number(getTotalMarketplaceFees())
              )?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`}
            </span>
          </div>
        </div>
        <div className='flex items-center justify-between text-xs'>
          <div className='flex flex-col'>
            <span className='text-sm font-normal text-[#6F6F6F]'>Marketplace Fees</span>
          </div>
          <div className='align-end flex flex-col'>
            <span className='font-normal text-[#6F6F6F]'>
              +{' '}
              {`$${getTotalMarketplaceFees()?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
              })}`}
            </span>
          </div>
        </div>
        <div className='flex items-center justify-between text-xs'>
          <div className='flex flex-col'>
            <span className='text-sm font-normal text-[#6F6F6F]'>Creator Royalties</span>
          </div>
          <div className='align-end flex flex-col'>
            <span className='font-normal text-[#6F6F6F]'>
              +{' '}
              {`$${getTotalRoyalties()?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
              })}`}
            </span>
          </div>
        </div>
        <div className='mt-6 flex items-center justify-between'>
          <div className='flex flex-col'>
            <span className='text-sm font-medium'>Total Price</span>
          </div>
          <div className='align-end flex flex-col text-lg'>
            <span className='font-bold'>
              $
              {Number(getTotalPriceUSD())?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
              })}
            </span>
          </div>
        </div>
      </div>
    );
  }, [getTotalMarketplaceFees, getTotalPriceUSD, getTotalRoyalties]);

  return (
    <div className='m-7 flex flex-col items-center'>
      {getSummaryContent()}
      <span className='mx-1 my-7 self-center font-noi-grotesk text-sm font-medium'>
        Once the transaction is confirmed, the NFT will be sent to your wallet instantly.
      </span>
      <Button
        size={ButtonSize.LARGE}
        stretch
        label={'Buy now'}
        onClick={() => {
          togglePurchaseSummaryModal();
        }}
        type={ButtonType.PRIMARY}
      />
    </div>
  );
}
