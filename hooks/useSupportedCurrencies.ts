import { NULL_ADDRESS } from 'constants/addresses';
import { Dai, Usdc, Weth } from 'constants/typechain';
import { AssetClass } from 'graphql/generated/types';
import { useBalances } from 'hooks/balances/useBalances';
import { useDaiAllowance } from 'hooks/balances/useDaiAllowance';
import { useUsdcAllowance } from 'hooks/balances/useUsdcAllowance';
import { useWethAllowance } from 'hooks/balances/useWethAllowance';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useTransferProxy } from 'hooks/contracts/useTransferProxy';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { MAX_UINT_256 } from 'utils/marketplaceUtils';

import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import DAI_LOGO from 'public/dai.svg';
import ETH_LOGO from 'public/eth.svg';
import USDC_LOGO from 'public/usdc.svg';
import WETH_LOGO from 'public/weth.svg';
import { useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';

export type NFTSupportedCurrency = {
  name: string;
  logo: string;
  contract: string;
  usd: (val: number) => number;
  allowance: (address: string) => Promise<BigNumberish>;
  setAllowance: (address: string) => Promise<boolean>;
  balance: BigNumberish;
  loggedInAllowance: BigNumber;
  mutateLoggedInAllowance: () => void
}

export type SupportedCurrency = 'WETH' | 'ETH' | 'DAI' | 'USDC';

export type NFTSupportedCurrencies = {
  [c in SupportedCurrency]: NFTSupportedCurrency
}

export type NFTSupportedCurrenciesInterface = {
  getByContractAddress: (address: string) => NFTSupportedCurrency
  data: NFTSupportedCurrencies
};

export function useSupportedCurrencies(): NFTSupportedCurrenciesInterface {
  const ethPriceUSD = useEthPriceUSD();
  const {
    weth,
    dai,
    usdc,
  } = useAllContracts();
  const erc20TransferProxy = useTransferProxy(AssetClass.Erc20);
  const { data: acctData } = useAccount();
  const balances = useBalances(acctData?.address);
  const {
    allowance: wethAllowance,
    mutate: mutateWethAllowance
  } = useWethAllowance(acctData?.address, erc20TransferProxy);
  const {
    allowance: daiAllowance,
    mutate: mutateDaiAllowance
  } = useDaiAllowance(acctData?.address, erc20TransferProxy);
  const {
    allowance: usdcAllowance,
    mutate: mutateUsdcAllowance
  } = useUsdcAllowance(acctData?.address, erc20TransferProxy);

  const setAllowanceForContract = useCallback(async (
    contract: Dai | Weth | Usdc,
    account: string
  ): Promise<boolean> => {
    return contract
      .connect(await acctData?.connector?.getSigner() ?? account)
      .approve(erc20TransferProxy, MAX_UINT_256)
      .then((tx) => tx.wait(1))
      .then(() => true)
      .catch(() => {
        console.log('Failed to get currency approval. Please connect wallet.');
        return false;
      });
  }, [erc20TransferProxy, acctData]);

  const data: NFTSupportedCurrencies = useMemo(() => {
    return {
      'WETH': {
        name: 'WETH',
        logo: WETH_LOGO,
        contract: weth.address,
        usd: (val: number) => Number(Number(val * ethPriceUSD).toFixed(2)),
        allowance: async (account: string) => {
          const wethAllowance = await weth.allowance(account, erc20TransferProxy ?? NULL_ADDRESS);
          return wethAllowance;
        },
        setAllowance: (account: string) => setAllowanceForContract(weth, account),
        // balance: balances.weth?.balance ?? 0,
        balance: 0,
        loggedInAllowance: BigNumber.from(wethAllowance?.balance ?? 0),
        mutateLoggedInAllowance: mutateWethAllowance
      },
      'ETH': {
        name: 'ETH',
        logo: ETH_LOGO,
        contract: NULL_ADDRESS,
        usd: (val: number) => Number(Number(val * ethPriceUSD).toFixed(2)),
        allowance: async (account: string) => {
          // ETH doesn't have allowances - just need to include ETH
          // in amount field as payable transaction.
          return 0;
        },
        setAllowance: async () => true,
        balance: balances.eth?.balance ?? 0,
        loggedInAllowance: BigNumber.from(0),
        mutateLoggedInAllowance: () => null
      },
      'DAI': {
        name: 'DAI',
        logo: DAI_LOGO,
        contract: dai.address,
        usd: (val: number) => val,
        allowance: async (account: string) => {
          const daiAllowance = await dai.allowance(account, erc20TransferProxy ?? NULL_ADDRESS);
          return daiAllowance;
        },
        setAllowance: (account: string) => setAllowanceForContract(dai, account),
        // balance: balances.dai?.balance ?? 0,
        balance: 0,
        loggedInAllowance: BigNumber.from(daiAllowance?.balance ?? 0),
        mutateLoggedInAllowance: mutateDaiAllowance
      },
      'USDC': {
        name: 'USDC',
        logo: USDC_LOGO,
        contract: usdc.address,
        usd: (val: number) => val,
        allowance: async (account: string) => {
          const usdcAllowance = await usdc.allowance(account, erc20TransferProxy ?? NULL_ADDRESS);
          return usdcAllowance;
        },
        setAllowance: (account: string) => setAllowanceForContract(usdc, account),
        // balance: balances.usdc?.balance ?? 0,
        balance: 0,
        loggedInAllowance: BigNumber.from(usdcAllowance?.balance ?? 0),
        mutateLoggedInAllowance: mutateUsdcAllowance
      }
    };
  }, [
    balances.eth?.balance,
    dai,
    daiAllowance?.balance,
    erc20TransferProxy,
    ethPriceUSD,
    mutateDaiAllowance,
    mutateUsdcAllowance,
    mutateWethAllowance,
    setAllowanceForContract,
    usdc,
    usdcAllowance?.balance,
    weth,
    wethAllowance?.balance
  ]);

  const getByContractAddress = useCallback((
    contractAddress: string
  ): NFTSupportedCurrency | null => {
    switch(contractAddress) {
    case dai.address:
      return data.DAI;
    case usdc.address:
      return data.USDC;
    case weth.address:
      return data.WETH;
    case NULL_ADDRESS:
      return data.ETH;
    }
    
    return null;
  }, [dai.address, data.DAI, data.ETH, data.USDC, data.WETH, usdc.address, weth.address]);

  return {
    data,
    getByContractAddress
  };
}