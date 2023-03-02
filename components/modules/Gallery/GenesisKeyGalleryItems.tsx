import { Maybe } from 'graphql/generated/types';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { AlchemyOwnedNFT } from 'types';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import GenesisKeyGalleryCard from './GenesisKeyGalleryCard';

import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { memo, useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import AutoSizer from 'react-virtualized-auto-sizer';
import { areEqual, FixedSizeGrid } from 'react-window';
import { useAccount } from 'wagmi';

export interface GenesisKeyGalleryItemsProps {
  showMyStuff: boolean;
  currentFilter: string;
  setDetailId: (id: Maybe<number>) => void;
}

export function GenesisKeyGalleryItems(props: GenesisKeyGalleryItemsProps) {
  const { address: currentAddress } = useAccount();
  const router = useRouter();
  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(currentAddress);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const itemsPerRow = useCallback(() => {
    if (screenWidth < 640) {
      return 2;
    } else if (screenWidth < 960) {
      return 3;
    } else if (screenWidth < 1280) {
      return 4;
    } else {
      return 5;
    }
  }, [screenWidth]);

  const getRowHeight = useCallback((rowWidth: number) => {
    return Math.floor(rowWidth / itemsPerRow());
  }, [itemsPerRow]);

  const getTokenIdForGrid = useCallback((rowIndex: number, columnIndex: number) => {
    const start = rowIndex * itemsPerRow() + 1;
    return start + columnIndex;
  }, [itemsPerRow]);

  const GKGridCell = memo<{
    columnIndex: number,
    rowIndex: number;
    style: any;
  }>((cellProps) => {
    const tokenId = getTokenIdForGrid(cellProps.rowIndex, cellProps.columnIndex);
    if (BigNumber.from(tokenId).gt(10000)) {
      return null;
    }
    return (
      <div
        style={cellProps.style}
        key={tokenId}
        className={tw(
          'flex mb-4 items-center justify-center px-4',
          'minxl:w-1/5 minlg:w-1/4 minmd:w-1/3 w-2/5'
        )}
      >
        <GenesisKeyGalleryCard
          key={tokenId}
          id={tokenId}
          onClick={() => {
            if (isMobile) {
              router.push('/app/gallery/' + tokenId);
            } else {
              props.setDetailId(tokenId);
            }
          }}
        />
      </div>
    );
  },
  // custom areEqual function from react-window.
  areEqual
  );
  GKGridCell.displayName = 'GKGridCell';

  const gkIDFilter: (token: AlchemyOwnedNFT) => boolean = useCallback((token: AlchemyOwnedNFT) => {
    if (isNullOrEmpty(props.currentFilter)) {
      return true;
    }
    return BigNumber.from(token?.id?.tokenId).toString() === props.currentFilter;
  }, [props.currentFilter]);

  if (!isNullOrEmpty(props.currentFilter) && !props.showMyStuff) {
    const filterID = parseInt(props.currentFilter, 10);
    if (BigNumber.from(filterID).gt(10000) || BigNumber.from(filterID).lte(0)) {
      return null;
    }
    return (
      <div
        key={props.currentFilter}
        className={tw(
          'SingleGKSearchResultContainer',
          'flex mb-4 items-center justify-center px-4',
          'minxl:w-1/5 minlg:w-1/4 minmd:w-1/3 w-2/5'
        )}
      >
        <GenesisKeyGalleryCard
          key={props.currentFilter}
          id={filterID}
          onClick={() => {
            if (isMobile) {
              router.push('/app/gallery/' + filterID);
            } else {
              props.setDetailId(filterID);
            }
          }}
        />
      </div>
    );
  } else if (props.showMyStuff) {
    return (
      <>
        {(ownedGKTokens?.filter(gkIDFilter) ?? []).map((genesisKeyToken) => {
          return (
            <div
              key={genesisKeyToken?.id?.tokenId}
              className={tw(
                'MyGKSearchResultContainer',
                'flex mb-4 items-center justify-center px-4',
                'minxl:w-1/5 minlg:w-1/4 minmd:w-1/3 w-2/5'
              )}
            >
              <GenesisKeyGalleryCard
                key={BigNumber.from(genesisKeyToken?.id?.tokenId).toNumber()}
                id={BigNumber.from(genesisKeyToken?.id?.tokenId).toNumber()}
                onClick={() => {
                  if (isMobile) {
                    router.push('/app/gallery/' + BigNumber.from(genesisKeyToken?.id?.tokenId).toNumber());
                  } else {
                    props.setDetailId(BigNumber.from(genesisKeyToken?.id?.tokenId).toNumber());
                  }
                }}
              />
            </div>
          );
        })}
      </>
    );
  } else {
    return (
      <AutoSizer>
        {({ width }) => {
          return (
            <FixedSizeGrid
              width={width}
              layout="vertical"
              height={screenHeight ?? 1000}
              columnCount={itemsPerRow()}
              columnWidth={getRowHeight(width)}
              rowHeight={getRowHeight(width)}
              rowCount={Math.ceil(10000 / itemsPerRow())}
              overscanColumnCount={2}
              itemData={[]}
            >
              {GKGridCell}
            </FixedSizeGrid>
          );
        }}
      </AutoSizer>
    );
  }
}
