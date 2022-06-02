import { Maybe } from 'graphql/generated/types';
import { useFileUploadMutation } from 'graphql/hooks/useFileUploadMutation';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useUpdateProfileMutation } from 'graphql/hooks/useUpdateProfileMutation';
import { useUpdateProfileImagesMutation } from 'graphql/hooks/useUploadProfileImagesMutation';
import { isNullOrEmpty } from 'utils/helpers';

import moment from 'moment';
import React, { PropsWithChildren, useCallback, useState } from 'react';

export interface DraftImg {
  preview: Maybe<string>,
  raw: Maybe<string | File>
}

interface ProfileEditGalleryContextType {
  draftToHide: Set<string>; // ID is of format collectionAddress:tokenId
  draftToShow: Set<string>;
  toggleHidden: (id: string, currentVisibility: boolean) => void;
  draftShowAll: boolean;
  draftHideAll: boolean;
  onHideAll: () => void;
  onShowAll: () => void;
  draftHeaderImg: DraftImg,
  setDraftHeaderImg: (img: DraftImg) => void,
  draftProfileImg: DraftImg,
  setDraftProfileImg: (img: DraftImg) => void,
  draftBio: Maybe<string>,
  setDraftBio: (bio: string) => void,
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  clearDrafts: () => void;
  saveProfile: () => void;
  saving: boolean;
}

// initialize with default values
export const ProfileEditGalleryContext = React.createContext<ProfileEditGalleryContextType>({
  draftToHide: new Set(),
  draftToShow: new Set(),
  toggleHidden: () => null,
  draftShowAll: false,
  draftHideAll: false,
  onHideAll: () => null,
  onShowAll: () => null,
  draftHeaderImg: { preview: '', raw: '' },
  setDraftHeaderImg: () => null,
  draftProfileImg: { preview: '', raw: '' },
  setDraftProfileImg: () => null,
  draftBio: null,
  setDraftBio: () => null,
  editMode: false,
  setEditMode: () => null,
  clearDrafts: () => null,
  saveProfile: () => null,
  saving: false,
});

export interface ProfileEditGalleryContextProviderProps {
  profileURI: string;
}

/**
 * This context provides state management and helper functions for editing Profiles.
 * 
 * This context does _not_ return the server-provided values for all fields. You should
 * check this context for drafts, and fallback on the server-provided values at the callsite.
 * 
 */
export function ProfileEditGalleryContextProvider(
  props: PropsWithChildren<ProfileEditGalleryContextProviderProps>
) {
  const { profileData, mutate: mutateProfileData } = useProfileQuery(props.profileURI);

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftToHide, setDraftToHide] = useState<Set<string>>(new Set());
  const [draftToShow, setDraftToShow] = useState<Set<string>>(new Set());
  const [draftShowAll, setDraftShowAll] = useState(false);
  const [draftHideAll, setDraftHideAll] = useState(false);
  const [draftBio, setDraftBio] = useState<string>(profileData?.profile?.description);
  const [draftProfileImg, setDraftProfileImg] = useState({ preview: '', raw: null });
  const [draftHeaderImg, setDraftHeaderImg] = useState({ preview: '', raw: null });

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
    setDraftShowAll(false);
    setDraftHideAll(false);
    setDraftToHide(newToHide);
    setDraftToShow(newToShow);
  }, [draftToHide, draftToShow]);

  const clearDrafts = useCallback(() => {
    // reset
    setDraftProfileImg({ preview: '', raw: null });
    setDraftHeaderImg({ preview: '', raw: null });
    setDraftBio(draftBio);
    setEditMode(false);
    setDraftToHide(new Set());
    setDraftToShow(new Set());
    setDraftShowAll(false);
    setDraftHideAll(false);
  }, [draftBio]);

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
          hideNFTIds: Array.from(draftToHide),
          showNFTIds: Array.from(draftToShow),
          showAllNFTs: draftShowAll,
          hideAllNFTs: draftHideAll,
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
    draftHeaderImg,
    draftProfileImg,
    updateProfile,
    profileData?.profile?.id,
    draftBio,
    draftToHide,
    draftToShow,
    draftShowAll,
    draftHideAll,
    fileUpload,
    uploadProfileImages,
    props.profileURI,
    clearDrafts,
    mutateProfileData
  ]);
  
  return <ProfileEditGalleryContext.Provider value={{
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
    toggleHidden,
    draftHideAll,
    draftShowAll,
    onHideAll: () => {
      setDraftShowAll(false);
      setDraftToHide(new Set());
      setDraftToShow(new Set());
      setDraftHideAll(true);
    },
    onShowAll: () => {
      setDraftHideAll(false);
      setDraftToHide(new Set());
      setDraftToShow(new Set());
      setDraftShowAll(true);
    },
    saveProfile,
    saving,
    clearDrafts
  }}>
    {props.children}
  </ProfileEditGalleryContext.Provider>;
}