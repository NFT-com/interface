export interface NftCardProps {
  name: string,
  collectionName: string,
  price: string,
  secondPrice: string,
  ednDay: string,
  isOnSale: boolean
}

export function NftCard(props: NftCardProps) {
  return (
    <div className="group/ntfCard transition-all cursor-pointer m-2 rounded-[16px] shadow-lg overflow-hidden cursor-p w-[264px] h-[442px]">
      <div className="relative h-[252px] object-cover">
        <img
          className="w-[100%] h-[100%]"
          src="https://www.cnet.com/a/img/resize/c5b48e90abe8b7fe339fc0139f3834dbe434fee5/hub/2021/11/29/f566750f-79b6-4be9-9c32-8402f58ba0ef/richerd.png?auto=webp&width=1200"
          alt=""/>
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
            className="text-[16px] leading-[25.5px] text-[#6A6A6A] mt-[4px] font-[400] list-none p-0 m-[0]">{props.collectionName}</li>
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
    </div>
  );
}

//
// export interface NftCardProps {
//   name: string,
//   collectionName: string,
//   price: string,
//   secondPrice: string,
//   ednDay: string,
//   isOnSale: boolean
// }
//
// export function NftCard(props: NftCardProps) {
//   return (
//     <div className="group/ntfCard cursor-pointer m-2 flex flex-col rounded-[16px] shadow-lg overflow-hidden cursor-p">
//       <div  className="relative min-h-[252px] object-cover">
//         <img
//           className="w-[100%] h-[100%]"
//           src="https://www.cnet.com/a/img/resize/c5b48e90abe8b7fe339fc0139f3834dbe434fee5/hub/2021/11/29/f566750f-79b6-4be9-9c32-8402f58ba0ef/richerd.png?auto=webp&width=1200"
//           alt=""/>
//         <div className="group-hover/ntfCard:opacity-100 opacity-0 w-[100%] h-[100%] bg-[rgba(0,0,0,0.40)] absolute top-0">
//           <div className="absolute bottom-[24.5px] flex flex-row justify-center w-[100%]">
//             <button className="mx-[7px] px-[16px] py-[8px] bg-[#F9D54C] text-[#000000] rounded-[10px] text-[18px] leading-[24px] font-[500] hover:bg-black  hover:text-[#F9D54C] ">Buy Now</button>
//             <button className="mx-[7px] px-[16px] py-[8px] bg-[#ffffff] text-[#000000] rounded-[10px] text-[18px] leading-[24px] font-[500]">Icon</button>
//           </div>
//         </div>
//       </div>
//       <div className="h-[100%] flex flex-col justify-between p-[18px] bg-white">
//         <ul
//           className="flex flex-col text-[20px] leading-[28px] font-[600] list-none border-b-[1px] border-[#F2F2F2] pb-[8px] mb-[8px]">
//           <li className="list-none p-0 m-[0] min-h-[56px]">{props.name}</li>
//           <li
//             className="text-[16px] leading-[25.5px] text-[#6A6A6A] mt-[4px] font-[400] list-none p-0 m-[0]">{props.collectionName}</li>
//         </ul>
//         {
//           props.isOnSale ? (
//             <ul className="flex flex-row justify-between">
//               <li className="p-0 m-[0] flex flex-col">
//                 <span className="font-[500] text-[#000000] text-[18px]">{props.secondPrice}</span>
//                 <span className="text-[#B2B2B2] font-[400]">Price</span>
//               </li>
//               <li className="text-[16px] p-0 m-[0] flex flex-col text-[#747474] font-[500]">{props.price}</li>
//               <li className="text-[16px] p-0 m-[0] flex flex-col items-end">
//                 <span className="text-[16px] text-[#B2B2B2] font-[400]">Ends in</span>
//                 <span className="text-[16px] text-[#6A6A6A] font-[500]">{props.ednDay}</span>
//               </li>
//             </ul>
//           ) : (
//             <button className="px-[16px] py-[8px] bg-black text-[#ffffff] rounded-[10px] text-[18px] leading-[24px] font-[500]">Make an offer</button>
//           )
//         }
//       </div>
//     </div>
//   );
// }
