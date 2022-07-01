import { NFTCard } from 'components/elements/NFTCard';
import { MarketplaceAsset } from 'graphql/generated/types';
import { useFetchNFT } from 'graphql/hooks/useFetchNft';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { filterNulls, processIPFSURL } from 'utils/helpers';
import { isNFT } from 'utils/marketplaceUtils';

import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';

export interface MarketplaceMultiAssetCardProps {
  assets: PartialDeep<MarketplaceAsset>[];
  subtitle: string;
  type?: string;
  onClick: () => void;
  onSelectToggle: (selected: boolean) => void;
}

/**
 * Takes an array of NFTs or currencies in the MarketplaceAsset format,
 * and renders up to 4 images for them.
 * 
 * Note: to render an NFT's image, the nftId must be present on the asset,
 * and the NFT must exist by that ID in our database.
 */
export function MarketplaceMultiAssetCard(props: MarketplaceMultiAssetCardProps) {
  const { getByContractAddress } = useSupportedCurrencies();
  const { fetchNFT } = useFetchNFT();
  
  const [assetImages, setAssetImages] = useState([]);
  const [singleAssetTitle, setSingleAssetTitle] = useState(null);

  useEffect(() => {
    if (assetImages.length > 0) {
      // only fetch these once
      return;
    }
    (async () => {
      const images = await Promise.all(props.assets.map(async (asset) => {
        if (isNFT(asset.standard.assetClass)) {
          const nft = await fetchNFT(
            asset?.standard?.contractAddress,
            BigNumber.from(asset?.standard?.tokenId).toString()
          );
          if (props.assets.length === 1) {
            setSingleAssetTitle(nft?.metadata?.name);
          }
          return processIPFSURL(nft?.metadata?.imageURL);
        } else {
          const currency = getByContractAddress(
            asset.standard.contractAddress
          );
          if (props.assets.length === 1) {
            setSingleAssetTitle(currency.name);
          }
          return currency.logo;
        }
      }));
      setAssetImages(filterNulls(images));
    })();
  }, [assetImages.length, fetchNFT, getByContractAddress, props.assets]);

  const firstAssetType = isNFT(props.assets[0].standard.assetClass) ? 'NFT': 'Currency';
  return <NFTCard
    header={{
      key: 'Type: ',
      value: props.type ?? (props.assets.length > 1 ? 'Basket' : firstAssetType)
    }}
    title={singleAssetTitle ?? props.assets.length + ' items'}
    subtitle={props.subtitle}
    images={assetImages}
    onClick={props.onClick}
    onSelectToggle={props.onSelectToggle}
  />;
}