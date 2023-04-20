import React, { useEffect, useRef, useState } from 'react';
import { SlidersHorizontal, X } from 'phosphor-react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { NFTCardSkeleton } from 'components/elements/Skeletons/NFTCardSkeleton';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { NFTCard } from 'components/modules/NFTCard/NFTCard';
import { SideNav } from 'components/modules/Search/SideNav';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { isNullOrEmpty } from 'utils/format';
import { getPerPage } from 'utils/helpers';
import { tw } from 'utils/tw';

import NoActivityIcon from 'public/icons/no_activity.svg?svgr';

function usePrevious(value) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function DiscoverNftsPage() {
  const [page, setPage] = useState(1);
  const {
    sideNavOpen,
    setSideNavOpen,
    setSearchModalOpen,
    nftsResultsFilterBy,
    setClearedFilters,
    setIsDiscoverCollections,
    isDiscoverCollections
  } = useSearchModal();
  const { fetchTypesenseSearch } = useFetchTypesenseSearch();
  const [filters, setFilters] = useState([]);
  const [nftSData, setNftsData] = useState([]);
  const [found, setTotalFound] = useState(null);
  const [loading, setLoading] = useState(false);
  const prevFilters = usePrevious(nftsResultsFilterBy);
  const { width: screenWidth } = useWindowDimensions();

  const NFTS_LOAD_COUNT = getPerPage('discoverNFTs', screenWidth, sideNavOpen);

  useEffect(() => {
    isDiscoverCollections && setIsDiscoverCollections(false);
  }, [isDiscoverCollections, setIsDiscoverCollections]);

  useEffect(() => {
    if (page > 1 && nftsResultsFilterBy !== prevFilters) {
      setPage(1);
      return;
    }
    setLoading(true);
    fetchTypesenseSearch({
      facet_by: ',listings.marketplace,status,listings.price,nftType',
      index: 'nfts',
      q: '*',
      sort_by: 'score:desc',
      query_by: '',
      filter_by: nftsResultsFilterBy,
      per_page: NFTS_LOAD_COUNT,
      page
    }).then(results => {
      setLoading(false);
      setTotalFound(results.found);
      page > 1 ? setNftsData([...nftSData, ...results.hits]) : setNftsData(results.hits);
      filters.length < 1 && !isNullOrEmpty(results?.facet_counts) && setFilters([...results.facet_counts]);
    });

    return () => {
      setClearedFilters();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTypesenseSearch, page, nftsResultsFilterBy, filters]);
  const showNftView = () => {
    return (
      <div
        className={tw(
          'gap-2 space-y-4 minmd:grid minmd:gap-4 minmd:space-x-0 minmd:space-y-0 minlg:gap-4',
          sideNavOpen
            ? 'w-full grid-cols-1 minmd:grid-cols-2 minlg:grid-cols-2 minxl:grid-cols-3 minxxl:grid-cols-4 minhd:grid-cols-5'
            : 'w-full grid-cols-1 minmd:grid-cols-2  minlg:grid-cols-3  minxl:grid-cols-4 minxxl:grid-cols-5 minhd:grid-cols-6'
        )}
      >
        {nftSData &&
          nftSData?.length > 0 &&
          nftSData?.map((item, index) => {
            return (
              <NFTCard
                key={index}
                name={item.document.nftName}
                tokenId={item.document.tokenId}
                contractAddr={item.document.contractAddr}
                images={[item.document.imageURL]}
                collectionName={item.document.contractName}
                redirectTo={`/app/nft/${item.document.contractAddr}/${item.document.tokenId}`}
              />
            );
          })}
      </div>
    );
  };
  return (
    <>
      <div className='mb-10 min-h-screen self-center p-2 minmd:m-0 minmd:max-w-full minmd:self-stretch minmd:p-4 minlg:mb-10 minlg:mt-20 minlg:p-8 minxl:mx-auto minhd:p-16 '>
        <div className='flex'>
          <div className=' min-h-disc w-full'>
            <div>
              <div className='mb-10 flex justify-between'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div
                      className={`hidden max-w-[112px] cursor-pointer overflow-hidden minlg:block ${
                        sideNavOpen ? 'mr-[206px]' : 'mr-4'
                      }`}
                      onClick={e => {
                        e.preventDefault();
                        setSideNavOpen(!sideNavOpen);
                      }}
                    >
                      {sideNavOpen ? (
                        <div className='flex items-center justify-center rounded-[48px] bg-[#F2F2F2] px-5 py-3 text-lg text-[#6A6A6A]'>
                          Filters
                          <X size={22} className='ml-2 text-[#6A6A6A]' />
                        </div>
                      ) : (
                        <div className='flex items-center justify-center rounded-[48px] bg-black px-5 py-3 text-lg text-white'>
                          <SlidersHorizontal size={22} className='mr-2' />
                          <p>Filter</p>
                        </div>
                      )}
                    </div>
                    <div className='mr-4 mt-0 flex justify-between px-0 minlg:hidden'>
                      <div
                        onClick={() => setSearchModalOpen(true, 'filters', filters)}
                        className={
                          'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black text-lg  text-white'
                        }
                      >
                        <SlidersHorizontal size={22} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex'>
                <div className='w-full flex-auto'>
                  <div className='flex items-start justify-center'>
                    <div className={'hidden minlg:block'}>
                      <SideNav onSideNav={() => null} filtersData={filters} />
                    </div>
                    <div className='w-full grid-cols-1'>
                      {!loading && nftSData?.length === 0 ? (
                        <div>
                          <NoActivityIcon className='m-auto mt-10 h-[300px]' />
                          <div className='mb-2 mt-5 flex items-center justify-center font-noi-grotesk text-[24px] font-semibold text-[#4D4D4D] md:text-[20px]'>
                            No Results Found
                          </div>
                        </div>
                      ) : null}
                      {nftSData?.length > 0 && showNftView()}
                      {loading && (
                        <div
                          className={tw(
                            'mt-3 gap-2 minmd:grid minmd:gap-4 minmd:space-x-0 minlg:gap-4',
                            sideNavOpen
                              ? 'w-full grid-cols-1 minmd:grid-cols-2 minlg:grid-cols-2 minxl:grid-cols-3 minxxl:grid-cols-4 minhd:grid-cols-5'
                              : 'w-full grid-cols-1 minmd:grid-cols-2  minlg:grid-cols-3  minxl:grid-cols-4 minxxl:grid-cols-5 minhd:grid-cols-6'
                          )}
                        >
                          {[...Array(12).keys()].map((_, index) => (
                            <NFTCardSkeleton key={index} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {nftSData && nftSData.length < found && nftSData?.length > 0 && (
                    <div className='mx-auto mt-7 flex w-full justify-center font-medium minxl:w-1/4'>
                      <Button
                        size={ButtonSize.LARGE}
                        scaleOnHover
                        stretch={true}
                        label={'Load More'}
                        onClick={e => {
                          e.preventDefault();
                          setPage(page + 1);
                        }}
                        type={ButtonType.PRIMARY}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

DiscoverNftsPage.getLayout = function getLayout(page) {
  return <DefaultLayout showDNavigation={true}>{page}</DefaultLayout>;
};
