import { CollectionCard } from 'components/modules/DiscoveryCards/CollectionCard';
import { useCollectionLikeCountQuery } from 'graphql/hooks/useCollectionLikeQuery';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { HomePageV3CollectionsSection } from 'types/HomePage';
import { isOfficialCollection } from 'utils/helpers';
import { tw } from 'utils/tw';

import React, { useEffect, useState } from 'react';
import { Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

export interface HomePageData {
  data?: HomePageV3CollectionsSection;
}

export function DiscoverCollections({ data }: HomePageData) {
  const { fetchTypesenseSearch } = useFetchTypesenseSearch();
  const [collections, setCollectionData] = useState(null);
  const { data: collectionLikeData } = useCollectionLikeCountQuery(collections?.map((c) => c?.document?.contractAddr));
  const addressIds = data?.collectionsAddressIds;
  useEffect(() => {
    fetchTypesenseSearch({
      facet_by: ',floor,nftType,volume,issuance',
      index: 'collections',
      q: '*',
      query_by: 'contractAddr,contractName',
      filter_by: addressIds && addressIds?.length > 0 ? `isOfficial:true && contractAddr:=[${addressIds.toString()}]` : 'isOfficial:true',
      per_page: 10,
      page: 1,
    }).then((results) => {
      setCollectionData(results?.hits);
    });
  }, [addressIds, fetchTypesenseSearch]);

  return(
    <div id='anim-discover-trigger' className={tw(
      'bg-black relative',
      'minlg:before:w-40 minlg:before:absolute minlg:before:left-[2.5rem] minlg:before:top-0 minlg:before:h-[1.875rem] before:bg-white before:skew-x-[-20deg]',
      'minlg:after:w-[8.9rem] minlg:after:absolute minlg:after:left-[11.5rem] minlg:after:top-0 minlg:after:h-[5.5rem] after:bg-white after:skew-x-[-20deg]'
    )}>
      <div className={tw(
        'pl-5 minmd:pl-0',
        'relative z-0 py-[2.5rem] minlg:pt-[6.25rem] minlg:pb-12',
      )}>
        <div className='relative minlg:text-center'>
          <h2 data-aos="fade-up" className={tw(
            'text-[3rem] minmd:text-[3.75rem] minxl:text-[5.125rem] minxxl:text-[7.5rem] leading-[1.0854] font-normal text-white',
            'mb-10 minmd:mb-[6.625rem]'
          )}>{data?.sectionTitle}</h2>
        </div>

        <div className='overflow-hidden mb-12'>
          <div id='anim-discover-content'>
            <Swiper
              modules={[Scrollbar]}
              spaceBetween={16}
              breakpoints={{
                0: {
                  slidesPerView: 1.15,
                },
                600: {
                  slidesPerView: 2,
                },
                1200: {
                  slidesPerView: 2.5,
                },
                1600: {
                  slidesPerView: 3.5,
                }
              }}
              autoplay={{
                'delay': 3500,
                'disableOnInteraction': false
              }}
              scrollbar={{ draggable: true }}
              className='flex !pb-12 minxl:!pb-[4.875rem]'>
              {collections && collections?.length > 0 && collections?.map((collection, index) => {
                return (
                  <SwiperSlide key={index} className='!h-auto'>
                    <CollectionCard
                      key={index}
                      redirectTo={`/app/collection/${isOfficialCollection({ name: collection.document.contractName, isOfficial: collection.document.isOfficial })}/`}
                      contractAddr={collection.document?.contractAddr}
                      collectionId={collection?.document?.id}
                      floorPrice={collection.document?.floor}
                      totalVolume={collection.document?.volume}
                      contractName={collection.document.contractName}
                      isOfficial={collection.document.isOfficial}
                      images={[collection.document.bannerUrl]}
                      likeInfo={collectionLikeData && collectionLikeData[index]}
                    />
                  </SwiperSlide>

                );
              })}
            </Swiper>
          </div>
        </div>

        <div data-aos="zoom-in" data-aos-delay="100" className='text-center'>
          <a href={data?.ctaButtonLink} className={tw(
            'bg-[#F9D54C] hover:bg-[#dcaf07] drop-shadow-lg rounded-full transition-colors',
            'inline-flex items-center justify-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
            'text-xl minxxl:text-3xl text-black font-medium uppercase'
          )}>{data?.ctaButtonText}</a>
        </div>
      </div>
    </div>
  );
}
