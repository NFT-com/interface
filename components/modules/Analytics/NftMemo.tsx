import { useContext } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import Toast from 'components/elements/Toast';
import { NFTDetailContext } from 'components/modules/NFTDetail/NFTDetailContext';
import { Nft } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/format';
import { tw } from 'utils/tw';

import { useThemeColors } from 'styles/theme/useThemeColors';

export interface NftMemoProps {
  nft: PartialDeep<Nft>;
}

export const NftMemo = (props: NftMemoProps) => {
  const { nft } = props;
  const { alwaysBlack } = useThemeColors();
  const { address: currentAddress } = useAccount();

  const { editMemo, draftMemo, setDraftMemo, saveMemo, setEditMemo, clearDraft } = useContext(NFTDetailContext);

  const handleMemoChange = event => {
    let memoValue = event.target.value;
    if (memoValue.length === 0) {
      memoValue = '';
    }
    setDraftMemo(memoValue);
  };

  return (
    <>
      <div className='my-5 flex h-full w-full p-4'>
        <div className='flex h-full w-full'>
          <div className='h-full w-full'>
            <Toast />
            <div className='relative font-noi-grotesk text-[16px] font-medium leading-5 text-[#6A6A6A]'>
              Owner&apos;s Message
            </div>
            <textarea
              className={tw(
                'mt-2 w-full resize-none text-base',
                'h-32 w-full rounded-[10px] px-3 pb-2 text-left font-medium',
                'leading-5',
                'bg-[#F8F8F8]',
                'font-noi-grotesk text-[#1F2127]',
                `${editMemo ? 'border-2' : 'border-none'}`
              )}
              maxLength={300}
              placeholder={
                currentAddress === (nft?.wallet?.address ?? props.nft?.owner) && isNullOrEmpty(nft?.memo)
                  ? 'Enter message (optional)'
                  : undefined
              }
              value={draftMemo ?? nft?.memo ?? ''}
              onChange={e => {
                handleMemoChange(e);
              }}
              style={{
                color: alwaysBlack
              }}
              disabled={!currentAddress === (nft?.wallet?.address ?? props.nft?.owner) || !editMemo}
            />
            <div className='flex w-full flex-row items-center justify-center py-2 minxl:float-right minxl:-mb-12 minxl:w-1/4 minxl:flex-row-reverse'>
              {currentAddress === (nft?.wallet?.address ?? props.nft?.owner) && !editMemo && (
                <Button
                  size={ButtonSize.LARGE}
                  type={ButtonType.PRIMARY}
                  stretch
                  label={'Edit'}
                  onClick={() => {
                    setEditMemo(true);
                    setDraftMemo(draftMemo ?? nft?.memo ?? '');
                  }}
                />
              )}
              {currentAddress === (nft?.wallet?.address ?? props.nft?.owner) && editMemo && (
                <div className='inline-flex space-x-4'>
                  <Button
                    size={ButtonSize.LARGE}
                    type={ButtonType.PRIMARY}
                    label={'Save'}
                    onClick={() => {
                      setEditMemo(false);
                      saveMemo();
                    }}
                  />
                  <Button
                    size={ButtonSize.LARGE}
                    type={ButtonType.SECONDARY}
                    label={'Clear'}
                    onClick={() => {
                      clearDraft();
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
