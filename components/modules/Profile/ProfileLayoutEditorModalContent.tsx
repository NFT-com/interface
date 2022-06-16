import { tw } from 'utils/tw';

import Image from 'next/image';
import { X } from 'phosphor-react';

export interface ProfileLayoutEditorModalContentProps {
  onClose: () => void;
}

export function ProfileLayoutEditorModalContent(props: ProfileLayoutEditorModalContentProps) {
  const layoutImages = {
    'Default': '/group_8.png',
    'Mosaic': '/group_9.png',
    'Featured': '/group_10.png',
    'Spotlight': '/group_11.png',
  };
  return (
    <div className={tw(
      'absolute top-0 left-0 h-screen w-screen',
      'dark:bg-secondary-bg-dk bg-white',
      'text-primary-txt dark:text-primary-txt-dk',
      'p-5'
    )}>
      <div className='flex items-center justify-between w-full'>
        <span className='text-4xl'>Select Layout</span>
        <div className='flex items-center cursor-pointer' onClick={props.onClose}>
          <span className='mr-4 text-2xl'>Close</span>
          <X size={20} />
        </div>
      </div>
      <div className='w-full flex flex-wrap mt-4'>
        {['Default', 'Mosaic', 'Featured', 'Spotlight'].map((layout) => {
          // todo: check local edit context and remote value here
          const selected = layout === 'Default';
          return (
            <div
              className={tw(
                'relative cursor-pointer',
                'sm:w-full md:w-1/3 w-1/4 aspect-[3/2]',
                'mb-4 px-2'
              )}
              key={layout}
            >
              <div className={tw(
                'relative flex items-center justify-center',
                'rounded-lg border h-full w-full',
                selected ? 'border-link': 'border-white'
              )}>
                <span className='text-2xl'>{layout}</span>
                <div className='absolute top-0 left-0 h-full w-full rounded-lg'>
                  <div className="w-full h-full p-4">
                    <div className='relative w-full h-full'>
                      <Image
                        alt="layout type"
                        src={layoutImages[layout]}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}