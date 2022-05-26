import { ConnectedAddress } from 'components/elements/ConnectedAddress';
import Loader from 'components/elements/Loader';
import AddFundsDialog from 'components/modules/AddFundsDialog';
import { Maybe } from 'graphql/generated/types';
import { useEthBalance } from 'hooks/balances/useEthBalance';
import { useAddFundsDialog } from 'hooks/state/useAddFundsDialog';
import { useWalletSlide } from 'hooks/state/useWalletSlide';
import useCopyClipboard from 'hooks/useCopyClipboard';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { filterNulls, prettify } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ethers } from 'ethers';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ETH_LOGO from 'public/eth.svg';
import { useCallback, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { ChevronDown, ChevronUp } from 'react-feather';
import { ExternalLink as LinkIcon } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { BalanceData } from 'types';
import { useAccount, useNetwork } from 'wagmi';

interface AccountDetailsProps {
  ENSName?: string;
  openOptions: () => void;
}

export default function AccountDetails({ ENSName, openOptions }: AccountDetailsProps) {
  const { data: account } = useAccount();
  const { activeChain } = useNetwork();

  const userEthBalance = useEthBalance(account?.address);
  const { setAddFundsDialogOpen } = useAddFundsDialog();
  const { toggleWalletSlide } = useWalletSlide();
  const ethPriceUSD = useEthPriceUSD();
  const router = useRouter();

  const [optionsExpanded, setOptionsExpanded] = useState(false);
  const { secondaryIcon } = useThemeColors();
  const [isCopied, setCopied] = useCopyClipboard();

  const { profileUris: myOwnedProfileTokenUris } = useMyNftProfileTokens();

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
          balance: formatBalance(userEthBalance?.balance) ?? '0',
          usd: ethPriceUSD,
          address: null,
        },
        // {
        //   name: 'Wrapped Ethereum',
        //   symbol: 'WETH',
        //   logo: WETH_LOGO,
        //   balance: formatBalance(balances?.weth),
        //   usd: ethPriceUSD,
        //   address: getAddress('weth', chainId),
        // },
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
        // {
        //   name: 'USDC',
        //   symbol: 'USDC',
        //   logo: USDC_LOGO,
        //   balance: formatBalance(balances?.usdc),
        //   usd: 1,
        //   address: getAddress('usdc', chainId),
        // },
        // {
        //   name: 'Dai',
        //   symbol: 'DAI',
        //   logo: DAI_LOGO,
        //   balance: formatBalance(balances?.dai),
        //   usd: 1,
        //   address: getAddress('dai', chainId),
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

  const options = useCallback(() => {
    return [
      {
        title: isCopied ? 'Copied!' : 'Copy Address',
        onClick: () => {
          setCopied(account?.address);
        },
        isLink: false
      },
      {
        title: 'Change Wallet',
        onClick: openOptions,
        isLink: false
      },
      {
        title: 'My Assets',
        onClick: () => {
          toggleWalletSlide();
          router.push('/app/myAssets');
        },
        isLink: true
      },
      {
        title: 'My Bids',
        onClick: () => {
          toggleWalletSlide();
          router.push('/app/myBids');
        },
        isLink: true
      },
      {
        title: 'My Offers',
        onClick: () => {
          toggleWalletSlide();
          router.push('/app/myOffers');
        },
        isLink: true
      },
      {
        title: 'My Listings',
        onClick: () => {
          toggleWalletSlide();
          router.push('/app/myListings');
        },
        isLink: true
      },
      {
        title: 'My Transactions',
        onClick: () => {
          toggleWalletSlide();
          router.push('/app/myTransactions');
        },
        isLink: true
      },
      {
        title: 'Settings',
        onClick: () => {
          toggleWalletSlide();
          router.push('/app/settings');
        },
        isLink: true
      },
    ];
  }, [account?.address, isCopied, openOptions, router, setCopied, toggleWalletSlide]);

  return (
    <>
      <AddFundsDialog key={account?.address} account={account?.address} />
      <div className="px-5 py-8 flex flex-col">
        {activeChain.id !== 1 && (
          <div className="text-center text-red-500 font-bold mb-6">Please switch to Mainnet</div>
        )}
        <div className='flex w-full justify-between'>
          <ConnectedAddress ensName={ENSName} color='pink'/>
          <div className="flex items-end cursor-pointer" style={{ color: secondaryIcon }}>
            {optionsExpanded ?
              <ChevronUp onClick={() => setOptionsExpanded(false)} /> :
              <ChevronDown onClick={() => setOptionsExpanded(true)} />}
          </div>
        </div>
      </div>
      {optionsExpanded && options().map(option => (
        <div
          key={option.title}
          onClick={option.onClick}
          className={tw(
            'px-10 mx-5 mb-2.5 cursor-pointer flex',
            'py-2.5 hover:opacity-80',
            'dark:text-primary-txt-dk text-primary-txt',
            'rounded-xl border',
            'dark:bg-accent-dk bg-accent',
            'dark:border-accent-border-dk border-accent-border',
          )}
        >
          {option.title}
          {option.isLink &&
            <div className="inline ml-2">
              <LinkIcon size={16} />
            </div>
          }
        </div>
      ))}
      {(myOwnedProfileTokenUris ?? []).length > 0 &&
      <div className='mx-5 text-secondary-txt text-lg mb-2.5 mt-2.5'>
          Profiles
      </div>}
      {
        (myOwnedProfileTokenUris ?? [])?.map(profileUri => {
          const shortURI = profileUri.split('/').pop();
          return (
            <div
              key={profileUri}
              onClick={() => {
                toggleWalletSlide();
                router.push('/' + shortURI);
              }}
              className={tw(
                'flex items-center mx-5 cursor-pointer shrink-0',
                'h-16 px-4 rounded-xl mb-3.5 rounded-xl border',
                'dark:bg-accent-dk bg-accent',
                'dark:border-accent-border-dk border-accent-border',
              )}
            >
              <span className='text-lg text-secondary-txt'>
              @{shortURI}
              </span>
            </div>
          );
        })
      }
      <div className='mx-5 text-secondary-txt text-lg mb-2.5 mt-2.5'>
          Funds
      </div>
      <div className="mx-5">
        {coins().map((item, i) => {
          return (
            <div
              key={i}
              className={tw(
                'flex items-center justify-center px-4',
                'py-3 h-18 rounded-xl mb-3.5 rounded-xl border',
                'dark:bg-accent-dk bg-accent',
                'dark:border-accent-border-dk border-accent-border',
              )}
            >
              <div className="flex items-center">
                <Image className="h-8 mr-4" src={item.logo} alt={item.symbol} />
              </div>
              <div className="w-full">
                <div className="flex items-center justify-between font-bold text-base mb-1">
                  <div
                    className={`${item.address && 'cursor-pointer'} flex items-start text-primary-txt dark:text-primary-txt-dk`}
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
                  <div className="text-primary-txt dark:text-primary-txt-dk">
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
          'hover:opacity-80 text-primary-button-txt bg-primary-button-bckg'
        )}
        onClick={() => {
          if (isMobile) {
            window.open(
              `https://pay.sendwyre.com/?sourceCurrency=USD&destCurrency=ETH&dest=${account?.address}`,
              '_blank'
            );
          } else {
            setAddFundsDialogOpen(true);
          }
        }}
      >
          Add Funds
      </div>
    </>
  );
}
