/* eslint-disable import/no-unresolved */
// Import Swiper styles
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';

import { NFTCard } from 'components/elements/NFTCard';
import { useFetchCollectionNFTs } from 'graphql/hooks/useFetchCollectionNFTs';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { Doppler, getEnv } from 'utils/env';
import { getChainIdString } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import SwiperCore, { Autoplay, Navigation } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import useSWR from 'swr';
import { useNetwork } from 'wagmi';

SwiperCore.use([Autoplay, Navigation]);

export interface NFTDetailMoreFromCollectionProps {
  contract: string;
  collectionName: string;
}

export function NFTDetailMoreFromCollection(props: NFTDetailMoreFromCollectionProps) {
  const { width: screenWidth } = useWindowDimensions();
  const { fetchCollectionsNFTs } = useFetchCollectionNFTs();
  const router = useRouter();
  const { chain } = useNetwork();
  const { data } = useSWR('NFTDetailMoreFromCollection' + props.contract, async () => {
    const result = await fetchCollectionsNFTs({
      chainId: getChainIdString(chain?.id) ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
      collectionAddress: props.contract,
      pageInput: {
        first: 50
      }
    });
    return result?.collectionNFTs?.items;
  });

  if (data == null) {
    return null;
  }

  return <div className='flex flex-col w-full px-[16px]'>
    <span className="text-2xl font-bold font-grotesk mb-2">More from collection</span>
    <div className='flex py-2 h-full items-stretch'>
      <Swiper
        slidesPerView={screenWidth < 600 ? 1 : screenWidth >= 600 && screenWidth < 900 ? 3 : 4}
        centeredSlides={false}
        loop={true}
        spaceBetween={16}
        autoplay={{
          'delay': 3000,
          'disableOnInteraction': false
        }}
        className="flex drop-shadow-2xl"
      >
        {data?.map((nft, index) => {
          return (
            <SwiperSlide className={tw(
              'NftCollectionItem flex flex-col w-72 shrink-0 cursor-pointer self-stretch',
            )} key={nft?.id ?? index}>
              <NFTCard
                contractAddress={props.contract}
                tokenId={nft.tokenId}
                title={nft.metadata.name}
                images={[nft?.previewLink || nft.metadata.imageURL]}
                collectionName={props.collectionName}
                onClick={() => {
                  if (nft.metadata.name) {
                    router.push(`/app/nft/${props.contract}/${nft.tokenId}`);
                  }
                }}
                customBorderRadius={'rounded-tl rounded-tr'}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  </div>;
}