import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CheckCircle, GasPump, Info, Warning } from 'phosphor-react';
import { useAccount } from 'wagmi';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { isNullOrEmpty } from 'utils/format';
import { sameAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

type SettingsFormProps = {
  buttonText: string;
  inputVal: string;
  changeHandler: (e) => void;
  submitHandler: () => void;
  isAssociatedOrPending?: boolean;
};

export default function SettingsForm({
  buttonText,
  inputVal,
  changeHandler,
  submitHandler,
  isAssociatedOrPending
}: SettingsFormProps) {
  const [error, setError] = useState(false);
  const { address: currentAddress } = useAccount();
  const isSelf = sameAddress(currentAddress, inputVal);

  useEffect(() => {
    if (isAssociatedOrPending) {
      setError(true);
    } else if (isSelf) {
      setError(true);
    } else if (ethers.utils.isAddress(inputVal)) {
      setError(false);
    } else {
      setError(true);
    }
  }, [inputVal, isAssociatedOrPending, error, isSelf]);

  const getContent = useCallback(() => {
    if (isNullOrEmpty(inputVal)) {
      return null;
    }

    if (isSelf && error) {
      return (
        <>
          <p className='mt-1 font-noi-grotesk text-xs text-[#DD0F70]'>This is your current address</p>
          <Warning
            size={25}
            className='absolute right-0 top-[31%] mr-3 box-border -translate-y-1/2 rounded-full'
            weight='fill'
            color='#DD0F70'
          />
        </>
      );
    }

    if (isAssociatedOrPending && error) {
      return (
        <>
          <p className='mt-1 font-noi-grotesk text-xs text-[#D8771F]'>Request exists on chain</p>
          <Info
            size={25}
            className='absolute right-0 top-[31%] mr-3 box-border -translate-y-1/2 rounded-full'
            weight='fill'
            color='#D8771F'
          />
        </>
      );
    }

    if (error) {
      return (
        <>
          <p className='mt-1 font-noi-grotesk text-xs text-[#DD0F70]'>Address is not valid</p>
          <Warning
            size={25}
            className='absolute right-0 top-[31%] mr-3 box-border -translate-y-1/2 rounded-full'
            weight='fill'
            color='#DD0F70'
          />
        </>
      );
    }

    return (
      <>
        <p className='mt-1 font-noi-grotesk text-xs text-[#0E8344]'>Valid wallet address</p>
        <CheckCircle
          size={25}
          className='absolute right-0 top-[31%] mr-3 box-border -translate-y-1/2 rounded-full'
          color='green'
          weight='fill'
        />
      </>
    );
  }, [error, inputVal, isSelf, isAssociatedOrPending]);

  return (
    <div className='w-full'>
      <div className='relative mb-3'>
        <input
          value={inputVal}
          onChange={e => changeHandler(e.target.value)}
          className={tw(
            'focus:shadow-outline box-border w-full appearance-none rounded-[10px] border px-3 py-2 pr-10 leading-tight text-gray-700 shadow  placeholder:font-mono placeholder:text-sm focus:outline-none',
            inputVal === ''
              ? 'border-[#D5D5D5]'
              : error
              ? 'border-[#DD0F70] focus:border-[#DD0F70] focus:ring-1 focus:ring-[#DD0F70]'
              : 'border-[#0E8344] focus:border-[#0E8344] focus:ring-1 focus:ring-[#0E8344]'
          )}
          id='currentAddress'
          type='text'
          placeholder='0x0000...0000'
        />

        {getContent()}
      </div>

      <Button
        type={ButtonType.PRIMARY}
        size={ButtonSize.LARGE}
        label={buttonText}
        stretch
        disabled={error || inputVal === '' || isAssociatedOrPending}
        onClick={() => submitHandler()}
      />
      <div className='mt-2 flex items-center justify-center font-noi-grotesk text-sm text-[#6F6F6F]'>
        <GasPump size={20} weight='fill' />
        <p className='ml-1'>
          This action will require a <span className='border-b	border-dashed border-[#6F6F6F]'>gas fee.</span>
        </p>
      </div>
    </div>
  );
}
