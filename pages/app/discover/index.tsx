import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { Footer } from 'components/elements/Footer';
import { NFTCollectionCard } from 'components/elements/NFTCollectionCard';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { useFetchCollectionNFTs } from 'graphql/hooks/useFetchCollectionNFTs';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { tw } from 'utils/tw';
import { SearchableFields } from 'utils/typeSenseAdapters';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Vector from 'public/Vector.svg';
import { useEffect, useState } from 'react';
import { ChevronsUp, Loader } from 'react-feather';

export const CuratedCollectionsFilter = (props: {onClick: (term: string) => void}) => {
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
  return (
    <div className={'border-t border-[#e5e7eb] border-b'}>
      <div className="mx-5 text-gray-400 text-lg my-3.5 flex justify-between">
        <div>
          <span>Check out our curated collections</span>
          <p>We’ve hand-picked NFT collections to help you find what you’re looking for.</p>
        </div>
        <ChevronsUp
          onClick={() => {
            setIsFilterCollapsed(!isFilterCollapsed);
          }}
          className={tw('cursor-pointer transition-transform', isFilterCollapsed ? 'rotate-180' : '')}
        />
      </div>
      <motion.div
        animate={{
          height: isFilterCollapsed ? 0 : 'auto' }}
        transition={{ duration: 0.2 }}
        className={tw('overflow-hidden mx-auto')}
      >
        <div className="flex flex-wrap justify-between items-center w-[70%] mx-auto h-fit my-10">

          <span
            className="border border-black rounded-[1.75rem] py-4 px-6 h-fit my-3 hover:cursor-pointer"
            onClick={() => props.onClick('')}
          >PFP</span>
          <span
            className="border border-black rounded-[1.75rem] py-4 px-6 h-fit my-3 hover:cursor-pointer"
            onClick={() => props.onClick('col')}
          >Art</span>
          <span className="border border-black rounded-[1.75rem] py-4 px-6 h-fit my-3 hover:cursor-pointer">Gaming</span>
          <span className="border border-black rounded-[1.75rem] py-4 px-6 h-fit my-3 hover:cursor-pointer">Genesys Keys</span>
          <span className="border border-black rounded-[1.75rem] py-4 px-6 h-fit my-3 hover:cursor-pointer">Profiles</span>
          <span className="border border-black rounded-[1.75rem] py-4 px-6 h-fit my-3 hover:cursor-pointer mx-auto">Discover by keyword</span>
        </div>
      </motion.div>
    </div>);
};

const CollectionItem = (contractAddr: any) => {
  const router = useRouter();
  const { fetchCollectionsNFTs } = useFetchCollectionNFTs();
  const [imageArray, setImageArray] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const images = [];
    contractAddr && fetchCollectionsNFTs({
      collectionAddress: contractAddr,
      pageInput:{
        first: 3,
        afterCursor: null, }
    }).then((collectionsData => {
      setCount(collectionsData?.collectionNFTs.items.length);
      images.push(collectionsData?.collectionNFTs.items[0]?.metadata.imageURL);
      images.push(collectionsData?.collectionNFTs.items[1]?.metadata.imageURL);
      images.push(collectionsData?.collectionNFTs.items[2]?.metadata.imageURL);
      setImageArray([...images]);
      console.log(images, 'images fdo');
    }));
  }, [fetchCollectionsNFTs, contractAddr]);

  return (
    imageArray.length > 0 && <NFTCollectionCard
      contract={contractAddr}
      count={count}
      images={imageArray}
      onClick={() => {
        router.push(`/app/collection/${contractAddr}/`);
      } }
    />
  );
};

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { fetchTypesenseSearch, loading } = useFetchTypesenseSearch();
  const [collectionsResults, setCollectionsResults] = useState([]);
  const [found, setFound] = useState(0);

  useEffect(() => {
    fetchTypesenseSearch({
      index:'collections',
      queryFields: SearchableFields.COLLECTIONS_INDEX_FIELDS,
      searchTerm: searchTerm,
      perPage: 2,
      page: page,
    })
      .then((results) => {
        setCollectionsResults([...collectionsResults,...results.hits]);
        setFound(results.found);
        console.log(results, 'results fdo');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTypesenseSearch, page, searchTerm]);

  const changeCurated = (curated: string) => {
    setCollectionsResults([]);
    setSearchTerm(curated);
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
      <div className="my-10">
        <span className="font-grotesk text-black font-black text-4xl">Discover</span>
        <p className="text-[#7F7F7F]">Find your next PFP, one-of-kind collectable, or membership pass to the next big thing!</p>
        <CuratedCollectionsFilter onClick={changeCurated}/>
        {loading ?
          <div className="w-full mx-auto flex justify-center">
            <Loader />
          </div> :
          <>
            {collectionsResults && collectionsResults.map((collection, index) => {
              console.log(collection, 'collection fdo');
              return (
                <div key={index}>
                  <CollectionItem contractAddr={collection.document.contractAddr} />
                </div>);
            })}
          </>}
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