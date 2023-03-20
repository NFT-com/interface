import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import LikeCount from 'components/elements/LikeCount';
import { NFTCard } from 'components/elements/NFTCard';
import { CollectionActivity } from 'components/modules/Analytics/CollectionActivity';
import { NFTCard as NFTCardNew } from 'components/modules/NFTCard/NFTCard';
import { BannerWrapper } from 'components/modules/Profile/BannerWrapper';
import { SideNav } from 'components/modules/Search/SideNav';
import { LikeableType } from 'graphql/generated/types';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useGetContractSalesStatisticsQuery } from 'graphql/hooks/useGetContractSalesStatisticsQuery';
import { useGetNFTDetailsQuery } from 'graphql/hooks/useGetNFTDetailsQuery';
import { usePreviousValue } from 'graphql/hooks/usePreviousValue';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useSetLikeMutation } from 'graphql/hooks/useSetLikeMutation';
import { useUnsetLikeMutation } from 'graphql/hooks/useUnsetLikeMutation';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useNftProfileTokens } from 'hooks/useNftProfileTokens';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { getContractMetadata } from 'utils/alchemyNFT';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty, processIPFSURL, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { CollectionInfo } from './CollectionInfo';

import { Tab } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FunnelSimple } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { ExternalLink as LinkIcon } from 'react-feather';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import useSWR from 'swr';

export interface CollectionProps {
  contract: string;
}

export function Collection(props: CollectionProps) {
  const { usePrevious } = usePreviousValue();
  const router = useRouter();
  const { contractAddr } = router.query;
  const prevContractAddr = usePrevious(contractAddr);
  const { width: screenWidth } = useWindowDimensions();
  const { setSearchModalOpen, id_nftName, sideNavOpen, setSideNavOpen, setModalType, setCollectionPageAppliedFilters, setClearedFilters } = useSearchModal();
  const [collectionNfts, setCollectionNfts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [found, setFound] = useState(0);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const prevPage = usePrevious(currentPage);
  const prevId_nftName = usePrevious(id_nftName);
  const defaultChainId = useDefaultChainId();
  const { data: collectionData } = useCollectionQuery(defaultChainId, props.contract?.toString());
  const { data: collectionMetadata } = useSWR('ContractMetadata' + props.contract, async () => {
    return await getContractMetadata(props.contract, defaultChainId);
  });
  const { fetchTypesenseMultiSearch } = useFetchTypesenseSearch();
  const collectionName = collectionMetadata?.contractMetadata?.name;
  const collectionSalesHistory = useGetContractSalesStatisticsQuery(props?.contract?.toString());
  const collectionNFTInfo = useGetNFTDetailsQuery(props?.contract?.toString(), collectionNfts[0]?.document?.tokenId);
  const { profileTokens: creatorTokens } = useNftProfileTokens(collectionData?.collection?.deployer);
  const { profileData: collectionOwnerData } = useProfileQuery(
    creatorTokens?.at(0)?.tokenUri?.raw?.split('/').pop()
  );
  const { profileData: collectionPreferredOwnerData } = useProfileQuery(
    collectionOwnerData?.profile?.owner?.preferredProfile?.url
  );
  const { setLike } = useSetLikeMutation(
    collectionData?.collection?.id,
    LikeableType.Collection
  );

  const { unsetLike } = useUnsetLikeMutation(
    collectionData?.collection?.id
  );

  const tabs = {
    0: 'NFTs',
    1: 'Activity'
  };

  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  useEffect(() => {
    if (prevContractAddr !== contractAddr){
      setCollectionNfts([]);
      setCurrentPage(1);
      setFound(0);
      setCollectionPageAppliedFilters('','', true);
    }

    if (prevId_nftName !== id_nftName){
      setCollectionNfts([]);
      setCurrentPage(1);
      setFound(0);
    }
  },[contractAddr, id_nftName, prevContractAddr, prevId_nftName, setClearedFilters, setCollectionPageAppliedFilters]);

  useEffect(() => {
    currentPage === 1 && props.contract && fetchTypesenseMultiSearch({ searches: [{
      'collection': 'nfts',
      'q'       : id_nftName,
      'query_by': 'tokenId,nftName',
      'per_page': 8,
      'page'    : currentPage,
      'facet_by': 'contractAddr,traits.value,traits.type',
      'filter_by': 'contractAddr:='+(contractAddr?.toString() || props.contract),
      'exhaustive_search' : true
    }] })
      .then((resp) => {
        setCollectionNfts([...resp.results[0].hits]);
        setFound(resp.results[0].found);
      });
  }, [contractAddr, currentPage, fetchTypesenseMultiSearch, id_nftName, props.contract]);

  useEffect(() => {
    if (currentPage > 1 && (currentPage !== prevPage)) {
      props.contract && fetchTypesenseMultiSearch({ searches: [{
        'collection': 'nfts',
        'q'       : id_nftName,
        'query_by': 'tokenId,nftName',
        'per_page': 8,
        'page'    : currentPage,
        'facet_by': 'contractAddr,traits.value,traits.type',
        'filter_by': 'contractAddr:='+(contractAddr?.toString() || props.contract),
        'exhaustive_search' : true
      }] })
        .then((resp) => {
          setCollectionNfts([...collectionNfts, ...resp.results[0].hits]);
          setFound(resp.results[0].found);
        });
    }
  }, [collectionNfts, contractAddr, currentPage, fetchTypesenseMultiSearch, id_nftName, prevPage, props.contract]);

  const theme = {
    p: (props: any) => {
      const { children } = props;
      return (
        <p className="inline">
          {children}
        </p>
      );
    },
    a: (props: any) => {
      const { children } = props;
      return (
        
        <a
          className="underline inline"
          href={props.href}
          target="_blank"
          rel="noreferrer"
        >
          {children}
        </a>
      );
    }
  };

  return (
    <>
      <div className="mt-20">
        <BannerWrapper
          imageOverride={collectionNFTInfo?.data?.contract?.metadata?.banner_url?.replace('?w=500', '?w=3000') || collectionNFTInfo?.data?.contract?.metadata?.cached_banner_url}
          isCollection
        />
      </div>
      <div className='font-grotesk px-4 mt-9 max-w-nftcom mx-auto'>
        <div className='flex'>
          <h2 className="text-3xl font-bold">
            {isNullOrEmpty(collectionName) && isNullOrEmpty(collectionData?.collection?.name) ?
              (<div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center">
                <div className="w-full">
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-36 mb-4"></div>
                </div>
                <span className="sr-only">Loading...</span>
              </div>)
              : ( collectionData?.collection?.name || collectionName)}
          </h2>
          {getEnvBool(Doppler.NEXT_PUBLIC_SOCIAL_ENABLED) &&
          <div className='ml-3'>
            <LikeCount count={collectionData?.collection?.likeCount} isLiked={false} onClick={setLike} />
          </div>
          }
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6 minlg:w-1/2">
          <div className='flex'>
            {collectionPreferredOwnerData &&
              <div className='relative h-10 w-10'>
                <Image src={processIPFSURL(collectionPreferredOwnerData?.profile?.photoURL) || 'https://cdn.nft.com/profile-image-default.svg'} alt='test' className='rounded-[10px] mr-2' layout='fill' objectFit='cover' />
              </div>
            }
            <div className={tw(
              'flex flex-col justify-between',
              collectionPreferredOwnerData?.profile && 'ml-2'
            )}>
              <p className='text-[10px] uppercase text-[#6F6F6F] font-bold'>Creator</p>
              {collectionPreferredOwnerData?.profile ?
                <Link href={`/${collectionPreferredOwnerData?.profile?.url}`}>
                  <p className='font-bold underline decoration-[#F9D963] underline-offset-4 cursor-pointer'>{collectionPreferredOwnerData?.profile?.url}</p>
                </Link>
                :
                <div className='mt-1 text-[#B59007] font-medium font-mono'>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://etherscan.io/address/${props.contract?.toString()}`}
                    className=' tracking-wide flex'
                  >
                    <span>{shortenAddress(collectionData?.collection?.deployer, 4)}</span>
                    <LinkIcon size={20} className='ml-1' />
                  </a>
                </div>
              }
            </div>
          </div>

          <div className='flex flex-col'>
            <p className='text-[10px] uppercase text-[#6F6F6F] font-bold'>Contract Address</p>
            <div className='mt-1 text-[#B59007] font-medium font-mono'>
              
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://etherscan.io/address/${props.contract?.toString()}`}
                className='tracking-wide flex'
              >
                <span className='contractAddress'>{shortenAddress(props.contract?.toString(), 4)}</span>
                <LinkIcon size={20} className='ml-1' />
              </a>
            </div>
          </div>
        </div>
        <div className='font-grotesk mt-6 text-black flex flex-col minlg:flex-row mb-10'>
          {collectionData?.collection?.description && collectionData?.collection?.description !== 'placeholder collection description text' &&
          <div className='minlg:w-1/2'>
            <h3 className='text-[#6F6F6F] font-semibold'>
              Description
            </h3>
            <div className='mt-1 mb-10 minlg:mb-0 minlg:pr-4'>
              {descriptionExpanded ?
                <>
                  <ReactMarkdown components={theme} skipHtml linkTarget="_blank">
                    {collectionData?.collection?.description}
                  </ReactMarkdown>
                  <p className='text-[#B59007] font-bold inline ml-1 hover:cursor-pointer' onClick={() => setDescriptionExpanded(false)}>Show less</p>
                </>
                :
                <>
                  {collectionData?.collection?.description.length > 87
                    ?
                    <div className='inline minlg:hidden'>
                      <ReactMarkdown components={theme} skipHtml linkTarget="_blank">
                        {collectionData?.collection?.description.substring(0, 87) + '...'}
                      </ReactMarkdown>
                    </div>
                    :
                    <div className='inline minlg:hidden'>
                      <ReactMarkdown components={theme} skipHtml linkTarget="_blank">
                        {collectionData?.collection?.description}
                      </ReactMarkdown>
                    </div>
                  }
                  {collectionData?.collection?.description.length > 200
                    ?
                    <div className='hidden minlg:inline'>
                      <ReactMarkdown components={theme} skipHtml linkTarget="_blank">
                        {collectionData?.collection?.description.substring(0, 200) + '...'}
                      </ReactMarkdown>
                    </div>
                    :
                    <div className='hidden minlg:inline'>
                      <ReactMarkdown components={theme} skipHtml linkTarget="_blank">
                        {collectionData?.collection?.description}
                      </ReactMarkdown>
                    </div>
                  }
                  {
                    collectionData?.collection?.description.length > 87 &&
                    <>
                      <p className='text-[#B59007] font-bold ml-1 hover:cursor-pointer inline minlg:hidden' onClick={() => setDescriptionExpanded(true)}>
                        Show more
                      </p>
                    </>
                  }
                  {
                    collectionData?.collection?.description.length > 200 &&
                    <>
                      <p className='text-[#B59007] font-bold ml-1 hover:cursor-pointer hidden minlg:inline' onClick={() => setDescriptionExpanded(true)}>
                        Show more
                      </p>
                    </>
                  }
                </>
              }
            </div>
          </div>
          }
          <div className='w-full minlg:w-1/2'>
            <CollectionInfo data={collectionSalesHistory?.data?.statistics} type={collectionNfts[0]?.document?.nftType} hasDescription={true} />
          </div>
        </div>
      </div>
      <div className={tw(
        'px-4 pb-16 w-full',
        'max-w-nftcom mx-auto'
      )}
      >
        {
          <>
            {getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED) &&
            <div className='block minlg:flex minlg:flex-row-reverse w-full minlg:w-max mb-6 justify-between items-center'>
              <div className='block minlg:flex items-center mb-6 minlg:mb-0'>
                <Tab.Group onChange={(index) => {setSelectedTab(tabs[index]);}}>
                  <Tab.List className="flex space-x-1 rounded-3xl bg-[#F6F6F6] font-grotesk minlg:max-w-md minlg:w-[448px]">
                    {Object.keys(tabs).map((tab) => (
                      <Tab
                        key={tab}
                        className={({ selected }) =>
                          tw(
                            'w-full rounded-3xl py-2.5 text-sm font-medium leading-5 text-[#6F6F6F]',
                            selected
                        && 'bg-black text-[#F8F8F8]'
                          )
                        }
                      >
                        {tabs[tab]}
                      </Tab>
                    ))}
                  </Tab.List>
                </Tab.Group>
              </div>
              <div
                className={tw(
                  sideNavOpen ? 'mr-5' : '',
                  'w-full mb-6 minlg:mb-0 minlg:mr-3 items-center flex minlg:flex-auto')}
                onClick={() => {
                  if (screenWidth < 900) {
                    setModalType('collectionFilters');
                    setSearchModalOpen(true, 'collectionFilters' );
                  } else {
                    setSideNavOpen(!sideNavOpen);
                  }
                }}>
                <div
                  className={tw(
                    'cursor-pointer w-full minlg:h-10',
                    'bg-white text-[#1F2127] font-grotesk font-bold p-1 rounded-[20px]',
                    'flex items-center justify-center border border-[#D5D5D5]')}
                >
                  <div className='minlg:hidden flex items-center justify-center'>
                    <FunnelSimple color='#1F2127' className='h-5 w-4 mr-2 minlg:mr-0 minlg:h-7 minlg:w-7'/>
                    <p>Filter</p>
                  </div>
                  <div className='hidden minlg:block'>
                    {(!sideNavOpen || (sideNavOpen && selectedTab !== 'NFTs')) && <FunnelSimple color='#1F2127' className='h-5 w-4 mr-2 minlg:mr-0 minlg:h-7 minlg:w-7'/>}
                    {sideNavOpen && selectedTab === 'NFTs' && <p className="px-[6.5rem]">Close Filters</p>}
                  </div>
                </div>
              </div>
            </div>
            }
            {selectedTab === 'NFTs' &&
            <div className="flex overflow-hidden pb-3.5">
              <div className="hidden minlg:block">
                <SideNav onSideNav={() => null} isCollectionView/>
              </div>
              {collectionNfts.length > 0
                ? <div className="flex-auto">
                  {found &&
                <p className='font-medium uppercase mb-4 text-[#6F6F6F] text-[10px] '>{found > 1 ? `${found} NFTS` : `${found} NFT`}</p>
                  }
                  <div className="grid grid-cols-2 minmd:grid-cols-3 minlg:grid-cols-4 gap-5 max-w-nftcom minxl:mx-auto ">
                    {collectionNfts.map((nft, index) => {
                      return !getEnvBool(Doppler.NEXT_PUBLIC_SOCIAL_ENABLED)
                        ? (
                          <div className="NftCollectionItem" key={index}>
                            <NFTCard
                              contractAddress={nft.document.contractAddr}
                              tokenId={nft.document.tokenId}
                              title={nft.document.nftName}
                              collectionName={nft.document.contractName}
                              images={[]}
                              redirectTo={nft.document.nftName && `/app/nft/${nft.document.contractAddr}/${nft.document.tokenId}`}
                              description={nft.document.nftDescription ? nft.document.nftDescription.slice(0,50) + '...': '' }
                            />
                          </div>) :
                        (
                          <div className="NftCollectionItem" key={index}>
                            <NFTCardNew
                              contractAddr={nft.document.contractAddr}
                              tokenId={nft.document.tokenId}
                              name={nft.document.nftName}
                              collectionName={nft.document.contractName}
                              images={[]}
                              redirectTo={nft.document.nftName && `/app/nft/${nft.document.contractAddr}/${nft.document.tokenId}`}
                            />
                          </div>
                        );
                    }
                    )}
                  </div>
                  {found > collectionNfts.length && <div className="mx-auto w-full minxl:w-3/5 flex justify-center mt-7 font-medium">
                    <Button
                      size={ButtonSize.LARGE}
                      scaleOnHover
                      stretch
                      label={'Load More'}
                      onClick={ () => {
                        setCurrentPage(currentPage + 1);
                      }}
                      type={ButtonType.PRIMARY}
                    />
                  </div>}
                </div>
                : <div className="font-grotesk font-black text-xl text-[#7F7F7F]">No results found</div>}
            </div>
            }
            {selectedTab === 'Activity' &&
              <CollectionActivity contract={props?.contract} />
            }
          </>
        }
      </div>
    </>
  );
}