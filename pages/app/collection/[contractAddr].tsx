import { PageWrapper } from 'components/layouts/PageWrapper';
import { Collection } from 'components/modules/Collection/Collection';
import { NotFoundPage } from 'pages/404';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { ethers } from 'ethers';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const { contractAddr } = router.query;

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
      <Collection contract={contractAddr as string} />
    </PageWrapper>
  );
}