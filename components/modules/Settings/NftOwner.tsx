import 'react-toastify/dist/ReactToastify.css';

import { Modal } from 'components/elements/Modal';
import Toast from 'components/elements/Toast';
import ProfileCard from 'components/modules/Sidebar/ProfileCard';
import { useMyProfilesQuery } from 'graphql/hooks/useMyProfilesQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useUpdateWalletProfileIdMutation } from 'graphql/hooks/useUpdateWalletProfileIdMutation';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { Doppler, getEnvBool } from 'utils/env';

import { XCircle } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type NftOwnerProps = {
  selectedProfile: string
}

export default function NftOwner({ selectedProfile }: NftOwnerProps) {
  const { profileData } = useProfileQuery(selectedProfile);
  const { data: myProfiles } = useMyProfilesQuery();
  const { updateWalletProfileId } = useUpdateWalletProfileIdMutation();
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const [visible, setVisible] = useState(false);
  const [allProfiles, setAllProfiles] = useState([]);
  const [profilesToShow, setProfilesToShow] = useState([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    setSelected(profileData?.profile?.owner?.preferredProfile?.url);
  }, [profileData]);
  
  useEffect(() => {
    setAllProfiles(myOwnedProfileTokens);
  }, [myOwnedProfileTokens]);

  useEffect(() => {
    allProfiles.sort((a, b) => a.title.localeCompare(b.title));
    const index = allProfiles.findIndex((e) => e.title === selected);
    allProfiles.unshift(...allProfiles.splice(index, 1));
    setProfilesToShow(allProfiles.slice(0, 3));
  }, [myOwnedProfileTokens, allProfiles, selected]);

  const searchHandler = (query) => {
    setAllProfiles(allProfiles.filter((item) => item.title.includes(query)));

    if(query === ''){
      setAllProfiles(myOwnedProfileTokens);
    }
  };

  const LoadMoreHandler = () => {
    const currentLength = profilesToShow.length;
    const nextProfiles = allProfiles.slice(currentLength, currentLength + 3);
    setProfilesToShow([...profilesToShow, ...nextProfiles]);
  };

  const updateOwnerProfile = (profileTitle) => {
    setSelected(profileTitle);
    const profileId = myProfiles?.myProfiles?.items?.find((profile) => profile.url === profileTitle).id;
    updateWalletProfileId({ profileId: profileId }).then(() => toast.success('Saved!')).catch(() => toast.error('Error'));
  };

  return (
    <div id="owner" className='md:mt-10 mt-0 font-grotesk'>
      <h2 className='text-black mb-2 font-bold md:text-2xlz text-4xl tracking-wide'>NFT Owner</h2>
      <p className='mb-4 text-[#6F6F6F]'>Select which profile will display as the owner for your NFTs and collections.</p>

      {selected !== '' && <ProfileCard onClick={setVisible} opensModal showSwitch profile={myOwnedProfileTokens?.find(t => t.title === selected)} />}
      
      <Modal
        visible={visible}
        loading={false}
        title={'Request Modal'}
        onClose={() => {
          setVisible(false);
        }}
        fullModal
        bgColor='white'
        pure
      >
        <div className='w-full h-screen bg-white text-left px-4'>
          <Toast />
          <XCircle onClick={() => setVisible(false)} className='absolute top-5 right-3 hover:cursor-pointer' size={32} color="black" weight="fill" />
          <div className='pt-28 font-grotesk lg:max-w-md max-w-lg m-auto'>
            <div>
              <h2 className='text-4xl tracking-wide font-bold mb-10'>Set Owner</h2>
              <p className='text-[#6F6F6F] mb-4'>Select the profile to sign-in with by default.</p>
              <input onChange={event => searchHandler(event.target.value.toLowerCase())} className="shadow appearance-none border rounded-[10px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 border-[#D5D5D5] placeholder:text-sm" id="currentAddress" type="text" placeholder="Profile Name" />
            </div>
            <div>
              {profilesToShow && profilesToShow?.map((profile) => {
                return (
                  <ProfileCard isSelected={selected === profile.title} message={selected === profile.title && 'Current Owner'} key={profile?.title} onClick={updateOwnerProfile} profile={profile} />
                );
              })}
            </div>
            {getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_FACTORY_ENABLED) && (
              <button className="bg-black text-base font-bold tracking-normal mb-4 text-[#F9D963] py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full" type="button">
              Get a New Profile
              </button>
            )}
            {allProfiles.length > 3
              ?
              (
                <button onClick={() => LoadMoreHandler()} className="bg-[#F9D963] font-bold tracking-normal hover:bg-[#fcd034] text-base text-black py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline w-full" type="button">
              Load More
                </button>
              )
              : null
            }
          </div>
        </div>
      </Modal>
    </div>
  );
}
