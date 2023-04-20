import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'phosphor-react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { ProfileLayoutType } from 'graphql/generated/types';
import { tw } from 'utils/tw';

import { ProfileContext } from './ProfileContext';

export interface ProfileLayoutEditorModalContentProps {
  savedLayoutType: ProfileLayoutType;
  onClose: () => void;
}

export function ProfileLayoutEditorModalContent(props: ProfileLayoutEditorModalContentProps) {
  const layoutImages = {
    Default: '/group_8.webp',
    Mosaic: '/group_9.webp',
    Featured: '/group_10.webp',
    Spotlight: '/group_11.webp'
  };
  const { draftLayoutType, setDraftLayoutType } = useContext(ProfileContext);

  const [originalLayout, setOriginalLayout] = useState(null);

  useEffect(() => {
    if (originalLayout == null) {
      setOriginalLayout(draftLayoutType);
    }
  }, [draftLayoutType, originalLayout]);

  return (
    <div
      className={tw(
        'absolute left-0 top-0 h-[60%] w-screen overflow-scroll md:h-screen',
        'bg-white dark:bg-secondary-bg-dk',
        'text-primary-txt dark:text-primary-txt-dk',
        'p-5'
      )}
    >
      <div className='flex w-full items-center justify-between'>
        <span className='text-4xl'>Select Layout</span>
        <div
          className='flex cursor-pointer items-center'
          onClick={() => {
            setDraftLayoutType(originalLayout);
            props.onClose();
          }}
        >
          <span className='mr-4 text-2xl'>Close</span>
          <X size={20} />
        </div>
      </div>
      <div className='mt-4 flex w-full flex-wrap'>
        {[
          ProfileLayoutType.Default,
          ProfileLayoutType.Mosaic,
          ProfileLayoutType.Featured,
          ProfileLayoutType.Spotlight
        ].map(layout => {
          const selected = layout === (draftLayoutType ?? props.savedLayoutType);
          return (
            <div
              className={tw('relative cursor-pointer', 'aspect-[3/2] w-1/4 md:w-1/3 sm:w-full', 'mb-4 px-2')}
              onClick={() => {
                setDraftLayoutType(layout);
              }}
              key={layout}
            >
              <div
                className={tw(
                  'relative flex items-center justify-center',
                  'h-full w-full rounded-lg border',
                  selected ? 'border-link' : 'border-white'
                )}
                data-testid={`${layout}-layout-option2`}
              >
                <span className='text-2xl' data-testid={`${layout}-layout-option1`}>
                  {layout}
                </span>
                <div className='absolute left-0 top-0 h-full w-full rounded-lg'>
                  <div className='h-full w-full p-4'>
                    <div className='relative h-full w-full'>
                      <Image
                        data-testid={`${layout}-layout-option3`}
                        alt='layout type'
                        src={layoutImages[layout]}
                        layout='fill'
                        objectFit='contain'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div data-testid='ConfirmButton' className='mt-4 flex w-full flex-col items-center' onClick={props.onClose}>
        <Button
          size={ButtonSize.LARGE}
          label={'Confirm'}
          onClick={() => {
            props.onClose();
          }}
          type={ButtonType.PRIMARY}
        />
        <div
          className='mt-4 cursor-pointer text-link hover:underline'
          onClick={() => {
            setDraftLayoutType(originalLayout);
            props.onClose();
          }}
        >
          Cancel
        </div>
      </div>
    </div>
  );
}
