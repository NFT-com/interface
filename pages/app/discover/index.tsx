import { AccentType, Button, ButtonType } from 'components/elements/Button';
import Loader from 'components/elements/Loader';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CollectionItem } from 'components/modules/Search/CollectionItem';
import { CuratedCollectionsFilter } from 'components/modules/Search/CuratedCollectionsFilter';
import { SideNav } from 'components/modules/Search/SideNav';
import { useFetchNFTsForCollections } from 'graphql/hooks/useFetchNFTsForCollections';
import { usePreviousValue } from 'graphql/hooks/usePreviousValue';
import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { DiscoverPageProps } from 'types';
import { collectionCardImages, getPerPage, isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { CollectionCard } from '../../../components/modules/DiscoveryCards/CollectionCard';
import { NftCard } from '../../../components/modules/DiscoveryCards/NftCard';
import { ProfileCard } from '../../../components/modules/DiscoveryCards/ProfileCard';
import { DiscoveryTabNav } from '../../../components/modules/DiscoveryTabNavigation/DiscoveryTabsNavigation';

import { getCollection } from 'lib/contentful/api';
import { SlidersHorizontal, X } from 'phosphor-react';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

export default function DiscoverPage({ data }: DiscoverPageProps) {
  const { fetchNFTsForCollections } = useFetchNFTsForCollections();
  const { width: screenWidth } = useWindowDimensions();
  const { usePrevious } = usePreviousValue();
  const [page, setPage] = useState(1);
  const [tabName, setTabName] = useState('nft');
  const { sideNavOpen, setCuratedCollections, selectedCuratedCollection, curatedCollections, setSelectedCuratedCollection, setSideNavOpen } = useSearchModal();
  const [paginatedAddresses, setPaginatedAddresses] = useState([]);
  const prevSelectedCuratedCollection = usePrevious(selectedCuratedCollection);

  const { data: nftsForCollections } = useSWR(selectedCuratedCollection, async () => {
    let nftsForCollections;
    prevSelectedCuratedCollection !== selectedCuratedCollection && setPaginatedAddresses([]);
    await fetchNFTsForCollections({
      collectionAddresses: contractAddresses,
      count: 5
    }).then((collectionsData => {
      const sortedNftsForCollections = collectionsData.nftsForCollections.sort((a,b) =>(a.collectionAddress > b.collectionAddress) ? 1 : -1);
      nftsForCollections = sortedNftsForCollections.filter(i => i.nfts.length > 0);
    }));
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
    const sortedPaginatedAddresses = paginatedContracts?.sort((a,b) =>(a.collectionAddress > b.collectionAddress) ? 1 : -1);
    nftsForCollections && nftsForCollections.length > 0 && setPaginatedAddresses([...sortedPaginatedAddresses]);
  },[nftsForCollections, page, screenWidth, sideNavOpen]);

  const changeCurated = () => {
    setPage(1);
  };
  const showCOntend = () => {
    if(tabName === 'nft'){
      return (
        <div className="flex justify-start mb-10">
          <NftCard
            name="Name"
            collectionName="Colection Name"
            price="19.99$"
            secondPrice="2000"
            ednDay="10 days"
            isOnSale={false}/>
          <NftCard
            name="Name"
            collectionName="Colection Name"
            price="19.99$"
            secondPrice="2000"
            ednDay="10 days"
            isOnSale={true}/>
        </div>
      );
    }
    if(tabName === 'collections'){
      return (
        <div className="flex justify-start mb-10">
          <CollectionCard
            key={1}
            contract={'Name'}
            userName={'User name'}
            description={'descriptiondescriptiondescription'}
            countOfElements={'1000'}
            imgUrl={''}/>
        </div>
      );
    }
    if(tabName === 'profiles'){
      return (
        <div className="flex justify-start mb-10">
          <ProfileCard
            name="Name"
            nftCounter="100"
            followLink=""
            btnName="link name"
            bgImg=""/>
        </div>
      );
    }
  };

  return(
    <>
      <div className="minmd:p-16 minmd:m-0 p-16 mb-10 minlg:mb-10 minlg:mt-20 minmd:max-w-full self-center minmd:self-stretch minxl:mx-auto min-h-screen ">
        <div className="flex">
          {/*minlg:ml-6*/}
          <div className=" w-full min-h-disc">
            <div className="flex">
              <div className="flex-auto">
                {/*<div className="font-grotesk text-blog-text-reskin text-xs minmd:text-sm font-black mt-6 minlg:mt-0">*/}
                {/*  {`${nftsForCollections?.length || 0} ${selectedCuratedCollection?.tabTitle.toUpperCase() ?? 'CURATED'} COLLECTIONS`}*/}
                {/*</div>*/}
                <div className={tw(
                  'gap-2 minmd:grid minmd:grid-cols-2 minmd:space-x-2 minlg:space-x-0 minlg:gap-4',
                  !sideNavOpen ? 'minxl:grid-cols-2': 'minlg:grid-cols-2 minmd:grid-cols-1 minxl:grid-cols-3')}>
                  {paginatedAddresses && paginatedAddresses.length > 0 && paginatedAddresses.map((collection, index) => {
                    return (
                      <CollectionCard
                        key={index}
                        redirectTo={`/app/collection/${collection?.collectionAddress}/`}
                        contractAddress={collection?.collectionAddress}
                        contract={collection?.collectionAddress}
                        userName={collection.nfts[0].metadata.name}
                        description={collection.nfts[0].metadata.description}
                        countOfElements={collection.actualNumberOfNFTs}
                        imgUrl={collectionCardImages(collection)}/>
                      // <div key={index} className="DiscoverCollectionItem mb-2 min-h-[10.5rem]">
                      //   <CollectionItem
                      //     contractAddr={collection?.collectionAddress}
                      //     images={collectionCardImages(collection)}
                      //     count={collection.actualNumberOfNFTs}
                      //   />
                      // </div>
                    );
                  })}
                </div>
                {(paginatedAddresses && paginatedAddresses.length === 0) &&
                (<div className="flex items-center justify-center min-h-[16rem] w-full">
                  <Loader />
                </div>)}
                { paginatedAddresses && paginatedAddresses.length > 0 && paginatedAddresses.length < nftsForCollections?.length &&
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
