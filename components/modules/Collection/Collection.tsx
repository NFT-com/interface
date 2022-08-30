import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { NFTCard } from 'components/elements/NFTCard';
import { TxHistory } from 'components/modules/Analytics/TxHistory';
import { CollectionAnalyticsContainer } from 'components/modules/Collection/CollectionAnalyticsContainer';
import { BannerWrapper } from 'components/modules/Profile/BannerWrapper';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { usePreviousValue } from 'graphql/hooks/usePreviousValue';
import { useGetCollectionByAddress } from 'hooks/analytics/graph/useGetCollectionByAddress';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { isNullOrEmpty, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';
import { getTypesenseInstantsearchAdapterRaw } from 'utils/typeSenseAdapters';

import { CollectionInfo } from './CollectionInfo';

import { Tab } from '@headlessui/react';
import Image from 'next/image';
import router from 'next/router';
import { ArrowClockwise, FunnelSimple } from 'phosphor-react';
import CopyIcon from 'public/arrow_square_out.svg';
import { useEffect, useState } from 'react';
import { ExternalLink as LinkIcon } from 'react-feather';
import useSWR from 'swr';
import { useNetwork } from 'wagmi';

export interface CollectionProps {
  contract: string;
  profile?: any
}

export function Collection(props: CollectionProps) {
  const { chain } = useNetwork();
  const { usePrevious } = usePreviousValue();
  const client = getTypesenseInstantsearchAdapterRaw;
  const [collectionNfts, setCollectionNfts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [found, setFound] = useState(0);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const prevVal = usePrevious(currentPage);
  const { data: collectionData } = useCollectionQuery(String( chain ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)), props.contract?.toString());
  const collectionInfo = useGetCollectionByAddress(props.contract?.toString());
  const { data: imgUrl } = useSWR('imageurl', async() => {
    let imgUrl;
    if (isNullOrEmpty(collectionData?.ubiquityResults?.collection?.banner)) {
      imgUrl = null;
    } else {
      imgUrl = await fetch(`${collectionData?.ubiquityResults?.collection?.banner}?apiKey=${getEnv(Doppler.NEXT_PUBLIC_UBIQUITY_API_KEY)}`)
        .then(
          (data) => data.status === 200 ? `${collectionData?.ubiquityResults?.collection?.banner}?apiKey=${getEnv(Doppler.NEXT_PUBLIC_UBIQUITY_API_KEY)}` : null
        );
    }
    return imgUrl;
  } );

  const tabs = {
    0: 'NFTs',
    1: 'Activity',
    2: 'Analytics'
  };

  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  useEffect(() => {
    currentPage === 1 && props.contract && client.collections('nfts')
      .documents()
      .search({
        'q'       : props.contract.toString(),
        'query_by': 'contractAddr',
        'per_page': 8,
        'page'    : currentPage
      })
      .then(function (nftsResults) {
        setCollectionNfts([...nftsResults.hits]);
        setFound(nftsResults.found);
      });
  }, [client, currentPage, props.contract]);

  useEffect(() => {
    if (currentPage > 1 && currentPage !== prevVal) {
      props.contract && client.collections('nfts')
        .documents()
        .search({
          'q'       : props.contract.toString(),
          'query_by': 'contractAddr',
          'per_page': 8,
          'page'    : currentPage
        })
        .then(function (nftsResults) {
          setCollectionNfts([...collectionNfts, ...nftsResults.hits]);
          setFound(nftsResults.found);
        });
    }
  }, [client, collectionNfts, currentPage, prevVal, props.contract]);

  return (
    !getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED)
      ? (
        <>
          <div className="mt-20">
            <BannerWrapper
              imageOverride={imgUrl}/>
          </div>
          <div className={tw(
            'pt-7 px-8 minmd:px-[5%] minxl:mx-auto pb-16 w-full',
          )}
          >
            {collectionNfts.length > 0 ?
              <>
                {getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED) &&
            <Tab.Group onChange={(index) => {setSelectedTab(tabs[index]);}}>
              <Tab.List className="flex space-x-1 rounded-3xl bg-[#F6F6F6] font-grotesk">
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
                }
                {selectedTab === 'NFTs' &&
            <>
              <div className="font-grotesk font-black text-black text-4xl max-w-nftcom minxl:mx-auto">{collectionNfts[0].document.contractName}</div>
              <div className="mb-7 text-4xl flex items-center font-medium text-copy-size text-[#6F6F6F] max-w-nftcom minxl:mx-auto">
                <span>{shortenAddress(props.contract?.toString())}</span>
                <a
                  target="_blank"
                  rel="noreferrer" href={`https://etherscan.io/address/${props.contract?.toString()}`} className='font-bold underline tracking-wide'>
                  <CopyIcon />
                </a>
              </div>
              <div className="grid grid-cols-2 minmd:grid-cols-3 minlg:grid-cols-4 gap-4 max-w-nftcom minxl:mx-auto ">
                {collectionNfts.map((nft, index) => {
                  return (
                    <div className="NftCollectionItem" key={index}>
                      <NFTCard
                        title={nft.document.nftName}
                        subtitle={'#'+ nft.document.tokenId}
                        images={[nft.document.imageURL]}
                        onClick={() => {
                          if (nft.document.nftName) {
                            router.push(`/app/nft/${nft.document.contractAddr}/${nft.document.tokenId}`);
                          }
                        }}
                        description={nft.document.nftDescription ? nft.document.nftDescription.slice(0,50) + '...': '' }
                        customBorderRadius={'rounded-tl-2xl rounded-tr-2xl'}
                      />
                    </div>);}
                )}
              </div>
              {found > collectionNfts.length && <div className="mx-auto w-full minxl:w-3/5 flex justify-center mt-7 font-medium">
                <Button
                  color={'black'}
                  accent={AccentType.SCALE}
                  stretch={true}
                  label={'Load More'}
                  onClick={ () => {
                    setCurrentPage(currentPage + 1);
                  }}
                  type={ButtonType.PRIMARY}
                />
              </div>}
            </>
                }
                {selectedTab === 'Activity' &&
              <TxHistory />
                }
                {selectedTab === 'Analytics' &&
              <CollectionAnalyticsContainer data={collectionData} />
                }
              </>:
              <div className="font-grotesk font-black text-4xl text-[#7F7F7F]">No NFTs in the collection</div>}
          </div>
        </>) :
      <>
        <div className="mt-20">
          <BannerWrapper
            imageOverride={imgUrl}
            isCollection
          />
        </div>
        <div className='font-grotesk px-4 mt-9 max-w-nftcom mx-auto'>
          <h2 className="text-3xl font-bold">
            {collectionData?.collection?.name}
          </h2>
          <div className="grid grid-cols-2 gap-4 mt-6 minlg:w-1/2">
            <div className='flex'>
              {props.profile &&
              <div className='relative h-10 w-10'>
                <Image src={props.profile?.photoURL || 'https://cdn.nft.com/profile-image-default.svg'} alt='test' className='rounded-[10px] mr-2' layout='fill' objectFit='cover' />
              </div>
              }
              <div className={tw(
                'flex flex-col justify-between',
                props.profile && 'ml-2'
              )}>
                <p className='text-[10px] uppercase text-[#6F6F6F] font-bold'>Creator</p>
                {props.profile
                  ? (
                    <p className='font-bold underline decoration-[#F9D963] underline-offset-4'>{props.profile.url}</p>
                  )
                  : (
                    <div className='flex mt-1 text-[#B59007] font-medium font-mono'>
                      <span>{shortenAddress(props.contract?.toString(), 4)}</span>
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`https://etherscan.io/address/${props.contract?.toString()}`}
                        className='font-bold underline tracking-wide'
                      >
                        <LinkIcon size={20} className='ml-1' />
                      </a>
                    </div>
                  )
                }
            
              </div>
            </div>

            <div className='flex flex-col'>
              <p className='text-[10px] uppercase text-[#6F6F6F] font-bold'>Contract Address</p>
              <div className='flex mt-1 text-[#B59007] font-medium font-mono'>
                <span>{shortenAddress(props.contract?.toString(), 4)}</span>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://etherscan.io/address/${props.contract?.toString()}`}
                  className='font-bold underline tracking-wide'
                >
                  <LinkIcon size={20} className='ml-1' />
                </a>
              </div>
            </div>
          </div>
          <div className='font-grotesk mt-6 text-black flex flex-col minlg:flex-row mb-10'>
            {collectionInfo?.collection_by_address?.description &&
          <div className='minlg:w-1/2'>
            <h3 className='text-[#6F6F6F] font-semibold'>
            Description
            </h3>
            <div className='mt-1 mb-10 minlg:mb-0 minlg:pr-4'>
              {descriptionExpanded ?
                <>
                  <p className='inline'>
                    {collectionInfo?.collection_by_address?.description}
                  </p>
                  <p className='text-[#B59007] font-bold inline ml-1 hover:cursor-pointer' onClick={() => setDescriptionExpanded(false)}>Show less</p>
                </>
                :
                <>
                  <p className='inline minlg:hidden'>
                    {collectionInfo?.collection_by_address?.description.length > 87 ? collectionInfo?.collection_by_address?.description.substring(0, 87) + '...' : collectionInfo?.collection_by_address?.description}
                  </p>
                  <p className='hidden minlg:inline'>
                    {collectionInfo?.collection_by_address?.description.length > 200 ? collectionInfo?.collection_by_address?.description.substring(0, 200) + '...' : collectionInfo?.collection_by_address?.description}
                  </p>
                  {
                    collectionInfo?.collection_by_address?.description.length > 87 &&
                    <>
                      <p className='text-[#B59007] font-bold ml-1 hover:cursor-pointer inline minlg:hidden' onClick={() => setDescriptionExpanded(true)}>
                        Show more
                      </p>
                    </>
                  }
                  {
                    collectionInfo?.collection_by_address?.description.length > 200 &&
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
              <CollectionInfo />
            </div>
          </div>
        </div>
        <div className={tw(
          'px-4 pb-16 w-full',
          'max-w-nftcom mx-auto'
        )}
        >
          {collectionNfts.length > 0 ?
            <>
              {getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED) &&
            <div className='block minlg:flex w-full mb-6 justify-between items-center'>
              <div className='block minlg:flex items-center mb-6 minlg:mb-0'>
                <div className='bg-[#F8F8F8] text-[#6F6F6F] w-10 h-10 font-grotesk font-bold p-1 rounded-[20px]  items-center justify-center mr-4 hidden minlg:flex'>
                  <FunnelSimple color='#6F6F6F' className='h-7 w-7'/>
                </div>
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
                id="refreshNftButton"
                className={tw(
                  'rounded-full bg-[#F8F8F8] h-10 w-10 justify-center items-center mr-6 hidden minlg:flex'
                )}
              >
                <ArrowClockwise color='#6F6F6F' className='h-7 w-7'/>
              </div>
              <div className='mb-6 items-center w-full flex minlg:hidden'>
                <div
                  id="refreshNftButton"
                  className={tw(
                    'rounded-full bg-[#F8F8F8] h-6 w-7 flex justify-center items-center mr-6'
                  )}
                >
                  <ArrowClockwise color='#6F6F6F' className='h-4 w-4'/>
                </div>
                <div className='w-full bg-[#F8F8F8] text-[#6F6F6F] font-grotesk font-bold p-1 rounded-[20px] flex items-center justify-center'>
                  <FunnelSimple color='#6F6F6F' className='h-5 w-4 mr-2'/>
                  <p>Filter</p>
                </div>
              </div>
            </div>
              }
              {selectedTab === 'NFTs' &&
            <>
              <p className='font-medium uppercase mb-4 text-[#6F6F6F] text-[10px] '>{collectionNfts.length} {collectionNfts.length > 1 ? 'NFTS' : 'NFT'}</p>
              <div className="grid grid-cols-2 minmd:grid-cols-3 minlg:grid-cols-4 gap-4 max-w-nftcom minxl:mx-auto ">
                {collectionNfts.map((nft, index) => {
                  return (
                    <div className="NftCollectionItem" key={index}>
                      <NFTCard
                        title={nft.document.nftName}
                        subtitle={'#'+ nft.document.tokenId}
                        images={[nft.document.imageURL]}
                        onClick={() => {
                          if (nft.document.nftName) {
                            router.push(`/app/nft/${nft.document.contractAddr}/${nft.document.tokenId}`);
                          }
                        }}
                        description={nft.document.nftDescription ? nft.document.nftDescription.slice(0,50) + '...': '' }
                        customBorderRadius={'rounded-tl-2xl rounded-tr-2xl'}
                      />
                    </div>);}
                )}
              </div>
              {found > collectionNfts.length && <div className="mx-auto w-full minxl:w-3/5 flex justify-center mt-7 font-medium">
                <Button
                  color={'black'}
                  accent={AccentType.SCALE}
                  stretch={true}
                  label={'Load More'}
                  onClick={ () => {
                    setCurrentPage(currentPage + 1);
                  }}
                  type={ButtonType.PRIMARY}
                />
              </div>}
            </>
              }
              {selectedTab === 'Activity' &&
              <TxHistory />
              }
              {selectedTab === 'Analytics' &&
              <CollectionAnalyticsContainer data={collectionData} />
              }
            </>
            :
            <div className="font-grotesk font-black text-4xl text-[#7F7F7F]">No NFTs in the collection</div>
          }
        </div>
      </>
  );
}