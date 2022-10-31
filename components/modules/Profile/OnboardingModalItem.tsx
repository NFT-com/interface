import OnboardingActionModal from './OnboardingActionModal';

import { CheckCircle } from 'phosphor-react';
import NftGoldLogo from 'public/nft_gold_logo.svg';
import { Fragment, useState } from 'react';

type OnboardingItemProps = {
  isCompleted: boolean;
  name: string;
  coins: number;
  description?: string;
  buttonText?: string;
  onClick?: () => void
};

interface OnboardingModalItemProps {
  items: Array<OnboardingItemProps>;
}

export default function OnboardingModalItem({ items } : OnboardingModalItemProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <>
      {items?.map((item) => (
        <>
          {item.isCompleted ?
            <div className='flex justify-between p-3'>
              <div className='flex items-center'>
                <CheckCircle size={25} color="#26AA73" weight="fill" className='mr-3' />
                <p className='text-[#26AA73] line-through font-medium'>{item.name}</p>
              </div>
              <div className='flex items-center'>
                {item.coins}
                <div className='h-[25px] w-[25px] ml-2'>
                  <NftGoldLogo />
                </div>
              </div>
            </div>
            :
            <div
              className='group flex justify-between p-3 hover:bg-[#FFF4CA] rounded-lg hover:cursor-pointer'
              onClick={() => {
                setModalOpen(true);
                setSelectedItem(item);
              }}
            >
              <div className='flex items-center'>
                <div className='w-5 h-5 border rounded-full mr-3 ml-[2px] border-[#969696] group-hover:border-[#F9D54C]'></div>
                <p className='text-[#B2B2B2] group-hover:text-black font-medium'>{item.name}</p>
              </div>
              <div className='flex items-center bg-gradient-to-r bg-clip-text text-transparent from-[#FAC213] to-[#FF9B37]'>
                {item.coins}
                <div className='h-[25px] w-[25px] ml-2'>
                  <NftGoldLogo />
                </div>
              </div>
            </div>
          }
        </>
      ))}
      <OnboardingActionModal modalOpen={modalOpen} setModalOpen={setModalOpen} selectedItem={selectedItem} />
    </>
  );
}
    