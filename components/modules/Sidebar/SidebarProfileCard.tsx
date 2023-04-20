import { SetStateAction } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Wallet } from 'phosphor-react';
import { useAccount } from 'wagmi';

import ClientOnly from 'components/elements/ClientOnly';
import { useSidebar } from 'hooks/state/useSidebar';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

type SidebarProfileCardProps = {
  profile: {
    metadata: {
      header: string;
      image: string;
    };
    title: string;
  };
  onClick?: (value?: string | SetStateAction<boolean> | SetStateAction<string>) => void;
  opensModal?: boolean;
  message?: string;
  showSwitch?: boolean;
  isSelected?: boolean;
  isSidebar?: boolean;
};

export function SidebarProfileCard({
  profile,
  onClick,
  message,
  showSwitch,
  opensModal,
  isSelected,
  isSidebar
}: SidebarProfileCardProps) {
  const { address: currentAddress } = useAccount();
  const router = useRouter();
  const { setSidebarOpen } = useSidebar();
  return (
    <motion.div
      className={tw(
        'box-border rounded-[10px]',
        isSelected && 'outline-3 outline outline-offset-[-2px] outline-[#F9D963]'
      )}
    >
      {isSidebar ? (
        <motion.div
          style={{
            backgroundImage: `url("${profile?.metadata?.header}")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,.8)'
          }}
          className={tw('box-border h-20 w-full rounded-t-[10px] bg-cover bg-center hover:cursor-pointer')}
        >
          <div className='4 flex h-full items-center rounded-[10px] px-4'>
            {profile?.metadata?.image && (
              <Image
                onClick={() => {
                  router.push(`/${profile?.title}`);
                  setSidebarOpen(false);
                }}
                className='rounded-full'
                width={50}
                height={50}
                alt={`profile for ${profile?.title}`}
                src={profile?.metadata?.image}
              />
            )}
            <div className='flex h-full w-full justify-between'>
              <div
                className='flex w-full items-center'
                onClick={() => {
                  router.push(`/${profile?.title}`);
                  setSidebarOpen(false);
                }}
              >
                {message && (
                  <p className='-mb-1 ml-3 font-noi-grotesk text-xs font-bold uppercase leading-6 tracking-wider text-[#F9D963]'>
                    {message}
                  </p>
                )}
                <div>
                  <p className='ml-3 w-full font-noi-grotesk text-base font-medium leading-6 tracking-wide text-white'>
                    {profile?.title}
                  </p>
                  <div className='ml-3 flex'>
                    <Wallet size={23} color='#D5D5D5' weight='fill' className='mr-1' />
                    <ClientOnly>
                      <p className='w-full font-mono text-base font-medium leading-6 tracking-wide text-[#D5D5D5]'>
                        {shortenAddress(currentAddress, 4)}
                      </p>
                    </ClientOnly>
                  </div>
                </div>
              </div>
              <div
                className='flex h-full items-center'
                onClick={onClick ? (!opensModal ? () => onClick(profile?.title) : () => onClick(true)) : null}
              >
                <p data-cy='profileCardSwitchSidebar' className='text-[#F9D963]'>
                  Switch
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          style={{
            backgroundImage: `url("${profile?.metadata?.header}")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,.8)'
          }}
          className={tw('box-border h-20 w-full rounded-[10px] bg-cover bg-center hover:cursor-pointer')}
          onClick={onClick ? (!opensModal ? () => onClick(profile?.title) : () => onClick(true)) : null}
        >
          <div className='flex h-full items-center rounded-[10px] p-4'>
            {profile?.metadata?.image && (
              <Image
                className='rounded-full'
                width={50}
                height={50}
                alt={`profile for ${profile?.title}`}
                src={profile?.metadata?.image}
              />
            )}
            <div className='flex w-full justify-between'>
              <div>
                {message && (
                  <p className='-mb-1 ml-3 font-noi-grotesk text-xs font-bold uppercase leading-6 tracking-wider text-[#F9D963]'>
                    {message}
                  </p>
                )}
                <p className='ml-3 font-noi-grotesk text-base font-medium leading-6 tracking-wide text-white'>
                  {profile?.title}
                </p>
              </div>
              {showSwitch && (
                <p data-cy='profileCardSwitch' className='text-[#F9D963]'>
                  Switch
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
