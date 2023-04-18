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

export default function DiscoverCollections({ data }: HomePageData) {
  const { fetchTypesenseSearch } = useFetchTypesenseSearch();
  const [collections, setCollectionData] = useState(null);
  const { data: collectionLikeData } = useCollectionLikeCountQuery(
    collections?.map(c => c?.document?.contractAddr)
  );
  const addressIds = data?.collectionsAddressIds;
  useEffect(() => {
    fetchTypesenseSearch({
      facet_by: ',floor,nftType,volume,issuance',
      index: 'collections',
      q: '*',
      query_by: 'contractAddr,contractName',
      filter_by:
        addressIds && addressIds?.length > 0
          ? `isOfficial:true && contractAddr:=[${addressIds.toString()}]`
          : 'isOfficial:true',
      per_page: 10,
      page: 1
    }).then(results => {
      setCollectionData(results?.hits);
    });
  }, [addressIds, fetchTypesenseSearch]);

  return(
    <div id='anim-discover-trigger' className={tw(
      'bg-black relative',
      'minlg:before:w-40 minlg:before:absolute minlg:before:left-[2.5rem] minlg:before:top-0 minlg:before:h-[1.875rem] before:bg-white before:skew-x-[-20deg]',
      'minlg:after:w-[8.9rem] minlg:after:absolute minlg:after:left-[11.5rem] minlg:after:top-0 minlg:after:h-[5.5rem] after:bg-white after:skew-x-[-20deg]'
    )}>
      <svg className='absolute left-7 top-0 minlg:hidden' width="239" height="92" viewBox="0 0 239 92" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M142.15 -232H97.748L0 21.0588H43.1864L142.15 -232Z"/>
        <path d="M159.333 -175.765H115.419L18.7451 78.856H61.4569L159.333 -175.765Z"/>
        <path d="M209.32 -196.072H164.918L67.1699 58.5489H110.356L209.32 -196.072Z"/>
        <path d="M239 -163.268H194.598L96.8497 91.3529H140.036L239 -163.268Z"/>
      </svg>

      <div className={tw(
        'pl-5 minlg:pl-0',
        'relative z-0 pt-36 pb-16 minlg:pt-[6.25rem] minlg:pb-12',
      )}>
        <div className='relative minlg:text-center'>
          <h2
            data-aos='fade-up'
            className={tw(
              'text-[3rem] font-normal leading-[1.0854] text-white minmd:text-[3.75rem] minxl:text-[5.125rem] minxxl:text-[7.5rem]',
              'mb-10 minmd:mb-[6.625rem]'
            )}
          >
            {data?.sectionTitle}
          </h2>
        </div>

        <div className='mb-12 overflow-hidden'>
          <div id='anim-discover-content'>
            <Swiper
              modules={[Scrollbar]}
              spaceBetween={16}
              breakpoints={{
                0: {
                  slidesPerView: 1.15
                },
                600: {
                  slidesPerView: 2
                },
                1200: {
                  slidesPerView: 2.5
                },
                1600: {
                  slidesPerView: 3.5
                }
              }}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false
              }}
              scrollbar={{ draggable: true }}
              className='flex !pb-12 minxl:!pb-[4.875rem]'
            >
              {collections &&
                collections?.length > 0 &&
                collections?.map((collection, index) => {
                  return (
                    <SwiperSlide key={index} className='!h-auto'>
                      <CollectionCard
                        key={index}
                        redirectTo={`/app/collection/${isOfficialCollection({
                          name: collection.document.contractName,
                          isOfficial: collection.document.isOfficial
                        })}/`}
                        contractAddr={collection.document?.contractAddr}
                        collectionId={collection?.document?.id}
                        floorPrice={collection.document?.floor}
                        totalVolume={collection.document?.volume}
                        contractName={collection.document.contractName}
                        isOfficial={collection.document.isOfficial}
                        images={[collection.document.bannerUrl]}
                        likeInfo={
                          collectionLikeData && collectionLikeData[index]
                        }
                      />
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>
        </div>

        <div data-aos='zoom-in' data-aos-delay='100' className='text-center'>
          <a
            href={data?.ctaButtonLink}
            className={tw(
              'rounded-full bg-[#F9D54C] drop-shadow-lg transition-colors hover:bg-[#dcaf07]',
              'inline-flex h-[4rem] items-center justify-center px-6 minxxl:h-[6rem] minxxl:px-9',
              'text-xl font-medium uppercase text-black minxxl:text-3xl'
            )}
          >
            {data?.ctaButtonText}
          </a>
        </div>
      </div>
    </div>
  );
}
