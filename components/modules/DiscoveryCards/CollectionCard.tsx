import { useCollectionQuery } from '../../../graphql/hooks/useCollectionQuery';
import { Doppler, getEnv } from '../../../utils/env';
import { processIPFSURL } from '../../../utils/helpers';

import { useState } from 'react';
import { useNetwork } from 'wagmi';

const MAX_COUNT = 180;
export interface CollectionCardProps {
  contract: string
  title: string;
  countOfElements: number;
  contractAddress: any;
  contractName: string;
  description: string;
  userName: string;
  userAvatar: string;
  isVerified: boolean;
  redirectTo: string;
  imgUrl: any;
}

export function CollectionCard(props: CollectionCardProps) {
  const { chain } = useNetwork();
  const discoverPageEnv = getEnv(Doppler.NEXT_PUBLIC_DISCOVER2_PHASE1_ENABLED);

  const [isStringCut, toggleStringLength] = useState(false);
  const { data: collection } = useCollectionQuery(String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)), props?.contract);
  const collectionName = collection?.collection?.name ?? props.contractName;
  const sliceString = (description: string) => {
    if(!description) return;
    let newDescription;
    if(description?.length > MAX_COUNT){
      const newString = description?.slice(0, !isStringCut ? MAX_COUNT : description?.length);
      newDescription = !isStringCut ? `${newString}...` : newString;
    }else {
      newDescription = description;
    }
    return newDescription;
  };
  const checkImg = (images) => {
    if(!images) return;
    const convertedImages = images.map(image => {
      if(image){
        return processIPFSURL(image);
      }
    }).filter(Boolean);
    return convertedImages[0];
  };
  return (
    <a href={props.redirectTo && props.redirectTo !== '' ? props.redirectTo : '#'} className="block hover:scale-105 transition-all cursor-pointer rounded-[16px] shadow-lg overflow-hidden cursor-p">
      <div className="h-44 relative ">
        <img className="w-[100%] object-cover h-[100%]" src={checkImg(props.imgUrl)} alt="Image"/>
        {/*<div className="absolute w-[48px] h-[48px] bg-[rgba(0,0,0,0.70)] rounded-[50%] top-3 right-2"></div>*/}
      </div>
      <div className="pt-4 pr-[20px] pb-5 pl-[30px] min-h-51rem">
        <div className="border-b-[1px] border-[#F2F2F2] pb-[11px] mb-[16px]">
          <div className="flex justify-between items-start">
            <span className="pr-[20px] text-xl leading-7 text-[#000000] font-[600] max-w-[60%]">{collectionName}</span>
            <button className="bg-white pl-2 pr-[12px] py-[6px] flex items-center shadow-lg rounded-[16px] text-base leading-6 text-[#000000] font-[400] ">
              <div className="w-6 h-6 bg-black rounded-[50%] mr-[6px]"></div>
              <span className="text-ellipsis overflow-hidden block max-w-[100px] min-w-[100px] whitespace-nowrap">{props.userName}</span>
            </button>
          </div>
          <div className="text-base leading-[25px] text-[#6A6A6A] font-[400] mt-[6px]">
            {props.countOfElements + (props.countOfElements > 1 ? ' Elements' : ' Element')}
          </div>
        </div>
        {
          props.description && (
            <div onClick={(event) => event.preventDefault()} className="leading-[23.2px] text-[#959595] font-[400]">
              <p className="text-base">
                {sliceString(props.description)}
                {
                  props.description.length > MAX_COUNT && (
                    <button onClick={() => toggleStringLength(!isStringCut)} className="text-[#000000] font-[600] ml-[5px]">{isStringCut ? 'less' : 'more'}</button>
                  )
                }
              </p>
            </div>
          )
        }
      </div>
    </a>
  );
}
