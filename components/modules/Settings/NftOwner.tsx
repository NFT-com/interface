import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { XCircle } from 'phosphor-react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { Modal } from 'components/elements/Modal';
import Toast from 'components/elements/Toast';
import { SidebarProfileCard } from 'components/modules/Sidebar/SidebarProfileCard';
import { useMyProfilesQuery } from 'graphql/hooks/useMyProfilesQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useUpdateWalletProfileIdMutation } from 'graphql/hooks/useUpdateWalletProfileIdMutation';
import { useUser } from 'hooks/state/useUser';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { tw } from 'utils/tw';

import 'react-toastify/dist/ReactToastify.css';

type NftOwnerProps = {
  selectedProfile: string;
  isSidebar: boolean;
  showToastOnSuccess: boolean;
};

export default function NftOwner({ selectedProfile, isSidebar, showToastOnSuccess }: NftOwnerProps) {
  const { profileData } = useProfileQuery(selectedProfile);
  const { data: myProfiles } = useMyProfilesQuery();
  const { updateWalletProfileId } = useUpdateWalletProfileIdMutation();
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const { getHiddenProfileWithExpiry, setCurrentProfileUrl } = useUser();
  const [visible, setVisible] = useState(false);
  const [allProfiles, setAllProfiles] = useState([]);
  const [profilesToShow, setProfilesToShow] = useState([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (!profileData?.profile?.owner?.preferredProfile?.url) {
      updateWalletProfileId({ profileId: myOwnedProfileTokens[0]?.title }).catch(() => toast.error('Error'));
    }
    if (!isSidebar) {
      setSelected(profileData?.profile?.owner?.preferredProfile?.url || myOwnedProfileTokens[0]?.title);
    } else {
      setSelected(selectedProfile);
    }
  }, [profileData, myOwnedProfileTokens, updateWalletProfileId, selectedProfile, isSidebar]);

  useEffect(() => {
    setAllProfiles(myOwnedProfileTokens);
  }, [myOwnedProfileTokens]);

  const sortProfiles = () => {
    const hiddenProfile = getHiddenProfileWithExpiry();
    const hiddenIndex = allProfiles.findIndex(e => e.title === hiddenProfile);
    if (hiddenIndex !== -1) {
      allProfiles.splice(hiddenIndex, 1);
    }

    allProfiles.sort((a, b) => a.title.localeCompare(b.title));
    const index = allProfiles.findIndex(e => e.title === selected);
    allProfiles.unshift(...allProfiles.splice(index, 1));
    setProfilesToShow(allProfiles.slice(0, 3));
  };

  const searchHandler = query => {
    setAllProfiles(allProfiles.filter(item => item?.title?.toLowerCase().includes(query)));
    setProfilesToShow(allProfiles.slice(0, 3));
    if (!allProfiles.length) {
      setAllProfiles(myOwnedProfileTokens.filter(item => item?.title?.toLowerCase().includes(query)));
    }
    if (query === '') {
      setAllProfiles(myOwnedProfileTokens);
    }
  };

  useEffect(() => {
    setProfilesToShow(allProfiles.slice(0, 3));
  }, [allProfiles]);

  const LoadMoreHandler = () => {
    const currentLength = profilesToShow.length;
    const nextProfiles = allProfiles.slice(currentLength, currentLength + 3);
    setProfilesToShow([...profilesToShow, ...nextProfiles]);
  };

  const updateOwnerProfile = profileTitle => {
    setSelected(profileTitle);
    if (isSidebar) {
      setCurrentProfileUrl(profileTitle);
      setVisible(false);
    } else {
      const profileId = myProfiles?.myProfiles?.items?.find(profile => profile.url === profileTitle)?.id;
      updateWalletProfileId({ profileId })
        .then(() => {
          toast.success('Saved!');
        })
        .catch(() => toast.error('Error'));
    }
  };

  return (
    <div id='owner' className='font-noi-grotesk'>
      {showToastOnSuccess && <Toast />}
      {!isSidebar && (
        <>
          <h2 className='mb-2 text-2xl font-bold tracking-wide text-black'>Select Primary NFT Profile</h2>
          <p className='mb-4 text-[#6F6F6F]'>
            Select the primary NFT Profile you want associated with your Ethereum address. This profile will display as
            the “owner” for NFTs and collections owned by the address which owns NFT Profile.
          </p>
        </>
      )}
      {selected !== '' && (
        <div className={tw(!isSidebar && 'mb-4')}>
          <SidebarProfileCard
            onClick={() => {
              setVisible(true);
              sortProfiles();
            }}
            isSidebar={isSidebar}
            opensModal
            showSwitch={myOwnedProfileTokens && myOwnedProfileTokens.length > 1}
            profile={myOwnedProfileTokens?.find(t => t.title === selected)}
          />
        </div>
      )}

      {isSidebar ? (
        <Modal
          visible={visible}
          loading={false}
          title={''}
          onClose={() => {
            setVisible(false);
          }}
          hideX
          bgColor='white'
          fullModal
          pure
        >
          <div className='maxlg:h-max h-screen max-w-full rounded-none bg-white px-4 pb-10 text-left minlg:m-auto minlg:mt-24 minlg:h-max minlg:max-w-[458px] minlg:rounded-[10px]'>
            <div className='m-auto max-w-lg pt-16 font-noi-grotesk minlg:relative lg:max-w-md'>
              <div className='absolute right-4 top-4 h-6 w-6 rounded-full bg-[#F9D963] hover:cursor-pointer minlg:right-1'></div>
              <XCircle
                onClick={() => setVisible(false)}
                className='absolute right-3 top-3 hover:cursor-pointer minlg:right-0'
                size={32}
                color='black'
                weight='fill'
              />
              <div>
                <h2 className='mb-10 text-4xl font-bold tracking-wide'>Switch To Profile</h2>
                <input
                  onChange={event => searchHandler(event.target.value.toLowerCase())}
                  className='focus:shadow-outline mb-4 w-full appearance-none rounded-[10px] border border-[#D5D5D5] px-3 py-2 leading-tight text-gray-700 shadow placeholder:text-sm focus:outline-none'
                  id='currentAddress'
                  type='text'
                  placeholder='Profile Name'
                />
              </div>
              <div className='maxlg:max-h-[320px] max-h-[350px] overflow-auto'>
                <div>
                  {profilesToShow &&
                    profilesToShow?.map(profile => {
                      return (
                        <div className='mb-4' key={profile?.title}>
                          <SidebarProfileCard
                            isSelected={selected === profile.title}
                            message={selected === profile.title && 'Current Profile'}
                            onClick={selected !== profile.title && updateOwnerProfile}
                            profile={profile}
                          />
                        </div>
                      );
                    })}
                </div>

                {!allProfiles.length && <p className='mb-4 text-[#6F6F6F]'>No profiles found. Please try again.</p>}

                <Link href='/app/mint-profiles'>
                  <Button
                    type={ButtonType.PRIMARY}
                    size={ButtonSize.LARGE}
                    label='Get a New Profile'
                    onClick={() => null}
                    stretch
                  />
                </Link>

                {allProfiles.length > profilesToShow.length ? (
                  <Button
                    type={ButtonType.PRIMARY}
                    size={ButtonSize.LARGE}
                    label='Load More'
                    onClick={() => LoadMoreHandler()}
                    stretch
                  />
                ) : null}
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        <Modal
          visible={visible}
          loading={false}
          title={''}
          onClose={() => {
            setVisible(false);
          }}
          hideX
          bgColor='white'
          fullModal
          pure
        >
          <div className='maxlg:h-max h-screen max-w-full rounded-none bg-white px-4 pb-10 text-left minlg:m-auto minlg:mt-24 minlg:h-max minlg:max-w-[458px] minlg:rounded-[10px]'>
            <div className='m-auto max-w-lg pt-16 font-noi-grotesk minlg:relative lg:max-w-md'>
              <div className='absolute right-4 top-4 h-6 w-6 rounded-full bg-[#F9D963] hover:cursor-pointer minlg:right-1'></div>
              <XCircle
                onClick={() => setVisible(false)}
                className='absolute right-3 top-3 hover:cursor-pointer minlg:right-0'
                size={32}
                color='black'
                weight='fill'
              />
              <div>
                <h2 className='mb-10 text-4xl font-bold tracking-wide'>Select NFT Profile</h2>
                <p className='mb-4 text-[#6F6F6F]'>
                  Select the primary NFT Profile you want associated with your Ethereum address. This profile will
                  display as the “owner” for NFTs and collections owned by the address which owns NFT Profile.
                </p>
                <input
                  onChange={event => searchHandler(event.target.value.toLowerCase())}
                  className='focus:shadow-outline mb-4 w-full appearance-none rounded-[10px] border border-[#D5D5D5] px-3 py-2 leading-tight text-gray-700 shadow placeholder:text-sm focus:outline-none'
                  id='currentAddress'
                  type='text'
                  placeholder='Profile name'
                />
              </div>
              <div className='maxlg:max-h-[320px] hideScroll max-h-[350px] overflow-auto'>
                <div>
                  {profilesToShow &&
                    profilesToShow?.map(profile => {
                      return (
                        <div className='mb-4' key={profile?.title}>
                          <SidebarProfileCard
                            isSelected={selected === profile.title}
                            message={selected === profile.title && 'Current Owner'}
                            onClick={selected !== profile.title && updateOwnerProfile}
                            profile={profile}
                          />
                        </div>
                      );
                    })}
                </div>

                {!allProfiles.length && <p className='mb-4 text-[#6F6F6F]'>No profiles found. Please try again.</p>}

                <Link href='/app/mint-profiles'>
                  <Button
                    type={ButtonType.PRIMARY}
                    size={ButtonSize.LARGE}
                    label='Get a New Profile'
                    onClick={() => null}
                    stretch
                  />
                </Link>

                {allProfiles.length > profilesToShow.length ? (
                  <Button
                    type={ButtonType.PRIMARY}
                    size={ButtonSize.LARGE}
                    label='Load More'
                    onClick={() => LoadMoreHandler()}
                    stretch
                  />
                ) : null}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
