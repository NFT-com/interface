import useWindowDimensions from 'hooks/useWindowDimensions';

import { outerElementType } from './outerElementType';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

interface CellInfo {
  itemData: any;
  rowIndex: number;
  cellIndex: number;
  getItemHeight: (height: number) => void;
}

interface CardsGridProps {
  children: (cellInfo: CellInfo) => JSX.Element;
  gridData: any[];
  sideNavOpen?: boolean;
  loadMoreItems: () => void;
  totalItems: number;
  cardType: string;
  rowClass?: string;
  defaultRowHeight?: number
  hasNextPage?: boolean;
}

export default function CardsGrid(props: CardsGridProps) {
  const { children, gridData, sideNavOpen, loadMoreItems, totalItems, cardType, rowClass, defaultRowHeight, hasNextPage } = props;
  const childParams = useMemo(() => ({ itemData: null, rowIndex: null, cellIndex: null, getItemHeight: null } ),[]);
  const [dataPerRows, setDataPerRows] = useState([]);
  const [rowHeight, setRowhHeight] = useState(550);

  let windowObject;
  if (typeof window !== 'undefined') {
    windowObject = window;
  }

  const getRowHeight = useCallback((height: number) => {
    setRowhHeight(height);
  }, []);
  const { width: screenWidth } = useWindowDimensions();
  const [columnCount, setColumnCount] = useState(screenWidth < 600 ? 1 : screenWidth > 600 && screenWidth <= 900 ? 2 : screenWidth > 900 && screenWidth <= 1600 ? 3 : 4);

  useEffect(() => {
    const flatData = [...gridData];
    const data2D = [];
    while(flatData.length) data2D.push(flatData.splice(0,columnCount));
    setDataPerRows(data2D);
  },[columnCount, gridData]);

  useEffect(() => {
    if (screenWidth) {
      if (!sideNavOpen) {
        if (screenWidth > 1600) {
          setColumnCount(cardType == 'nfts' || cardType == 'profileDiscover' ? 5 : 3);
        } else if (screenWidth > 1200 && screenWidth <= 1600) {
          setColumnCount(cardType == 'nfts' ? 4 : cardType == 'profileDiscover' ? 5: 3);
        } else if (screenWidth > 900 && screenWidth <= 1200) {
          setColumnCount(cardType == 'nfts' || cardType == 'profileDiscover'? 3 : 2);
        } else if (screenWidth > 600 && screenWidth <= 900) {
          setColumnCount(2);
        } else {
          setColumnCount(1);
        }
      } else {
        if (screenWidth > 1600) {
          setColumnCount(cardType == 'nfts' ? 4 : 3);
        } else if (screenWidth > 1200 && screenWidth <= 1600) {
          setColumnCount(3);
        } else if (screenWidth > 900 && screenWidth <= 1200) {
          setColumnCount(2);
        } else if (screenWidth > 600 && screenWidth <= 900) {
          setColumnCount(2);
        } else {
          setColumnCount(1);
        }
      }
    }
  },[sideNavOpen, screenWidth, cardType]);

  const itemCount = hasNextPage ? dataPerRows.length + 1 : dataPerRows.length;
  const isItemLoaded = useCallback( index => !hasNextPage || index < dataPerRows.length, [dataPerRows.length, hasNextPage]);

  const Row = useCallback(({ index, style, data }: any) => {
    childParams.rowIndex = index;
    const row = data[index];
    
    console.log('!isItemLoaded(index) fdo', !isItemLoaded(index));
    return (
      <div style={style} className={rowClass}>
        {(!isItemLoaded(index)) ?
          (<div className='border bg-gray-400 h-40 w-20' >asdfasdfasdfsd</div>)
          :
          (row && row?.map((item, cellIndex) => {
            childParams.itemData = item;
            childParams.cellIndex = cellIndex;
            childParams.getItemHeight = getRowHeight;
            return item && children(childParams);
          }))}
      </div>
    );
  }, [childParams, children, getRowHeight, isItemLoaded, rowClass]);

  return (
    <div className='grid-cols-1 w-full'
      style={{
        minHeight: '100vh',
        backgroundColor: 'inherit',
        position: 'sticky',
        top: '0px',
      }}>
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
        threshold={10}
      >
        {({ ref, onItemsRendered }) => (
          (rowHeight || defaultRowHeight) &&< FixedSizeList
            className="grid no-scrollbar"
            outerElementType={outerElementType}
            width={windowObject?.innerWidth ?? 0}
            height={windowObject?.innerHeight ?? 0}
            itemCount={dataPerRows.length}
            itemData={dataPerRows}
            itemSize={defaultRowHeight ?? (rowHeight + (screenWidth < 600 && cardType == 'nfts' ? 65 : 12))}
            overscanRowCount={3}
            onItemsRendered={onItemsRendered}
            ref={ref}
          >
            {Row}
          </FixedSizeList>
        )}
      </InfiniteLoader>
    </div>
  );
}