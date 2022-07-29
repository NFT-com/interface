import { motion } from 'framer-motion';
import Image from 'next/image';

type ProfileCardProps = {
  profile: {
    metadata: {
      header: string
      image: string
    }
    title: string
  }
  onClick?: (profileUrl) => void
  message?: string
  showSwitch?: boolean
};

export default function ProfileCard({ profile, onClick, message, showSwitch }: ProfileCardProps) {
  return (
    <motion.div className='mb-4 rounded-[10px]'>
      <input className="sr-only peer" type="radio" value={profile?.title} name="profile" id={`profile_${profile?.title}`}></input>
      <label className="flex cursor-pointer rounded-[10px] peer-checked:ring-[#F9D963] peer-checked:ring-2 peer-checked:border-transparent" htmlFor={`profile_${profile?.title}`}>
        <motion.div
          style={{
            backgroundImage: `url("${profile?.metadata?.header}")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,.8)'
          }}
          className=' rounded-[10px] hover:cursor-pointer w-full bg-cover bg-center'
          onClick={onClick ? () => onClick(profile?.title) : null}
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
      </label>
    </motion.div>
  );
}
