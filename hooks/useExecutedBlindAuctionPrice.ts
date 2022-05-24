import { useAllContracts } from './contracts/useAllContracts';

import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';

export function useExecutedBlindAuctionPrice(): BigNumber {
  const [blindAuctionPrice, setBlindAuctionPrice] = useState(BigNumber.from(0));
  const { genesisKeyDistributor } = useAllContracts();
  
  useEffect(() => {
    (async () => {
      const ethAmount = await genesisKeyDistributor.ethAmount();
      setBlindAuctionPrice(ethAmount);
    })();
  }, [genesisKeyDistributor]);

  return blindAuctionPrice;
}