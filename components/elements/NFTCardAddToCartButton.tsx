import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchasesContext } from 'components/modules/Checkout/NFTPurchaseContext';
import { getAddressForChain, nftAggregator } from 'constants/contracts';
import { WETH } from 'constants/tokens';
import { AuctionType, LooksrareProtocolData, Nft, NftcomProtocolData, SeaportProtocolData, TxActivity, X2Y2ProtocolData } from 'graphql/generated/types';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useGetCurrentDate } from 'hooks/useGetCurrentDate';
import { useGetERC20ProtocolApprovalAddress } from 'hooks/useGetERC20ProtocolApprovalAddress';
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
  const getERC20ProtocolApprovalAddress = useGetERC20ProtocolApprovalAddress();
  const currentDate = useGetCurrentDate();
  
  return (
    <button onClick={async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const listing = lowestListing;
      const currencyData = getByContractAddress(getListingCurrencyAddress(listing) ?? WETH.address);
      const allowance = await currencyData.allowance(currentAddress, getAddressForChain(nftAggregator, defaultChainId));
      const protocolAllowance = await currencyData.allowance(currentAddress, getERC20ProtocolApprovalAddress(listing?.order?.protocol as ExternalProtocol));
      const price = getListingPrice(listing, (listing?.order?.protocolData as NftcomProtocolData).auctionType === AuctionType.Decreasing ? currentDate : null);
      const protocol = listing?.order?.protocol as ExternalProtocol;
      stagePurchase({
        nft: props.nft,
        activityId: listing?.id,
        currency: getListingCurrencyAddress(listing) ?? WETH.address,
        price: price,
        collectionName: props.collectionName,
        protocol: protocol,
        isERC20ApprovedForAggregator: BigNumber.from(allowance ?? 0).gt(price),
        isERC20ApprovedForProtocol: BigNumber.from(protocolAllowance ?? 0).gt(price),
        orderHash: listing?.order?.orderHash,
        makerAddress: listing?.order.makerAddress,
        takerAddress: listing?.order.takerAddress,
        nonce: listing?.order?.nonce,
        protocolData: listing?.order?.protocol === ExternalProtocol.Seaport ?
          listing?.order?.protocolData as SeaportProtocolData :
          listing?.order?.protocol === ExternalProtocol.X2Y2 ?
            listing?.order?.protocolData as X2Y2ProtocolData:
            listing?.order?.protocolData as LooksrareProtocolData
      });
      toggleCartSidebar('Buy');
    }}
    className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-5 rounded focus:outline-none focus:shadow-outline w-full" type="button">
      Add to cart
    </button>
  );
};