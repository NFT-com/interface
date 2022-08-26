import { Nft } from 'graphql/generated/types';
import { tw } from 'utils/tw';

import { useState } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { PartialDeep } from 'type-fest';

export interface NftMemoProps {
  nft: PartialDeep<Nft>;
}

export const NftMemo = (props: NftMemoProps) => {
  const { nft } = props;
  const { alwaysBlack } = useThemeColors();

  const [draftMemo, setDraftMemo] = useState('');

  const handleMemoChange = (event) => {
    let memoValue = event.target.value;
    if(memoValue.length === 0) {
      memoValue = '';
    }
    setDraftMemo(memoValue);
  };
  
  return (
    <div className='w-full p-4'>
      <span className='dark:text-white flex items-start'>Owner&apos;s Message</span>
      <div className="max-w-full minmd:max-w-xl minxl:max-w-2xl flex items-end flex-col">
        <textarea
          className={tw(
            'text-base w-full resize-none mt-4',
            'text-left px-3 py-2 w-full rounded-xl font-medium h-32',
          )}
          maxLength={300}
          placeholder="Enter memo (optional)"
          value={draftMemo ?? ''}
          onChange={e => {
            handleMemoChange(e);
          }}
          style={{
            color: alwaysBlack,
          }}
        />
      </div>
    </div>
  );
};

