import Loader from 'components/elements/Loader';
import { Maybe } from 'graphql/generated/types';
import { useEthBalance } from 'hooks/balances/useEthBalance';
import { useAddFundsDialog } from 'hooks/state/useAddFundsDialog';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { filterNulls, prettify } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ethers } from 'ethers';
import Image from 'next/image';
import ETH_LOGO from 'public/eth.svg';
import { useCallback } from 'react';
import { ExternalLink as LinkIcon } from 'react-feather';
import { BalanceData } from 'types';
import { useAccount } from 'wagmi';

/**
 * TODO: ADD OTHER ASSET BALANCES FOR MARKETPLACE
 */

export default function HeroSidebarFunds() {
  const { data: account } = useAccount();

  const userEthBalance = useEthBalance(account?.address);
  const { setAddFundsDialogOpen } = useAddFundsDialog();
  const ethPriceUSD = useEthPriceUSD();

  // const chainId = initChainId || 1;

  type CoinData = {
    name: string;
    symbol: string;
    logo: string;
    balance: string;
    usd: string;
    address: string;
  };

  // const balances = useBalances(account);

  const formatBalance = (item: Maybe<BalanceData>) => {
    if (item == null) {
      return '0';
    }
    return ethers.utils.formatUnits(item.balance, item.decimals);
  };

  const coins: () => Array<CoinData> = useCallback(() => {
    return filterNulls(
      [
        {
          name: 'Ethereum',
          symbol: 'ETH',
          logo: ETH_LOGO,
          balance: formatBalance(userEthBalance?.balance),
          usd: ethPriceUSD,
          address: null,
        },
        // getEnvBool(Secret.REACT_APP_ANALYTICS_ENABLED)
        //   ? {
        //     name: 'NFT.com',
        //     symbol: 'NFT',
        //     logo: NFT_LOGO,
        //     balance: formatBalance(balances?.nft),
        //     usd: 0.1,
        //     address: getAddress('nft', chainId),
        //   }
        //   : null,
        // getEnvBool(Secret.REACT_APP_ANALYTICS_ENABLED)
        //   ? {
        //     name: 'USDC',
        //     symbol: 'USDC',
        //     logo: USDC_LOGO,
        //     balance: formatBalance(balances?.usdc),
        //     usd: 1,
        //     address: getAddress('usdc', chainId),
        //   }
        //   : null,
        // getEnvBool(Secret.REACT_APP_ANALYTICS_ENABLED)
        //   ? {
        //     name: 'Dai',
        //     symbol: 'DAI',
        //     logo: DAI_LOGO,
        //     balance: formatBalance(balances?.dai),
        //     usd: 1,
        //     address: getAddress('dai', chainId),
        //   }
        //   : null,
        // {
        //   name: 'Wrapped Ethereum',
        //   symbol: 'WETH',
        //   logo: WETH_LOGO,
        //   balance: formatBalance(balances?.weth),
        //   usd: ethPriceUSD,
        //   address: getAddress('weth', chainId),
        // },
      ]
    );
  }, [
    // balances?.dai,
    // balances?.nft,
    // balances?.usdc,
    // balances?.weth,
    // chainId,
    ethPriceUSD,
    userEthBalance,
  ]);

  return (
    <>
      <div className='mx-5 text-secondary-txt text-lg mb-4 mt-2.5'>
          Tokens
      </div>
      <div className="mx-5">
        {coins().map((item, i) => {
          return (
            <div
              key={i}
              className={tw(
                'flex items-center justify-center px-4',
                'py-3 h-18 rounded-xl mb-3.5 border',
                'bg-accent-dk',
                'border-accent-border-dk',
              )}
            >
              <div className="flex items-center">
                {/* <Image className="h-8 mr-4" src={item.logo} alt={item.symbol} /> */}
              </div>
              <div className="w-full">
                <div className="flex items-center justify-between font-bold text-base mb-1">
                  <div
                    className={`${item.address && 'cursor-pointer'} flex items-start text-primary-txt-dk`}
                    onClick={() => {
                      item.address &&
                        window.open(
                          `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${item.address}`
                        );
                    }}
                  >
                    {item.symbol}
                    {item.address && (
                      <div className="inline ml-1.5">
                        <LinkIcon size={16} />
                      </div>
                    )}
                  </div>
                  <div className="text-primary-txt-dk">
                    {prettify(item.balance)}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-secondary-txt">
                  <div>{item.name}</div>
                  <div>
                    {!item.usd
                      ? (
                        <Loader />
                      )
                      : (
                        '$' + prettify(Number(item.balance) * Number(item.usd))
                      )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
