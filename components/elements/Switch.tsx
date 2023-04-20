import { Dispatch, SetStateAction } from 'react';
import { Switch as HeadlessSwitch } from '@headlessui/react';

import { tw } from 'utils/tw';

interface SwitchProps {
  left: string;
  right: string;
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
}

export const Switch = ({ enabled, setEnabled, left, right }: SwitchProps) => {
  return (
    <HeadlessSwitch.Group as='div' className='flex items-center'>
      <HeadlessSwitch.Label as='span' className='mr-4'>
        <span className='text-sm font-medium text-black dark:text-white'>{left}</span>
      </HeadlessSwitch.Label>
      <HeadlessSwitch
        checked={enabled}
        onChange={setEnabled}
        className={tw(
          enabled ? 'bg-toggle-bg' : 'bg-accent-dk',
          'relative inline-flex h-6 w-11 flex-shrink-0 border-2',
          'cursor-pointer rounded-full border-transparent',
          'transition-colors duration-200 ease-in-out',
          'focus:toggle-bg focus:outline-none focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden='true'
          className={tw(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white',
            'transform shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </HeadlessSwitch>
      <HeadlessSwitch.Label as='span' className='ml-4'>
        <span className='text-sm font-medium text-black dark:text-white '>{right}</span>
      </HeadlessSwitch.Label>
    </HeadlessSwitch.Group>
  );
};
