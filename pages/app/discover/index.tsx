import { AccentType, Button, ButtonType } from 'components/elements/Button';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CollectionItem } from 'components/modules/Search/CollectionItem';
import { CuratedCollectionsFilter } from 'components/modules/Search/CuratedCollectionsFilter';
import { SideNav } from 'components/modules/Search/SideNav';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';
import NotFoundPage from 'pages/404';
import { Doppler, getEnvBool } from 'utils/env';
import { getPerPage } from 'utils/helpers';
import { tw } from 'utils/tw';
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
  const [searchTerm, setSearchTerm] = useState('nft');
  const [page, setPage] = useState(1);
  const { fetchTypesenseSearch, loading } = useFetchTypesenseSearch();
  const [collectionsResults, setCollectionsResults] = useState([]);
  const [found, setFound] = useState(0);
  const { width: screenWidth } = useWindowDimensions();
  const prevVal = usePrevious(page);
  const { sideNavOpen } = useSearchModal();

  useEffect(() => {
    if (page > 1 && page !== prevVal) {
      screenWidth && fetchTypesenseSearch({
        index:'collections',
        query_by: SearchableFields.COLLECTIONS_INDEX_FIELDS,
        q: searchTerm,
        per_page: getPerPage('collections', screenWidth, sideNavOpen),
        page: page,
      })
        .then((results) => {
          setCollectionsResults([...collectionsResults,...results.hits]);
          setFound(results.found);
        });
    }
  }, [fetchTypesenseSearch, page, searchTerm, screenWidth, collectionsResults, prevVal, sideNavOpen]);

  useEffect(() => {
    page === 1 && fetchTypesenseSearch({
      index:'collections',
      query_by: SearchableFields.COLLECTIONS_INDEX_FIELDS,
      q: searchTerm,
      per_page: getPerPage('collections', screenWidth, sideNavOpen),
      page: 1,
    })
      .then((results) => {
        setCollectionsResults([...results.hits]);
        setFound(results.found);
      });
  }, [fetchTypesenseSearch, screenWidth, page, searchTerm, sideNavOpen] );

  if (!getEnvBool(Doppler.NEXT_PUBLIC_SEARCH_ENABLED)) {
    return <NotFoundPage />;
  }

  const changeCurated = (curated: string) => {
    setCollectionsResults([]);
    setSearchTerm(curated);
    setPage(1);
  };

  return(
    <>
      <div className="my-10 minlg:mb-10 minlg:mt-20 max-w-lg minmd:max-w-full mx-[4%] minmd:mx-[2%] minlg:mr-[2%] minlg:ml-0 self-center minmd:self-stretch">
        <Link href='/app/auctions' passHref>
          <a>
            <div className='mx-auto flex flex-row items-center justify-center w-full h-[55px] font-grotesk minmd:text-lg text-base leading-6 text-white font-[500] bg-[#111111] whitespace-pre-wrap'>
              <span>Mint yourself! Get a free profile</span>
              <div className='flex flex-col rounded items-center p-[1px] ml-2'>
                <Vector />
              </div>
            </div>
          </a>
        </Link>
        <div className="flex">
          <div className="hidden minlg:block">
            <SideNav onSideNav={changeCurated}/>
          </div>
          <div className="minlg:mt-8 minlg:ml-6">
            <span className="font-grotesk text-black font-black text-4xl minmd:text-5xl">Discover</span>
            <p className="text-blog-text-reskin mt-4 text-base minmd:text-lg">
            Find your next PFP, one-of-kind collectable, or membership pass to the next big thing!
            </p>
            <div className="block minlg:hidden">
              <CuratedCollectionsFilter onClick={changeCurated} />
            </div>
            {loading ?
              <div className="w-full mx-auto flex justify-center items-center h-screen">
                <Loader />
              </div> :
              <div className="mt-10">
                <div className="font-grotesk text-blog-text-reskin text-xs minmd:text-sm font-black">
                  {found} PROFILE PICTURE COLLECTIONS
                </div>
                <div className={tw(
                  'mt-6 gap-2 minmd:grid minmd:grid-cols-2 minmd:space-x-2 minlg:space-x-0 minlg:gap-4',
                  sideNavOpen ? 'minxl:grid-cols-3': 'minlg:grid-cols-3 minxl:grid-cols-4')}>
                  {collectionsResults && collectionsResults.map((collection, index) => {
                    return (
                      <div key={index} className="DiscoverCollectionItem mb-2 min-h-[10.5rem] minmd:min-h-[13rem] minxl:min-h-[13.5rem]">
                        <CollectionItem
                          contractAddr={collection.document.contractAddr}
                          contractName={collection.document.contractName}
                        />
                      </div>);
                  })}
                </div>
              </div>}
            {collectionsResults.length < found && !loading && <div className="mx-auto w-full minxl:w-3/5 flex justify-center mt-7 font-medium">
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
    </>
  );
}

DiscoverPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      { page }
    </DefaultLayout>
  );
};