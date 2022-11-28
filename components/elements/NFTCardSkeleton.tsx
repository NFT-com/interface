
export function NFTCardSkeleton() {
  return (
    <div className="flex flex-col h-full rounded-2xl shadow-lg">
      <div className="h-[252px] aspect-square rounded-t-2xl bg-[#F2F3F5]"></div>
      <div className="flex flex-col space-y-3 p-4">
        <div className="bg-[#F2F3F5] h-2 w-1/2 mb-2"></div>
        <div className="bg-[#F2F3F5] h-2 w-full"></div>
        <div className="bg-[#F2F3F5] h-2 w-3/4"></div>
        <div className="border-b border-[#F2F2F2] h-[1px] pb-7"></div>
      </div>
      <div className="flex justify-between pt-4 px-4">
        <div className="bg-[#F2F3F5] h-2 w-1/5"></div>
        <div className="bg-[#F2F3F5] h-2 w-2/5"></div>
      </div>
    </div>
  );
}
