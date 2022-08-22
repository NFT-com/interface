import { NULL_ADDRESS } from 'constants/addresses';
import { Dai, Usdc, Weth } from 'constants/typechain';
import { useBalances } from 'hooks/balances/useBalances';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { MAX_UINT_256 } from 'utils/marketplaceUtils';

import { TransferProxyTarget } from './balances/useNftCollectionAllowance';

import { BigNumberish } from '@ethersproject/bignumber';
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
  allowance: (address: string, proxy: TransferProxyTarget) => Promise<BigNumberish>;
  setAllowance: (address: string, proxy: TransferProxyTarget) => Promise<boolean>;
  balance: BigNumberish;
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
  const { address, connector } = useAccount();
  const balances = useBalances(address);

  const setAllowanceForContract = useCallback(async (
    contract: Dai | Weth | Usdc,
    currentAddress: string,
    proxy: TransferProxyTarget
  ): Promise<boolean> => {
    return contract
      .connect(await connector?.getSigner() ?? currentAddress)
      .approve(proxy, MAX_UINT_256)
      .then((tx) => tx.wait(1))
      .then(() => true)
      .catch(() => {
        console.log('Failed to get currency approval. Please connect wallet.');
        return false;
      });
  }, [connector]);

  const data: NFTSupportedCurrencies = useMemo(() => {
    return {
      'WETH': {
        name: 'WETH',
        logo: WETH_LOGO,
        contract: weth.address,
        usd: (val: number) => Number(Number(val * ethPriceUSD).toFixed(2)),
        allowance: async (currentAddress: string, proxy: TransferProxyTarget) => {
          const wethAllowance = await weth.allowance(currentAddress, proxy ?? NULL_ADDRESS);
          return wethAllowance;
        },
        setAllowance: (currentAddress: string, proxy: TransferProxyTarget) => setAllowanceForContract(weth, currentAddress, proxy),
        // balance: balances.weth?.balance ?? 0,
        balance: 0,
      },
      'ETH': {
        name: 'ETH',
        logo: ETH_LOGO,
        contract: NULL_ADDRESS,
        usd: (val: number) => Number(Number(val * ethPriceUSD).toFixed(2)),
        allowance: async () => {
          // ETH doesn't have allowances - just need to include ETH
          // in amount field as payable transaction.
          return 0;
        },
        setAllowance: async () => true,
        balance: balances.eth?.balance ?? 0,
      },
      'DAI': {
        name: 'DAI',
        logo: DAI_LOGO,
        contract: dai.address,
        usd: (val: number) => val,
        allowance: async (currentAddress: string, proxy: TransferProxyTarget) => {
          const daiAllowance = await dai.allowance(currentAddress, proxy ?? NULL_ADDRESS);
          return daiAllowance;
        },
        setAllowance: (currentAddress: string, proxy: TransferProxyTarget) => setAllowanceForContract(dai, currentAddress, proxy),
        // balance: balances.dai?.balance ?? 0,
        balance: 0,
      },
      'USDC': {
        name: 'USDC',
        logo: USDC_LOGO,
        contract: usdc.address,
        usd: (val: number) => val,
        allowance: async (currentAddress: string, proxy: TransferProxyTarget) => {
          const usdcAllowance = await usdc.allowance(currentAddress, proxy ?? NULL_ADDRESS);
          return usdcAllowance;
        },
        setAllowance: (currentAddress: string, proxy: TransferProxyTarget) => setAllowanceForContract(usdc, currentAddress, proxy),
        // balance: balances.usdc?.balance ?? 0,
        balance: 0,
      }
    };
  }, [balances.eth?.balance, dai, ethPriceUSD, setAllowanceForContract, usdc, weth]);

  const getByContractAddress = useCallback((
    contractAddress: string
  ): NFTSupportedCurrency | null => {
    switch(contractAddress.toLowerCase()) {
    case dai.address.toLowerCase():
      return data.DAI;
    case usdc.address.toLowerCase():
      return data.USDC;
    case weth.address.toLowerCase():
      return data.WETH;
    case NULL_ADDRESS.toLowerCase():
      return data.ETH;
    }
    
    return null;
  }, [dai.address, data.DAI, data.ETH, data.USDC, data.WETH, usdc.address, weth.address]);

  return {
    data,
    getByContractAddress
  };
}