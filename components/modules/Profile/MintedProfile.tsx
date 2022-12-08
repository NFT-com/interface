/* eslint-disable @next/next/no-img-element */
import CustomTooltip2 from 'components/elements/CustomTooltip2';
import Loader from 'components/elements/Loader';
import { Collection } from 'components/modules/Collection/Collection';
import { BannerWrapper } from 'components/modules/Profile/BannerWrapper';
import { AddressTupleStructOutput } from 'constants/typechain/Nft_resolver';
import { ProfileViewType } from 'graphql/generated/types';
import { useAssociatedCollectionForProfile } from 'graphql/hooks/useAssociatedCollectionForProfileQuery';
import { useIsProfileCustomized } from 'graphql/hooks/useIsProfileCustomized';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useUser } from 'hooks/state/useUser';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useIsOwnerAndSignedIn } from 'hooks/useIsOwnerAndSignedIn';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { Doppler, getEnvBool } from 'utils/env';
import { getEtherscanLink, isNullOrEmpty, sameAddress, shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ClaimProfileCard } from './ClaimProfileCard';
import { DeployedCollectionsGallery } from './DeployedCollectionsGallery';
import { LinksToSection } from './LinksToSection';
import { MintedProfileGallery } from './MintedProfileGallery';
import { MintedProfileInfo } from './MintedProfileInfo';
import OnboardingModal from './Onboarding/OnboardingModal';
import { ProfileContext } from './ProfileContext';
import { ProfileScrollContextProvider } from './ProfileScrollContext';

import { BigNumber } from 'ethers';
import Image from 'next/image';
import cameraIcon from 'public/camera.png';
import CameraIconEdit from 'public/camera_icon.svg';
import PencilIconRounded from 'public/pencil-icon-rounded.svg';
import { useCallback, useContext, useState } from 'react';
import { isMobile } from 'react-device-detect';
import Dropzone from 'react-dropzone';
import useSWR from 'swr';
import { useAccount, useNetwork } from 'wagmi';

export interface MintedProfileProps {
  profileURI: string;
  addressOwner?: string;
}

export function MintedProfile(props: MintedProfileProps) {
  const { profileURI, addressOwner } = props;
  const [isPicturedHovered, setIsPicturedHovered] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'nfts' | 'deployed'>('nfts');
  const defaultChainId = useDefaultChainId();
  const {
    editMode,
    saving,
    draftProfileImg,
    draftHeaderImg,
    setDraftHeaderImg,
    setDraftProfileImg,
    userIsAdmin,
    publiclyVisibleNftsNoEdit,
    loading,
    draftDeployedContractsVisible
  } = useContext(ProfileContext);
  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const { profileData } = useProfileQuery(profileURI);
  const { user } = useUser();
  const { data: profileCustomizationStatus } = useIsProfileCustomized(user?.currentProfileUrl, defaultChainId.toString());
  const { nftResolver } = useAllContracts();
  const isOwnerAndSignedIn = useIsOwnerAndSignedIn(profileURI);

  const fetchAssociatedContract = useCallback(async () => {
    if (profileData?.profile?.profileView !== ProfileViewType.Collection) {
      return null;
    }
    return await nftResolver.associatedContract(profileURI).catch(() => null);
  }, [nftResolver, profileData?.profile?.profileView, profileURI]);

  const fetchAssociatedAddress = useCallback(async () => {
    if (profileData?.profile?.profileView !== ProfileViewType.Collection) {
      return null;
    }
    return await nftResolver.associatedAddresses(profileURI).catch(() => null);
  }, [nftResolver, profileData?.profile?.profileView, profileURI]);

  const { data: associatedContract } = useSWR<AddressTupleStructOutput>(
    'AssociatedCollection' + profileURI + profileData?.profile?.profileView,
    fetchAssociatedContract
  );
  const { data: associatedAddresses } = useSWR<AddressTupleStructOutput[]>(
    'AssociatedAddresses' + profileURI + profileData?.profile?.profileView,
    fetchAssociatedAddress
  );
  const { data: associatedCollectionWithDeployer } = useAssociatedCollectionForProfile(profileURI);

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
  if (
    associatedContract != null &&
    (associatedAddresses?.find(addr => sameAddress(addr?.chainAddr, associatedCollectionWithDeployer?.deployer)) || sameAddress(profileData?.profile?.owner?.address, associatedCollectionWithDeployer?.deployer))
  ) {
    return <div className='w-full h-max'>
      <Collection contract={associatedContract?.chainAddr} />
    </div>;
  }

  return (
    <>
      <ProfileScrollContextProvider>
        <div className='w-full group'>
          <BannerWrapper
            draft={!isNullOrEmpty(draftHeaderImg?.preview)}
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
                    {editMode && !getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) && isOwnerAndSignedIn && <div
                      className={tw(
                        'absolute bottom-5 right-5 minmd:right-4'
                      )}
                      onClick={open}
                    >
                      <PencilIconRounded alt="Edit banner" color="white" className='rounded-full h-10 w-10 cursor-pointer'/>
                    </div>}

                    {getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) && editMode && isOwnerAndSignedIn && !saving && <div
                      onClick={open}
                      className='group-hover:cursor-pointer'
                    >
                      <div className='absolute inset-0 bg-black opacity-50'></div>
                      <div className='w-10 h-10 absolute left-0 right-0 mx-auto top-0 bottom-0 my-auto'>
                        <CustomTooltip2
                          orientation='top'
                          tooltipComponent={
                            <div
                              className="w-max"
                            >
                              <p>Upload a new banner image</p>
                            </div>
                          }
                        >
                          <CameraIconEdit />
                        </CustomTooltip2>
                      </div>
                    </div>}
                  </section>
                )}
              </Dropzone>
            </div>
          </BannerWrapper>
        </div>
        <div className={tw(
          'flex-col',
          'max-w-[1400px] min-w-[60%] minxl:w-full',
          isMobile ? 'mx-2' : 'mx-2 minmd:mx-8 minxl:mx-auto',
        )}>
          <div
            className={tw(
              'flex justify-start items-start',
              getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ? 'flex-col' : 'flex-col minmd:flex-row minmd:items-center'
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
                disabled={!userIsAdmin || !getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) && !editMode || getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) && !editMode}
                onDrop={files => {
                  if (userIsAdmin) onDropProfile(files);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className={tw(
                    'relative outline-none',
                    userIsAdmin ? '' : 'cursor-default',
                    getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ? 'w-[88px] h-[88px] minlg:w-[120px] minlg:h-[120px] minlg:ml-20' :'h-32 minlg:h-52 w-32 minlg:w-52 '
                  )}>
                    <input {...getInputProps()} />
                    {saving && <div
                      style={{ zIndex: 102 }}
                      className={tw(
                        getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ?
                          'bg-white/10 mt-[-45px] minlg:mt-[-60px] ml-6 minlg:ml-0 absolute shadow-md' :
                          'border bg-white/10 mt-[-67px] minmd:mt-[-120px] minlg:mt-[-115px]',
                        'rounded-full absolute flex ',
                        'items-center justify-center h-full w-full',
                      )}
                    >
                      <Loader/>
                    </div>}
                    {editMode && !getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) && <div
                      style={{ zIndex: 102, }}
                      className={tw(
                        isPicturedHovered ? 'opacity-100' : 'opacity-30',
                        'absolute right-4 minlg:right-9 minxl:right-6',
                        'bottom-24 minmd:bottom-[9.5rem] minlg:bottom-[9.5rem] minxl:bottom-40'
                      )}
                    >
                      <PencilIconRounded alt="Edit mode" color="white" className='rounded-full h-6 minlg:h-10 w-6 minlg:w-10  cursor-pointer'/>
                    </div>}

                    <div
                      className={tw(
                        'object-center',
                        'h-full w-full group',
                        'shrink-0 aspect-square',
                        getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) && editMode && 'hover:cursor-pointer',
                        isOwnerAndSignedIn && editMode ? 'hover:cursor-pointer' : '',
                        !getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) && userIsAdmin && !isMobile && editMode ? 'hoverBlue' : '',
                        getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) && 'box-border border-[5px] border-white rounded-full',
                        getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ? 'mt-[-45px] minlg:mt-[-60px] ml-6 minlg:ml-0 absolute shadow-md' :'mt-[-67px] minmd:mt-[-120px] minlg:mt-[-115px] absolute'
                      )}
                    >
                      {getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) && editMode && !saving && isOwnerAndSignedIn && <div
                        style={{ zIndex: 102, }}
                        className={tw(
                          'absolute -top-[5px] -bottom-[5px] -right-[5px] -left-[5px] rounded-full'
                        )}
                      >
                        <div className='bg-black opacity-50 absolute top-0 bottom-0 right-0 left-0 rounded-full'></div>
                        <div className='w-[28px] h-[28px] absolute left-0 right-0 mx-auto top-0 bottom-0 my-auto'>
                          <CustomTooltip2
                            orientation='top'
                            tooltipComponent={
                              <div
                                className="rounded-xl w-max"
                              >
                                <p>Update your profile image</p>
                              </div>
                            }
                          >
                            <CameraIconEdit />
                          </CustomTooltip2>
                        </div>
                      </div>}

                      <Image
                        src={
                          !isNullOrEmpty(draftProfileImg?.preview)
                            ? draftProfileImg?.preview
                            : profileData?.profile?.photoURL ??
                            (!getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED)
                              ? 'https://cdn.nft.com/profile-image-default.svg' :
                              cameraIcon.src)
                        }
                        priority
                        layout='fill'
                        alt="profilePicture"
                        draggable={false}
                        className={tw(
                          'rounded-full',
                        )}
                        style={{ zIndex: 101, overflow: 'hidden' }}
                      />
                    </div>
                  </div>
                )}
              </Dropzone>
            </div>
            <MintedProfileInfo
              userIsAdmin={userIsAdmin}
              profileURI={profileURI}
            />
          </div>
          {
            draftDeployedContractsVisible && !getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) &&
          <div className={tw(
            'flex w-full px-12',
            editMode ? 'mt-8' : 'mt-8'
          )}>
            <span
              onClick={() => {
                setSelectedTab('nfts');
              }}
              className={tw(
                'cursor-pointer text-lg tracking-wide mr-4',
                selectedTab === 'nfts' ? 'text-black' : 'text-secondary-txt'
              )}
            >
              NFTs
            </span>
            <span
              onClick={() => {
                setSelectedTab('deployed');
              }}
              className={tw(
                'cursor-pointer text-lg tracking-wide',
                selectedTab === 'deployed' ? 'text-black' : 'text-secondary-txt'
              )}
            >
              Created Collections
            </span>
          </div>
          }
          <div
            className={tw(
              'h-full',
              editMode && !draftDeployedContractsVisible && !getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ? 'mt-28 minmd:mt-16' :'mt-5 minmd:mt-0' ,
              getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) && 'mt-6',
              'w-full justify-start space-y-4 flex flex-col',
              selectedTab === 'nfts' ? 'flex' : 'hidden'
            )}
          >
            {user?.currentProfileUrl === props.profileURI && getEnvBool(Doppler.NEXT_PUBLIC_GA_ENABLED) && profileCustomizationStatus && !profileCustomizationStatus?.isProfileCustomized &&
              <div className='block minlg:hidden mt-2 px-2'>
                <ClaimProfileCard />
              </div>
            }

            {
              (userIsAdmin && editMode) || (publiclyVisibleNftsNoEdit?.length > 0) ?
                <MintedProfileGallery
                  profileURI={profileURI}
                  ownedGKTokens={ownedGKTokens?.map(token => BigNumber.from(token?.id?.tokenId ?? 0).toNumber())}
                /> :
                loading
                  ?
                  <div className= 'min-h-[25rem] text-primary-txt flex flex-col items-center justify-center'>
                    <div className="mb-2">Loading...</div>
                    <Loader />
                  </div>
                  :
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
          <div
            className={tw(
              'h-full sm:mt-5',
              'w-full justify-start space-y-4 flex flex-col',
              selectedTab === 'deployed' ? 'flex' : 'hidden'
            )}
          >
            <DeployedCollectionsGallery address={addressOwner} />
          </div>
        </div>
      </ProfileScrollContextProvider>

      {getEnvBool(Doppler.NEXT_PUBLIC_GA_ENABLED) && addressOwner === currentAddress && user.currentProfileUrl === profileURI && !editMode &&
        <OnboardingModal profileURI={profileURI} />
      }
    </>
  );
}
