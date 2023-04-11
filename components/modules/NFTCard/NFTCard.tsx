import LikeCount from 'components/elements/LikeCount';
import { DetailedNft } from 'components/modules/DiscoveryCards/CollectionCard';
import { WETH } from 'constants/tokens';
import { LikeableType, TxActivity } from 'graphql/generated/types';
import { useNftLikeQuery } from 'graphql/hooks/useNFTLikeQuery';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { getGenesisKeyThumbnail, isNullOrEmpty, processIPFSURL, sameAddress } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { getListingCurrencyAddress, getLowestPriceListing } from 'utils/listingUtils';
import { filterValidListings } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import { NFTCardButton } from './NFTCardButton';
import { NFTCardDescription } from './NFTCardDescription';
import { NFTCardEditMode } from './NFTCardEditMode';
import { NFTCardImage } from './NFTCardImage';

import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';
export interface NftCardProps {
  name: string;
  images: Array<string | null>;
  collectionName: string;
  contractAddr: string;
  tokenId: string;
  redirectTo: string;

  listings?: PartialDeep<TxActivity>[];
  nft?: PartialDeep<DetailedNft>;
  isOwnedByMe?: boolean;
  visible?: boolean | null;
  onVisibleToggle?: (visible: boolean) => void;
  onClick?: () => void;
  descriptionVisible?: boolean;
  preventDefault?: boolean;
}

export function NFTCard(props: NftCardProps) {
  const { address: currentAddress } = useAccount();
  const defaultChainId = useDefaultChainId();
  const chainId = useDefaultChainId();
  const ethPriceUSD = useEthPriceUSD();

  const { getByContractAddress } = useSupportedCurrencies();

  const { data: nft } = useNftQuery(props.contractAddr, (props?.listings?.length || props?.nft) ? null : props.tokenId); // skip query if listings are passed, or if nft is passed by setting tokenId to null
  const { data: nftLikeData, mutate: mutateNftLike } = useNftLikeQuery(props.contractAddr, props.tokenId);
  const processedImageURLs = sameAddress(props.contractAddr, getAddress('genesisKey', defaultChainId)) && !isNullOrEmpty(props.tokenId) ?
    [getGenesisKeyThumbnail(props.tokenId)]
    : props.images.length > 0 ? props.images?.map(processIPFSURL) : [nft?.metadata?.imageURL].map(processIPFSURL);
  const bestListing = getLowestPriceListing(filterValidListings(props.listings ?? nft?.listings?.items), ethPriceUSD, chainId);
  const isOwnedByMe = props?.isOwnedByMe || (props?.nft?.wallet?.address ?? props?.nft?.owner) === currentAddress;
  const currencyData = getByContractAddress(getListingCurrencyAddress(bestListing) ?? WETH.address);

  return (
    <div className='relative w-full h-full'>
      {props?.visible !== true && props?.visible !== false &&
        <div className='absolute top-4 right-4 z-50'>
          <LikeCount
            mutate={mutateNftLike}
            count={nftLikeData?.likeCount}
            isLiked={nftLikeData?.isLikedBy}
            likeData={{
              id: nft?.id ?? props?.nft?.id,
              type: LikeableType.Nft
            }}
          />
        </div>
      }

      <div className={tw(
        'group/ntfCard transition-all cursor-pointer rounded-2xl shadow-xl relative w-full h-full minmd:mb-0 overflow-visible',
        props.descriptionVisible != false ? '' : 'h-max'
      )}>
        <NFTCardEditMode {...props} />
        <a
          href={props.redirectTo && props.redirectTo !== '' ? props.redirectTo : '#'}
          onClick={(e) => {
            e.stopPropagation();
            props.preventDefault && e.preventDefault();
            gtag('event', `${props?.visible ? 'Hide' : 'Show'} Single NFT`, {
              ethereumAddress: currentAddress,
              title: props?.name,
              processedImageURLs: processedImageURLs?.[0]
            });
            props.onClick && props.onClick();
          }}
        >
          <div className={tw(
            'relative object-cover w-full h-max flex flex-col',
            !bestListing && props.descriptionVisible && 'mb-10'
          )}>
            <NFTCardImage {...props} bestListing={bestListing} nft={nft} isOwnedByMe={isOwnedByMe} currencyData={currencyData} />
            {props.descriptionVisible != false &&
              <NFTCardDescription {...props} bestListing={bestListing} nft={nft} currencyData={currencyData} />
            }
            {(props?.listings?.length || nft?.listings?.items?.length) && bestListing && props?.descriptionVisible !== false && !isOwnedByMe ?
              <NFTCardButton {...props} bestListing={bestListing} nft={nft} currencyData={currencyData} />
              : null
            }
          </div>
        </a>
      </div>
    </div>
  );
}
