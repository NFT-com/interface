import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { Footer } from 'components/elements/Footer';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { CollectionItem } from 'components/modules/Search/CollectionItem';
import { CuratedCollectionsFilter } from 'components/modules/Search/CuratedCollectionsFilter';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import useWindowDimensions from 'hooks/useWindowDimensions';
import NotFoundPage from 'pages/404';
import { Doppler, getEnvBool } from 'utils/env';
import { SearchableFields } from 'utils/typeSenseAdapters';

import Link from 'next/link';
import Vector from 'public/Vector.svg';
import { useEffect, useRef, useState } from 'react';
import { Loader } from 'react-feather';

function usePrevious(value) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { fetchTypesenseSearch, loading } = useFetchTypesenseSearch();
  const [collectionsResults, setCollectionsResults] = useState([]);
  const [found, setFound] = useState(0);
  const { width: screenWidth } = useWindowDimensions();
  const prevVal = usePrevious(page);

  useEffect(() => {
    if (page > 1 && page !== prevVal) {
      screenWidth && fetchTypesenseSearch({
        index:'collections',
        query_by: SearchableFields.COLLECTIONS_INDEX_FIELDS,
        q: searchTerm,
        per_page: screenWidth >= 1200 ? 9 : screenWidth >= 900 ? 6 : screenWidth >= 600 ? 4 : 2,
        page: page,
      })
        .then((results) => {
          setCollectionsResults([...collectionsResults,...results.hits]);
          setFound(results.found);
        });
    }
  }, [fetchTypesenseSearch, page, searchTerm, screenWidth, collectionsResults, prevVal]);

  useEffect(() => {
    page === 1 && fetchTypesenseSearch({
      index:'collections',
      query_by: SearchableFields.COLLECTIONS_INDEX_FIELDS,
      q: searchTerm,
      per_page: screenWidth >= 1200 ? 9 : screenWidth >= 900 ? 6 : screenWidth >= 600 ? 4 : 2,
      page: 1,
    })
      .then((results) => {
        setCollectionsResults([...results.hits]);
        setFound(results.found);
      });
  }, [fetchTypesenseSearch, screenWidth, page, searchTerm] );

  if (!getEnvBool(Doppler.NEXT_PUBLIC_SEARCH_ENABLED)) {
    return <NotFoundPage />;
  }

  const changeCurated = (curated: string) => {
    setCollectionsResults([]);
    setSearchTerm(curated);
    setPage(1);
  };

  return(
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
      </div>
      <div className="my-10 max-w-lg minmd:max-w-full mx-[4%] minmd:mx-[2%] self-center minmd:self-stretch">
        <span className="font-grotesk text-black font-black text-4xl minmd:text-5xl">Discover</span>
        <p className="text-blog-text-reskin mt-4 text-base minmd:text-lg">
            Find your next PFP, one-of-kind collectable, or membership pass to the next big thing!
        </p>
        <CuratedCollectionsFilter onClick={changeCurated} />
        {loading ?
          <div className="w-full mx-auto flex justify-center">
            <Loader />
          </div> :
          <div className="mt-10">
            <div className="font-grotesk text-blog-text-reskin text-xs minmd:text-sm font-black">
              {found} PROFILE PICTURE COLLECTIONS
            </div>
            <div className="mt-6 minmd:grid minmd:grid-cols-2 minmd:space-x-2">
              {collectionsResults && collectionsResults.map((collection, index) => {
                return (
                  <div key={index} className="DiscoverCollectionItem min-h-[10.5rem] minmd:min-h-[13rem]">
                    <CollectionItem
                      contractAddr={collection.document.contractAddr}
                      contractName={collection.document.contractName}
                    />
                  </div>);
              })}
            </div>
          </div>}
        {collectionsResults.length < found && <div className="mx-auto w-full minxl:w-3/5 flex justify-center mt-7 font-medium">
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
      <div className='w-full'>
        <Footer />
      </div>
    </PageWrapper>
  );
}