import { Maybe, ProfileDisplayType } from 'graphql/generated/types';
import { useFileUploadMutation } from 'graphql/hooks/useFileUploadMutation';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useUpdateProfileMutation } from 'graphql/hooks/useUpdateProfileMutation';
import { useUpdateProfileImagesMutation } from 'graphql/hooks/useUploadProfileImagesMutation';

import moment from 'moment';
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { isNullOrEmpty } from 'utils/helpers';

export interface DraftImg {
  preview: Maybe<string>,
  raw: Maybe<string | File>
}

interface ProfileEditContextType {
  draftToHide: Set<string>; // ID is of format collectionAddress:tokenId
  draftToShow: Set<string>;
  toggleHidden: (id: string, currentVisibility: boolean) => void;
  hideNftIds: (toHide: string[]) => void;
  showNftIds: (toShow: string[]) => void;
  onHideAll: () => void;
  onShowAll: () => void;
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
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  clearDrafts: () => void;
  saveProfile: () => void;
  saving: boolean;
  selectedCollection: Maybe<string>;
  setSelectedCollection: (collectionAddress: string) => void;
}

// initialize with default values
export const ProfileEditContext = React.createContext<ProfileEditContextType>({
  draftToHide: new Set(),
  draftToShow: new Set(),
  toggleHidden: () => null,
  hideNftIds: (toHide: string[]) => null,
  showNftIds: (toShow: string[]) => null,
  onHideAll: () => null,
  onShowAll: () => null,
  draftHeaderImg: { preview: '', raw: '' },
  setDraftHeaderImg: (img: DraftImg) => null,
  draftProfileImg: { preview: '', raw: '' },
  setDraftProfileImg: (img: DraftImg) => null,
  draftBio: null,
  setDraftBio: (bio: string) => null,
  draftGkIconVisible: true,
  setDraftGkIconVisible: (val: boolean) => null,
  draftDisplayType: ProfileDisplayType.Nft,
  setDraftDisplayType: () => null,
  editMode: false,
  setEditMode: () => null,
  clearDrafts: () => null,
  saveProfile: () => null,
  saving: false,
  selectedCollection: null,
  setSelectedCollection: (collectionAddress: string) => null,
});

export interface ProfileEditContextProviderProps {
  profileURI: string;
}

/**
 * This context provides state management and helper functions for editing Profiles.
 * 
 * This context does _not_ return the server-provided values for all fields. You should
 * check this context for drafts, and fallback on the server-provided values at the callsite.
 * 
 */
export function ProfileEditContextProvider(
  props: PropsWithChildren<ProfileEditContextProviderProps>
) {
  const { profileData, mutate: mutateProfileData } = useProfileQuery(props.profileURI);

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftToHide, setDraftToHide] = useState<Set<string>>(new Set());
  const [draftToShow, setDraftToShow] = useState<Set<string>>(new Set());
  const [draftBio, setDraftBio] = useState<string>(profileData?.profile?.description);
  const [draftGkIconVisible, setDraftGkIconVisible] = useState<boolean>(profileData?.profile?.gkIconVisible);
  const [draftProfileImg, setDraftProfileImg] = useState({ preview: '', raw: null });
  const [draftHeaderImg, setDraftHeaderImg] = useState({ preview: '', raw: null });
  const [draftDisplayType, setDraftDisplayType] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState<string>(null);

  const { updateProfile } = useUpdateProfileMutation();
  const { fileUpload } = useFileUploadMutation();
  const { uploadProfileImages } = useUpdateProfileImagesMutation();

  const toggleHidden = useCallback((
    id: string,
    currentVisibility: boolean
  ) => {
    const newToHide = new Set(draftToHide);
    const newToShow = new Set(draftToShow);
    
    if (currentVisibility) {
      // NFT is visible on BE.
      if (newToHide.has(id)) {
        newToHide.delete(id);
      } else {
        newToHide.add(id);
      }
    } else {
      // NFT is hidden on BE.
      if (newToShow.has(id)) {
        newToShow.delete(id);
      } else {
        newToShow.add(id);
      }
    }
    setDraftToHide(newToHide);
    setDraftToShow(newToShow);
  }, [draftToHide, draftToShow]);

  const clearDrafts = useCallback(() => {
    // reset
    setDraftProfileImg({ preview: '', raw: null });
    setDraftHeaderImg({ preview: '', raw: null });
    setDraftBio(draftBio);
    setDraftGkIconVisible(draftGkIconVisible);
    setEditMode(false);
    setDraftToHide(new Set());
    setDraftToShow(new Set());
    setDraftDisplayType(null);
  }, [draftBio, draftGkIconVisible]);

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
  
        const result = await updateProfile({
          id: profileData?.profile?.id,
          description: draftBio,
          gkIconVisible: draftGkIconVisible,
          hideNFTIds: Array.from(draftToHide),
          showNFTIds: Array.from(draftToShow),
          displayType: draftDisplayType,
          ...(imageUploadResult
            ? {}
            : {
              bannerURL: headerUploadImage,
              photoURL: profileUploadImage,
            })
        });
  
        if (result) {
          mutateProfileData();
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
    draftProfileImg,
    draftHeaderImg,
    clearDrafts,
    uploadProfileImages,
    profileData?.profile?.id,
    updateProfile,
    draftBio,
    draftGkIconVisible,
    draftToHide,
    draftToShow,
    draftDisplayType,
    fileUpload,
    props.profileURI,
    mutateProfileData
  ]);
  
  return <ProfileEditContext.Provider value={{
    draftToHide,
    draftToShow,
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
    draftDisplayType,
    setDraftDisplayType,
    toggleHidden,
    hideNftIds: (toHide: string[]) => {
      const newToHide = new Set(draftToHide);
      const newToShow = new Set(draftToShow);
      toHide.forEach(id => {
        newToShow.delete(id);
        newToHide.add(id);
      });
      setDraftToHide(newToHide);
      setDraftToShow(newToShow);
    },
    showNftIds: (toShow: string[]) => {
      const newToHide = new Set(draftToHide);
      const newToShow = new Set(draftToShow);
      toShow.forEach(id => {
        newToHide.delete(id);
        newToShow.add(id);
      });
      setDraftToHide(newToHide);
      setDraftToShow(newToShow);
    },
    onHideAll: async () => {
      setDraftToHide(new Set());
      setDraftToShow(new Set());
      setSaving(true);
      const result = await updateProfile({
        id: profileData?.profile?.id,
        hideAllNFTs: true,
      });
      if (result) {
        mutateProfileData();
        clearDrafts();
      }
      setEditMode(false);
      setSaving(false);
    },
    onShowAll: async () => {
      setDraftToHide(new Set());
      setDraftToShow(new Set());
      setSaving(true);
      const result = await updateProfile({
        id: profileData?.profile?.id,
        showAllNFTs: true,
      });
      if (result) {
        mutateProfileData();
        clearDrafts();
      }
      setEditMode(false);
      setSaving(false);
    },
    saveProfile,
    saving,
    clearDrafts,
    selectedCollection,
    setSelectedCollection,
  }}>
    {props.children}
  </ProfileEditContext.Provider>;
}