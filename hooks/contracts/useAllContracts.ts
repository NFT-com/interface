import {
  Dai,
  Genesis_key,
  Genesis_key_distributor,
  Genesis_key_team_claim,
  Genesis_key_team_distributor,
  MaxProfiles,
  Nft_profile,
  Nft_resolver,
  Nft_token,
  Profile_auction,
  Usdc,
  Validation_logic,
  Weth } from 'constants/typechain';
import { getDaiContract } from 'hooks/contracts/getDaiContract';
import { getGenesisKeyContract } from 'hooks/contracts/getGenesisKeyContract';
import { getNftProfileContract } from 'hooks/contracts/getNftProfileContract';
import { getNftTokenContract } from 'hooks/contracts/getNftTokenContract';
import { getProfileAuctionContract } from 'hooks/contracts/getProfileAuctionContract';
import { getUsdcContract } from 'hooks/contracts/getUsdcContract';
import { getWethContract } from 'hooks/contracts/getWethContract';
import { Doppler, getEnv } from 'utils/env';
import { getAddress } from 'utils/httpHooks';

import { getGenesisKeyDistributorContract } from './getGenesisKeyDistributorContract';
import { getGenesisKeyTeamClaimContract } from './getGenesisKeyTeamClaimContract';
import { getGenesisKeyTeamDistributorContract } from './getGenesisKeyTeamDistributorContract';
import { getMarketplaceContract } from './getMarketplaceContract';
import { getMarketplaceEventContract } from './getMarketplaceEventContract';
import { getMaxProfilesContract } from './getMaxProfilesContract';
import { getNftResolverContract } from './getNftResolverContract';
import { getValidationLogicContract } from './getValidationLogicContract';

import { useEffect, useState } from 'react';
import { useNetwork, useProvider, useSigner } from 'wagmi';

export interface Contracts {
  dai: Dai;
  weth: Weth;
  usdc: Usdc;
  nftToken: Nft_token;
  nftProfile: Nft_profile;
  nftResolver: Nft_resolver;
  profileAuction: Profile_auction | MaxProfiles;
  genesisKey: Genesis_key;
  genesisKeyDistributor: Genesis_key_distributor;
  genesisKeyTeamDistributor: Genesis_key_team_distributor;
  genesisKeyTeamClaim: Genesis_key_team_claim;
}

export function useAllContracts(): Contracts {
  const { chain } = useNetwork();
  const { data: signer } = useSigner();

  const chainId = chain?.id ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID);
  
  const provider = useProvider({ chainId: Number(chainId) });

  const [daiContract, setDaiContract] =
    useState(getDaiContract(getAddress('weth', chainId), provider));
  const [wethContract, setWethContract] =
    useState(getWethContract(getAddress('weth', chainId), provider));
  const [usdcContract, setUsdcContract] =
    useState(getUsdcContract(getAddress('usdc', chainId), provider));
  const [nftTokenContract, setNftTokenContract] =
    useState(getNftTokenContract(getAddress('nft', chainId), provider));
  const [nftProfileContract, setNftProfileContract] =
    useState(getNftProfileContract(getAddress('nftProfile', chainId), provider));
  const [profileAuctionContract, setProfileAuctionContract] = useState(
    chainId === 5 ?
      getMaxProfilesContract(getAddress('profileAuction', chainId), provider) :
      getProfileAuctionContract(
        getAddress('profileAuction', chainId),
        provider
      ));
  const [genesisKeyContract, setGenesisKeyContract] =
    useState(getGenesisKeyContract(getAddress('genesisKey', chainId), provider));
  const [genesisKeyDistributorContract, setGenesisKeyDistributorContract] = useState(
    getGenesisKeyDistributorContract(getAddress('genesisKeyDistributor', chainId), provider)
  );
  const [genesisKeyTeamDistributorContract, setGenesisKeyTeamDistributorContract] = useState(
    getGenesisKeyTeamDistributorContract(
      getAddress('genesisKeyTeamDistributor', chainId),
      provider
    )
  );
  const [genesisKeyTeamClaim, setGenesisKeyTeamClaim] = useState(
    getGenesisKeyTeamClaimContract(getAddress('genesisKeyTeamClaim', chainId), provider)
  );
  const [nftResolverContract, setNftResolverContract] =
  useState(getNftResolverContract(getAddress('nftResolver', chainId), signer));

  useEffect(() => {
    setDaiContract(getDaiContract(getAddress('dai', chainId), provider));
    setWethContract(getWethContract(getAddress('weth', chainId), provider));
    setUsdcContract(getUsdcContract(getAddress('usdc', chainId), provider));
    setNftTokenContract(getNftTokenContract(getAddress('nft', chainId), provider));
    setNftProfileContract(getNftProfileContract(getAddress('nftProfile', chainId), provider));
    setProfileAuctionContract(
      getProfileAuctionContract(getAddress('profileAuction', chainId), provider)
    );
    setGenesisKeyContract(getGenesisKeyContract(getAddress('genesisKey', chainId), provider));
    setGenesisKeyDistributorContract(
      getGenesisKeyDistributorContract(getAddress('genesisKeyDistributor', chainId), provider)
    );
    setGenesisKeyTeamDistributorContract(
      getGenesisKeyTeamDistributorContract(
        getAddress('genesisKeyTeamDistributor', chainId),
        provider
      )
    );
    setGenesisKeyTeamClaim(
      getGenesisKeyTeamClaimContract(getAddress('genesisKeyTeamClaim', chainId), provider)
    );
    setNftResolverContract(
      getNftResolverContract(getAddress('nftResolver', chainId), signer)
    );
  }, [chainId, provider, signer]);
  
  return {
    dai: daiContract,
    weth: wethContract,
    usdc: usdcContract,
    nftToken: nftTokenContract,
    nftProfile: nftProfileContract,
    nftResolver: nftResolverContract,
    profileAuction: profileAuctionContract,
    genesisKey: genesisKeyContract,
    genesisKeyDistributor: genesisKeyDistributorContract,
    genesisKeyTeamDistributor: genesisKeyTeamDistributorContract,
    genesisKeyTeamClaim: genesisKeyTeamClaim,
  };
}
