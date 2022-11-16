export interface NftCardProps {
  name?: string,
  nftCounter?: string,
  followLink?: string,
  btnName?: string
  bgImg?: string,

}

export function ProfileCard(props: NftCardProps) {
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
