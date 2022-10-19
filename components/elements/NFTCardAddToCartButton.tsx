import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchasesContext } from 'components/modules/Checkout/NFTPurchaseContext';
import { getAddressForChain, nftAggregator } from 'constants/contracts';
import { WETH } from 'constants/tokens';
import { LooksrareProtocolData, Nft, SeaportProtocolData, TxActivity } from 'graphql/generated/types';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { ExternalProtocol } from 'types';
import { getListingCurrencyAddress, getListingPrice } from 'utils/listingUtils';

import { BigNumber } from 'ethers';
import { MouseEvent, useContext } from 'react';
import { PartialObjectDeep } from 'type-fest/source/partial-deep';
import { useAccount } from 'wagmi';

export const NFTCardAddToCartButton = ( props: {
  lowestListing: PartialObjectDeep<TxActivity, unknown>
  collectionName?: string | any;
  nft: PartialObjectDeep<Nft, unknown>;
}) => {
  const { lowestListing } = props;
  const { getByContractAddress } = useSupportedCurrencies();
  const { address: currentAddress } = useAccount();
  const defaultChainId = useDefaultChainId();
  const { stagePurchase } = useContext(NFTPurchasesContext);
  const { toggleCartSidebar } = useContext(NFTListingsContext);
  
  return (
    <button onClick={async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const listing = lowestListing;
      const currencyData = getByContractAddress(getListingCurrencyAddress(listing) ?? WETH.address);
      const allowance = await currencyData.allowance(currentAddress, getAddressForChain(nftAggregator, defaultChainId));
      const price = getListingPrice(listing);
      stagePurchase({
        nft: props.nft,
        activityId: listing?.id,
        currency: getListingCurrencyAddress(listing) ?? WETH.address,
        price: price,
        collectionName: props.collectionName,
        protocol: listing?.order?.protocol as ExternalProtocol,
        isApproved: BigNumber.from(allowance ?? 0).gt(price),
        protocolData: listing?.order?.protocol === ExternalProtocol.Seaport ?
          listing?.order?.protocolData as SeaportProtocolData :
          listing?.order?.protocolData as LooksrareProtocolData
      });
      toggleCartSidebar('Buy');
    }}
    className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-5 rounded focus:outline-none focus:shadow-outline w-full" type="button">
      Add to cart
    </button>
  );
};