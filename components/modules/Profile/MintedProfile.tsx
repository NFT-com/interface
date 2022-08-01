/* eslint-disable @next/next/no-img-element */
import { Footer } from 'components/elements/Footer';
import Loader from 'components/elements/Loader';
import { BannerWrapper } from 'components/modules/Profile/BannerWrapper';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { Doppler, getEnvBool } from 'utils/env';
import { getEtherscanLink, isNullOrEmpty, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { LinksToSection } from './LinksToSection';
import { MintedProfileGallery } from './MintedProfileGallery';
import { MintedProfileInfo } from './MintedProfileInfo';
import { ProfileContext } from './ProfileContext';
import { ProfileScrollContextProvider } from './ProfileScrollContext';

import { BigNumber } from 'ethers';
import cameraIcon from 'public/camera.png';
import PencilIconRounded from 'public/pencil-icon-rounded.svg';
import { useContext, useState } from 'react';
import { isMobile } from 'react-device-detect';
import Dropzone from 'react-dropzone';
import { useAccount, useNetwork } from 'wagmi';

export interface MintedProfileProps {
  profileURI: string;
  addressOwner?: string;
}

export function MintedProfile(props: MintedProfileProps) {
  const { profileURI, addressOwner } = props;
  const [isPicturedHovered, setIsPicturedHovered] = useState(false);

  const {
    editMode,
    saving,
    draftProfileImg,
    draftHeaderImg,
    setDraftHeaderImg,
    setDraftProfileImg,
    userIsAdmin,
    publiclyVisibleNftCount
  } = useContext(ProfileContext);

  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const { profileData } = useProfileQuery(profileURI);

  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(currentAddress);
      
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
    <ProfileScrollContextProvider>
      <div className='w-full'>
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
                      'absolute bottom-5 right-5 minmd:right-4'
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
      </div>
      <div className={tw(
        'flex flex-col',
        'max-w-7xl min-w-[60%]',
        isMobile ? 'mx-2' : 'mx-2 minmd:mx-8 minxl:mx-auto',
      )}>
        <div
          className={tw(
            'flex flex-col minmd:flex-row justify-start items-start minmd:items-center',
          )}
          style={{
            zIndex: 103,
          }}
        >
          <div
            className="block minmd:flex items-end"
            onMouseEnter={() => setIsPicturedHovered(true)}
            onMouseLeave={() => setIsPicturedHovered(false)}>
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
                  'h-32 minlg:h-52 w-32 minlg:w-52 ',
                )}>
                  <input {...getInputProps()} />
                  {saving && <div
                    style={{ zIndex: 102 }}
                    className={tw(
                      'rounded-full absolute flex border bg-white/10',
                      'items-center justify-center h-full w-full',
                      'mt-[-67px] minmd:mt-[-120px] minlg:mt-[-115px] absolute'
                    )}
                  >
                    <Loader/>
                  </div>}
                  {editMode && <div
                    style={{ zIndex: 102, }}
                    className={tw(
                      isPicturedHovered ? 'opacity-100' : 'opacity-30',
                      'absolute right-4 minlg:right-9 mnxl:right-6',
                      'bottom-24 minmd:bottom-[9.5rem] minlg:bottom-[9.5rem] minxl:bottom-40'
                    )}
                  >
                    <PencilIconRounded alt="Edit mode" color="white" className='rounded-full h-6 minlg:h-10 w-6 minlg:w-10  cursor-pointer'/>
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
                      'mt-[-67px] minmd:mt-[-120px] minlg:mt-[-115px] absolute'
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
        <div
          className={tw(
            'h-full',
            editMode ? 'mt-28 minmd:mt-16' : 'mt-5 minmd:mt-0',
            'w-full justify-start space-y-4 flex flex-col',
          )}
        >
          {
            (userIsAdmin && editMode) || (publiclyVisibleNftCount > 0) ?
              <MintedProfileGallery
                profileURI={profileURI}
                ownedGKTokens={ownedGKTokens?.map(token => BigNumber.from(token?.id?.tokenId ?? 0).toNumber())}
              /> :
              <>
                <div className={tw(
                  'text-primary-txt dark:text-primary-txt-dk w-full flex justify-center flex-col mt-4',
                  addressOwner !== currentAddress ? 'cursor-pointer ' : ''
                )}
                >
                  <div className="mx-auto text-base minlg:text-lg minxl:text-xl w-3/5 text-center minlg:text-left font-bold">
                    <div
                      onClick={() => {
                        if (addressOwner !== currentAddress) {
                          window.open(
                            getEtherscanLink(chain?.id, addressOwner, 'address'),
                            '_blank'
                          );
                        }
                      }}
                      className="text-sm minxl:text-lg text-center font-bold"
                    >
                      {addressOwner === currentAddress ? 'You own this profile.' :'This profile is owned by ' + shortenAddress(addressOwner)}
                    </div>
                  </div>
                  <div className="mx-auto text-primary-txt dark:text-primary-txt-dk w-full flex justify-center flex-col">
                    <div className="text-sm minxl:text-lg mb-8 minlg:mb-0 mt-8 w-full text-center">
                      {addressOwner === currentAddress ?
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
                    <div className="mt-10 minxl:mt-24 w-full flex justify-center mb-24 px-4 minmd:px-0">
                      <LinksToSection isAddressOwner={addressOwner === currentAddress}/>
                    </div>
                  </div>
                </div>
              </>
          }
        </div>
      </div>
      <div className="flex grow" />
      <div className='w-full mt-20'>
        <Footer />
      </div>
    </ProfileScrollContextProvider>
  );
}
