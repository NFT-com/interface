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
  const [rowHeight, setRowhHeight] = useState(cardType == 'profiles' ? 332 : 550);

  let windowObject;
  if (typeof window !== 'undefined') {
    windowObject = window;
  }

  const getRowHeight = useCallback((height: number) => {
    setRowhHeight(height);
  }, []);
  
  const { width: screenWidth } = useWindowDimensions();

  const getColumns = useCallback(() => {
    const columns = {
      'nfts': !sideNavOpen ?
        (screenWidth > 1600 ? 5 : screenWidth > 1200 && screenWidth <= 1600 ? 4 : screenWidth > 900 && screenWidth <= 1200 ? 3 : screenWidth > 600 && screenWidth <= 900 ? 2 : 1)
        :
        (screenWidth > 1600 ? 4 : screenWidth > 1200 && screenWidth <= 1600 ? 3 : screenWidth > 900 && screenWidth <= 1200 ? 2 : screenWidth > 600 && screenWidth <= 900 ? 2 : 1),
      'collections': !sideNavOpen ?
        (screenWidth > 1600 ? 3 : screenWidth > 1200 && screenWidth <= 1600 ? 3 : screenWidth > 900 && screenWidth <= 1200 ? 2 : screenWidth > 600 && screenWidth <= 900 ? 2 : 1)
        :
        (screenWidth > 1600 ? 3 : screenWidth > 1200 && screenWidth <= 1600 ? 3 : screenWidth > 900 && screenWidth <= 1200 ? 2 : screenWidth > 600 && screenWidth <= 900 ? 2 : 1),
      'profileDiscover': (screenWidth > 1600 ? 5 : screenWidth > 1200 && screenWidth <= 1600 ? 5 : screenWidth > 900 && screenWidth <= 1200 ? 3 : screenWidth > 600 && screenWidth <= 900 ? 2 : 1),
      'profiles': (screenWidth > 1600 ? 6 : screenWidth > 1200 && screenWidth <= 1600 ? 5 : screenWidth > 900 && screenWidth <= 1200 ? 4 : screenWidth > 600 && screenWidth <= 900 ? 3 : 2)
    };
    return columns[cardType];
  }, [cardType, screenWidth, sideNavOpen]);

  const [columnCount, setColumnCount] = useState(screenWidth && getColumns());

  useEffect(() => {
    if (screenWidth) {
      setColumnCount(getColumns());
    }
  }, [getColumns, screenWidth]);

  useEffect(() => {
    if (columnCount > 0) {
      const flatData = [...gridData];
      const data2D = [];
      while(flatData.length) data2D.push(flatData.splice(0,columnCount));
      setDataPerRows(data2D);
    }
  },[columnCount, gridData]);

  const itemCount = hasNextPage ? dataPerRows.length + 1 : dataPerRows.length;
  const isItemLoaded = useCallback( index => !hasNextPage || index < dataPerRows.length, [dataPerRows.length, hasNextPage]);

  const Row = useCallback(({ index, style, data }: any) => {
    childParams.rowIndex = index;
    const row = data[index];

    return (
      <div style={style}
        className={rowClass}>
        {row && row?.map((item, cellIndex) => {
          childParams.itemData = item;
          childParams.cellIndex = cellIndex;
          childParams.getItemHeight = getRowHeight;
          return children(childParams);
        }
        )}
      </div>
    );
  }, [childParams, children, getRowHeight, rowClass]);

  return (
    (rowHeight || defaultRowHeight) && <div className='grid-cols-1 w-full'
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
        threshold={cardType == 'profiles' ? 10 : 5}
      >
        {({ ref, onItemsRendered }) => (
          < FixedSizeList
            className="grid no-scrollbar"
            outerElementType={outerElementType}
            width={windowObject?.innerWidth ?? 0}
            height={windowObject?.innerHeight ?? 0}
            itemCount={dataPerRows.length}
            itemData={dataPerRows}
            itemSize={defaultRowHeight ?? (rowHeight + (screenWidth < 600 && cardType == 'nfts' ? 65 : cardType == 'profiles' ? 0 : 12))}
            onItemsRendered={onItemsRendered}
            ref={ref}
            useIsScrolling={true}
          >
            {Row}
          </FixedSizeList>
        )}
      </InfiniteLoader>
    </div>
  );
}