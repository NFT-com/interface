import { isNullOrEmpty } from 'utils/format';
import { tw } from 'utils/tw';

import { useThemeColors } from 'styles/theme/useThemeColors';

export interface AddressInputProps {
  value: string;
  onChange: (val: string) => void;
  error: boolean;
}

export function AddressInput(props: AddressInputProps) {
  const { alwaysBlack } = useThemeColors();

  return (
    <div className='flex flex-row rounded-xl bg-white p-6 dark:bg-primary-txt'>
      <div className='flex grow basis-3/5'>
        <input
          type='text'
          className={tw(
            'min-w-0 border text-lg',
            'rounded-xl px-3 py-3 text-left font-medium',
            'w-full',
            props.error ? 'border-2 border-red-500' : ''
          )}
          placeholder='0x0000...1234'
          autoFocus={true}
          value={props.value ?? ''}
          onChange={e => {
            const validReg = /^[0-9a-zA-Z]*$/;
            if (isNullOrEmpty(e.target.value)) {
              props.onChange(null);
            } else if (validReg.test(e.target.value)) {
              props.onChange(e.target.value);
            } else {
              e.preventDefault();
            }
          }}
          style={{
            color: alwaysBlack
          }}
        />
      </div>
    </div>
  );
}
