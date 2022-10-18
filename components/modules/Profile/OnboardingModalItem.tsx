import { CheckCircle } from 'phosphor-react';
import NftGoldLogo from 'public/nft_gold_logo.svg';

type OnboardingModalItemProps = {
  isCompleted: boolean;
  name: string;
  coins: number
};

export default function OnboardingModalItem({ isCompleted, name, coins }: OnboardingModalItemProps ) {
  return (
    <>
      {isCompleted ?
        <div className='flex justify-between p-3'>
          <div className='flex items-center'>
            <CheckCircle size={25} color="#26AA73" weight="fill" className='mr-3' />
            <p className='text-[#26AA73] line-through font-medium'>{name}</p>
          </div>
          <div className='flex items-center'>
            {coins}
            <div className='h-[25px] w-[25px] ml-2'>
              <NftGoldLogo />
            </div>
          </div>
        </div>
        :
        <div className='group flex justify-between p-3 hover:bg-[#FFF4CA] rounded-lg hover:cursor-pointer'>
          <div className='flex items-center'>
            <div className='w-5 h-5 border rounded-full mr-3 ml-[2px] border-[#969696] group-hover:border-[#F9D54C]'></div>
            <p className='text-[#B2B2B2] group-hover:text-black font-medium'>{name}</p>
          </div>
          <div className='flex items-center bg-gradient-to-r bg-clip-text text-transparent from-[#FAC213] to-[#FF9B37]'>
            {coins}
            <div className='h-[25px] w-[25px] ml-2'>
              <NftGoldLogo />
            </div>
          </div>
        </div>
      }
    </>
  );
}
    