/* eslint-disable import/no-unresolved */
// Import Swiper styles
import { useState } from 'react';
import { BigNumber, BigNumberish } from 'ethers';
import { Autoplay, Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import useSWR from 'swr';
import { useNetwork } from 'wagmi';

import 'swiper/css/navigation';

import { NFTCard } from 'components/modules/NFTCard/NFTCard';
import { useFetchCollectionNFTs } from 'graphql/hooks/useFetchCollectionNFTs';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { Doppler, getEnv } from 'utils/env';
import { isNullOrEmpty } from 'utils/format';
import { getChainIdString } from 'utils/helpers';
import { tw } from 'utils/tw';

import RightSlider from 'public/icons/right-slider.svg?svgr';

import 'swiper/css';

export interface NFTDetailMoreFromCollectionProps {
  contract: string;
  collectionName: string;
  hideTokenId: BigNumberish;
}

export function NFTDetailMoreFromCollection(props: NFTDetailMoreFromCollectionProps) {
  const { width: screenWidth } = useWindowDimensions();
  const [my_swiper, set_my_swiper] = useState<SwiperClass>();
  const { fetchCollectionsNFTs } = useFetchCollectionNFTs();
  const { chain } = useNetwork();
  const { data } = useSWR(
    () =>
      props.contract && props.hideTokenId ? ['NFTDetailMoreFromCollection', props.contract, props.hideTokenId] : null,
    async () => {
      const result = await fetchCollectionsNFTs({
        chainId: getChainIdString(chain?.id) ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
        collectionAddress: props.contract,
        pageInput: {
          first: 50
        }
      });
      return result?.collectionNFTs?.items?.filter(nft => !BigNumber.from(nft?.tokenId).eq(props.hideTokenId));
    }
  );

  if (isNullOrEmpty(data)) {
    return null;
  }

  return (
    <div className='flex w-screen items-center justify-center bg-[#ECECEC]'>
      <div className='-px-4 my-10 flex w-full items-center minlg:max-w-[650px] minxl:max-w-nftcom'>
        <div className='flex w-full flex-col px-[16px]'>
          <span className='mb-2 font-noi-grotesk text-2xl font-bold'>More from collection</span>
          {screenWidth >= 1200 && data?.length < 5 ? (
            <div className='mx-auto flex h-full items-stretch py-2'>
              {data?.map((nft, index) => {
                return (
                  <div
                    className={tw('NftCollectionItem mr-4 flex w-72 shrink-0 cursor-pointer flex-col self-stretch')}
                    key={nft?.id ?? index}
                  >
                    <NFTCard
                      contractAddr={props.contract}
                      tokenId={nft.tokenId}
                      name={nft.metadata.name}
                      nft={nft}
                      images={[nft.metadata.imageURL]}
                      collectionName={props.collectionName}
                      redirectTo={`/app/nft/${props.contract}/${nft.tokenId}`}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='relative flex h-full items-stretch py-2'>
              <div className='absolute inset-y-0 right-[-1px] z-10 w-[150px] bg-gradient-to-r from-transparent to-[#ECECEC] lg:hidden' />
              <div className='absolute inset-y-0 left-[-1px] z-10 w-[150px] bg-gradient-to-l from-transparent to-[#ECECEC] lg:hidden' />
              <RightSlider
                onClick={() => {
                  my_swiper.slidePrev();
                }}
                className='absolute inset-y-1/2 left-[-50px] z-20 rotate-180 cursor-pointer hover:scale-105 lg:hidden'
              />
              <RightSlider
                onClick={() => {
                  my_swiper.slideNext();
                }}
                className='absolute inset-y-1/2 right-[-50px] z-20 cursor-pointer hover:scale-105 lg:hidden'
              />
              <Swiper
                onInit={ev => {
                  set_my_swiper(ev);
                }}
                slidesPerView={Math.min(
                  data?.length ?? 5,
                  screenWidth < 600
                    ? 2
                    : screenWidth >= 600 && screenWidth < 950
                    ? data?.length >= 3
                      ? 4
                      : data?.length
                    : data?.length >= 4
                    ? 5
                    : data?.length
                )}
                centeredSlides={!(screenWidth < 600)}
                allowSlideNext={true}
                loop={data?.length > 4}
                autoplay={{
                  delay: 4500,
                  disableOnInteraction: false
                }}
                className={tw('flex overflow-y-visible', 'h-max')}
                modules={[Autoplay]}
              >
                {data?.map((nft, index) => {
                  return (
                    <SwiperSlide
                      className={tw('NftCollectionItem mr-4 flex w-72 shrink-0 cursor-pointer flex-col self-stretch')}
                      key={nft?.id ?? index}
                    >
                      <NFTCard
                        contractAddr={props.contract}
                        tokenId={nft.tokenId}
                        name={nft.metadata.name}
                        nft={nft}
                        isOwnedByMe={nft?.isOwnedByMe}
                        listings={nft?.listings?.items || []}
                        images={[nft.metadata.imageURL]}
                        collectionName={props.collectionName}
                        redirectTo={`/app/nft/${props.contract}/${nft.tokenId}`}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
