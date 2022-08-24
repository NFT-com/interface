
import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { NFTCard } from 'components/elements/NFTCard';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { CollectionItem } from 'components/modules/Search/CollectionItem';
import { CollectionsResults } from 'components/modules/Search/CollectionsResults';
import { CuratedCollectionsFilter } from 'components/modules/Search/CuratedCollectionsFilter';
import { SideNav } from 'components/modules/Search/SideNav';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { getPerPage,isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';
import { SearchableFields } from 'utils/typeSenseAdapters';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { FunnelSimple } from 'phosphor-react';
import Vector from 'public/Vector.svg';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'react-feather';

function usePrevious(value) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function ResultsPage() {
  const { setSearchModalOpen, sideNavOpen, checkedFiltersList, filtersList, sortBy } = useSearchModal();
  const router = useRouter();
  const { searchTerm, searchType } = router.query;
  const { fetchTypesenseMultiSearch } = useFetchTypesenseSearch();
  const { width: screenWidth } = useWindowDimensions();
  const [results, setResults] = useState([]);
  const [found, setFound] = useState(0);
  const [page, setPage] = useState(1);
  const prevVal = usePrevious(page);
  const [filters, setFilters] = useState([]);

  const checkedFiltersString = useCallback(() => {
    let checkedFiltersString = '';
    const checkedList = [];
    if (filtersList) {
      const checkedArray = filtersList.filter(item => item.values.length > 0);
      checkedArray.forEach(item => {
        item.filter !== 'listedPx' && checkedList.push(item.filter + ': [' + item.values.toString()+ ']');
      });
      
      const priceOptions = filtersList.find(i => i.filter === 'listedPx');
      checkedFiltersString = checkedList.join(' && ') + (priceOptions && priceOptions.values ? (' && ' + priceOptions.values) : '');
    }

    return checkedFiltersString;
  }, [filtersList]);

  useEffect(() => {
    page === 1 && !isNullOrEmpty(searchType) && screenWidth && fetchTypesenseMultiSearch({ searches: [{
      facet_by: searchType?.toString() !== 'collections' ? SearchableFields.FACET_NFTS_INDEX_FIELDS : '',
      max_facet_values: 200,
      collection: searchType?.toString() !== 'collections' ? 'nfts' : 'collections',
      query_by: searchType?.toString() !== 'collections' ? SearchableFields.NFTS_INDEX_FIELDS : SearchableFields.COLLECTIONS_INDEX_FIELDS,
      q: searchTerm?.toString(),
      per_page: getPerPage(searchType?.toString(), screenWidth, sideNavOpen),
      page: page,
      filter_by: checkedFiltersString(),
      sort_by: sortBy,
    }] })
      .then((resp) => {
        setResults([...resp.results[0].hits]);
        setFound(resp.results[0].found);
        setFilters([...resp.results[0].facet_counts]);
      });
  },[fetchTypesenseMultiSearch, page, screenWidth, searchTerm, searchType, sideNavOpen, checkedFiltersList, filtersList, filters.length, sortBy, checkedFiltersString]);

  useEffect(() => {
    if (page > 1 && page !== prevVal) {
      screenWidth && fetchTypesenseMultiSearch({ searches: [{
        facet_by: searchType?.toString() !== 'collections' ? SearchableFields.FACET_NFTS_INDEX_FIELDS : '',
        max_facet_values: 200,
        collection: searchType?.toString(),
        query_by: searchType?.toString() === 'collections' ? SearchableFields.COLLECTIONS_INDEX_FIELDS : SearchableFields.NFTS_INDEX_FIELDS,
        q: searchTerm?.toString(),
        per_page: getPerPage(searchType?.toString(), screenWidth, sideNavOpen),
        page: page,
        filter_by: checkedFiltersString(),
        sort_by: sortBy,
      }] })
        .then((resp) => {
          setResults([...results,...resp.results[0].hits]);
          setFound(resp.results[0].found);
          setFilters([...resp.results[0].facet_counts]);
        });
    }
  }, [fetchTypesenseMultiSearch, page, searchTerm, screenWidth, prevVal, searchType, results, sideNavOpen, checkedFiltersList, filtersList, filters.length, sortBy, checkedFiltersString]);
  
  return (
    <PageWrapper
      bgColorClasses="bg-always-white"
      headerOptions={{
        removeSummaryBanner: true,
      }}>
      <div className="mt-20">
        <Link href='/app/auctions' passHref>
          <a>
            <div className='mx-auto flex flex-row items-center justify-center w-screen h-[55px] font-grotesk minmd:text-lg text-base leading-6 text-white font-[500] bg-[#111111] whitespace-pre-wrap'>
              <span>Mint yourself! Get a free profile</span>
              <div className='flex flex-col rounded items-center p-[1px] ml-2'>
                <Vector />
              </div>
            </div>
          </a>
        </Link>
        
        <div className="flex">
          <div className="hidden minlg:block">
            {filters.length > 0 && <SideNav onSideNav={() => null} filtersData={filters}/>}
          </div>
          <div className="mx-6">
            <div className="flex flex-col mt-6">
              <span className="text-xs font-medium text-blog-text-reskin">DISCOVER / RESULTS</span>
              <div className="text-2xl font-semibold pt-1">
                <span className="text-[#F9D963]">/ </span><span className="text-black">{searchTerm}</span>
              </div>
            </div>
            {searchType?.toString() === 'collections' && <CuratedCollectionsFilter onClick={() => null} />}
            <div>
              {searchType?.toString() === 'allResults' && <CollectionsResults searchTerm={searchTerm.toString()} />}
              <div className="mt-10 font-grotesk text-blog-text-reskin text-lg minmd:text-xl font-black">
                {found + ' ' + (searchType?.toString() !== 'collections' ? 'NFTS' : 'COLLECTIONS')}
              </div>
              {searchType?.toString() !== 'collections' &&
            <div className="my-6 mb-4 flex minlg:hidden justify-between font-grotesk font-black text-xl minmd:text-2xl">
              <div
                className="cursor-pointer flex flex-row items-center"
                onClick={() => {
                  setSearchModalOpen(true, 'filters', filters );
                }}>
                <FunnelSimple className="h-8 w-8" />
                Filter
              </div>
              <div
                className="cursor-pointer flex flex-row items-center"
                onClick={() => {
                  setSearchModalOpen(true, 'filters', filters );
                }}>
                Sort
                <ChevronDown className="h-10 w-10" />
              </div>
            </div>}
              <div className={tw(
                'mt-6',
                searchType?.toString() === 'collections' ? 'minmd:grid minmd:grid-cols-2' : `grid grid-cols-2 ${sideNavOpen ? 'minmd:grid-cols-3 minxl:grid-cols-4' : 'minmd:grid-cols-3 minlg:grid-cols-4'} `,
                searchType?.toString() === 'collections' ? 'space-y-4 minmd:space-y-0 minmd:gap-5' : 'gap-5')}>
                {results && results.map((item, index) => {
                  return (
                    <div key={index}
                      className={tw(
                        'DiscoverCollectionItem',
                        searchType?.toString() === 'collections' ? 'min-h-[10.5rem] minmd:min-h-[13rem]' : '')}
                    >
                      {searchType?.toString() === 'collections' ?
                        <CollectionItem
                          contractAddr={item.document.contractAddr}
                          contractName={item.document.contractName}
                        />:
                        <NFTCard
                          title={item.document.nftName}
                          subtitle={'#'+ item.document.tokenId}
                          images={[item.document.imageURL]}
                          onClick={() => {
                            if (item.document.nftName) {
                              router.push(`/app/nft/${item.document.contractAddr}/${item.document.tokenId}`);
                            }
                          }}
                          description={item.document.nftDescription ? item.document.nftDescription.slice(0,50) + '...': '' }
                          customBackground={'white'}
                          lightModeForced
                          customBorderRadius={'rounded-tl-2xl rounded-tr-2xl'}
                        />}
                    </div>);
                })}
              </div>
              {results.length < found && <div className="mx-auto w-full minxl:w-3/5 flex justify-center mt-7 font-medium">
                <Button
                  color={'black'}
                  accent={AccentType.SCALE}
                  stretch={true}
                  label={'Load More'}
                  onClick={() => setPage(page + 1)}
                  type={ButtonType.PRIMARY}
                />
              </div>}
            </div>
          </div>
        
        </div>
      </div>
    </PageWrapper>
  );
}
