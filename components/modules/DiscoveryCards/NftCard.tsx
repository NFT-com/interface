import { processIPFSURL } from 'utils/helpers';

export interface NftCardProps {
  name?: string,
  images?: any,
  collectionName?: string,
  redirectTo?: string,
  description?: string,
  customBackground?: string,
  lightModeForced?: boolean,
  price?: string,
  secondPrice?: string,
  ednDay?: string,
  isOnSale?: boolean
}

export function NftCard(props: NftCardProps) {
  return (
    <div className="group/ntfCard transition-all cursor-pointer rounded-[16px] shadow-lg overflow-hidden cursor-p h-[442px]">
      <a href={props.redirectTo && props.redirectTo !== '' ? props.redirectTo : '#'} >
        <div className="relative h-[252px] object-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-[100%] h-[100%]"
            src={processIPFSURL(props.images)}
            alt="Nft Image"/>
          <div className="group-hover/ntfCard:opacity-100 opacity-0 w-[100%] h-[100%] bg-[rgba(0,0,0,0.40)] absolute top-0">
            <div className="absolute bottom-[24.5px] flex flex-row justify-center w-[100%]">
              <button className="mx-[7px] px-[16px] py-[8px] bg-[#F9D54C] text-[#000000] rounded-[10px] text-[18px] leading-[24px] font-[500] hover:bg-black  hover:text-[#F9D54C] ">Buy Now</button>
              <button className="mx-[7px] px-[16px] py-[8px] bg-[#ffffff] text-[#000000] rounded-[10px] text-[18px] leading-[24px] font-[500]">Icon</button>
            </div>
          </div>
        </div>
        <div className="h-[190px] p-[18px] bg-white">
          <ul
            className="h-[94px] flex flex-col text-[20px] leading-[28px] font-[600] list-none border-b-[1px] border-[#F2F2F2] pb-[8px] mb-[8px]">
            <li className="list-none p-0 m-[0]">{props.name}</li>
            <li
              className="text-[16px] leading-[25.5px] text-[#6A6A6A] mt-[4px] font-[400] list-none p-0 m-[0] whitespace-nowrap text-ellipsis overflow-hidden">{props.collectionName}</li>
          </ul>
          {
            props.isOnSale
              ? (
                <ul className="flex flex-row justify-between mt-[14px]">
                  <li className="p-0 m-[0] flex flex-col">
                    <span className="font-[500] text-[#000000] text-[18px]">{props.secondPrice}</span>
                    <span className="text-[#B2B2B2] font-[400]">Price</span>
                  </li>
                  <li className="text-[16px] p-0 m-[0] flex flex-col text-[#747474] font-[500]">{props.price}</li>
                  <li className="text-[16px] p-0 m-[0] flex flex-col items-end">
                    <span className="text-[16px] text-[#B2B2B2] font-[400]">Ends in</span>
                    <span className="text-[16px] text-[#6A6A6A] font-[500]">{props.ednDay}</span>
                  </li>
                </ul>
              )
              : (
                <button className="mt-2 px-[16px] py-[8px] bg-black text-[#ffffff] rounded-[10px] text-[18px] leading-[24px] font-[500]">Make an offer</button>
              )
          }
        </div>
      </a>
    </div>
  );
}
