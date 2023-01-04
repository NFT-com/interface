import { AccentType, Button, ButtonType } from 'components/elements/Button';
import Loader from 'components/elements/Loader';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { NftCard } from 'components/modules/DiscoveryCards/NftCard';
import { SideNav } from 'components/modules/Search/SideNav';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useSearchModal } from 'hooks/state/useSearchModal';
import NotFoundPage from 'pages/404';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { SlidersHorizontal, X } from 'phosphor-react';
import React, { useEffect, useState } from 'react';

export default function CollectionsPage() {
  const newFiltersEnabled = getEnvBool(Doppler.NEXT_PUBLIC_DISCOVER2_PHASE3_ENABLED);
  const [page, setPage] = useState(1);
  const { sideNavOpen, setSideNavOpen, setSearchModalOpen, nftsResultsFilterBy } = useSearchModal();
  const { fetchTypesenseSearch } = useFetchTypesenseSearch();
  const [filters, setFilters] = useState([]);
  const [nftSData, setNftsData] = useState([]);
  const [found, setTotalFound] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchTypesenseSearch({
      facet_by: ',listings.marketplace,status,listings.price,nftType',
      index: 'nfts',
      q: '*',
      sort_by: 'listedFloor:desc',
      query_by: '',
      filter_by: nftsResultsFilterBy,
      per_page: 20,
      page: page,
    }).then((results) => {
      setLoading(false);
      filters.length < 1 && setFilters([...results.facet_counts]);
      setTotalFound(results.found);
      page > 1 ? setNftsData([...nftSData,...results.hits]) : setNftsData(results.hits);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTypesenseSearch, page, nftsResultsFilterBy, filters]);

  const showNftView = () => {
    return (
      <div className={tw(
        'gap-2 minmd:grid minmd:space-x-2 minlg:space-x-0 minlg:gap-4',
        sideNavOpen ? 'minhd:grid-cols-5 minxxl:grid-cols-4 minxl:grid-cols-3 minlg:grid-cols-2 minmd:grid-cols-2 grid-cols-1 w-full' : 'minhd:grid-cols-6 minxxl:grid-cols-5 minxl:grid-cols-4  minlg:grid-cols-3  minmd:grid-cols-2 grid-cols-1 w-full')}>
        {nftSData && nftSData?.length > 0 && nftSData?.map((item, index) => {
          return (
            <NftCard
              key={index}
              name={item.document.nftName}
              tokenId={item.document.tokenId}
              contractAddr={item.document.contractAddr}
              images={[item.document.imageURL]}
              collectionName={item.document.contractName}
              redirectTo={`/app/nft/${item.document.contractAddr}/${item.document.tokenId}`}
              description={item.document.nftDescription ? item.document.nftDescription.slice(0,50) + '...': '' }
              customBackground={'white'}
              lightModeForced/>
          );
        })}
      </div>
    );
  };
  if (!newFiltersEnabled) {
    return <NotFoundPage />;
  }else{
    return(
      <>
        <div className="p-2 minmd:p-4 minlg:p-8 minhd:p-16 minmd:m-0 mb-10 minlg:mb-10 minlg:mt-20 minmd:max-w-full self-center minmd:self-stretch minxl:mx-auto min-h-screen ">
          <div className="flex">
            <div className=" w-full min-h-disc">
              <div>
                <div className='flex justify-between mb-10'>
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center'>
                      <div
                        className={`hidden minlg:block max-w-[112px] overflow-hidden cursor-pointer ${sideNavOpen ? 'mr-[206px]' : 'mr-4'}`}
                        onClick={() => setSideNavOpen(!sideNavOpen)}>
                        {sideNavOpen ?
                          <div className="flex items-center justify-center bg-[#F2F2F2] text-[#6A6A6A] py-3 px-5 text-lg rounded-[48px]">
                            Filters
                            <X size={22} className="text-[#6A6A6A] ml-2" />
                          </div> :
                          <div className="flex items-center justify-center bg-black text-white py-3 px-5 text-lg rounded-[48px]">
                            <SlidersHorizontal size={22} className="mr-2"/>
                            <p>Filter</p>
                          </div>
                        }
                      </div>
                      <div className="px-0 flex mt-0 mr-4 justify-between minlg:hidden">
                        <div onClick={() => setSearchModalOpen(true, 'filters', filters )} className={'flex items-center justify-center bg-black text-white w-10 h-10 rounded-[50%] text-lg rounded-[48px] cursor-pointer'}>
                          <SlidersHorizontal size={22}/>
                        </div>
                        <div className={'hidden relative flex items-center justify-center bg-white border-[#ECECEC] border-[1px] text-white w-10 h-10 rounded-[50%] text-lg rounded-[48px] cursor-pointer z-5'}>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-auto">
                    <div className='flex'>
                      <div className={`${!sideNavOpen ? 'min-w-0' : 'min-w-[304px] -mt-4'} hidden minlg:block`}>
                        <SideNav onSideNav={() => null} filtersData={filters}/>
                      </div>
                      {showNftView()}
                    </div>
                    {(loading) &&
                      (<div className="flex items-center justify-center min-h-[16rem] w-full">
                        <Loader />
                      </div>)}
                    { nftSData && nftSData.length < found && nftSData?.length > 0 &&
                      <div className="mx-auto w-full minxl:w-1/4 flex justify-center mt-7 font-medium">
                        <Button
                          color={'black'}
                          accent={AccentType.SCALE}
                          stretch={true}
                          label={'Load More'}
                          onClick={() => {
                            setPage(page + 1);
                          }}
                          type={ButtonType.PRIMARY}
                        />
                      </div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

CollectionsPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout showDNavigation={true}>
      { page }
    </DefaultLayout>
  );
};