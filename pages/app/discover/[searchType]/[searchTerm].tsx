
import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { NFTCard } from 'components/elements/NFTCard';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { CollectionItem } from 'components/modules/Search/CollectionItem';
import { CuratedCollectionsFilter } from 'components/modules/Search/CuratedCollectionsFilter';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { tw } from 'utils/tw';
import { SearchableFields } from 'utils/typeSenseAdapters';

import Link from 'next/link';
import { useRouter } from 'next/router';
import Filter from 'public/funnel_simple.svg';
import Vector from 'public/Vector.svg';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'react-feather';

function usePrevious(value) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function ResultsPage() {
  const router = useRouter();
  const { searchTerm, searchType } = router.query;
  const { fetchTypesenseSearch, loading } = useFetchTypesenseSearch();
  const { width: screenWidth } = useWindowDimensions();
  const [results, setResults] = useState([]);
  const [found, setFound] = useState(0);
  const [page, setPage] = useState(1);
  const prevVal = usePrevious(page);

  useEffect(() => {
    page === 1 && searchType && screenWidth && fetchTypesenseSearch({
      index: searchType?.toString(),
      query_by: searchType?.toString() === 'collections' ? SearchableFields.COLLECTIONS_INDEX_FIELDS : SearchableFields.NFTS_INDEX_FIELDS,
      q: searchTerm?.toString(),
      per_page: screenWidth >= 1200 ? 9 : screenWidth >= 900 ? 6 : screenWidth >= 600 ? 4 : 2,
      page: page,
    })
      .then((resp) => {
        setResults([...resp.hits]);
        setFound(resp.found);
      });
  },[fetchTypesenseSearch, page, screenWidth, searchTerm, searchType]);

  useEffect(() => {
    if (page > 1 && page !== prevVal) {
      screenWidth && fetchTypesenseSearch({
        index: searchType?.toString(),
        query_by: searchType?.toString() === 'collections' ? SearchableFields.COLLECTIONS_INDEX_FIELDS : SearchableFields.NFTS_INDEX_FIELDS,
        q: searchTerm?.toString(),
        per_page: screenWidth >= 1200 ? 9 : screenWidth >= 900 ? 6 : screenWidth >= 600 ? 4 : 2,
        page: page,
      })
        .then((resp) => {
          setResults([...results,...resp.hits]);
          setFound(resp.found);
        });
    }
  }, [fetchTypesenseSearch, page, searchTerm, screenWidth, prevVal, searchType, results]);

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
        <div className="mx-6">
          <div className="flex flex-col mt-6">
            <span className="text-xs font-medium text-blog-text-reskin">DISCOVER / RESULTS</span>
            <div className="text-2xl font-semibold pt-1">
              <span className="text-[#F9D963]">/ </span><span className="text-black">{searchTerm}</span>
            </div>
          </div>
          <CuratedCollectionsFilter onClick={() => null} />
          <div className="mt-10 font-grotesk text-blog-text-reskin text-lg minmd:text-xl font-black">
            {found + ' ' + searchType?.toString().toUpperCase()}
          </div>
          {searchType?.toString() === 'nfts' &&
          <div className="my-6 mb-4 flex justify-between font-grotesk font-black text-xl minmd:text-2xl">
            <div className="cursor-pointer flex flex-row items-center">
              <Filter className="h-10 w-10" />
              Filter
            </div>
            <div className="cursor-pointer flex flex-row items-center">
              Sort
              <ChevronDown className="h-10 w-10" />
            </div>
          </div>}
          <div className={tw(
            'mt-6 minmd:grid minmd:grid-cols-2',
            searchType?.toString() === 'collections' ? 'minmd:space-x-2' : 'space-y-5 minmd:gap-5 minmd:space-y-0')}>
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
    </PageWrapper>
  );
}