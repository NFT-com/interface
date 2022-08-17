import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { Footer } from 'components/elements/Footer';
import { NFTCard } from 'components/elements/NFTCard';
import { BannerWrapper } from 'components/modules/Profile/BannerWrapper';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { usePreviousValue } from 'graphql/hooks/usePreviousValue';
import { Doppler, getEnv } from 'utils/env';
import { shortenAddress } from 'utils/helpers';
import { getTypesenseInstantsearchAdapterRaw } from 'utils/typeSenseAdapters';

import router from 'next/router';
import CopyIcon from 'public/arrow_square_out.svg';
import { useEffect, useState } from 'react';
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
        console.log(currentPage, 'useEffect1 fdo');
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
          console.log(currentPage, 'useEffect2 fdo');
        });
    }
  }, [client, collectionNfts, currentPage, prevVal, props.contract]);

  return (
    <>
      <div className="mt-20">
        <BannerWrapper
          imageOverride={collectionData?.ubiquityResults?.collection?.banner ? `${collectionData?.ubiquityResults?.collection?.banner} + ?apiKey=${getEnv(Doppler.NEXT_PUBLIC_UBIQUITY_API_KEY)}` : null}/>
      </div>
      <div className="mt-7 mx-8 minmd:mx-[5%] minxl:mx-auto max-w-nftcom ">
        {collectionNfts.length > 0 ?
          <>
            <div className="font-grotesk font-black text-black text-4xl">{collectionNfts[0].document.contractName}</div>
            <div className="mb-7 text-4xl flex items-center font-medium text-copy-size text-[#6F6F6F]">
              <span>{shortenAddress(props.contract?.toString())}</span>
              <a
                target="_blank"
                rel="noreferrer" href={`https://etherscan.io/address/${props.contract?.toString()}`} className='font-bold underline tracking-wide'>
                <CopyIcon />
              </a>
            </div>
            <div className="grid grid-cols-2 minmd:grid-cols-3 minlg:grid-cols-4 gap-4">
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
                      customBackground={'#303030'}
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
          </>:
          <div className="font-grotesk font-black text-4xl text-[#7F7F7F]">No NFTs in the collection</div>}
      </div>
      <div className='w-full mt-16'>
        <Footer />
      </div>
    </>
  );
}