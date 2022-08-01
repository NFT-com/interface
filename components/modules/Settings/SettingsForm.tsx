import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';

import { BigNumber } from 'ethers';
import { GasPump } from 'phosphor-react';
import { useRef } from 'react';
import { useAccount } from 'wagmi';

type SettingsFormProps = {
  type: string;
  buttonText: string;
  selectedProfile?: string;
};

export default function NftOwner({ type, buttonText, selectedProfile }: SettingsFormProps) {
  const { address: currentAddress } = useAccount();
  const addressRef = useRef(null);
  const { nftResolver, nftProfile } = useAllContracts();
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const profileToken = myOwnedProfileTokens.find(a => a.title === selectedProfile);
  
  const submitHandler = async (e) => {
    e.preventDefault();
    if(type === 'request'){
      const address = addressRef.current.value;
      await nftResolver.addAssociatedAddresses([{ cid: 0, chainAddr: address }], selectedProfile).then((res) => console.log(res));
      addressRef.current.value = '';
    } else {
      const address = addressRef.current.value;
      await nftProfile.transferFrom(currentAddress, address, BigNumber.from(profileToken)).then((res) => console.log(res));
      addressRef.current.value = '';
    }
  };

  return (
    <form className='md:w-full w-3/4'>
      <input ref={addressRef} className="shadow appearance-none border rounded-[10px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3 border-[#D5D5D5] placeholder:font-mono placeholder:text-sm" id="currentAddress" type="text" placeholder="0x0000...0000" />
  
      <button onClick={(e) => submitHandler(e)} className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full" type="button">
        {buttonText}
      </button>
      <div className='flex items-center font-grotesk text-blog-text-reskin justify-center mt-2 text-sm'>
        <GasPump size={20} weight="fill" />
        <p className='ml-1'>This action will require a gas fee.</p>
      </div>
    </form>
  );
}
  