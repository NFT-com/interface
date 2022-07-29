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
};

export default function ProfileCard({ profile, onClick, message }: ProfileCardProps) {
  return (
    <motion.div className='mb-4 rounded-[10px]'>
      <input className="sr-only peer" type="radio" value={profile.title} name="profile" id={`profile_${profile.title}`}></input>
      <label className="flex cursor-pointer rounded-[10px] peer-checked:ring-[#F9D963] peer-checked:ring-2 peer-checked:border-transparent" htmlFor={`profile_${profile.title}`}>
        <motion.div
          style={{
            background: `url("${profile.metadata.header}")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
          className='bg-black rounded-[10px] hover:cursor-pointer w-full'
          onClick={() => onClick(profile.title)}
        >
          <div className='bg-black opacity-80 flex items-center py-4 px-4 rounded-[10px]' >
            <Image className='rounded-full' width={50} height={50} alt={`profile for ${profile.title}`} src={profile.metadata.image} />
            <div>
              {message &&
                <p className='font-grotesk text-xs text-yellow-400 leading-6 font-bold -mb-1 ml-3 tracking-wider uppercase'>{message}</p>
              }
              <p className='font-grotesk text-base text-white leading-6 font-medium ml-3 tracking-wide'>{profile.title}</p>
            </div>
          </div>
        </motion.div>
      </label>
    </motion.div>
  );
}
