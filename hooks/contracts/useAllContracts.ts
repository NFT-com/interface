import { Dai } from 'constants/typechain/Dai';
import { GenesisKey } from 'constants/typechain/GenesisKey';
import { GenesisKeyDistributor } from 'constants/typechain/GenesisKeyDistributor';
import { GenesisKeyTeamClaim } from 'constants/typechain/GenesisKeyTeamClaim';
import { GenesisKeyTeamDistributor } from 'constants/typechain/GenesisKeyTeamDistributor';
import { Marketplace } from 'constants/typechain/Marketplace';
import { MarketplaceEvent } from 'constants/typechain/MarketplaceEvent';
import { NftProfile } from 'constants/typechain/NftProfile';
import { NftToken } from 'constants/typechain/NftToken';
import { ProfileAuction } from 'constants/typechain/ProfileAuction';
import { Usdc } from 'constants/typechain/Usdc';
import { ValidationLogic } from 'constants/typechain/ValidationLogic';
import { Weth } from 'constants/typechain/Weth';
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
  nftToken: NftToken;
  nftProfile: NftProfile;
  profileAuction: ProfileAuction;
  genesisKey: GenesisKey;
  genesisKeyDistributor: GenesisKeyDistributor;
  marketplace: Marketplace;
  marketplaceEvent: MarketplaceEvent;
  marketplaceValidator: ValidationLogic;
  genesisKeyTeamDistributor: GenesisKeyTeamDistributor;
  genesisKeyTeamClaim: GenesisKeyTeamClaim;
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
