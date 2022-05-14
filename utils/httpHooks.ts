import dai from 'constants/abis/dai.json';
import daiMainnet from 'constants/abis/dai_mainnet.json';
import marketplaceABI from 'constants/abis/marketplace.json';
import marketplaceABIMainnet from 'constants/abis/marketplace_mainnet.json';
import nftProfileABI from 'constants/abis/nft_profile.json';
import nftProfileABIMainnet from 'constants/abis/nft_profile_mainnet.json';
import nftTokenABI from 'constants/abis/nft_token.json';
import nftTokenABIMainnet from 'constants/abis/nft_token_mainnet.json';
import profileAuctionABI from 'constants/abis/profile_auction.json';
import profileAuctionABIMainnet from 'constants/abis/profile_auction_mainnet.json';
import usdc from 'constants/abis/usdc.json';
import usdcMainnet from 'constants/abis/usdc_mainnet.json';
import weth from 'constants/abis/weth.json';
import wethMainnet from 'constants/abis/weth_mainnet.json';
import {
  genesisKey,
  genesisKeyDistributor,
  genesisKeyTeamClaim,
  genesisKeyTeamDistributor,
  marketplace,
  marketplaceEvent,
  nftProfile,
  nftToken,
  profileAuction,
  validationLogic
} from 'constants/contracts';
import { DeployedContract } from 'constants/contracts';
import {
  DAI,
  DAI_RINKEBY,
  USDC,
  USDC_RINKEBY,
  WETH,
  WETH_RINKEBY
} from 'constants/tokens';
import { getEnv, Secret } from 'utils/getEnv';

import { ethers } from 'ethers';

export const isSandbox = (chainId: number | string | undefined) => {
  switch (Number(chainId)) {
  case 1:
    return false;
  default:
    return true;
  }
};

export const isProduction = (chainId: number | string) => {
  return !isSandbox(chainId);
};

const deployedContractAddressResolver = (chainId: number | string, tokenContract: DeployedContract) => {
  return ethers.utils.getAddress(isSandbox(chainId) ? tokenContract.rinkeby : tokenContract.mainnet);
};

export type SupportedTokenContract =
  | 'nft'
  | 'marketplace'
  | 'profileAuction'
  | 'nftProfile'
  | 'usdc'
  | 'dai'
  | 'weth'
  | 'erc721'
  | 'eip2612'
  | 'genesisKey'
  | 'genesisKeyDistributor'
  | 'validationLogic'
  | 'marketplaceEvent'
  | 'genesisKeyTeamDistributor'
  | 'genesisKeyTeamClaim';

export const getAddress = (token: SupportedTokenContract, chainId: number | string | undefined) => {
  if (getEnv(Secret.NEXT_PUBLIC_ENV) === 'PRODUCTION') {
    chainId = 1;
  }
  switch (token) {
  case 'marketplace':
    return deployedContractAddressResolver(chainId, marketplace);
  case 'validationLogic':
    return deployedContractAddressResolver(chainId, validationLogic);
  case 'marketplaceEvent':
    return deployedContractAddressResolver(chainId, marketplaceEvent);
  case 'genesisKey':
    return deployedContractAddressResolver(chainId, genesisKey);
  case 'genesisKeyDistributor':
    return deployedContractAddressResolver(chainId, genesisKeyDistributor);
  case 'genesisKeyTeamDistributor':
    return deployedContractAddressResolver(chainId, genesisKeyTeamDistributor);
  case 'genesisKeyTeamClaim':
    return deployedContractAddressResolver(chainId, genesisKeyTeamClaim);
  case 'nft':
    return deployedContractAddressResolver(chainId, nftToken);
  case 'nftProfile':
    return deployedContractAddressResolver(chainId, nftProfile);
  case 'profileAuction':
    return deployedContractAddressResolver(chainId, profileAuction);
  case 'usdc':
    return ethers.utils.getAddress(isSandbox(chainId) ? USDC_RINKEBY.address : USDC.address);
  case 'dai':
    return ethers.utils.getAddress(isSandbox(chainId) ? DAI_RINKEBY.address : DAI.address);
  case 'weth':
    return ethers.utils.getAddress(isSandbox(chainId) ? WETH_RINKEBY.address : WETH.address);
  default:
    return '';
  }
};

export const getABI = (token: SupportedTokenContract, chainId: number | string) => {
  switch (token) {
  case 'nft':
    return isSandbox(chainId) ? nftTokenABI : nftTokenABIMainnet;
  case 'marketplace':
    return isSandbox(chainId) ? marketplaceABI : marketplaceABIMainnet;
  case 'profileAuction':
    return isSandbox(chainId) ? profileAuctionABI : profileAuctionABIMainnet;
  case 'nftProfile':
    return isSandbox(chainId) ? nftProfileABI : nftProfileABIMainnet;
  case 'usdc':
    return isSandbox(chainId) ? usdc : usdcMainnet;
  case 'dai':
    return isSandbox(chainId) ? dai : daiMainnet;
  case 'weth':
    return isSandbox(chainId) ? weth : wethMainnet;
  default:
    return '';
  }
};
