/* eslint-disable @next/next/no-img-element */
import { useCallback, useContext, useState } from 'react';
import { isMobile } from 'react-device-detect';
import Dropzone from 'react-dropzone';
import { BigNumber } from 'ethers';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { useAccount, useNetwork } from 'wagmi';

import BlurImage from 'components/elements/BlurImage';
import CustomTooltip from 'components/elements/CustomTooltip';
import Loader from 'components/elements/Loader/Loader';
import { BannerWrapper } from 'components/modules/Profile/BannerWrapper';
import { AddressTupleStructOutput } from 'constants/typechain/Nft_resolver';
import { ProfileViewType } from 'graphql/generated/types';
import { useAssociatedCollectionForProfile } from 'graphql/hooks/useAssociatedCollectionForProfileQuery';
import { useIsProfileCustomized } from 'graphql/hooks/useIsProfileCustomized';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useUpdateProfileMutation } from 'graphql/hooks/useUpdateProfileMutation';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useUser } from 'hooks/state/useUser';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useIsOwnerAndSignedIn } from 'hooks/useIsOwnerAndSignedIn';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/format';
import { getEtherscanLink, sameAddress, shortenAddress } from 'utils/helpers';
import { cl } from 'utils/tw';

import cameraIcon from 'public/camera.webp';
import CameraIconEdit from 'public/icons/camera_icon.svg?svgr';

import OnboardingModal from './Onboarding/OnboardingModal';
import { ClaimProfileCard } from './ClaimProfileCard';
import { LinksToSection } from './LinksToSection';
import { MintedProfileGallery } from './MintedProfileGallery';
import { MintedProfileInfo } from './MintedProfileInfo';
import { ProfileContext } from './ProfileContext';
import { ProfileScrollContextProvider } from './ProfileScrollContext';

const Collection = dynamic(() => import('components/modules/Collection/Collection').then(mod => mod.Collection));
const CollectionBanner = dynamic(() =>
  import('components/modules/Collection/Collection').then(mod => mod.CollectionBanner)
);
const CollectionBody = dynamic(() =>
  import('components/modules/Collection/Collection').then(mod => mod.CollectionBody)
);
const CollectionDescription = dynamic(() =>
  import('components/modules/Collection/Collection').then(mod => mod.CollectionDescription)
);
const CollectionDetails = dynamic(() =>
  import('components/modules/Collection/Collection').then(mod => mod.CollectionDetails)
);
const CollectionHeader = dynamic(() =>
  import('components/modules/Collection/Collection').then(mod => mod.CollectionHeader)
);

export interface MintedProfileProps {
  profileURI: string;
  addressOwner?: string;
}

export function MintedProfile(props: MintedProfileProps) {
  const { profileURI, addressOwner } = props;
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
    debouncedSearchQuery
  } = useContext(ProfileContext);
  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const { profileData, mutate: mutateProfile } = useProfileQuery(profileURI);
  const { updateProfile } = useUpdateProfileMutation();
  const { user } = useUser();
  const { data: profileCustomizationStatus } = useIsProfileCustomized(
    user?.currentProfileUrl,
    defaultChainId.toString()
  );
  const { nftResolver } = useAllContracts();
  const isOwnerAndSignedIn = useIsOwnerAndSignedIn(profileURI);

  const [hideModal, setHideModal] = useState(false);

  const fetchAssociatedContract = useCallback(async () => {
    if (profileData?.profile?.profileView !== ProfileViewType.Collection) {
      return null;
    }
    if (Doppler.NEXT_PUBLIC_OFFCHAIN_ASSOCIATION_ENABLED && profileData?.profile?.associatedContract) {
      return { cid: parseInt(defaultChainId), chainAddr: profileData.profile.associatedContract };
    }
    return nftResolver.associatedContract(profileURI).catch(() => null);
  }, [defaultChainId, nftResolver, profileData?.profile, profileURI]);

  const fetchAssociatedAddress = useCallback(async () => {
    if (profileData?.profile?.profileView !== ProfileViewType.Collection) {
      return null;
    }
    return nftResolver.associatedAddresses(profileURI).catch(() => null);
  }, [nftResolver, profileData?.profile?.profileView, profileURI]);

  const { data: associatedContract } = useSWR<AddressTupleStructOutput>(
    `AssociatedCollection${profileURI}${profileData?.profile?.profileView}`,
    fetchAssociatedContract
  );
  const { data: associatedAddresses } = useSWR<AddressTupleStructOutput[]>(
    `AssociatedAddresses${profileURI}${profileData?.profile?.profileView}`,
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
        raw: files[0]
      });
    }
  };

  const onDropHeader = (files: Array<any>) => {
    if (files.length > 1) {
      alert('only 1 picture is allowed at a time');
    } else {
      setDraftHeaderImg({
        preview: URL.createObjectURL(files[0]),
        raw: files[0]
      });
    }
  };
  if (
    associatedContract?.chainAddr?.length &&
    (Doppler.NEXT_PUBLIC_OFFCHAIN_ASSOCIATION_ENABLED ||
      associatedAddresses?.find(addr => sameAddress(addr?.chainAddr, associatedCollectionWithDeployer?.deployer)) ||
      sameAddress(profileData?.profile?.owner?.address, associatedCollectionWithDeployer?.deployer))
  ) {
    return (
      <div className='h-max w-full'>
        <Collection contract={associatedContract?.chainAddr}>
          <CollectionBanner />
          <CollectionHeader>
            <CollectionDescription />
            <CollectionDetails />
          </CollectionHeader>
          <CollectionBody />
        </Collection>
      </div>
    );
  }

  const onHideCustomization = () => {
    updateProfile({
      id: profileData?.profile?.id,
      hideCustomization: true
    });
    mutateProfile();
    setHideModal(true);
  };

  return (
    <>
      <ProfileScrollContextProvider>
        <div className='group w-full'>
          <BannerWrapper
            alt={`${profileData?.profile?.url} profile banner image`}
            draft={!isNullOrEmpty(draftHeaderImg?.preview)}
            imageOverride={
              editMode
                ? isNullOrEmpty(draftHeaderImg?.preview)
                  ? profileData?.profile?.bannerURL
                  : draftHeaderImg?.preview
                : profileData?.profile?.bannerURL
            }
            loading={saving}
          >
            <div className='h-full w-full'>
              <Dropzone
                disabled={!userIsAdmin}
                accept={'image/*'['.*']}
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
                    {editMode && isOwnerAndSignedIn && !saving && (
                      <div onClick={open} className='group-hover:cursor-pointer'>
                        <div className='absolute inset-0 bg-black opacity-50'></div>
                        <div className='absolute inset-0 m-auto h-10 w-10'>
                          <CustomTooltip
                            orientation='top'
                            tooltipComponent={
                              <div className='w-max'>
                                <p>Upload a new banner image</p>
                              </div>
                            }
                          >
                            <CameraIconEdit />
                          </CustomTooltip>
                        </div>
                      </div>
                    )}
                  </section>
                )}
              </Dropzone>
            </div>
          </BannerWrapper>
        </div>
        <div
          className={cl(
            'flex-col',
            'min-w-[60%] max-w-[1400px] minxl:w-full',
            isMobile ? 'mx-2' : 'mx-2 minmd:mx-8 minxl:mx-auto'
          )}
        >
          <div
            className={cl('flex items-start justify-start', 'flex-col')}
            style={{
              zIndex: 103
            }}
          >
            <div className='block items-end minmd:flex'>
              <Dropzone
                accept={'image/*'['.*']}
                disabled={(!userIsAdmin && !editMode) || !editMode}
                onDrop={files => {
                  if (userIsAdmin) onDropProfile(files);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className={cl(
                      'relative outline-none',
                      userIsAdmin ? '' : 'cursor-default',
                      'h-[88px] w-[88px] minlg:ml-20 minlg:h-[120px] minlg:w-[120px]'
                    )}
                  >
                    <input {...getInputProps()} />
                    {saving && (
                      <div
                        style={{ zIndex: 102 }}
                        className={cl(
                          'absolute ml-6 mt-[-45px] bg-white/10 shadow-md minlg:ml-0 minlg:mt-[-60px]',
                          'absolute flex rounded-full ',
                          'h-full w-full items-center justify-center'
                        )}
                      >
                        <Loader />
                      </div>
                    )}

                    <div
                      className={cl(
                        'object-center',
                        'group h-full w-full',
                        'aspect-square shrink-0',
                        editMode && 'hover:cursor-pointer',
                        isOwnerAndSignedIn && editMode ? 'hover:cursor-pointer' : '',
                        'box-border rounded-full border-[5px] border-white',
                        'absolute ml-6 mt-[-45px] shadow-md minlg:ml-0 minlg:mt-[-60px]'
                      )}
                    >
                      {editMode && !saving && isOwnerAndSignedIn && (
                        <div
                          style={{ zIndex: 102 }}
                          className={cl('absolute -bottom-[5px] -left-[5px] -right-[5px] -top-[5px] rounded-full')}
                        >
                          <div className='absolute inset-0 rounded-full bg-black opacity-50'></div>
                          <div className='absolute inset-0 m-auto h-[28px] w-[28px]'>
                            <CustomTooltip
                              orientation='top'
                              tooltipComponent={
                                <div className='w-max rounded-xl'>
                                  <p>Update your profile image</p>
                                </div>
                              }
                            >
                              <CameraIconEdit />
                            </CustomTooltip>
                          </div>
                        </div>
                      )}

                      <BlurImage
                        src={
                          !isNullOrEmpty(draftProfileImg?.preview)
                            ? draftProfileImg?.preview
                            : profileData?.profile?.photoURL ??
                              (!getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED)
                                ? 'https://cdn.nft.com/profile-image-default.svg'
                                : cameraIcon.src)
                        }
                        priority
                        fill
                        alt='profilePicture'
                        draggable={false}
                        className={cl('rounded-full object-cover')}
                        style={{ zIndex: 101, overflow: 'hidden' }}
                      />
                    </div>
                  </div>
                )}
              </Dropzone>
            </div>
            <MintedProfileInfo userIsAdmin={userIsAdmin} profileURI={profileURI} />
          </div>
          <div
            className={cl('h-full', 'mt-5 minmd:mt-0', 'mt-6', 'flex w-full flex-col justify-start space-y-4', 'flex')}
          >
            {user?.currentProfileUrl === props.profileURI &&
              profileCustomizationStatus &&
              !profileCustomizationStatus?.isProfileCustomized && (
                <div className='mt-2 block px-2 minlg:hidden'>
                  <ClaimProfileCard />
                </div>
              )}

            {(userIsAdmin && editMode) || publiclyVisibleNftsNoEdit?.length > 0 ? (
              <MintedProfileGallery
                profileURI={profileURI}
                ownedGKTokens={ownedGKTokens?.map(token => BigNumber.from(token?.id?.tokenId ?? 0).toNumber())}
              />
            ) : loading ? (
              <div className='flex min-h-[25rem] flex-col items-center justify-center text-primary-txt'>
                <div className='mb-2'>Loading...</div>
                <Loader />
              </div>
            ) : (
              <>
                <div
                  className={cl(
                    'mt-4 flex w-full flex-col justify-center text-primary-txt dark:text-primary-txt-dk',
                    addressOwner !== currentAddress ? 'cursor-pointer ' : ''
                  )}
                >
                  <div className='mx-auto w-3/5 text-center text-base font-bold minlg:text-left minlg:text-lg minxl:text-xl'>
                    {isNullOrEmpty(debouncedSearchQuery) && (
                      <div
                        onClick={() => {
                          if (addressOwner !== currentAddress) {
                            window.open(getEtherscanLink(chain?.id, addressOwner, 'address'), '_blank');
                          }
                        }}
                        className='text-center text-sm font-bold minxl:text-lg'
                      >
                        {addressOwner === currentAddress
                          ? 'You own this profile.'
                          : `This profile is owned by ${shortenAddress(addressOwner)}`}
                      </div>
                    )}
                  </div>

                  <div className='mx-auto flex w-full flex-col justify-center text-primary-txt dark:text-primary-txt-dk'>
                    {isNullOrEmpty(debouncedSearchQuery) ? (
                      <div className='my-8 w-full text-center text-sm minlg:mb-0 minxl:text-lg'>
                        {addressOwner === currentAddress ? (
                          <p className='mx-8'>
                            As we roll out new features, you can return here for the latest NFT.com news, discover other
                            minted Genesis Keys and profiles in our community, and more. We have so much in store!
                          </p>
                        ) : (
                          <p className='mx-8'>
                            Do you want your own NFT.com Profile?
                            <br />
                            Learn how to claim a profile for your own by visiting either NFT.com or our Support
                            knowledge base.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className='my-8 w-full text-center text-sm minlg:mb-0 minxl:text-lg'>
                        <p className='mx-8'>No NFTs found, please try again.</p>
                      </div>
                    )}
                    <div className='mb-24 mt-10 flex w-full justify-center px-4 minmd:px-0 minxl:mt-24'>
                      <LinksToSection isAddressOwner={addressOwner === currentAddress} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </ProfileScrollContextProvider>
      {addressOwner === currentAddress &&
        user.currentProfileUrl === profileURI &&
        !editMode &&
        !profileData?.profile?.hideCustomization &&
        !hideModal && <OnboardingModal profileURI={profileURI} onClose={onHideCustomization} />}
    </>
  );
}
