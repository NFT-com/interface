import { useState } from 'react';
import dynamic from 'next/dynamic';
import { CheckCircle } from 'phosphor-react';

import { Doppler, getEnvBool } from 'utils/env';

import OnboardingSecondaryModal from './OnboardingSecondaryModal';

const BlurImage = dynamic(import('components/elements/BlurImage'));

type OnboardingItemProps = {
  isCompleted: boolean;
  name: string;
  coins: number;
  description?: string;
  buttonText?: string;
  href?: string;
};

interface OnboardingModalItemProps {
  items: Array<OnboardingItemProps>;
}

export default function OnboardingModalItem({ items }: OnboardingModalItemProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <>
      {items?.map(item => (
        <>
          {item.isCompleted ? (
            <div className='flex justify-between p-3'>
              <div className='flex items-center'>
                <CheckCircle size={25} color='#26AA73' weight='fill' className='mr-3' />
                <p className='font-medium text-[#26AA73] line-through'>{item.name}</p>
              </div>
              {getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_POINTS_ENABLED) && (
                <div className='flex items-center'>
                  <p className='w-2'>{item.coins}</p>
                  <div className='ml-2 h-[25px] w-[25px]'>
                    <BlurImage alt='default profile photo' src='/assets/nft_profile_default.webp' fill localImage />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className='group flex justify-between rounded-lg p-3 hover:cursor-pointer hover:bg-[#FFF4CA]'
              onClick={() => {
                setModalOpen(true);
                setSelectedItem(item);
              }}
            >
              <div className='flex items-center'>
                <div className='ml-[2px] mr-3 h-5 w-5 rounded-full border border-[#969696] group-hover:border-[#F9D54C]'></div>
                <p className='font-medium text-[#B2B2B2] group-hover:text-black'>{item.name}</p>
              </div>
              {getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_POINTS_ENABLED) && (
                <div className='flex items-center bg-gradient-to-r from-[#FAC213] to-[#FF9B37] bg-clip-text text-transparent'>
                  <p className='w-2'>{item.coins}</p>
                  <div className='ml-2 h-[25px] w-[25px]'>
                    <BlurImage alt='default profile photo' src='/assets/nft_profile_default.webp' fill localImage />
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ))}
      <OnboardingSecondaryModal modalOpen={modalOpen} setModalOpen={setModalOpen} selectedItem={selectedItem} />
    </>
  );
}
