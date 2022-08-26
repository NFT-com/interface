import { Button, ButtonType } from 'components/elements/Button';
import { NFTDetailContext } from 'components/modules/NFTDetail/NFTDetailContext';
import { Nft } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useContext } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export interface NftMemoProps {
  nft: PartialDeep<Nft>;
}

export const NftMemo = (props: NftMemoProps) => {
  const { nft } = props;
  const { alwaysBlack } = useThemeColors();
  const { address: currentAddress } = useAccount();

  const {
    editMemo,
    draftMemo,
    setDraftMemo,
    saveMemo,
    setEditMemo,
    clearDraft
  } = useContext(NFTDetailContext);

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
      <div className="max-w-full minmd:max-w-xl minxl:max-w-2xl flex items-center flex-col">
        <textarea
          className={tw(
            'text-base w-full resize-none mt-4',
            'text-left px-3 py-2 w-full rounded-xl font-medium h-32',
            'bg-[#F8F8F8]'
          )}
          maxLength={300}
          placeholder={currentAddress === nft?.wallet?.address && isNullOrEmpty(nft?.memo) && 'Enter memo (optional)'}
          value={draftMemo ?? nft?.memo ?? ''}
          onChange={e => {
            handleMemoChange(e);
          }}
          style={{
            color: alwaysBlack,
          }}
          disabled={!currentAddress === nft?.wallet?.address || !editMemo}
        />
        <div className='flex flex-row items-center py-2'>
          {currentAddress === nft?.wallet?.address && !editMemo &&
            <Button
              type={ButtonType.PRIMARY}
              label={'Edit'}
              onClick={() => {
                setEditMemo(true);
                setDraftMemo(nft?.memo ?? draftMemo ?? '');
              }}
            />
          }
          {currentAddress === nft?.wallet?.address && editMemo &&
            <div className='inline-flex space-x-4'>
              <Button
                type={ButtonType.PRIMARY}
                label={'Save'}
                onClick={() => {
                  saveMemo();
                  setEditMemo(false);
                  setDraftMemo('');
                } }
              />
              <Button
                type={ButtonType.SECONDARY}
                label={'Clear Draft'}
                onClick={() => {
                  clearDraft();
                } } />
            </div>
          }
        </div>
      </div>
    </div>
  );
};

