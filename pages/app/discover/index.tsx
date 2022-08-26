import { AccentType, Button, ButtonType } from 'components/elements/Button';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CollectionItem } from 'components/modules/Search/CollectionItem';
import { CuratedCollectionsFilter } from 'components/modules/Search/CuratedCollectionsFilter';
import { SideNav } from 'components/modules/Search/SideNav';
import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';
import NotFoundPage from 'pages/404';
import { DiscoverPageProps } from 'types';
import { Doppler, getEnvBool } from 'utils/env';
import { getPerPage, isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { getCollection } from 'lib/contentful/api';
import Link from 'next/link';
import Vector from 'public/Vector.svg';
import { useEffect, useMemo, useState } from 'react';

export default function DiscoverPage({ data }: DiscoverPageProps) {
  const { width: screenWidth } = useWindowDimensions();
  const [page, setPage] = useState(1);
  const { sideNavOpen, setCuratedCollections, selectedCuratedCollection, curatedCollections, setSelectedCuratedCollection } = useSearchModal();
  const [paginatedAddresses, setPaginatedAddresses] = useState([]);

  const contractAddresses = useMemo(() => {
    return selectedCuratedCollection?.contractAddresses.addresses ?? [];
  }, [selectedCuratedCollection?.contractAddresses.addresses]);

  setCuratedCollections(data);

  useEffect(() => {
    if(isNullOrEmpty(selectedCuratedCollection)) {
      setSelectedCuratedCollection(curatedCollections[0]);
    }
  },[curatedCollections, selectedCuratedCollection, setSelectedCuratedCollection]);

  useEffect(() => {
    setPaginatedAddresses([...contractAddresses.slice(0, getPerPage('discover', screenWidth, sideNavOpen)*page)]);
  },[contractAddresses, page, screenWidth, sideNavOpen]);

  if (!getEnvBool(Doppler.NEXT_PUBLIC_SEARCH_ENABLED)) {
    return <NotFoundPage />;
  }

  const changeCurated = () => {
    setPage(1);
  };

  return(
    <>
      <div className="my-10 minlg:mb-10 minlg:mt-20 max-w-lg minmd:max-w-full mx-[4%] minmd:mx-[2%] minlg:mr-[2%] minlg:ml-0 self-center minmd:self-stretch">
        <Link href='/app/auctions' passHref>
          <a>
            <div className='mx-auto flex flex-row items-center justify-center w-full h-[55px] font-grotesk minmd:text-lg text-base leading-6 text-white font-[500] bg-[#111111] whitespace-pre-wrap'>
              <span>Mint yourself! Get a free profile</span>
              <div className='flex flex-col rounded items-center p-[1px] ml-2'>
                <Vector />
              </div>
            </div>
          </a>
        </Link>
        <div className="flex">
          <div className="hidden minlg:block">
            <SideNav onSideNav={changeCurated}/>
          </div>
          <div className="minlg:mt-8 minlg:ml-6">
            <span className="font-grotesk text-black font-black text-4xl minmd:text-5xl">Discover</span>
            <p className="text-blog-text-reskin mt-4 text-base minmd:text-lg">
            Find your next PFP, one-of-kind collectable, or membership pass to the next big thing!
            </p>
            <div className="block minlg:hidden">
              <CuratedCollectionsFilter onClick={changeCurated}/>
            </div>
            <div className="mt-10">
              <div className="font-grotesk text-blog-text-reskin text-xs minmd:text-sm font-black">
                {`${contractAddresses.length} ${selectedCuratedCollection?.tabTitle.toUpperCase() ?? 'CURATED'} COLLECTIONS`}
              </div>
              <div className={tw(
                'mt-6 gap-2 minmd:grid minmd:grid-cols-2 minmd:space-x-2 minlg:space-x-0 minlg:gap-4',
                sideNavOpen ? 'minxl:grid-cols-3': 'minlg:grid-cols-3 minxl:grid-cols-4')}>
                {paginatedAddresses.map((collection, index) => {
                  return (
                    <div key={index} className="DiscoverCollectionItem mb-2 min-h-[10.5rem] minmd:min-h-[13rem] minxl:min-h-[13.5rem]">
                      <CollectionItem
                        contractAddr={collection}
                      />
                    </div>);
                })}
              </div>
            </div>
            { paginatedAddresses.length < contractAddresses.length &&
            <div className="mx-auto w-full minxl:w-3/5 flex justify-center mt-7 font-medium">
              <Button
                color={'black'}
                accent={AccentType.SCALE}
                stretch={true}
                label={'Load More'}
                onClick={() => setPage(page + 1)}
                type={ButtonType.PRIMARY}
              />
            </div>}
          </div>
        </div>
      </div>
    </>
  );
}

DiscoverPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      { page }
    </DefaultLayout>
  );
};

export async function getServerSideProps({ preview = false }) {
  const curData = await getCollection(false, 10, 'curatedCollectionsCollection', 'tabTitle contractAddresses');
  return {
    props: {
      preview,
      data: curData ?? null,
    }
  };
}