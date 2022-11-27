import TestProfileImg from 'public/gk-holder.svg';
import VerifiedIcon from 'public/verifiedIcon.svg';

export interface NftCardProps {
  name?: string,
  nftCounter?: string,
  followLink?: string,
  btnName?: string
  isLeaderBoard?: boolean
  bgImg?: string,

}

export function ProfileCard(props: NftCardProps) {
  const isLeaderBoard = props.isLeaderBoard;

  if(isLeaderBoard){
    return (
      <a className="px-6 flex justify-between font-noi-grotesk  w-full flex justify-start items-center hover:scale-105 transition-all cursor-pointer rounded-[16px] h-[6.25rem] shadow-lg overflow-hidden">
        <div className="flex justify-start items-center">
          <div className="flex justify-start items-center">
            <div className="mr-6">
              #1
            </div>
            <div className="w-20  rounded-[16px] overflow-hidden">
              <TestProfileImg/>
              {/*<RoundedCornerMedia*/}
              {/*  variant={RoundedCornerVariant.None}*/}
              {/*  width={600}*/}
              {/*  height={600}*/}
              {/*  containerClasses='w-[100%] object-cover h-[100%]'*/}
              {/*  src={processedImageURLs[0]}*/}
              {/*  extraClasses="hover:scale-105 transition"*/}
              {/*/>*/}
            </div>
          </div>
          <div className="pl-8 flex flex-row items-center justify-start">
            <span className="pr-5 text-xl text-[#000000] font-[500]">@username</span>
            <VerifiedIcon/>
            {/*<span className="pr-[20px] text-xl leading-7 text-[#000000] font-[600] max-w-[60%]">{collectionName}</span>*/}
          </div>
        </div>
        <div className="flex flex-row mr-10 items-center">
          <div className="text-[#6A6A6A] text-base"><span className="text-lg font-[600] text-[#000]">29</span> NFTs collected</div>
          <button className="ml-[6.3rem] py-1 px-4 bg-[#F9D54C] rounded-[8px] text-[#000] font-[500] hover:bg-[#000] hover:text-[#F9D54C] transition-all">Follow</button>
        </div>
      </a>
    );
  }else {
    return (
      <div className="transition-all cursor-pointer m-2 rounded-[16px] shadow-lg overflow-hidden cursor-p w-[264px] h-[212px]">
        <div className="bg-black h-[99px] relative">
          <div className="w-[54px] h-[54px] bg-[#ff0000]  border-[5px] border-[#ffffff] rounded-[50%] absolute left-4 -bottom-[27px]">

          </div>
        </div>
        <div className="h-[113px] bg-white pt-8 pl-5 pr-4 pb-4">
          <ul className="list-none flex flex-row justify-between">
            <li className="m-0 p-0 list-none text-5 leading-7 text-[#000000] font-[600] flex items-center">
              {props.name}
              <div className="w-[14px] h-[14px] bg-[#F9D54C] ml-1"></div>
            </li>
            <li className="m-0 p-0 list-none">
              <button className="bg-[#F9D54C] py-1 px-4 text-6 leading-6 text-[#000000] font-[500] rounded-[8px]">{props.btnName}</button>
            </li>
          </ul>
          <ul className="mt-2 list-none flex flex-row justify-between">
            <li className="m-0 p-0 list-none text-5 leading-7 text-[#000000] font-[600]">{props.nftCounter} <span className="text-[#6A6A6A] text-4 leading-6 font-[400]"> NFTs collected</span></li>
          </ul>
        </div>
      </div>
    );
  }
}
