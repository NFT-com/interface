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
  cardType: string;
  rowClass?: string;
  defaultRowHeight?: number
  hasNextPage?: boolean;
}

export default function CardsGrid(props: CardsGridProps) {
  const { children, gridData, sideNavOpen, loadMoreItems, cardType, rowClass, defaultRowHeight, hasNextPage } = props;
  const childParams = useMemo(() => ({ itemData: null, rowIndex: null, cellIndex: null, getItemHeight: null } ),[]);
  const [dataPerRows, setDataPerRows] = useState([]);
  const [rowHeight, setRowhHeight] = useState(550);
  const [skeletonEnabled, setSkeletonEnabled] = useState(false);

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
    
    return (
      <div style={style} className={rowClass}>
        {row && row?.map((item, cellIndex) => {
          childParams.itemData = item;
          childParams.cellIndex = cellIndex;
          childParams.getItemHeight = getRowHeight;
          if (!skeletonEnabled) {
            return children(childParams);
          } else {
            setTimeout(() => {
              setSkeletonEnabled(false);
            }, 1000);
            return (<div key={''+index+cellIndex} className='rounded-[16px] shadow-xl overflow-hidden w-full cursor-p relative mb-3'>
              <div className='animate-pulse w-full bg-gray-400 h-2/3'></div>
              <div className='w-full h-1/3'></div>
            </div>);
          }
        }
        )}
      </div>
    );
  }, [childParams, children, getRowHeight, rowClass, skeletonEnabled]);

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
            useIsScrolling={true}
            onScroll={(scrollInfo) => {
              setSkeletonEnabled(scrollInfo.scrollOffset % 225 > 20 && scrollInfo.scrollOffset % 225 < 200);
            }}
          >
            {Row}
          </FixedSizeList>
        )}
      </InfiniteLoader>
    </div>
  );
}