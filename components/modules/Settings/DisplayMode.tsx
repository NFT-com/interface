import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ProfileViewType } from 'graphql/generated/types';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useUpdateProfileViewMutation } from 'graphql/hooks/useUpdateProfileViewMutation';
import { Doppler, getEnvBool } from 'utils/env';

import AssociatedProfileSelect from './AssociatedProfileSelect';
import ConnectedCollections from './ConnectedCollections';

type DisplayModeProps = {
  selectedProfile: string;
};

export default function DisplayMode({ selectedProfile }: DisplayModeProps) {
  const [selected, setSelected] = useState('');
  const { profileData } = useProfileQuery(selectedProfile);
  const { updateProfileView } = useUpdateProfileViewMutation();

  useEffect(() => {
    if (profileData?.profile?.profileView === 'Collection') {
      setSelected('Collection');
    } else {
      setSelected('Gallery');
    }
  }, [profileData?.profile?.profileView, selectedProfile]);

  const handleChange = event => {
    setSelected(event.target.value);
    if (event.target.value !== ProfileViewType.Collection) {
      toast.success('Saved!');
      updateProfileView({ profileViewType: event.target.value, url: selectedProfile }).catch(() =>
        toast.error('Error')
      );
      gtag('event', 'Profile View Updated', {
        profile: selectedProfile,
        profileViewType: event.target.value
      });
    }
  };

  const handleAssociatedContract = () => {
    updateProfileView({ profileViewType: selected as ProfileViewType, url: selectedProfile }).catch(() =>
      toast.error('Error')
    );
    gtag('event', 'Profile View Updated', {
      profile: selectedProfile,
      profileViewType: selected
    });
  };

  return (
    <div id='display' className='mt-10 font-noi-grotesk'>
      <h2 className='mb-2 text-2xl font-bold tracking-wide text-black'>Select Display Mode</h2>
      <p className='text-[#6F6F6F]'>Choose how you plan to use your NFT Profile.</p>

      <div className='mt-4'>
        <input
          checked={selected === 'Gallery'}
          onChange={handleChange}
          className='form-radio h-4 w-4 border-2 border-[#D5D5D5] text-[#F9D963] focus:ring-[#F9D963]'
          type='radio'
          name='gallery-display'
          value='Gallery'
          id='Gallery'
        />
        <label className='ml-2 text-sm' htmlFor='Gallery'>
          NFT Gallery
        </label>
        <p className='mb-4 ml-6 mt-1 text-xs leading-6 text-[#6F6F6F]'>
          Display NFTs that you have collected and hold in any associated address.
        </p>

        <input
          checked={selected === 'Collection'}
          onChange={handleChange}
          className='form-radio h-4 w-4 border-2 border-[#D5D5D5] text-[#F9D963] focus:ring-[#F9D963]'
          type='radio'
          name='gallery-display'
          value='Collection'
          id='Collection'
        />
        <label className='ml-2 text-sm' htmlFor='Collection'>
          NFT Collection
        </label>
        <p className='ml-6 mt-1 text-xs leading-6 text-[#6F6F6F]'>
          Your NFT Profile will serve as the landing page for your NFT Collection.
        </p>
      </div>

      {selected === 'Collection' &&
        (getEnvBool(Doppler.NEXT_PUBLIC_OFFCHAIN_ASSOCIATION_ENABLED) ? (
          <AssociatedProfileSelect
            {...{
              profileId: profileData.profile.id,
              associatedContract: profileData.profile.associatedContract,
              onAssociatedContract: handleAssociatedContract
            }}
          />
        ) : (
          <ConnectedCollections {...{ selectedProfile }} />
        ))}
    </div>
  );
}
