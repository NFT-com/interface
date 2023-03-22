import { NftCard } from 'components/modules/DiscoveryCards/NftCard';
import { NFTCard } from 'components/modules/NFTCard/NFTCard';
import { ProfileContext } from 'components/modules/Profile/ProfileContext';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { Doppler, getEnvBool } from 'utils/env';

import { outerElementType } from './outerElementType';

import { BigNumber } from 'ethers';
import React, { useContext } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

interface CardsGridProfilePageProps {
  gridData: any[];
}

export default function CardsGridProfilePage(props: CardsGridProfilePageProps) {
  const { gridData } = props;
  const {
    loadMoreNfts,
    pageInfo,
    loadingIL,
    toggleHidden,
    editMode,
    draftNftsDescriptionsVisible
  } = useContext(ProfileContext);
      
  const { width: screenWidth } = useWindowDimensions();
  
  const ITEM_WIDTH = 199;
  const ITEM_HEIGHT = 344;
  
  function generateIndexesForRow(rowIndex, maxItemsPerRow, itemsAmount) {
    const result = [];
    const startIndex = rowIndex * maxItemsPerRow;
    
    for (let i = startIndex; i < Math.min(startIndex + maxItemsPerRow, itemsAmount); i++) {
      result.push(i);
    }
    return result;
  }
    
  function getMaxItemsAmountPerRow(width) {
    // return Math.max(Math.floor(width / ITEM_WIDTH), 1);
    return screenWidth > 1600 ? 6 : screenWidth > 1200 && screenWidth <= 1600 ? 5 : screenWidth > 900 && screenWidth <= 1200 ? 4 : screenWidth > 600 && screenWidth <= 900 ? 3 : 2;
  }
    
  function getRowsAmount(width, itemsAmount, hasMore) {
    const maxItemsPerRow = getMaxItemsAmountPerRow(width);
    
    return Math.ceil(itemsAmount/ maxItemsPerRow) + (hasMore ? 1 : 0);
  }
    
  const RowItem = React.memo(function RowItem({ itemData }: any) {
    return (
      !getEnvBool(Doppler.NEXT_PUBLIC_SOCIAL_ENABLED) ?
        <NftCard
          key={itemData.id}
          name={itemData?.metadata?.name}
          images={[itemData?.previewLink || itemData?.metadata?.imageURL]}
          collectionName={itemData?.collection?.name}
          isOwnedByMe={itemData?.isOwnedByMe}
          listings={itemData?.listings?.items || []}
          nft={itemData}
          contractAddr={itemData?.contract}
          tokenId={itemData?.tokenId}
          // only show the eye icons to the owner in edit mode
          visible={editMode ?
            !itemData?.hidden :
            null
          }
          onVisibleToggle={() => {
            if (editMode) {
              toggleHidden(itemData?.id, !itemData?.hidden);
            }
          }}
          onClick={() => {
            if (editMode) {
              toggleHidden(itemData?.id, !itemData?.hidden);
            }
          }}
          redirectTo={!editMode && ('/app/nft/' + itemData?.contract + '/' + BigNumber.from(itemData?.tokenId).toString())}
          descriptionVisible={draftNftsDescriptionsVisible}
          preventDefault={editMode}
          isGKMinted={itemData?.GKMinted}
        /> :
        <NFTCard
          key={itemData.id}
          name={itemData?.metadata?.name}
          images={[itemData?.previewLink || itemData?.metadata?.imageURL]}
          collectionName={itemData?.collection?.name}
          isOwnedByMe={itemData?.isOwnedByMe}
          listings={itemData?.listings?.items || []}
          nft={itemData}
          contractAddr={itemData?.contract}
          tokenId={itemData?.tokenId}
          // only show the eye icons to the owner in edit mode
          visible={editMode ?
            !itemData?.hidden :
            null
          }
          onVisibleToggle={() => {
            if (editMode) {
              toggleHidden(itemData?.id, !itemData?.hidden);
            }
          }}
          onClick={() => {
            if (editMode) {
              toggleHidden(itemData?.id, !itemData?.hidden);
            }
          }}
          redirectTo={!editMode && ('/app/nft/' + itemData?.contract + '/' + BigNumber.from(itemData?.tokenId).toString())}
          descriptionVisible={draftNftsDescriptionsVisible}
          preventDefault={editMode}
          customPadding='pb-[13px]'
        />
    );
  });
  
  const loadMoreItems = () => {
    if (!loadingIL) {
      loadMoreNfts();
    }
  };
  
  const noItemsRenderer = () => (
    <div>no items found</div>
  );
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  const rowCount = getRowsAmount(width, gridData.length, pageInfo?.lastCursor !== null);

  const rowRenderer = ({ index, style }) => {
    const maxItemsPerRow = getMaxItemsAmountPerRow(width);
    const indexesPerRow = generateIndexesForRow(index, maxItemsPerRow, gridData.length);
    const nftsPerRow = indexesPerRow.length > 0 && indexesPerRow.map(nftIndex => gridData[nftIndex]);
    return (
      <div style={style} className='grid minmd:grid-cols-3 minlg:grid-cols-4 minxl:grid-cols-5 minxxl:grid-cols-6 h-72 gap-4' >
        {nftsPerRow.length > 0 && nftsPerRow.map(nft =>(
          <RowItem key={nft.id} itemData={nft}/>
        ))}
      </div>
    );
  };
  
  return (
    <InfiniteLoader
      //ref={this.infiniteLoaderRef}
      itemCount={rowCount}
      isItemLoaded={({ index }) => {
        const maxItemsPerRow = getMaxItemsAmountPerRow(width);
        const allItemsLoaded = generateIndexesForRow(index, maxItemsPerRow, gridData.length).length > 0;
  
        return pageInfo?.lastCursor === null || allItemsLoaded;
      }}
      loadMoreItems={loadMoreItems}
      threshold={1}
    >
      {({ onItemsRendered, ref }) => (
        <section>
          <List
            ref={ref}
            outerElementType={outerElementType}
            height={height}
            width={width}
            itemCount={rowCount}
            itemSize={ITEM_HEIGHT}
            onItemsRendered={onItemsRendered}
            noItemsRenderer={noItemsRenderer}
          >
            {rowRenderer}
          </List>
        </section>
      )}
    </InfiniteLoader>
  );
}