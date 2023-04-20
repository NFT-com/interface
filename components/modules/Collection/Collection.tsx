import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ExternalLink as LinkIcon } from 'react-feather';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FunnelSimple } from 'phosphor-react';
import useSWR from 'swr';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import LikeCount from 'components/elements/LikeCount';
import { Tabs } from 'components/elements/Tabs';
import { CollectionActivity } from 'components/modules/Analytics/CollectionActivity';
import { NFTCard } from 'components/modules/NFTCard/NFTCard';
import { BannerWrapper } from 'components/modules/Profile/BannerWrapper';
import { SideNav } from 'components/modules/Search/SideNav';
import { LikeableType } from 'graphql/generated/types';
import {
  useCollectionQuery,
  useFetchTypesenseSearch,
  useGetContractSalesStatisticsQuery,
  useGetNFTDetailsQuery,
  usePreviousValue,
  useProfileQuery,
  useSetLikeMutation
} from 'graphql/hooks';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useNftProfileTokens } from 'hooks/useNftProfileTokens';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { useTabs, useToggle } from 'hooks/utils';
import { getContractMetadata } from 'utils/alchemyNFT';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/format';
import { shortenAddress } from 'utils/helpers';
import { cl, tw } from 'utils/tw';

import { CollectionContextType, CollectionHeaderProps, CollectionProps } from 'types/collection';

import { CollectionInfo } from './CollectionInfo';

const BlurImage = dynamic(import('components/elements/BlurImage'));

export const collectionPropTypeGuard = (
  props: CollectionProps
): {
  value: string;
  type: string;
  restProps: Omit<CollectionProps, 'slug'>;
} => {
  if ('slug' in props) {
    const { slug, ...restProps } = props;
    return { value: slug?.toString(), type: 'slug', restProps };
  }

  const { contract } = props;
  return { value: contract?.toString(), type: 'contract', restProps: props };
};

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

const useCollectionContext = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('Collection components cannot be rendered outside the Collection component!');
  }
  return context;
};

export function Collection(props: CollectionProps) {
  const router = useRouter();
  const { contractAddr, slug: slugQuery } = router.query;
  const contract = contractAddr as string;
  const slug = slugQuery as string;

  const defaultChainId = useDefaultChainId();
  const {
    setSearchModalOpen,
    id_nftName,
    sideNavOpen,
    setSideNavOpen,
    setModalType,
    setCollectionPageAppliedFilters,
    setClearedFilters
  } = useSearchModal();
  const [selectedTab, setSelectedTab, tabs] = useTabs(0, {
    0: 'NFTs',
    1: 'Activity'
  });

  const [found, setFound] = useState(0);
  const [collectionNfts, setCollectionNfts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { usePrevious } = usePreviousValue();
  const prevContractAddr = usePrevious(contract || slug);
  const prevPage = usePrevious(currentPage);
  const prevId_nftName = usePrevious(id_nftName);

  const propsGuard = collectionPropTypeGuard(props);
  const collectionContract =
    propsGuard.type === 'contract' ? propsGuard.value : propsGuard.restProps.contract.toString();

  // Data Fetching
  const { fetchTypesenseMultiSearch } = useFetchTypesenseSearch();
  const collectionSalesHistory = useGetContractSalesStatisticsQuery(collectionContract);
  const collectionNFTInfo = useGetNFTDetailsQuery(collectionContract, collectionNfts[0]?.document?.tokenId);
  const { data: collectionData, mutate: mutateCollectionData } = useCollectionQuery(
    propsGuard.type === 'contract' && !slug
      ? {
          chainId: defaultChainId,
          contract
        }
      : {
          chainId: defaultChainId,
          slug
        }
  );
  const { data: collectionMetadata } = useSWR(`ContractMetadata ${propsGuard.value}`, async () =>
    getContractMetadata(
      propsGuard.type === 'contract' ? propsGuard.value : collectionData.collection.contract,
      defaultChainId
    )
  );
  const { profileTokens: creatorTokens } = useNftProfileTokens(collectionData?.collection?.deployer);
  const { profileData: collectionOwnerData } = useProfileQuery(creatorTokens?.at(0)?.tokenUri?.raw?.split('/').pop());
  const { profileData: collectionPreferredOwnerData } = useProfileQuery(
    collectionOwnerData?.profile?.owner?.preferredProfile?.url
  );
  const { setLike, unsetLike } = useSetLikeMutation(collectionData?.collection?.id, LikeableType.Collection);
  const collectionName = collectionMetadata?.contractMetadata?.name;

  const value = useMemo(
    () => ({
      collectionContract,
      collectionData,
      mutateCollectionData,
      collectionName,
      collectionNfts,
      collectionNFTInfo,
      collectionPreferredOwnerData,
      collectionSalesHistory,
      contractAddr,
      currentPage,
      setCurrentPage,
      slug,
      found,
      selectedTab,
      setSelectedTab,
      tabs,
      setFound,
      setLike,
      unsetLike,
      setSearchModalOpen,
      sideNavOpen,
      setSideNavOpen,
      setModalType
    }),
    [
      collectionContract,
      collectionData,
      mutateCollectionData,
      collectionName,
      collectionNfts,
      collectionNFTInfo,
      collectionPreferredOwnerData,
      collectionSalesHistory,
      contractAddr,
      currentPage,
      setCurrentPage,
      slug,
      found,
      setFound,
      setLike,
      unsetLike,
      selectedTab,
      setSelectedTab,
      tabs,
      setSearchModalOpen,
      sideNavOpen,
      setSideNavOpen,
      setModalType
    ]
  );

  useEffect(() => {
    if (![contractAddr, slug].includes(prevContractAddr)) {
      setCollectionNfts([]);
      setCurrentPage(1);
      setFound(0);
      setCollectionPageAppliedFilters('', '', false);
    }

    if (prevId_nftName !== id_nftName) {
      setCollectionNfts([]);
      setCurrentPage(1);
      setFound(0);
    }
  }, [
    contractAddr,
    slug,
    id_nftName,
    prevContractAddr,
    prevId_nftName,
    setClearedFilters,
    setCollectionPageAppliedFilters
  ]);

  useEffect(() => {
    currentPage === 1 &&
      collectionContract &&
      fetchTypesenseMultiSearch({
        searches: [
          {
            collection: 'nfts',
            q: id_nftName,
            query_by: 'tokenId,nftName',
            per_page: 8,
            page: currentPage,
            facet_by: 'contractAddr,traits.value,traits.type',
            filter_by: `contractAddr:=${contractAddr?.toString() || collectionContract}`,
            exhaustive_search: true
          }
        ]
      }).then(resp => {
        setCollectionNfts([...resp.results[0].hits]);
        setFound(resp.results[0].found);
      });
  }, [contractAddr, currentPage, fetchTypesenseMultiSearch, id_nftName, collectionContract]);

  useEffect(() => {
    if (currentPage > 1 && currentPage !== prevPage) {
      collectionContract &&
        fetchTypesenseMultiSearch({
          searches: [
            {
              collection: 'nfts',
              q: id_nftName,
              query_by: 'tokenId,nftName',
              per_page: 8,
              page: currentPage,
              facet_by: 'contractAddr,traits.value,traits.type',
              filter_by: `contractAddr:=${contractAddr?.toString() || collectionContract}`,
              exhaustive_search: true
            }
          ]
        }).then(resp => {
          setCollectionNfts([...collectionNfts, ...resp.results[0].hits]);
          setFound(resp.results[0].found);
        });
    }
  }, [collectionNfts, contractAddr, currentPage, fetchTypesenseMultiSearch, id_nftName, prevPage, collectionContract]);

  return <CollectionContext.Provider value={value}>{props.children}</CollectionContext.Provider>;
}

export const CollectionBanner: React.FC = () => {
  const { collectionNFTInfo, collectionData } = useCollectionContext();

  // ! NOTE: Added fallback banner from collectionData, but image might be low res/quality.
  const imageOverride = !collectionNFTInfo?.error
    ? collectionNFTInfo?.data?.contract?.metadata?.banner_url?.replace('?w=500', '?w=3000') ||
      collectionNFTInfo?.data?.contract?.metadata?.cached_banner_url
    : collectionData?.collection?.bannerUrl;

  return (
    <div className='mt-20'>
      <BannerWrapper
        alt={`${collectionData?.collection?.name} Banner Image`}
        loading={Boolean(collectionNFTInfo.loading)}
        imageOverride={imageOverride}
        isCollection
      />
    </div>
  );
};

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({ children }) => {
  const { collectionContract, collectionData, mutateCollectionData, collectionName, collectionPreferredOwnerData } =
    useCollectionContext();
  return (
    <>
      <div className='mx-auto mt-9 max-w-nftcom px-4 font-noi-grotesk'>
        <div className='flex'>
          <h2 className='text-3xl font-bold'>
            {isNullOrEmpty(collectionName) && isNullOrEmpty(collectionData?.collection?.name) ? (
              <div role='status' className='animate-pulse space-y-8 md:flex md:items-center md:space-x-8 md:space-y-0'>
                <div className='w-full'>
                  <div className='mb-4 h-2.5 w-36 rounded-full bg-gray-200 dark:bg-gray-700'></div>
                </div>
                <span className='sr-only'>Loading...</span>
              </div>
            ) : (
              collectionData?.collection?.name || collectionName
            )}
          </h2>
          <div className='ml-3'>
            <LikeCount
              count={collectionData?.collection?.likeCount}
              isLiked={collectionData?.collection?.isLikedBy}
              mutate={mutateCollectionData}
              likeData={{
                id: collectionData?.collection?.id,
                type: LikeableType.Collection
              }}
            />
          </div>
        </div>
        <div className='mt-6 grid grid-cols-2 gap-4 minlg:w-1/2'>
          <div className='flex'>
            {collectionPreferredOwnerData && (
              <div className='relative h-10 w-10 overflow-hidden'>
                <BlurImage
                  src={
                    collectionPreferredOwnerData?.profile?.photoURL || 'https://cdn.nft.com/profile-image-default.svg'
                  }
                  alt='test'
                  className='mr-2 rounded-[10px] object-cover'
                  fill
                />
              </div>
            )}
            <div className={tw('flex flex-col justify-between', collectionPreferredOwnerData?.profile && 'ml-2')}>
              <p className='text-[10px] font-bold uppercase text-[#6F6F6F]'>Creator</p>
              {collectionPreferredOwnerData?.profile ? (
                <Link href={`/${collectionPreferredOwnerData?.profile?.url}`}>
                  <p className='cursor-pointer font-bold underline decoration-[#F9D963] underline-offset-4'>
                    {collectionPreferredOwnerData?.profile?.url}
                  </p>
                </Link>
              ) : (
                <div className='mt-1 font-mono font-medium text-[#B59007]'>
                  <a
                    target='_blank'
                    rel='noreferrer'
                    href={`https://etherscan.io/address/${collectionContract}`}
                    className=' flex tracking-wide'
                  >
                    <span>{shortenAddress(collectionData?.collection?.deployer, 4)}</span>
                    <LinkIcon size={20} className='ml-1' />
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-col'>
            <p className='text-[10px] font-bold uppercase text-[#6F6F6F]'>Contract Address</p>
            <div className='mt-1 font-mono font-medium text-[#B59007]'>
              <a
                target='_blank'
                rel='noreferrer'
                href={`https://etherscan.io/address/${collectionContract}`}
                className='flex tracking-wide'
              >
                <span className='contractAddress'>{shortenAddress(collectionContract, 4)}</span>
                <LinkIcon size={20} className='ml-1' />
              </a>
            </div>
          </div>
        </div>
        <div className='mb-10 mt-6 flex flex-col font-noi-grotesk text-black minlg:flex-row'>{children}</div>
      </div>
    </>
  );
};

export const CollectionDescription: React.FC = () => {
  const { collectionData } = useCollectionContext();
  const [descriptionExpanded, toggleDescription] = useToggle();
  const isExpanded = useMemo(() => descriptionExpanded, [descriptionExpanded]);

  const theme = {
    p: (props: any) => {
      const { children } = props;
      return <p className='inline'>{children}</p>;
    },
    a: (props: any) => {
      const { children } = props;
      return (
        <a className='inline underline' href={props.href} target='_blank' rel='noreferrer'>
          {children}
        </a>
      );
    }
  };

  return (
    <>
      {collectionData?.collection?.description &&
        collectionData?.collection?.description !== 'placeholder collection description text' && (
          <div className='minlg:w-1/2'>
            <h3 className='font-semibold text-[#6F6F6F]'>Description</h3>
            <div className='mb-10 mt-1 minlg:mb-0 minlg:pr-4'>
              {isExpanded ? (
                <>
                  <ReactMarkdown components={theme} skipHtml linkTarget='_blank'>
                    {collectionData?.collection?.description}
                  </ReactMarkdown>
                  <p
                    className='ml-1 inline font-bold text-[#B59007] hover:cursor-pointer'
                    onClick={() => toggleDescription()}
                  >
                    Show less
                  </p>
                </>
              ) : (
                <>
                  {collectionData?.collection?.description.length > 87 ? (
                    <div className='inline minlg:hidden'>
                      <ReactMarkdown components={theme} skipHtml linkTarget='_blank'>
                        {`${collectionData?.collection?.description.substring(0, 87)}...`}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className='inline minlg:hidden'>
                      <ReactMarkdown components={theme} skipHtml linkTarget='_blank'>
                        {collectionData?.collection?.description}
                      </ReactMarkdown>
                    </div>
                  )}
                  {collectionData?.collection?.description.length > 200 ? (
                    <div className='hidden minlg:inline'>
                      <ReactMarkdown components={theme} skipHtml linkTarget='_blank'>
                        {`${collectionData?.collection?.description.substring(0, 200)}...`}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className='hidden minlg:inline'>
                      <ReactMarkdown components={theme} skipHtml linkTarget='_blank'>
                        {collectionData?.collection?.description}
                      </ReactMarkdown>
                    </div>
                  )}
                  {collectionData?.collection?.description.length > 87 && (
                    <>
                      <p
                        className='ml-1 inline font-bold text-[#B59007] hover:cursor-pointer minlg:hidden'
                        onClick={() => toggleDescription()}
                      >
                        Show more
                      </p>
                    </>
                  )}
                  {collectionData?.collection?.description.length > 200 && (
                    <>
                      <p
                        className='ml-1 hidden font-bold text-[#B59007] hover:cursor-pointer minlg:inline'
                        onClick={() => toggleDescription()}
                      >
                        Show more
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
    </>
  );
};

export const CollectionDetails: React.FC = () => {
  const { collectionNfts, collectionSalesHistory } = useCollectionContext();
  return (
    <div className='w-full minlg:w-1/2'>
      <CollectionInfo
        data={collectionSalesHistory?.data?.statistics}
        type={collectionNfts[0]?.document?.nftType}
        hasDescription={true}
      />
    </div>
  );
};

export const CollectionNfts: React.FC = () => {
  const { collectionNfts, currentPage, setCurrentPage, found } = useCollectionContext();
  const onNextPage = () => setCurrentPage(currentPage + 1);
  return (
    <div className='flex overflow-hidden pb-3.5'>
      <div className='hidden minlg:block'>
        <SideNav onSideNav={() => null} isCollectionView />
      </div>
      {collectionNfts.length > 0 ? (
        <div className='flex-auto'>
          {found && (
            <p className='mb-4 text-[10px] font-medium uppercase text-[#6F6F6F] '>
              {found > 1 ? `${found} NFTS` : `${found} NFT`}
            </p>
          )}
          <div className='grid max-w-nftcom grid-cols-2 gap-5 minmd:grid-cols-3 minlg:grid-cols-4 minxl:mx-auto '>
            {collectionNfts.map((nft, i) => {
              return (
                <div className='NftCollectionItem' key={`${nft.contractAddr}-${nft.tokenId}-${i}`}>
                  <NFTCard
                    contractAddr={nft.document.contractAddr}
                    tokenId={nft.document.tokenId}
                    name={nft.document.nftName}
                    collectionName={nft.document.contractName}
                    images={[]}
                    redirectTo={nft.document.nftName && `/app/nft/${nft.document.contractAddr}/${nft.document.tokenId}`}
                  />
                </div>
              );
            })}
          </div>
          {found > collectionNfts.length && (
            <div className='mx-auto mt-7 flex w-full justify-center font-medium minxl:w-3/5'>
              <Button
                size={ButtonSize.LARGE}
                scaleOnHover
                stretch
                label={'Load More'}
                onClick={onNextPage}
                type={ButtonType.PRIMARY}
              />
            </div>
          )}
        </div>
      ) : (
        <div className='font-noi-grotesk text-xl font-black text-[#7F7F7F]'>No results found</div>
      )}
    </div>
  );
};

export const CollectionBody: React.FC = () => {
  const { width: screenWidth } = useWindowDimensions();
  const { setModalType, setSearchModalOpen, sideNavOpen, setSideNavOpen, collectionContract } = useCollectionContext();
  const [selectedTab, setSelectedTab] = useState('NFTs');

  const tabs = [
    {
      label: 'NFTs'
    },
    {
      label: 'Activity'
    }
  ];

  return (
    <>
      <div className={cl('w-full px-4 pb-16', 'mx-auto max-w-nftcom', 'min-h-screen')}>
        {getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED) && (
          <div className='mb-6 block w-full items-center justify-between minlg:flex minlg:w-max minlg:flex-row-reverse'>
            <div className='mb-6 block items-center minlg:mb-0 minlg:flex'>
              <Tabs tabOptions={tabs} onTabChange={setSelectedTab} customTabWidth={'minlg:max-w-md minlg:w-[448px]'} />
            </div>
            <div
              className={tw(
                sideNavOpen ? 'mr-5' : '',
                'mb-6 flex w-full items-center minlg:mb-0 minlg:mr-3 minlg:flex-auto'
              )}
              onClick={() => {
                if (screenWidth < 900) {
                  setModalType('collectionFilters');
                  setSearchModalOpen(true, 'collectionFilters');
                } else {
                  setSideNavOpen(!sideNavOpen);
                }
              }}
            >
              <div
                className={tw(
                  'w-full cursor-pointer minlg:h-10',
                  'rounded-[20px] bg-white p-1 font-noi-grotesk font-bold text-[#1F2127]',
                  'flex items-center justify-center border border-[#D5D5D5]'
                )}
              >
                <div className='flex items-center justify-center minlg:hidden'>
                  <FunnelSimple color='#1F2127' className='mr-2 h-5 w-4 minlg:mr-0 minlg:h-7 minlg:w-7' />
                  <p>Filter</p>
                </div>
                <div className='hidden minlg:block'>
                  {(!sideNavOpen || (sideNavOpen && tabs[selectedTab] !== 'NFTs')) && (
                    <FunnelSimple color='#1F2127' className='mr-2 h-5 w-4 minlg:mr-0 minlg:h-7 minlg:w-7' />
                  )}
                  {sideNavOpen && tabs[selectedTab] === 'NFTs' && <p className='px-[6.5rem]'>Close Filters</p>}
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedTab === 'NFTs' && <CollectionNfts />}
        {selectedTab === 'Activity' && <CollectionActivity contract={collectionContract} />}
      </div>
    </>
  );
};
