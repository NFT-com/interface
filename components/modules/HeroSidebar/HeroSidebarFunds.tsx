import Loader from 'components/elements/Loader';
import { useAddFundsDialog } from 'hooks/state/useAddFundsDialog';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { prettify } from 'utils/helpers';
import { tw } from 'utils/tw';

import { utils } from 'ethers';
import ETH_LOGO from 'public/eth.svg';
import { useBalance } from 'wagmi';
import { useAccount } from 'wagmi';

/**
 * TODO: ADD OTHER ASSET BALANCES FOR MARKETPLACE
 */

export default function HeroSidebarFunds() {
  const { data: account } = useAccount();
  const { data: balanceData } = useBalance({ addressOrName: account?.address, watch: true });

  const { setAddFundsDialogOpen } = useAddFundsDialog();

  const ethPriceUSD = useEthPriceUSD();

  return (
    <>
      <div className='mx-5 text-secondary-txt text-lg mb-4 mt-2.5'>
          Tokens
      </div>
      <div className="mx-5">
        <div
          className={tw(
            'flex items-center justify-center px-4',
            'py-3 h-18 rounded-xl mb-3.5 border',
            'bg-accent-dk',
            'border-accent-border-dk',
          )}
        >
          <div className="flex items-center">
            <ETH_LOGO className='h-8 mr-4' />
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between font-bold text-base mb-1">
              <div
                className={'flex items-start text-primary-txt-dk'}>
                {balanceData?.symbol}
              </div>
              <div className="text-primary-txt-dk">
                {(+utils.formatEther(balanceData?.value ?? 0)).toFixed(4)}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-secondary-txt">
                  Ethereum
              <div>
                {!ethPriceUSD
                  ? (
                    <Loader />
                  )
                  : (
                    '$' + prettify(Number(balanceData?.formatted) * Number(ethPriceUSD))
                  )}
              </div>
            </div>
          </div>
        </div>
          );
      </div>
      <div
        className={tw(
          'cursor-pointer flex items-center justify-center',
          'mt-5 mx-5 mb-7 rounded-xl h-10 text-lg shrink-0',
          'hover:opacity-80 text-always-black bg-primary-button-bckg'
        )}
        onClick={() => setAddFundsDialogOpen(true)}
      >
          Add Funds
      </div>
    </>
  );
}
