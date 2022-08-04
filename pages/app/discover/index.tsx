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
  const [active, setActive] = useState('PFP');

  return (
    <div className={'border-t border-[#e5e7eb] border-b my-3.5'}>
      <div className="flex justify-between">
        <span className="text-black text-lg font-medium">Check out our curated collections</span>
        <ChevronsUp
          onClick={() => {
            setIsFilterCollapsed(!isFilterCollapsed);
          }}
          className={tw('cursor-pointer transition-transform', isFilterCollapsed ? 'rotate-180' : '')}
        />
      </div>
      <p className="text-blog-text-reskin font-medium">
        We’ve hand-picked NFT collections to help you find what you’re looking for.
      </p>
      <motion.div
        animate={{
          height: isFilterCollapsed ? 0 : 'auto' }}
        transition={{ duration: 0.2 }}
        className={tw('overflow-hidden mx-auto')}
      >
        <div className="flex flex-wrap justify-between items-center w-[90%] max-w-xs mx-auto h-fit my-7">
          <span
            className={tw(
              'border border-gray-300 font-grotesk',
              'rounded-[1.75rem] py-4 px-6 h-fit my-3 hover:cursor-pointer',
              active === 'PFP' ? 'bg-[#F9D963] text-black font-black': 'text-blog-text-reskin font-bold' )}
            onClick={() => {
              setActive('PFP');
              props.onClick('nft');
            }}
          >
            PFP
          </span>
          <span
            className={tw(
              'border border-gray-300 font-grotesk',
              'rounded-[1.75rem] py-4 px-6 h-fit my-3 hover:cursor-pointer',
              active === 'Art' ? 'bg-[#F9D963] text-black font-black': 'text-blog-text-reskin font-bold' )}
            onClick={() => {
              setActive('Art');
              props.onClick('col');
            }}
          >
            Art
          </span>
          <span className="font-grotesk font-bold text-blog-text-reskin border border-gray-300 rounded-[1.75rem] py-4 px-6 h-fit my-3 hover:cursor-pointer">Gaming</span>
          <span className="font-grotesk font-bold text-blog-text-reskin border border-gray-300 rounded-[1.75rem] py-4 px-6 h-fit my-3 hover:cursor-pointer">Genesys Keys</span>
          <span className="font-grotesk font-bold text-blog-text-reskin border border-gray-300 rounded-[1.75rem] py-4 px-6 h-fit my-3 hover:cursor-pointer">Profiles</span>
          <span className="font-grotesk font-bold text-blog-text-reskin border border-gray-300 rounded-[1.75rem] py-4 px-6 h-fit my-3 hover:cursor-pointer mx-auto">Discover by keyword</span>
        </div>
      </motion.div>
    </div>);
};

const CollectionItem = ({ contractAddr, contractName }: {contractAddr: string; contractName: string} ) => {
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
    }));
  }, [fetchCollectionsNFTs, contractAddr]);

  return (
    imageArray.length > 0 && <NFTCollectionCard
      contract={contractAddr}
      count={count}
      images={imageArray}
      onClick={() => {
        router.push(`/app/collection/${contractAddr}/`);
      }}
      customBackground={'white'}
      customBorder={'border border-grey-200'}
      contractName={contractName}
      lightModeForced={true}
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
        //console.log(results, 'results fdo');
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
      <div className="my-10 max-w-lg mx-[4%] self-center">
        <span className="font-grotesk text-black font-black text-4xl">Discover</span>
        <p className="text-blog-text-reskin mt-4 text-base">Find your next PFP, one-of-kind collectable, or membership pass to the next big thing!</p>
        <CuratedCollectionsFilter onClick={changeCurated}/>
        {loading ?
          <div className="w-full mx-auto flex justify-center">
            <Loader />
          </div> :
          <>
            {collectionsResults && collectionsResults.map((collection, index) => {
              return (
                <div key={index} className="mt-6 min-h-[10.5rem]">
                  <CollectionItem
                    contractAddr={collection.document.contractAddr}
                    contractName={collection.document.contractName}
                  />
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