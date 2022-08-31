import { AccentType, Button, ButtonType } from 'components/elements/Button';
import Loader from 'components/elements/Loader';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CollectionItem } from 'components/modules/Search/CollectionItem';
import { CuratedCollectionsFilter } from 'components/modules/Search/CuratedCollectionsFilter';
import { SideNav } from 'components/modules/Search/SideNav';
import { useFetchNFTsForCollections } from 'graphql/hooks/useFetchNFTsForCollections';
import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';
import NotFoundPage from 'pages/404';
import { DiscoverPageProps } from 'types';
import { Doppler, getEnvBool } from 'utils/env';
import { getPerPage, isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { getCollection } from 'lib/contentful/api';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

export default function DiscoverPage({ data }: DiscoverPageProps) {
  const { fetchNFTsForCollections } = useFetchNFTsForCollections();
  const { width: screenWidth } = useWindowDimensions();
  const [page, setPage] = useState(1);
  const { sideNavOpen, setCuratedCollections, selectedCuratedCollection, curatedCollections, setSelectedCuratedCollection } = useSearchModal();
  const [paginatedAddresses, setPaginatedAddresses] = useState([]);

  const { data: nftsForCollections } = useSWR(selectedCuratedCollection, async () => {
    let nftsForCollections;
    setPaginatedAddresses([]);
    await fetchNFTsForCollections({
      collectionAddresses: contractAddresses,
      count: contractAddresses.length
    }).then((collectionsData => {
      nftsForCollections = collectionsData.nftsForCollections.sort((a,b) =>(a.collectionAddress > b.collectionAddress) ? 1 : -1);
    }));
    console.log(nftsForCollections, 'nftsForCollections fdo');
    return nftsForCollections;
  });

  const contractAddresses = useMemo(() => {
    return selectedCuratedCollection?.contractAddresses.addresses ?? [];
  }, [selectedCuratedCollection?.contractAddresses.addresses]);

  useEffect(() => {
    if(isNullOrEmpty(curatedCollections)) {
      setCuratedCollections(data);
    }
  },[curatedCollections, data, setCuratedCollections]);

  useEffect(() => {
    setPage(1);
  },[selectedCuratedCollection?.tabTitle]);

  useEffect(() => {
    if(isNullOrEmpty(selectedCuratedCollection)) {
      curatedCollections && curatedCollections.length > 0 && setSelectedCuratedCollection(curatedCollections[0]);
    }
  },[curatedCollections, selectedCuratedCollection, setSelectedCuratedCollection]);

  useEffect(() => {
    const paginatedContracts = nftsForCollections?.slice(0, getPerPage('discover', screenWidth, sideNavOpen)*page);
    console.log(paginatedContracts, 'paginatedContracts fdo');
    const sortedPaginatedAddresses = paginatedContracts?.sort((a,b) =>(a.collectionAddress > b.collectionAddress) ? 1 : -1);
    nftsForCollections && nftsForCollections.length > 0 && setPaginatedAddresses([...sortedPaginatedAddresses]);
  },[nftsForCollections, page, screenWidth, sideNavOpen]);

  if (!getEnvBool(Doppler.NEXT_PUBLIC_SEARCH_ENABLED)) {
    return <NotFoundPage />;
  }

  const changeCurated = () => {
    setPage(1);
  };

  return(
    <>
      <div className="my-10 minlg:mb-10 minlg:mt-20 max-w-lg minmd:max-w-full mx-[4%] minmd:mx-[2%] minlg:mr-[2%] minlg:ml-0 self-center minmd:self-stretch">
        <div className="flex">
          <div className="hidden minlg:block">
            <SideNav onSideNav={changeCurated}/>
          </div>
          <div className="minlg:mt-8 minlg:ml-6 w-full">
            <span className="font-grotesk text-black font-black text-4xl minmd:text-5xl">Discover</span>
            <p className="text-blog-text-reskin mt-4 text-base minmd:text-lg">
            Find your next PFP, one-of-kind collectable, or membership pass to the next big thing!
            </p>
            <div className="block minlg:hidden">
              <CuratedCollectionsFilter onClick={changeCurated}/>
            </div>
            <div className="mt-10">
              <div className="font-grotesk text-blog-text-reskin text-xs minmd:text-sm font-black">
                {`${contractAddresses.length} ${selectedCuratedCollection?.tabTitle.toUpperCase() ?? 'CURATED'} COLLECTIONS`}
              </div>
              <div className={tw(
                'mt-6 gap-2 minmd:grid minmd:grid-cols-2 minmd:space-x-2 minlg:space-x-0 minlg:gap-4',
                sideNavOpen ? 'minxl:grid-cols-3': 'minlg:grid-cols-3 minxl:grid-cols-4')}>
                {paginatedAddresses && paginatedAddresses.length > 0 && paginatedAddresses.map((collection, index) => {
                  return (
                    <div key={index} className="DiscoverCollectionItem mb-2 min-h-[10.5rem] minmd:min-h-[13rem] minxl:min-h-[13.5rem]">
                      <CollectionItem
                        contractAddr={collection?.collectionAddress}
                        images={[
                          collection.nfts[0]?.metadata?.imageURL,
                          collection.nfts[1]?.metadata?.imageURL,
                          collection.nfts[2]?.metadata?.imageURL,
                        ]}
                        count={collection.nfts.length}
                      />
                    </div>);
                })}
              </div>
              {(paginatedAddresses && paginatedAddresses.length === 0) &&
                (<div className="flex items-center justify-center min-h-[16rem] w-full">
                  <Loader />
                </div>)}
              {paginatedAddresses && paginatedAddresses.length < 5 && (
                <div className="hidden minlg:block w-full h-52"></div>
              )}
            </div>
            { paginatedAddresses.length < contractAddresses.length &&
            <div className="mx-auto w-full minxl:w-1/4 flex justify-center mt-7 font-medium">
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

export async function getServerSideProps({ preview = false }) {
  const curData = await getCollection(false, 10, 'curatedCollectionsCollection', 'tabTitle contractAddresses');
  return {
    props: {
      preview,
      data: curData ?? null,
    }
  };
}