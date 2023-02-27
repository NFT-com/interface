/* eslint-disable import/no-extraneous-dependencies */
import Loader from 'components/elements/Loader';
import { createRowIndices, getRowQuantity } from 'utils/helpers';
import { tw } from 'utils/tw';

// import ProgressLoader from '~/components/common/ProgressLoader';
// import { createRowIndices, getRowQuantity } from '~/lib/utils';
import type { FC } from 'react';
import React, { useEffect, useRef } from 'react';
import {
  AutoSizer as _AutoSizer,
  AutoSizerProps,
  IndexRange,
  InfiniteLoader as _InfiniteLoader,
  InfiniteLoaderProps,
  List as _List,
  ListProps,
  WindowScroller as _WindowScroller,
  WindowScrollerProps
} from 'react-virtualized';

// Had to typecast react-virtualized due to next.js typescript issues
// @see https://github.com/bvaughn/react-virtualized/issues/1739
const AutoSizer = _AutoSizer as unknown as FC<AutoSizerProps>;
const InfiniteLoader = _InfiniteLoader as unknown as FC<InfiniteLoaderProps>;
const List = _List as unknown as FC<ListProps>;
const WindowScroller = _WindowScroller as unknown as FC<WindowScrollerProps>;

type NftRenderer<Nft> = (nft?: Nft) => React.ReactNode;

interface NFTGalleryListRCProps<Nft> {
  nfts?: Nft[];
  fetchNfts?: () => void;//Function;
  hasMore?: boolean;
  isFetching?: boolean;
  reset?: boolean;
  nftWidth?: number;
  nftHeight?: number;
  children: NftRenderer<Nft>;
  draftLayoutType: string;
  profileLoading: boolean;
}

function NFTGalleryListRC<Nft>({
  nftWidth = 200,
  nftHeight = 400,
  hasMore = false,
  nfts = [],
  reset = false,
  isFetching = false,
  fetchNfts = () => null,//{},
  children,
  draftLayoutType = 'Default',
  profileLoading = false
}: NFTGalleryListRCProps<Nft>) {
  const infiniteLoaderRef = useRef<InfiniteLoaderProps>(null);

  useEffect(() => {
    if (reset && infiniteLoaderRef.current) {
      infiniteLoaderRef.current.resetLoadMoreRowsCache(true);
    }
  }, [reset, infiniteLoaderRef]);

  const loadMoreRows = async () => {
    console.log('fetching from infinte loading fdo 2');
    if (!isFetching) {
      console.log('fetching from infinte loading fdo 1');
      fetchNfts();
    }
  };

  const noRowsRenderer = () => (
    profileLoading ?
      null :
      <div className='flex justify-center'>
        <h1 className='font-sans text-2xl'>No Nfts Found...</h1>
      </div>
  );

  return (
    <section>
      <AutoSizer disableHeight>
        {({ width: rowWidth }) => {
          const rowCount = getRowQuantity(
            rowWidth,
            nftWidth,
            nfts.length,
            hasMore
          );

          return (
            <InfiniteLoader
              ref={infiniteLoaderRef}
              rowCount={rowCount}
              isRowLoaded={({ index }) => {
                const allNftsLoaded =
                  createRowIndices(index, rowWidth, nftWidth, nfts.length)
                    .length > 0;

                return !hasMore || allNftsLoaded;
              }}
              loadMoreRows={loadMoreRows}
            >
              {({ onRowsRendered, registerChild }) => (
                <WindowScroller>
                  {({ height, scrollTop }) => (
                    <List
                      className='justify-center overflow-y-auto scrollbar-thin scrollbar-track-amber-200/50 scrollbar-thumb-amber-500/50 scrollbar-track-rounded-full scrollbar-thumb-rounded-full'
                      autoHeight
                      ref={registerChild}
                      height={height}
                      scrollTop={scrollTop}
                      width={rowWidth}
                      rowCount={rowCount}
                      rowHeight={nftHeight}
                      onRowsRendered={onRowsRendered}
                      rowRenderer={({ index, style, key }) => {
                        const nftsForRow = createRowIndices(
                          index,
                          rowWidth,
                          nftWidth,
                          nfts.length
                        ).map(nftIndex => nfts[nftIndex]);

                        return (
                          <div
                            // role='list'
                            style={style}
                            key={key}
                            className={tw(
                              'grid w-full',
                              'gap-4 mt-4 minlg:mt-0',
                              draftLayoutType ?? 'Default'? 'grid-cols-2 minmd:grid-cols-3 minlg:grid-cols-4 minxl:grid-cols-5 minxxl:grid-cols-6' : '',
                              draftLayoutType == 'Mosaic' ? 'grid-cols-2 minmd:grid-cols-3 minlg:grid-cols-4 minxl:grid-cols-6' : '',
                              draftLayoutType == 'Featured' ? 'grid-cols-2 minmd:grid-cols-4 minlg:grid-cols-6' : '',
                              draftLayoutType == 'Spotlight' ? 'grid-cols-4 minlg:grid-cols-8' : '',
                            )}
                          >
                            {nftsForRow.map((nft, nftIndex) => (
                              <div
                                className=''
                                // style={{ width: nftWidth }}
                                key={nftIndex}
                              >
                                {children(nft)}
                              </div>
                            ))}
                          </div>
                        );
                      }}
                      // noRowsRenderer={noRowsRenderer}
                    />

                  )}
                </WindowScroller>
              )}
            </InfiniteLoader>
          );
        }}
      </AutoSizer>
      {/* {isFetching ? <ProgressLoader /> : null} */}
      {isFetching ? <div className='mx-auto'><Loader /></div> : null}
    </section>
  );
}

export default NFTGalleryListRC;
