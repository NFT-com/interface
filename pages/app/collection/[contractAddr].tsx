import { AccentType, Button, ButtonType } from 'components/elements/Button';
import Copy from 'components/elements/Copy';
import { NFTCard } from 'components/elements/NFTCard';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { BannerWrapper } from 'components/modules/Profile/BannerWrapper';
import { NotFoundPage } from 'pages/404';
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
    <div className={tw('grid gap-3 deprecated_minmd:gap-4 deprecated_minmd:grid-cols-4',
      'grid-cols-2 deprecated_minmd:my-[11.2rem] my-[6.82rem]')}>
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
  
  const displayZeros = (quantity: number) => {
    if (quantity < 10) {
      return '0000';
    } else if (quantity < 100){
      return '000';
    } else if (quantity < 1000){
      return '00';
    } else if (quantity < 10000){
      return '0';
    }
  };

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
    collectionNfts.length < 1 && loadNFTs();
  }, [collectionNfts.length, loadNFTs]);

  if (!ethers.utils.isAddress(contractAddr?.toString())) {
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
      <BannerWrapper />
      {collectionNfts.length > 0 &&
      <div className="mt-10 mx-8 max-w-nftcom minlg:mx-auto">
        <div className="font-grotesk font-black text-4xl">{collectionNfts[0].document.contractName}</div>
        <div className="mb-5 text-4xl">
          <Copy lightModeForced toCopy={contractAddr?.toString()} after>
            {shortenAddress(contractAddr?.toString())}
            <CopyIcon />
          </Copy>
        </div>
        <div className="grid grid-cols-2 minmd:grid-cols-3 minlg:grid-cols-4 gap-4">
          {collectionNfts.map((nft, index) => {
            return (
              <div key={index}>
                <NFTCard
                  traits={[{ value: 'Price: ' + (nft.document.listedPx ? (nft.document.listedPx + 'ETH') : 'Not estimated'), key: '' }]}
                  title={nft.document.nftName}
                  subtitle={'GK'+displayZeros(Number(nft.document.tokenId))+nft.document.tokenId}
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
      </div>}
    </PageWrapper>
  );
}