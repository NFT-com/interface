import { Maybe, Nft, ProfileDisplayType, ProfileLayoutType } from 'graphql/generated/types';
import { useFileUploadMutation } from 'graphql/hooks/useFileUploadMutation';
import { useMyNFTsQuery } from 'graphql/hooks/useMyNFTsQuery';
import { useProfileNFTsQuery } from 'graphql/hooks/useProfileNFTsQuery';
import { useProfileOrderingUpdateMutation } from 'graphql/hooks/useProfileOrderingUpdateMutation';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useUpdateProfileMutation } from 'graphql/hooks/useUpdateProfileMutation';
import { useUpdateProfileImagesMutation } from 'graphql/hooks/useUploadProfileImagesMutation';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';

import { DetailedNft } from './NftGrid';

import moment from 'moment';
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';

export interface DraftImg {
  preview: Maybe<string>,
  raw: Maybe<string | File>
}

export interface ProfileContextType {
  // display state
  publiclyVisibleNfts: PartialDeep<Nft>[];
  editModeNfts: PartialDeep<DetailedNft>[];
  publiclyVisibleNftCount: number;
  allOwnerNfts: PartialDeep<Nft>[];
  allOwnerNftCount: number;
  userIsAdmin: boolean;
  loadMoreNfts: () => void;
  setAllItemsOrder: (items: PartialDeep<Nft>[]) => void;
  // editor state
  toggleHidden: (id: string, currentVisibility: boolean) => void;
  hideNftIds: (toHide: string[]) => void;
  showNftIds: (toShow: string[]) => void;
  draftHeaderImg: DraftImg,
  setDraftHeaderImg: (img: DraftImg) => void,
  draftProfileImg: DraftImg,
  setDraftProfileImg: (img: DraftImg) => void,
  draftBio: Maybe<string>,
  setDraftBio: (bio: string) => void,
  draftGkIconVisible: Maybe<boolean>,
  setDraftGkIconVisible: (val: boolean) => void,
  draftDisplayType: ProfileDisplayType,
  setDraftDisplayType: (displayType: ProfileDisplayType) => void,
  draftLayoutType: ProfileLayoutType,
  setDraftLayoutType: (layoutType: ProfileLayoutType) => void,
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  clearDrafts: () => void;
  saveProfile: () => void;
  saving: boolean;
  selectedCollection: Maybe<string>;
  setSelectedCollection: (collectionAddress: string) => void;
  draftNftsDescriptionsVisible: Maybe<boolean>;
  setDraftNftsDescriptionsVisible: (val: boolean) => void;
}

// initialize with default values
export const ProfileContext = React.createContext<ProfileContextType>({
  publiclyVisibleNfts: [],
  editModeNfts: [],
  publiclyVisibleNftCount: 0,
  allOwnerNfts: [],
  allOwnerNftCount: 0,
  loadMoreNfts: () => null,
  setAllItemsOrder: () => null,
  userIsAdmin: false,
  toggleHidden: () => null,
  hideNftIds: () => null,
  showNftIds: () => null,
  draftHeaderImg: { preview: '', raw: '' },
  setDraftHeaderImg: () => null,
  draftProfileImg: { preview: '', raw: '' },
  setDraftProfileImg: () => null,
  draftBio: '',
  setDraftBio: () => '',
  draftGkIconVisible: true,
  setDraftGkIconVisible: () => null,
  draftDisplayType: ProfileDisplayType.Nft,
  setDraftDisplayType: () => null,
  draftLayoutType: ProfileLayoutType.Default,
  setDraftLayoutType: () => null,
  editMode: false,
  setEditMode: () => null,
  clearDrafts: () => null,
  saveProfile: () => null,
  saving: false,
  selectedCollection: null,
  setSelectedCollection: () => null,
  draftNftsDescriptionsVisible: true,
  setDraftNftsDescriptionsVisible: () => null,
});

export interface ProfileContextProviderProps {
  profileURI: string;
}

/**
 * This context provides state management and helper functions for viewing and editing Profiles.
 */
export function ProfileContextProvider(
  props: PropsWithChildren<ProfileContextProviderProps>
) {
  const { chain } = useNetwork();

  /**
   * Queries
   */
  const { profileData, mutate: mutateProfileData } = useProfileQuery(props.profileURI);
  const { profileTokens: ownedProfileTokens } = useMyNftProfileTokens();
  const [loadedCount, setLoadedCount] = useState(1000);
  const {
    nfts: publicProfileNfts,
    totalItems: publicProfileNftsCount,
    mutate: mutatePublicProfileNfts,
  } = useProfileNFTsQuery(
    profileData?.profile?.id,
    String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)),
    loadedCount
  );
  const {
    data: allOwnerNfts,
    loading: loadingAllOwnerNfts,
    totalItems: allOwnerNftCount,
    mutate: mutateAllOwnerNfts
  } = useMyNFTsQuery(loadedCount);

  /**
   * Edit mode state
   */
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftBio, setDraftBio] = useState<string>(profileData?.profile?.description);
  const [draftGkIconVisible, setDraftGkIconVisible] = useState<boolean>(profileData?.profile?.gkIconVisible);
  const [draftNftsDescriptionsVisible, setDraftNftsDescriptionsVisible] = useState<boolean>(profileData?.profile?.nftsDescriptionsVisible);
  const [draftProfileImg, setDraftProfileImg] = useState({ preview: '', raw: null });
  const [draftHeaderImg, setDraftHeaderImg] = useState({ preview: '', raw: null });
  const [draftDisplayType, setDraftDisplayType] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState<string>(null);
  const [draftLayoutType , setDraftLayoutType] = useState<ProfileLayoutType>(null);

  useEffect(() => {
    // make sure these initial values are set when the Profile data loads.
    if (draftBio == null) {
      setDraftBio(profileData?.profile?.description);
    }
    if (draftGkIconVisible == null) {
      setDraftGkIconVisible(profileData?.profile?.gkIconVisible);
    }
    if (draftNftsDescriptionsVisible == null) {
      setDraftNftsDescriptionsVisible(profileData?.profile?.nftsDescriptionsVisible);
    }
  }, [draftBio, draftGkIconVisible, draftNftsDescriptionsVisible, profileData?.profile?.description, profileData?.profile?.gkIconVisible, profileData?.profile?.nftsDescriptionsVisible]);
  
  // make sure this doesn't overwrite local changes, use server-provided value for initial state only.
  const [publiclyVisibleNfts, setPubliclyVisibleNfts] = useState<PartialDeep<Nft>[]>(null);
  const [editModeNfts, setEditModeNfts] = useState<PartialDeep<DetailedNft>[]>(null);

  useEffect(() => {
    if (!loadingAllOwnerNfts) {
      setEditModeNfts([
        ...setHidden(publiclyVisibleNfts ?? [], false),
        ...setHidden(allOwnerNfts?.filter(nft => publiclyVisibleNfts?.find(nft2 => nft2.id === nft.id) == null) ?? [], true)
      ]);
    }
  }, [allOwnerNfts, publiclyVisibleNfts, loadingAllOwnerNfts]);

  useEffect(() => {
    setDraftDisplayType(null);
  }, [editMode]);

  const setAllItemsOrder = useCallback((orderedItems: DetailedNft[]) => {
    setEditModeNfts([
      ...orderedItems.filter((nft: DetailedNft) => !nft.hidden),
      ...orderedItems.filter((nft: DetailedNft) => nft.hidden),
    ]);
  }, []);
  
  useEffect(() => {
    if (publiclyVisibleNfts == null || !editMode) {
      setPubliclyVisibleNfts(publicProfileNfts);
    }
  }, [publicProfileNfts, publiclyVisibleNfts, editMode]);
  
  /**
   * Mutations
   */
  const { updateProfile } = useUpdateProfileMutation();
  const { fileUpload } = useFileUploadMutation();
  const { uploadProfileImages } = useUpdateProfileImagesMutation();
  const { updateOrder } = useProfileOrderingUpdateMutation();

  const toggleHidden = useCallback((
    id: string,
    currentVisibility: boolean
  ) => {
    if (currentVisibility) {
      setPubliclyVisibleNfts((publiclyVisibleNfts ?? []).slice().filter(nft => nft.id !== id));
    } else {
      // NFT is currently hidden.
      const nft = allOwnerNfts.find(nft => nft.id === id);
      setPubliclyVisibleNfts([...publiclyVisibleNfts, nft]);
    }
  }, [allOwnerNfts, publiclyVisibleNfts]);

  const clearDrafts = useCallback(() => {
    // reset
    setDraftProfileImg({ preview: '', raw: null });
    setDraftHeaderImg({ preview: '', raw: null });
    setDraftBio(profileData?.profile?.description);
    setDraftGkIconVisible(draftGkIconVisible);
    setDraftNftsDescriptionsVisible(draftNftsDescriptionsVisible);
    setEditMode(false);
    setDraftLayoutType(null);
    setPubliclyVisibleNfts(null);
  }, [draftGkIconVisible, draftNftsDescriptionsVisible, profileData?.profile?.description]);

  useEffect(() => {
    setSelectedCollection(null);
  }, [editMode]);

  const saveProfile = useCallback(async () => {
    try {
      if (draftProfileImg?.raw?.size > 2000000) { // 2MB
        alert('Profile image is too large (> 2MB). Please upload a smaller image.');
        clearDrafts();
      } else if (draftHeaderImg?.raw?.size > 2000000) { // 2MB
        alert('Header image is too large (> 2MB). Please upload a smaller image.');
        clearDrafts();
      } else {
        setSaving(true);
        const imageUploadResult = await uploadProfileImages({
          profileId: profileData?.profile?.id,
          compositeProfileURL: false,
          avatar: draftProfileImg.raw ?? null,
          banner: draftHeaderImg.raw ?? null
        });
  
        let headerUploadImage: string;
        let profileUploadImage: string;
        if (!imageUploadResult) {
          if (!isNullOrEmpty(draftHeaderImg.raw)) {
            headerUploadImage = await fileUpload(
              draftHeaderImg,
              props.profileURI + '-header-img-' + moment.now()
            );
          }
          if (!isNullOrEmpty(draftProfileImg.raw)) {
            profileUploadImage = await fileUpload(
              draftProfileImg,
              props.profileURI + '-profile-img-' + moment.now()
            );
          }
        }
        if (getEnvBool(Doppler.NEXT_PUBLIC_REORDER_ENABLED)) {
          await updateOrder({
            profileId: profileData?.profile?.id,
            updates: editModeNfts?.map((nft, index) => ({ nftId: nft.id, newIndex: index }))
          });
        }
        const result = await updateProfile({
          id: profileData?.profile?.id,
          description: isNullOrEmpty(draftBio) ? profileData?.profile?.description : draftBio,
          gkIconVisible: draftGkIconVisible,
          nftsDescriptionsVisible: draftNftsDescriptionsVisible,
          hideNFTIds: allOwnerNfts?.filter(nft => publiclyVisibleNfts.find(nft2 => nft2.id === nft.id) == null)?.map(nft => nft.id),
          showNFTIds: publiclyVisibleNfts?.map(nft => nft.id),
          layoutType: draftLayoutType,
          ...(imageUploadResult
            ? {}
            : {
              bannerURL: headerUploadImage,
              photoURL: profileUploadImage,
            })
        });
  
        if (result) {
          mutateProfileData();
          mutatePublicProfileNfts();
          mutateAllOwnerNfts();
          clearDrafts();
        }
        setSaving(false);
      }
    } catch (err) {
      console.log('error while saving profile: ', err);
      alert('Error while saving profile.');
      clearDrafts();
      setSaving(false);
    }
  }, [
    editModeNfts,
    updateOrder,
    draftProfileImg,
    draftHeaderImg,
    clearDrafts,
    uploadProfileImages,
    profileData?.profile?.id,
    profileData?.profile?.description,
    updateProfile,
    draftBio,
    draftGkIconVisible,
    draftNftsDescriptionsVisible,
    draftLayoutType,
    fileUpload,
    props.profileURI,
    mutateProfileData,
    mutatePublicProfileNfts,
    mutateAllOwnerNfts,
    allOwnerNfts,
    publiclyVisibleNfts
  ]);

  const setHidden: (
    nfts: PartialDeep<Nft>[], hidden: boolean
  ) => PartialDeep<DetailedNft>[] = (
    nfts: PartialDeep<Nft>[],
    hidden: boolean
  ) => {
    return nfts.map(nft => ({ ...nft, hidden: hidden }));
  };

  return <ProfileContext.Provider value={{
    editModeNfts: editModeNfts ?? [],
    allOwnerNfts: allOwnerNfts ?? [],
    allOwnerNftCount: allOwnerNftCount ?? 0,
    publiclyVisibleNfts: publiclyVisibleNfts ?? [],
    publiclyVisibleNftCount: publicProfileNftsCount ?? 0,
    loadMoreNfts: () => {
      setLoadedCount(loadedCount + 100);
    },
    setAllItemsOrder,
    userIsAdmin: ownedProfileTokens
      .map(token => token?.tokenUri?.raw?.split('/').pop())
      .includes(props.profileURI),
    editMode,
    setEditMode: (enabled: boolean) => {
      setEditMode(enabled);
    },
    draftHeaderImg,
    draftProfileImg,
    setDraftHeaderImg: (img: DraftImg) => {
      setDraftHeaderImg(img);
    },
    setDraftProfileImg: (img: DraftImg) => {
      setDraftProfileImg(img);
    },
    draftBio,
    setDraftBio: (bio: string) => {
      setDraftBio(bio);
    },
    draftGkIconVisible,
    setDraftGkIconVisible: (val: boolean) => {
      setDraftGkIconVisible(val);
    },
    draftNftsDescriptionsVisible,
    setDraftNftsDescriptionsVisible: (val: boolean) => {
      setDraftNftsDescriptionsVisible(val);
    },
    draftDisplayType,
    setDraftDisplayType,
    draftLayoutType,
    setDraftLayoutType,
    toggleHidden,
    hideNftIds: (toHide: string[]) => {
      setPubliclyVisibleNfts((publiclyVisibleNfts ?? []).slice().filter(nft => !toHide.includes(nft.id)));
    },
    showNftIds: (toShow: string[]) => {
      const additions = [];
      allOwnerNfts?.filter(nft => toShow?.includes(nft.id))?.forEach((nft) => {
        if (!publiclyVisibleNfts?.includes(nft) && !additions?.includes(nft)) {
          additions.push(nft);
        }
      });
      setPubliclyVisibleNfts([...(publiclyVisibleNfts ?? []), ...additions]);
    },
    saveProfile,
    saving,
    clearDrafts,
    selectedCollection,
    setSelectedCollection,
  }}>
    {props.children}
  </ProfileContext.Provider>;
}