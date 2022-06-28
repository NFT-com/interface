/* eslint-disable @next/next/no-img-element */
import { Button, ButtonType } from 'components/elements/Button';
import { Footer } from 'components/elements/Footer';
import Loader from 'components/elements/Loader';
import { BannerWrapper } from 'components/modules/Profile/BannerWrapper';
import { useMyNFTsQuery } from 'graphql/hooks/useMyNFTsQuery';
import { useProfileNFTsQuery } from 'graphql/hooks/useProfileNFTsQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { Doppler,getEnvBool } from 'utils/env';
import { getEtherscanLink, isNullOrEmpty, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { LinksToSection } from './LinksToSection';
import { MintedProfileGallery } from './MintedProfileGallery';
import { MintedProfileInfo } from './MintedProfileInfo';
import { ProfileEditContext } from './ProfileEditContext';

import cameraIcon from 'public/camera.png';
import PencilIconRounded from 'public/pencil-icon-rounded.svg';
import { useContext, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import Dropzone from 'react-dropzone';
import { useAccount, useNetwork } from 'wagmi';

export interface MintedProfileProps {
  profileURI: string;
  addressOwner?: string;
}

export function MintedProfile(props: MintedProfileProps) {
  const { profileURI, addressOwner } = props;

  const {
    editMode,
    setEditMode,
    clearDrafts,
    saveProfile,
    saving,
    draftBio,
    draftProfileImg,
    draftHeaderImg,
    setDraftHeaderImg,
    setDraftProfileImg,
  } = useContext(ProfileEditContext);

  const { data: account } = useAccount();
  const { activeChain } = useNetwork();
  const { profileUris: myOwnedProfileTokenUris } = useMyNftProfileTokens();
  const { profileData } = useProfileQuery(profileURI);
  const userIsAdmin = getEnvBool(Doppler.NEXT_PUBLIC_CUSTOM_PROFILES_ENABLED)
    && myOwnedProfileTokenUris
      .map(fullUri => fullUri.split('/').pop())
      .includes(profileURI);

  const { mutate: mutateMyNFTs } = useMyNFTsQuery(20);
      
  const { nfts: publiclyVisibleNFTs, mutate: mutateProfileNFTs } = useProfileNFTsQuery(
    profileData?.profile?.id,
    // this query is only used to determine if the profile has any nfts, so we don't need to track the page info.
    // however, we should still fetch the full first page for caching purposes.
    20
  );

  useEffect(() => {
    mutateProfileNFTs();
  }, [editMode, mutateProfileNFTs]);

  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(account?.address);
  const hasGks = !isNullOrEmpty(ownedGKTokens);
      
  const onDropProfile = (files: Array<any>) => {
    if (files.length > 1) {
      alert('only 1 picture is allowed at a time');
    } else {
      setDraftProfileImg({
        preview: URL.createObjectURL(files[0]),
        raw: files[0],
      });
    }
  };

  const onDropHeader = (files: Array<any>) => {
    if (files.length > 1) {
      alert('only 1 picture is allowed at a time');
    } else {
      setDraftHeaderImg({
        preview: URL.createObjectURL(files[0]),
        raw: files[0],
      });
    }
  };

  return (
    <div className="relative h-screen">
      <BannerWrapper
        imageOverride={
          editMode ?
            (isNullOrEmpty(draftHeaderImg?.preview) ?
              profileData?.profile?.bannerURL :
              draftHeaderImg?.preview) :
            profileData?.profile?.bannerURL
        }
        loading={saving}
      >
        <div className='w-full h-full'>
          <Dropzone
            disabled={!userIsAdmin}
            accept={'image/*' ['.*']}
            onDrop={files => {
              if (userIsAdmin) {
                onDropHeader(files);
              }
            }}
          >
            {({ getRootProps, getInputProps, open }) => (
              <section>
                <div {...getRootProps()} style={{ outline: 'none' }}>
                  <input {...getInputProps()} />
                </div>
                {userIsAdmin && hasGks && (
                  editMode ?
                    <div
                      className={tw(
                        'flex absolute top-24 right-32 sm:right-28'
                      )}
                      style={{ zIndex: 49 }}
                    >
                      <div className='mr-4'>
                        <Button
                          type={ButtonType.PRIMARY}
                          label={'Save'}
                          onClick={() => {
                            analytics.track('Update Profile', {
                              ethereumAddress: account?.address,
                              profile: profileURI,
                              newProfile: draftProfileImg?.preview ? true : false,
                              newHeader: draftHeaderImg?.preview ? true : false,
                              newDescription: draftBio,
                            });

                            saveProfile();
                            setEditMode(false);
                            mutateProfileNFTs();
                            mutateMyNFTs();
                          }}
                        />
                      </div>
                      <Button
                        type={ButtonType.SECONDARY}
                        label={'Cancel'}
                        onClick={clearDrafts}
                      />
                    </div> :
                    <div
                      id="MintedProfileEditButtonContainer"
                      className={tw(
                        'absolute top-24 right-32 sm:right-11'
                      )}
                      style={{ zIndex: 49 }}
                    >
                      <Button
                        type={ButtonType.SECONDARY}
                        label={'Edit Profile'}
                        onClick={() => {
                          setEditMode(true);
                        }}
                      />
                    </div>)}
                {editMode && <div
                  className={tw(
                    'absolute bottom-5 right-32 sm:right-28'
                  )}
                  onClick={open}
                >
                  <PencilIconRounded alt="Edit banner" color="white" className='rounded-full h-10 w-10 cursor-pointer'/>
                </div>}
              </section>
            )}
          </Dropzone>
        </div>
      </BannerWrapper>
      <div
        className='flex justify-center items-center'
        style={{
          zIndex: 103,
        }}
      >
        <div className="flex items-center md:flex-col justify-center">
          <div className="flex items-end md:mt-[-30px] lg:mt-[-86px] mt-[-125px] mr-20 ml-[-4rem] md:ml-0 md:mr-0">
            <Dropzone
              accept={'image/*' ['.*']}
              disabled={!userIsAdmin || !editMode}
              onDrop={files => {
                if (userIsAdmin) onDropProfile(files);
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()} className={tw(
                    'relative outline-none',
                    userIsAdmin ? '' : 'cursor-default',
                    'h-60 w-60',
                  )}>
                    <input {...getInputProps()} />
                    {saving && <div
                      style={{ zIndex: 102 }}
                      className={tw(
                        'rounded-full absolute flex border bg-white/10',
                        'items-center justify-center h-full w-full'
                      )}
                    >
                      <Loader/>
                    </div>}
                    <img
                      src={
                        !isNullOrEmpty(draftProfileImg?.preview)
                          ? draftProfileImg?.preview
                          : profileData?.profile?.photoURL ??
                          (!getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED)
                            ? 'https://cdn.nft.com/profile-image-default.svg' :
                            cameraIcon.src)
                      }
                      alt="profilePicture"
                      draggable={false}
                      className={tw(
                        'object-center rounded-full',
                        'h-full w-full',
                        'shrink-0 aspect-square',
                        userIsAdmin && editMode ? 'cursor-pointer' : '',
                        userIsAdmin && !isMobile && editMode ? 'hoverBlue' : ''
                      )}
                      style={{ zIndex: 101, }}
                    />
                    {editMode && <div
                      className={tw(
                        'absolute bottom-5 -right-4 md:-right-8'
                      )}
                    >
                      <PencilIconRounded alt="Edit mode" color="white" className='rounded-full h-10 w-10 cursor-pointer'/>
                    </div>}
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <MintedProfileInfo
            userIsAdmin={userIsAdmin}
            profileURI={profileURI}
          />
        </div>
      </div>
      <main className={tw(
        'h-full',
        userIsAdmin ? 'justify-between' : 'justify-start space-y-4',
        'w-full justify-start space-y-4 flex flex-col')}>
        {
          (userIsAdmin && editMode) || (publiclyVisibleNFTs?.length ?? 0) > 0 ?
            <MintedProfileGallery
              profileURI={profileURI}
              ownedGKTokens={ownedGKTokens}
            /> :
            <>
              <div className={tw(
                'text-primary-txt dark:text-primary-txt-dk w-full flex justify-center flex-col mt-4',
                addressOwner !== account ? 'cursor-pointer ' : ''
              )}
              >
                <div className="mx-auto md:text-base lg:text-lg text-xl w-3/5 md:text-center text-left font-bold">
                  <div
                    onClick={() => {
                      if (addressOwner !== account?.address) {
                        window.open(
                          getEtherscanLink(activeChain?.id, addressOwner, 'address'),
                          '_blank'
                        );
                      }
                    }}
                    className="lg:text-sm text-lg text-center font-bold"
                  >
                    {addressOwner === account?.address ? 'You own this profile.' :'This profile is owned by ' + shortenAddress(addressOwner)}
                  </div>
                </div>
                <div className="mx-auto text-primary-txt dark:text-primary-txt-dk w-full flex justify-center flex-col">
                  <div className="lg:text-sm text-lg md:mb-8 mt-8 w-full text-center">
                    {addressOwner === account?.address ?
                      <p className='mx-8'>
                        As we roll out new features, you can return here for the latest NFT.com news, discover{' '}
                        other minted Genesis Keys and profiles in our community, and more.{' '}
                        We have so much in store!
                      </p>
                      :
                      <p className='mx-8'>
                        Do you want your own NFT.com Profile?<br />
                        Learn how to claim a profile for your own by visiting either NFT.com or our Support knowledge base.
                      </p>}
                  </div>
                  <div className="lg:mt-10 mt-24 w-full flex justify-center mb-24 sm:px-4">
                    <LinksToSection isAddressOwner={addressOwner === account?.address}/>
                  </div>
                </div>
              </div>
            </>
        }
        <div className='w-full items-center'>
          <Footer />
        </div>
      </main>
    </div>
  );
}
