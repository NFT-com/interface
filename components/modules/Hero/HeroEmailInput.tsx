import { Button, ButtonType } from 'components/Button/Button';
import helpers from 'utils/utils';

import { useState } from 'react';

export interface HeroEmailInputProps {
  center?: boolean
}

export function HeroEmailInput(props: HeroEmailInputProps) {
  const [email, setEmail] = useState('');
  return (
    <div
      className={helpers.joinClasses(
        'rounded-xl p-8 flex flex-col',
        props.center === true ? 'items-center px-20' : ''
      )}
      style={{ backgroundColor: '#11141D' }}
    >
      <div className='text-2xl font-medium'>Input Email for Whitepaper</div>
      <input
        className={
          'mt-8 px-3 py-3 text-lg text-left px-3 py-3 w-full rounded-lg font-medium'
        }
        style={{
          color: 'black'
        }}
        value={email}
        placeholder='Enter email'
        onChange={async e => {
          setEmail(e.target.value);
        }}
      />
      <div className='mt-8'>
        <Button
          type={ButtonType.PRIMARY}
          label={'Subscribe'}
          onClick={() => {
            // TODO: send email mutation
          }}
        />
      </div>
    </div>
  );
}