import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { Footer } from 'components/elements/Footer';
import { NFTCard } from 'components/elements/NFTCard';
import { AnalyticsContainer } from 'components/modules/Analytics/AnalyticsContainer';
import { BannerWrapper } from 'components/modules/Profile/BannerWrapper';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { usePreviousValue } from 'graphql/hooks/usePreviousValue';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { isNullOrEmpty, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';
import { getTypesenseInstantsearchAdapterRaw } from 'utils/typeSenseAdapters';

import { Tab } from '@headlessui/react';
import router from 'next/router';
import CopyIcon from 'public/arrow_square_out.svg';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useNetwork } from 'wagmi';

export interface CollectionProps {
  contract: string;
}

export function Collection(props: CollectionProps) {
  const { chain } = useNetwork();
  const { usePrevious } = usePreviousValue();
  const client = getTypesenseInstantsearchAdapterRaw;
  const [collectionNfts, setCollectionNfts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [found, setFound] = useState(0);
  const prevVal = usePrevious(currentPage);
  const { data: collectionData } = useCollectionQuery(String( chain ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)), props.contract?.toString());
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
    1: 'Analytics'
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
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                {Object.keys(tabs).map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      tw(
                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                        selected
                          ? 'bg-white shadow'
                          : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
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
            {selectedTab === 'Analytics' &&
              <AnalyticsContainer data={collectionData} />
            }
          </>:
          <div className="font-grotesk font-black text-4xl text-[#7F7F7F]">No NFTs in the collection</div>}
      </div>
      <div className='w-full'>
        <Footer />
      </div>
    </>
  );
}