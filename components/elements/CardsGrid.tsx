import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';

import { outerElementType } from './outerElementType';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

interface CellInfo {
  itemData: any;
  rowIndex: number;
  cellIndex: number;
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
}

export default function CardsGrid(props: CardsGridProps) {
  const { children, gridData, sideNavOpen, loadMoreItems, totalItems, cardType, rowClass, defaultRowHeight } = props;
  const childParams = useMemo(() => ({ itemData: null, rowIndex: null, cellIndex: null } ),[]);
  const [dataPerRows, setDataPerRows] = useState([]);
  const [columnCount, setColumnCount] = useState(5);
  const { cardHeightForRWGrid } = useSearchModal();

  let windowObject;
  if (typeof window !== 'undefined') {
    windowObject = window;
  }

  const { width: screenWidth } = useWindowDimensions();

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

  const isItemLoaded = index => index < dataPerRows.length;

  const Row = useCallback(({ index, style, data }: any) => {
    childParams.rowIndex = index;
    const row = data[index];
    
    return (
      <div style={style} className={rowClass}>
        {row && row?.map((item, cellIndex) => {
          childParams.itemData = item;
          childParams.cellIndex = cellIndex;
          return item && children(childParams);
        })}
      </div>
    );
  }, [childParams, children, rowClass]);

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
        itemCount={dataPerRows.length}
        loadMoreItems={() => loadMoreItems()}
        threshold={10}
      >
        {({ ref }) => (
          <FixedSizeList
            className="grid no-scrollbar"
            outerElementType={outerElementType}
            width={windowObject?.innerWidth ?? 0}
            height={windowObject?.innerHeight ?? 0}
            itemCount={dataPerRows.length}
            itemData={dataPerRows}
            itemSize={defaultRowHeight ?? (cardHeightForRWGrid ? (cardHeightForRWGrid+((screenWidth < 600 && cardType == 'nfts')? 65 : 12 )): 450)}
            overscanRowCount={3}
            onItemsRendered={(itemsRendered) => {
              if (gridData && ((gridData.length < totalItems && gridData?.length > 0) || totalItems != 0))
                itemsRendered.visibleStartIndex % 3 == 0 && loadMoreItems();
            }}
            ref={ref}
          >
            {Row}
          </FixedSizeList>
        )}
      </InfiniteLoader>
    </div>
  );
}