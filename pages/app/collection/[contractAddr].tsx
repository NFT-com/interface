import CollectionDetails from 'components/elements/CollectionDetails';
import Copy from 'components/elements/Copy';
import { GraphView } from 'components/elements/GraphView';
import { Switch } from 'components/elements/Switch';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { NotFoundPage } from 'pages/404';
import { Doppler, getEnv } from 'utils/env';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useState } from 'react';
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
  const { activeChain } = useNetwork();
  const router = useRouter();
  const { contractAddr } = router.query;
  const [enabled, setEnabled] = useState(false);
  const { data: collectionData } = useCollectionQuery(String(activeChain?.id | getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)),contractAddr?.toString(), false);

  if (!ethers.utils.isAddress(contractAddr?.toString())) {
    return <NotFoundPage />;
  }

  return (
    <PageWrapper
      bgColorClasses={tw(
        'bg-always-white',
        //'dark:bg-pagebg-dk'
      )}
      headerOptions={{
        removeSummaryBanner: true,
      }}>
      {collectionData && collectionData.collection && <div className="md:mx-10 lg:mx-20 mx-72 mt-36">
        <div className="font-medium text-3xl tracking-normal mt-6 text-gray-500 text-always-black">
          <b>NFT Collection - {collectionData?.collection?.name}</b>
        </div>
        <div className="text-gray-500 dark:text-black">
          <Copy toCopy={contractAddr?.toString()} after>
            {shortenAddress(contractAddr?.toString())}
          </Copy>
        </div>
        <div className="flex justify-end items-center mb-2 text-always-black">
          <Switch
            left="Card View"
            right="Graph View"
            enabled={enabled}
            setEnabled={setEnabled}
          />
        </div>
        {enabled ? <GraphView /> : <CardsView />}
        <div className="font-bold text-3xl tracking-normal mt-6 text-always-black">NFT</div>
        <div className="text-gray-500 mt-4 mb-1 text-sm tracking-wider">
          NOTE: The estimated values are not financial advice, and should only be used as
          a general guide of relative rarity. Please do your own research before making
          financial decisions. <b>Only ERC721 supported, more soon.</b>
        </div>
        <CollectionDetails address={contractAddr?.toString()} collectionName={collectionData?.collection?.name}/>
      </div>}
    </PageWrapper>
  );
}