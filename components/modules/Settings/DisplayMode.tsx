import ConnectedAccounts from './ConnectedAccounts';

import { useState } from 'react';

type Address = {
  chainAddr: string;
}

type DisplayModeProps = {
  selectedProfile: string;
  associatedAddresses : {
    pending: Address[];
    accepted: Address[];
  };
  removeHandler: (type: string, address: string) => void
};

export default function DisplayMode({ selectedProfile, associatedAddresses, removeHandler }: DisplayModeProps) {
  const [selected, setSelected] = useState('personal');
  const handleChange = event => {
    setSelected(event.target.value);
  };
  return (
    <div id="display" className='mt-10 font-grotesk'>
      <h2 className='text-black mb-2 font-bold md:text-2xl text-4xl tracking-wide'>Display Mode</h2>
      <p className='mb-4 text-[#6F6F6F]'>Select what your profile will show to the public.</p>
  
      <div className='mt-4'>
        <input checked={selected === 'personal'} onChange={handleChange} className="form-radio text-[#F9D963] border-2 border-[#D5D5D5] w-4 h-4 focus:ring-[#F9D963]" type="radio" name="gallery-display" value='personal' id='personal' />
        <label className="ml-3" htmlFor="personal">
            Personal Gallery
        </label>
        <p className='md:mt-2 mt-0 mb-4 text-xs text-[#6F6F6F] md:ml-6 ml-7'>
          Your profile will display the NFTs in your wallet.
        </p>

        <input checked={selected === 'collection'} onChange={handleChange} className="form-radio text-[#F9D963] border-2 border-[#D5D5D5] w-4 h-4 focus:ring-[#F9D963]" type="radio" name="gallery-display" value='collection' id='collection' />
        <label className="ml-3" htmlFor="collection">
          NFT Collection
        </label>
        <p className='md:mt-2 mt-0 mb-4 text-xs text-[#6F6F6F] md:ml-6 ml-7'>
          Your profile will act as an official landing page for your deployed NFT Collection.
        </p>
      </div>
      {selected === 'personal' && <ConnectedAccounts {...{ associatedAddresses, removeHandler, selectedProfile }} />}
    </div>
  );
}