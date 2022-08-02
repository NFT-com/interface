import { tw } from 'utils/tw';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { SetStateAction } from 'react';

type ProfileCardProps = {
  profile: {
    metadata: {
      header: string
      image: string
    }
    title: string
  }
  onClick?: (value?: string | SetStateAction<boolean> | SetStateAction<string> ) => void
  opensModal?: boolean
  message?: string
  showSwitch?: boolean
  isSelected?: boolean
};

export default function ProfileCard({ profile, onClick, message, showSwitch, opensModal, isSelected }: ProfileCardProps) {
  return (
    <motion.div className={tw(
      'mb-4 rounded-[10px] box-border',
      isSelected && 'outline-[#F9D963] outline-offset-[-1px] outline-2 outline'
    )}>
      <motion.div
        style={{
          backgroundImage: `url("${profile?.metadata?.header}")`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,.8)'
        }}
        className={tw(
          'rounded-[10px] hover:cursor-pointer w-full bg-cover bg-center box-border',
        )}
        onClick={onClick ? !opensModal ? () => onClick(profile?.title) : () => onClick(true) : null}
      >
        <div className='flex items-center py-4 px-4 rounded-[10px]' >
          {profile?.metadata?.image && <Image className='rounded-full' width={50} height={50} alt={`profile for ${profile?.title}`} src={profile?.metadata?.image} />}
          <div className='flex justify-between w-full'>
            <div>
              {message &&
                <p className='font-grotesk text-xs text-[#F9D963] leading-6 font-bold -mb-1 ml-3 tracking-wider uppercase'>{message}</p>
              }
              <p className='font-grotesk text-base text-white leading-6 font-medium ml-3 tracking-wide'>{profile?.title}</p>
            </div>
            {showSwitch && <p className='text-[#F9D963]'>Switch</p>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
