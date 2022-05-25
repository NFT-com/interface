import {
  Dai,
  Genesis_key,
  Genesis_key_distributor,
  Genesis_key_team_claim,
  Genesis_key_team_distributor,
  Marketplace,
  Marketplace_event,
  Nft_profile,
  Nft_token,
  Profile_auction,
  Usdc,
  Validation_logic,
  Weth
} from 'constants/typechain';
import { getDaiContract } from 'hooks/contracts/getDaiContract';
import { getGenesisKeyContract } from 'hooks/contracts/getGenesisKeyContract';
import { getNftProfileContract } from 'hooks/contracts/getNftProfileContract';
import { getNftTokenContract } from 'hooks/contracts/getNftTokenContract';
import { getProfileAuctionContract } from 'hooks/contracts/getProfileAuctionContract';
import { getUsdcContract } from 'hooks/contracts/getUsdcContract';
import { getWethContract } from 'hooks/contracts/getWethContract';
import { getAddress } from 'utils/httpHooks';

import { getGenesisKeyDistributorContract } from './getGenesisKeyDistributorContract';
import { getGenesisKeyTeamClaimContract } from './getGenesisKeyTeamClaimContract';
import { getGenesisKeyTeamDistributorContract } from './getGenesisKeyTeamDistributorContract';
import { getMarketplaceContract } from './getMarketplaceContract';
import { getMarketplaceEventContract } from './getMarketplaceEventContract';
import { getValidationLogicContract } from './getValidationLogicContract';

import { useEffect, useState } from 'react';
import { useNetwork, useProvider } from 'wagmi';

export interface Contracts {
  dai: Dai;
  weth: Weth;
  usdc: Usdc;
  nftToken: Nft_token;
  nftProfile: Nft_profile;
  profileAuction: Profile_auction;
  genesisKey: Genesis_key;
  genesisKeyDistributor: Genesis_key_distributor;
  marketplace: Marketplace;
  marketplaceEvent: Marketplace_event;
  marketplaceValidator: Validation_logic;
  genesisKeyTeamDistributor: Genesis_key_team_distributor;
  genesisKeyTeamClaim: Genesis_key_team_claim;
}

export function useAllContracts(): Contracts {
  const { activeChain } = useNetwork();
  const provider = useProvider({ chainId: activeChain?.id ?? 0 });
  
  const [daiContract, setDaiContract] =
    useState(getDaiContract(getAddress('weth', activeChain?.id), provider));
  const [wethContract, setWethContract] =
    useState(getWethContract(getAddress('weth', activeChain?.id), provider));
  const [usdcContract, setUsdcContract] =
    useState(getUsdcContract(getAddress('usdc', activeChain?.id), provider));
  const [nftTokenContract, setNftTokenContract] =
    useState(getNftTokenContract(getAddress('nft', activeChain?.id), provider));
  const [nftProfileContract, setNftProfileContract] =
    useState(getNftProfileContract(getAddress('nftProfile', activeChain?.id), provider));
  const [profileAuctionContract, setProfileAuctionContract] = useState(getProfileAuctionContract(
    getAddress('profileAuction', activeChain?.id),
    provider
  ));
  const [genesisKeyContract, setGenesisKeyContract] =
    useState(getGenesisKeyContract(getAddress('genesisKey', activeChain?.id), provider));
  const [marketPlaceContract, setMarketPlaceContract] =
    useState(getMarketplaceContract(getAddress('marketplace', activeChain?.id), provider));
  const [validationLogicContract, setValidationLogicContract] =
    useState(getValidationLogicContract(getAddress('validationLogic', activeChain?.id), provider));
  const [marketplaceEventContract, setMarketplaceEventContract] =
      useState(getMarketplaceEventContract(getAddress('marketplaceEvent', activeChain?.id), provider));
  const [genesisKeyDistributorContract, setGenesisKeyDistributorContract] = useState(
    getGenesisKeyDistributorContract(getAddress('genesisKeyDistributor', activeChain?.id), provider)
  );
  const [genesisKeyTeamDistributorContract, setGenesisKeyTeamDistributorContract] = useState(
    getGenesisKeyTeamDistributorContract(
      getAddress('genesisKeyTeamDistributor', activeChain?.id),
      provider
    )
  );
  const [genesisKeyTeamClaim, setGenesisKeyTeamClaim] = useState(
    getGenesisKeyTeamClaimContract(getAddress('genesisKeyTeamClaim', activeChain?.id), provider)
  );

  useEffect(() => {
    setDaiContract(getDaiContract(getAddress('dai', activeChain?.id), provider));
    setWethContract(getWethContract(getAddress('weth', activeChain?.id), provider));
    setUsdcContract(getUsdcContract(getAddress('usdc', activeChain?.id), provider));
    setNftTokenContract(getNftTokenContract(getAddress('nft', activeChain?.id), provider));
    setNftProfileContract(getNftProfileContract(getAddress('nftProfile', activeChain?.id), provider));
    setProfileAuctionContract(
      getProfileAuctionContract(getAddress('profileAuction', activeChain?.id), provider)
    );
    setGenesisKeyContract(getGenesisKeyContract(getAddress('genesisKey', activeChain?.id), provider));
    setMarketPlaceContract(
      getMarketplaceContract(getAddress('marketplace', activeChain?.id), provider)
    );
    setValidationLogicContract(
      getValidationLogicContract(getAddress('validationLogic', activeChain?.id), provider)
    );
    setMarketplaceEventContract(
      getMarketplaceEventContract(getAddress('marketplaceEvent', activeChain?.id), provider)
    );
    setGenesisKeyDistributorContract(
      getGenesisKeyDistributorContract(getAddress('genesisKeyDistributor', activeChain?.id), provider)
    );
    setGenesisKeyTeamDistributorContract(
      getGenesisKeyTeamDistributorContract(
        getAddress('genesisKeyTeamDistributor', activeChain?.id),
        provider
      )
    );
    setGenesisKeyTeamClaim(
      getGenesisKeyTeamClaimContract(getAddress('genesisKeyTeamClaim', activeChain?.id), provider)
    );
  }, [activeChain, provider]);

  return {
    dai: daiContract,
    weth: wethContract,
    usdc: usdcContract,
    nftToken: nftTokenContract,
    nftProfile: nftProfileContract,
    profileAuction: profileAuctionContract,
    genesisKey: genesisKeyContract,
    genesisKeyDistributor: genesisKeyDistributorContract,
    marketplace: marketPlaceContract,
    marketplaceEvent: marketplaceEventContract,
    marketplaceValidator: validationLogicContract,
    genesisKeyTeamDistributor: genesisKeyTeamDistributorContract,
    genesisKeyTeamClaim: genesisKeyTeamClaim,
  };
}
