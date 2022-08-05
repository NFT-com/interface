import { AccentType, Button, ButtonType } from 'components/elements/Button';
import Copy from 'components/elements/Copy';
import { Footer } from 'components/elements/Footer';
import { NFTCard } from 'components/elements/NFTCard';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { BannerWrapper } from 'components/modules/Profile/BannerWrapper';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { NotFoundPage } from 'pages/404';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';
import { getTypesenseInstantsearchAdapterRaw } from 'utils/typeSenseAdapters';

import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import CopyIcon from 'public/arrow_square_out.svg';
import { useCallback, useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

export type CollectionPageRouteParams = {
  address: string;
}

interface InfoCardProps {
  title: string;
  value: string;
  unit?: string
}

export const InfoCard = ({ title, value, unit }: InfoCardProps) => {
  return (
    <div className="bg-white rounded-xl pl-5 pt-5 pb-5">
      <div className="text-base font-bold text-gray-500 tracking-normal">{title}</div>
      <div className="font-medium text-black text-3xl mt-1">
        <b>{value} </b>
        <span className="text-lg font-normal">{unit}</span>
      </div>
    </div>
  );
};

export const CardsView = () => {
  return (
    <div className={tw('grid gap-3 minlg:gap-4 minlg:grid-cols-4',
      'grid-cols-2 minlg:my-[11.2rem] my-[6.82rem]')}>
      <InfoCard title={'Total NFT Value'} value={'14.08'} unit={'ETH'} />
      <InfoCard title={'Number of Transactions'} value={'128'} />
      <InfoCard title={'Price Change'} value={'0.7'} unit={'%'} />
      <InfoCard title={'Volume'} value={'0.7'} unit={'ETH'} />
    </div>
  );
};

export default function CollectionPage() {
  const { chain } = useNetwork();
  const router = useRouter();
  const { contractAddr } = router.query;
  const client = getTypesenseInstantsearchAdapterRaw;
  const [collectionNfts, setCollectionNfts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [found, setFound] = useState(0);
<<<<<<< HEAD
  const { data: collectionData } = useCollectionQuery(String( chain?.id ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)), contractAddr?.toString(), true);
=======
  const { data: collectionData } = useCollectionQuery(String( chain ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)), contractAddr?.toString());
>>>>>>> main
  
  const loadNFTs = useCallback(() => {
    contractAddr && client.collections('nfts')
      .documents()
      .search({
        'q'       : contractAddr.toString(),
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
  }, [client, collectionNfts, contractAddr]);

  useEffect(() => {
    contractAddr && collectionNfts.length < 1 && loadNFTs();
  }, [collectionNfts.length, contractAddr, loadNFTs]);

  const caseInsensitiveAddr = contractAddr?.toString().toLowerCase();
  if (!ethers.utils.isAddress(caseInsensitiveAddr) || !getEnvBool(Doppler.NEXT_PUBLIC_COLLECTION_PAGE_ENABLED)) {
    return <NotFoundPage />;
  }

  return (
    <PageWrapper
      bgColorClasses={tw(
        'bg-always-white',
      )}
      headerOptions={{
        removeSummaryBanner: true,
      }}>
      <div className="mt-20">
        <BannerWrapper imageOverride={collectionData?.ubiquityResults?.collection?.banner + `?apiKey=${process.env.NEXT_PUBLIC_UBIQUITY_API_KEY}`}/>
      </div>
      <div className="mt-7 mx-8 minmd:mx-[5%] minxl:mx-auto max-w-nftcom ">
        {collectionNfts.length > 0 ?
          <>
            <div className="font-grotesk font-black text-4xl">{collectionNfts[0].document.contractName}</div>
            <div className="mb-7 text-4xl">
              <Copy lightModeForced toCopy={contractAddr?.toString()} after>
                {shortenAddress(contractAddr?.toString())}
                <CopyIcon />
              </Copy>
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
                  loadNFTs();
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
    </PageWrapper>
  );
}