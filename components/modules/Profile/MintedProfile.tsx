/* eslint-disable @next/next/no-img-element */
import { Footer } from 'components/elements/Footer';
import Loader from 'components/elements/Loader';
import { BannerWrapper } from 'components/modules/Profile/BannerWrapper';
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
    saving,
    draftProfileImg,
    draftHeaderImg,
    setDraftHeaderImg,
    setDraftProfileImg,
  } = useContext(ProfileEditContext);

  const { data: account } = useAccount();
  const { activeChain } = useNetwork();
  const { profileUris: myOwnedProfileTokenUris } = useMyNftProfileTokens();
  const { profileData } = useProfileQuery(profileURI);
  const userIsAdmin = myOwnedProfileTokenUris
    .map(fullUri => fullUri.split('/').pop())
    .includes(profileURI);

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
    <div className="relative h-screen w-full">
      <div className="w-full flex flex-col h-full">
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
                  {editMode && <div
                    className={tw(
                      'absolute bottom-5 xs:right-6 sm:right-3 md:right-4 right-4'
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
        <div className={tw(
          'flex flex-col',
          'max-w-7xl',
          isMobile ? 'mx-2' : 'sm:mx-2 lg:mx-8 mx-auto',
        )}>
          <div
            className={tw(
              'flex justify-start items-center sm:flex-col sm:items-start',
            )}
            style={{
              zIndex: 103,
            }}
          >
            <div className="sm:block flex items-end">
              <Dropzone
                accept={'image/*' ['.*']}
                disabled={!userIsAdmin || !editMode}
                onDrop={files => {
                  if (userIsAdmin) onDropProfile(files);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className={tw(
                    'relative outline-none',
                    userIsAdmin ? '' : 'cursor-default',
                    'h-52 w-52 md:h-32 md:w-32',
                  )}>
                    <input {...getInputProps()} />
                    {saving && <div
                      style={{ zIndex: 102 }}
                      className={tw(
                        'rounded-full absolute flex border bg-white/10',
                        'items-center justify-center h-full w-full',
                        'xs:mt-[-60px] sm:mt-[-67px] md:mt-[-120px] lg:mt-[-86px] mt-[-115px] absolute'
                      )}
                    >
                      <Loader/>
                    </div>}
                    {editMode && <div
                      style={{ zIndex: 102, }}
                      className={tw(
                        'absolute opacity-30 hover:opacity-100',
                        'xs:right-5 sm:right-4 md:right-4 lg:right-9 right-6',
                        'xs:bottom-[5.5rem] sm:bottom-24 md:bottom-[9.5rem] lg:bottom-[9.5rem] bottom-40'
                      )}
                    >
                      <PencilIconRounded alt="Edit mode" color="white" className='rounded-full h-10 w-10 md:h-6 md:w-6 cursor-pointer'/>
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
                        userIsAdmin && !isMobile && editMode ? 'hoverBlue' : '',
                        'xs:mt-[-60px] sm:mt-[-67px] md:mt-[-120px]  mt-[-115px] absolute'
                      )}
                      style={{ zIndex: 101, }}
                    />
                  </div>
                )}
              </Dropzone>
            </div>
            <MintedProfileInfo
              userIsAdmin={userIsAdmin}
              profileURI={profileURI}
            />
          </div>
          <main
            className={tw(
              'h-full',
              editMode ? 'sm:mt-28 md:mt-12 lg:mt-8 mt-12' : 'sm:mt-5',
              'w-full justify-start space-y-4 flex flex-col',
            )}
          >
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
          </main>
        </div>
        <div className="flex grow" />
        <div className='w-full '>
          <Footer />
        </div>
      </div>
    </div>
  );
}
