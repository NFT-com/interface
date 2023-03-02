import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import Loader from 'components/elements/Loader';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { NftCard } from 'components/modules/DiscoveryCards/NftCard';
import { SideNav } from 'components/modules/Search/SideNav';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import memoize from 'memoize-one';
import { SlidersHorizontal, X } from 'phosphor-react';
import NoActivityIcon from 'public/no_activity.svg';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
function usePrevious(value) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function CollectionsPage() {
  const [page, setPage] = useState(1);
  const { sideNavOpen, setSideNavOpen, setSearchModalOpen, nftsResultsFilterBy, setClearedFilters } = useSearchModal();
  const { fetchTypesenseSearch } = useFetchTypesenseSearch();
  const [filters, setFilters] = useState([]);
  const [nftSData, setNftsData] = useState([]);
  const [found, setTotalFound] = useState(null);
  const [loading, setLoading] = useState(false);
  const prevFilters = usePrevious(nftsResultsFilterBy);

  useEffect(() => {
    if (page > 1 && nftsResultsFilterBy !== prevFilters){
      setPage(1);
      return;
    }else {
      setLoading(true);
      fetchTypesenseSearch({
        facet_by: ',listings.marketplace,status,listings.price,nftType',
        index: 'nfts',
        q: '*',
        sort_by: 'score:desc',
        query_by: '',
        filter_by: nftsResultsFilterBy,
        per_page: 20,
        page: page,
      }).then((results) => {
        setLoading(false);
        setTotalFound(results?.found);
        page > 1 ? setNftsData([...nftSData,...(results ? results.hits : [])]) : setNftsData(results?.hits);
        filters.length < 1 && !isNullOrEmpty(results?.facet_counts) && setFilters([...results.facet_counts]);
      });
    }
    return () => {
      setClearedFilters();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTypesenseSearch, page, nftsResultsFilterBy, filters]);

  const createItemData = memoize(({ columnCount, nftSData }) => {
    const thing = [...nftSData];
    const nftsDataRows = [];
    while(thing.length) nftsDataRows.push(thing.splice(0,columnCount));
    return({
      columnCount,
      nftsDataRows,
    });
  });
  
  // const isItemLoaded = index => index < nftSData.length && nftSData[index] !== null;
  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = index => index < 1000;

  // const isItemLoaded = itemsCount => index => {  return (itemsCount - index) > 5; };
  const loadMoreItems = (startIndex, stopIndex) => {
    console.log('loadMore, executed fdo', startIndex, stopIndex);
    setPage(page + 1);
  };

  const Row = useCallback(({ index, style, data }: any) => {
    const { nftsDataRows, columnCount } = data;
    const row = nftsDataRows[index];
    // console.log('row fdo', index, row);
    
    return (
      <div style={style} className={tw(
        'flex flex-row justify-between w-full gap-4'
      )}>{row && row?.map((item) => (
          item && (
            <NftCard
              name={item.document.nftName}
              tokenId={item.document.tokenId}
              contractAddr={item.document.contractAddr}
              images={[item.document.imageURL]}
              collectionName={item.document.contractName}
              redirectTo={`/app/nft/${item.document.contractAddr}/${item.document.tokenId}`}
              description={item.document.nftDescription ? item.document.nftDescription.slice(0,50) + '...': '' }
              customBackground={'white'}
              lightModeForced
              // listings={item.document.listings}
              // skipNftQuery
            />
          )))}
      </div>
    );
  }, []);
  
  const showNftView = () => {
    const columnCount = 5;//Math.floor(width / cardWidth);
    const itemData = createItemData({ nftSData, columnCount });
    return (
      <div className='grid-cols-1 w-full'
        style={{
          minHeight: '100vh',
          backgroundColor: 'inherit',
          position: 'sticky',
          top: '0px',
        }}>
        <AutoSizer>
          {({ width }) => (
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={1000}
              loadMoreItems={ () => setPage(page + 1)}
              threshold={10}
            >
              {({ onItemsRendered, ref }) => (
                <FixedSizeList
                  className="grid no-scrollbar"
                  width={width}
                  height={871}
                  itemCount={1000}
                  itemData={itemData}
                  itemSize={600}
                  overscanRowCount={3}
                  onItemsRendered={(stuff) => {
                    console.log('stuff fdo', stuff);
                    setPage(page + 1);
                  }}
                  ref={ref}
                >
                  {Row}
                </FixedSizeList>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    );
  };
  return(
    <>
      <div className="p-2 minmd:p-4 minlg:p-8 minhd:p-16 minmd:m-0 mb-10 minlg:mb-10 minlg:mt-20 minmd:max-w-full self-center minmd:self-stretch minxl:mx-auto min-h-screen ">
        <div className="flex">
          <div className=" w-full min-h-disc">
            <div>
              <div className='flex justify-between mb-10'>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center'>
                    <div
                      className={`hidden minlg:block max-w-[112px] overflow-hidden cursor-pointer ${sideNavOpen ? 'mr-[206px]' : 'mr-4'}`}
                      onClick={() => setSideNavOpen(!sideNavOpen)}>
                      {sideNavOpen ?
                        <div className="flex items-center justify-center bg-[#F2F2F2] text-[#6A6A6A] py-3 px-5 text-lg rounded-[48px]">
                          Filters
                          <X size={22} className="text-[#6A6A6A] ml-2" />
                        </div> :
                        <div className="flex items-center justify-center bg-black text-white py-3 px-5 text-lg rounded-[48px]">
                          <SlidersHorizontal size={22} className="mr-2"/>
                          <p>Filter</p>
                        </div>
                      }
                    </div>
                    <div className="px-0 flex mt-0 mr-4 justify-between minlg:hidden">
                      <div onClick={() => setSearchModalOpen(true, 'filters', filters )} className={'flex items-center justify-center bg-black text-white w-10 h-10 rounded-full text-lg  cursor-pointer'}>
                        <SlidersHorizontal size={22}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-auto">
                  <div className='flex items-start justify-center'>
                    <div className={'hidden minlg:block'}>
                      <SideNav onSideNav={() => null} filtersData={filters}/>
                    </div>
                    <div>
                      {
                        !loading && nftSData?.length === 0
                          ? (
                            <div>
                              <NoActivityIcon className='m-auto mt-10 h-[300px]' />
                              <div className="md:text-[20px] text-[24px] font-semibold font-noi-grotesk mb-2 flex items-center justify-center mt-5 text-[#4D4D4D]">No Results Found</div>
                            </div>
                          )
                          : null
                      }
                      {nftSData?.length > 0 && showNftView()}
                    </div>

                  </div>
                  {(loading) &&
                    (<div className="flex items-center justify-center min-h-[16rem] w-full">
                      <Loader />
                    </div>)}
                  { nftSData && nftSData.length < found && nftSData?.length > 0 &&
                    <div className="mx-auto w-full minxl:w-1/4 flex justify-center mt-7 font-medium">
                      <Button
                        size={ButtonSize.LARGE}
                        scaleOnHover
                        stretch={true}
                        label={'Load More'}
                        onClick={() => {
                          setPage(page + 1);
                        }}
                        type={ButtonType.PRIMARY}
                      />
                    </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

CollectionsPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout showDNavigation={true}>
      { page }
    </DefaultLayout>
  );
};
