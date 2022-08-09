import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useUpdateProfileViewMutation } from 'graphql/hooks/useUpdateProfileViewMutation';

import ConnectedAccounts from './ConnectedAccounts';
import { RejectedEvent } from './ConnectedAccounts';
import ConnectedCollections from './ConnectedCollections';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type Address = {
  chainAddr: string;
}

type DisplayModeProps = {
  selectedProfile: string;
  associatedAddresses : {
    pending: Address[];
    accepted: Address[];
    denied: RejectedEvent[]
  };
};

export default function DisplayMode({ selectedProfile, associatedAddresses }: DisplayModeProps) {
  const [selected, setSelected] = useState('');
  const { profileData } = useProfileQuery(selectedProfile);
  const { updateProfileView } = useUpdateProfileViewMutation();

  useEffect(() => {
    if(profileData?.profile?.profileView === 'Collection'){
      setSelected('Collection');
    } else {
      setSelected('Gallery');
    }
  }, [profileData?.profile?.profileView, selectedProfile]);

  const handleChange = event => {
    toast.success('Saved!');
    setSelected(event.target.value);
    updateProfileView({ profileViewType: event.target.value, url: selectedProfile }).catch(() => toast.error('Error'));
  };

  return (
    <div id="display" className='mt-10 font-grotesk'>
      <h2 className='text-black mb-2 font-bold md:text-2xl text-4xl tracking-wide'>Display Mode</h2>
      <p className='mb-4 text-[#6F6F6F]'>Select what your profile will show to the public.</p>
  
      <div className='mt-4'>
        <input checked={selected === 'Gallery'} onChange={handleChange} className="form-radio text-[#F9D963] border-2 border-[#D5D5D5] w-4 h-4 focus:ring-[#F9D963]" type="radio" name="gallery-display" value='Gallery' id='Gallery' />
        <label className="ml-3" htmlFor="Gallery">
            Personal Gallery
        </label>
        <p className='md:mt-2 mt-0 mb-4 text-xs text-[#6F6F6F] md:ml-6 ml-7'>
          Your profile will display the NFTs in your wallet.
        </p>

        <input checked={selected === 'Collection'} onChange={handleChange} className="form-radio text-[#F9D963] border-2 border-[#D5D5D5] w-4 h-4 focus:ring-[#F9D963]" type="radio" name="gallery-display" value='Collection' id='Collection' />
        <label className="ml-3" htmlFor="Collection">
          NFT Collection
        </label>
        <p className='md:mt-2 mt-0 mb-4 text-xs text-[#6F6F6F] md:ml-6 ml-7'>
          Your profile will act as an official landing page for your deployed NFT Collection.
        </p>
      </div>

      {selected === 'Collection' &&
        <ConnectedCollections {...{ selectedProfile }} />
      }
      <ConnectedAccounts {...{ associatedAddresses, selectedProfile }} />
    </div>
  );
}