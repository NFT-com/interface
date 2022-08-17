import { tw } from 'utils/tw';

import { ethers } from 'ethers';
import { CheckCircle, GasPump, Info,Warning } from 'phosphor-react';
import { useEffect, useState } from 'react';

type SettingsFormProps = {
  buttonText: string;
  inputVal: string
  changeHandler: (e) => void
  submitHandler: () => void
  isAssociatedOrSelf?: boolean
};

export default function SettingsForm({ buttonText, inputVal, changeHandler, submitHandler, isAssociatedOrSelf }: SettingsFormProps) {
  const [error, setError] = useState(false);

  useEffect(() => {
    if(isAssociatedOrSelf){
      setError(true);
    } else if(ethers.utils.isAddress(inputVal)){
      setError(false);
    } else {
      setError(true);
    }
  }, [inputVal, isAssociatedOrSelf, error]);

  return (
    <div className='w-full'>
      <div className='relative'>
        <input value={inputVal} onChange={(e) => changeHandler(e.target.value)}
          className={tw('box-border shadow appearance-none border rounded-[10px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  placeholder:font-mono placeholder:text-sm pr-10',
            inputVal === '' ? 'border-[#D5D5D5]' : error ? 'border-[#DD0F70] focus:ring-[#DD0F70] focus:ring-1 focus:border-[#DD0F70]' : 'border-[#0E8344] focus:ring-[#0E8344] focus:ring-1 focus:border-[#0E8344]',
          )}
          id="currentAddress" type="text" placeholder="0x0000...0000" />

        {inputVal === ''
          ? null
          : (
            error
              ?
              (
                isAssociatedOrSelf ?
                  <>
                    <p className='text-[#D8771F] mt-1 text-xs font-grotesk'>Request exists on chain</p>
                    <Info size={25} className='mr-3 rounded-full absolute box-border top-[31%] -translate-y-1/2 right-0' weight="fill" color='#D8771F' />
                  </>
                  :
                  <>
                    <p className='text-[#DD0F70] mt-1 text-xs font-grotesk'>Address is not valid</p>
                    <Warning size={25} className='mr-3 rounded-full absolute box-border top-[31%] -translate-y-1/2 right-0' weight="fill" color='#DD0F70' />
                  </>
              )
              :
              (
                <>
                  <p className='text-[#0E8344] mt-1 text-xs font-grotesk'>Valid wallet address</p>
                  <CheckCircle size={25} className='mr-3 rounded-full absolute box-border top-[31%] -translate-y-1/2 right-0' color='green' weight="fill" />
                </>
              )
          )}
      </div>
  
      <button onClick={() => submitHandler()} disabled={error || inputVal === '' || isAssociatedOrSelf} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] font-bold tracking-wide focus:outline-none focus:shadow-outline w-full mt-3 disabled:bg-[#B6B6B6] disabled:text-white disabled:border-[#6F6F6F] disabled:border disabled:hover:cursor-not-allowed" type="button">
        {buttonText}
      </button>
      <div className='flex items-center font-grotesk text-[#6F6F6F] justify-center mt-2 text-sm'>
        <GasPump size={20} weight="fill" />
        <p className='ml-1'>This action will require a <span className='border-dashed	border-b border-[#6F6F6F]'>gas fee.</span></p>
      </div>
    </div>
  );
}
  