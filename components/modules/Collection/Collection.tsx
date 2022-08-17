import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { Footer } from 'components/elements/Footer';
import { NFTCard } from 'components/elements/NFTCard';
import { BannerWrapper } from 'components/modules/Profile/BannerWrapper';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { Doppler,getEnv } from 'utils/env';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';
import { getTypesenseInstantsearchAdapterRaw } from 'utils/typeSenseAdapters';

import router from 'next/router';
import CopyIcon from 'public/arrow_square_out.svg';
import { useCallback, useEffect,useState } from 'react';
import { useNetwork } from 'wagmi';

export interface CollectionProps {
  contract: string;
  forceLightMode?: boolean
}

export function Collection(props: CollectionProps) {
  const { chain } = useNetwork();
  const client = getTypesenseInstantsearchAdapterRaw;
  const [collectionNfts, setCollectionNfts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [found, setFound] = useState(0);
  const { data: collectionData } = useCollectionQuery(String( chain ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)), props.contract?.toString());
  
  const loadNFTs = useCallback(() => {
    props.contract && client.collections('nfts')
      .documents()
      .search({
        'q'       : props.contract.toString(),
        'query_by': 'contractAddr',
        'per_page': 8,
        'page'    : currentPage < 1 ? 1 : currentPage
      })
      .then(function (nftsResults) {
        setCollectionNfts([...collectionNfts, ...nftsResults.hits]);
        setFound(nftsResults.found);
      });
    setCurrentPage(currentPage + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, collectionNfts, props.contract]);

  useEffect(() => {
    props.contract && collectionNfts.length < 1 && loadNFTs();
  }, [collectionNfts.length, props.contract, loadNFTs]);

  return (
    <>
      <div className="mt-20">
        <BannerWrapper
          imageOverride={collectionData?.ubiquityResults?.collection?.banner ? `${collectionData?.ubiquityResults?.collection?.banner} + ?apiKey=${getEnv(Doppler.NEXT_PUBLIC_UBIQUITY_API_KEY)}` : null}/>
      </div>
      <div className={tw(
        'pt-7 px-8 minmd:px-[5%] minxl:mx-auto pb-16 w-full',
        props.forceLightMode && 'bg-white'
      )}
      >
        {collectionNfts.length > 0 ?
          <>
            <div className="font-grotesk font-black text-black text-4xl">{collectionNfts[0].document.contractName}</div>
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
                  loadNFTs();
                }}
                type={ButtonType.PRIMARY}
              />
            </div>}
          </>:
          <div className="font-grotesk font-black text-4xl text-[#7F7F7F]">No NFTs in the collection</div>}
      </div>
      <div className='w-full'>
        <Footer />
      </div>
    </>
  );
}