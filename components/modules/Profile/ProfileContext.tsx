import { Maybe, Nft, ProfileDisplayType, ProfileLayoutType } from 'graphql/generated/types';
import { useFileUploadMutation } from 'graphql/hooks/useFileUploadMutation';
import { useMyNFTsQuery } from 'graphql/hooks/useMyNFTsQuery';
import { usePreviousValue } from 'graphql/hooks/usePreviousValue';
import { useProfileNFTsQuery } from 'graphql/hooks/useProfileNFTsQuery';
import { useProfileOrderingUpdateMutation } from 'graphql/hooks/useProfileOrderingUpdateMutation';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useSearchNFTsForProfile } from 'graphql/hooks/useSearchNFTsForProfile';
import { useSearchVisibleNFTsForProfile } from 'graphql/hooks/useSearchVisibleNFTsForProfile';
import { useUpdateProfileMutation } from 'graphql/hooks/useUpdateProfileMutation';
import { useUpdateProfileImagesMutation } from 'graphql/hooks/useUploadProfileImagesMutation';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';

import { DetailedNft } from './NftGrid';

import moment from 'moment';
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';

export interface DraftImg {
  preview: Maybe<string>,
  raw: Maybe<string | File>
}

export interface ProfileContextType {
  // display state
  publiclyVisibleNfts: PartialDeep<Nft>[];
  publiclyVisibleNftsNoEdit: PartialDeep<Nft>[];
  editModeNfts: PartialDeep<DetailedNft>[];
  publiclyVisibleNftCount: number;
  allOwnerNfts: PartialDeep<Nft>[];
  allOwnerNftCount: number;
  userIsAdmin: boolean;
  loadMoreNfts: () => void;
  loadMoreNftsEditMode: () => void;
  setAllItemsOrder: (items: PartialDeep<Nft>[]) => void;
  // editor state
  toggleHidden: (id: string, currentVisibility: boolean) => void;
  hideNftIds: (toHide: string[], hideAll?: boolean) => void;
  showNftIds: (toShow: string[], showAll?: boolean) => void;
  draftHeaderImg: DraftImg,
  setDraftHeaderImg: (img: DraftImg) => void,
  draftProfileImg: DraftImg,
  setDraftProfileImg: (img: DraftImg) => void,
  draftBio: Maybe<string>,
  setDraftBio: (bio: string) => void,
  draftGkIconVisible: Maybe<boolean>,
  setDraftGkIconVisible: (val: boolean) => void,
  draftDeployedContractsVisible: Maybe<boolean>,
  setDraftDeployedContractsVisible: (val: boolean) => void,
  draftDisplayType: ProfileDisplayType,
  setDraftDisplayType: (displayType: ProfileDisplayType) => void,
  draftLayoutType: ProfileLayoutType,
  setLayoutType: (layoutType: ProfileLayoutType) => void,
  setDescriptionsVisible: (isVisible: boolean) => void,
  setDraftLayoutType: (layoutType: ProfileLayoutType) => void,
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  clearDrafts: () => void;
  saveProfile: () => void;
  saveProfileImage: (file: {raw: any, preview: string}, type: string) => void
  saving: boolean;
  selectedCollection: Maybe<string>;
  setSelectedCollection: (collectionAddress: string) => void;
  draftNftsDescriptionsVisible: Maybe<boolean>;
  setDraftNftsDescriptionsVisible: (val: boolean) => void;
  loading: boolean;
  loadingAllOwnerNfts: boolean;
  hideAllNFTsValue: boolean;
  showAllNFTsValue: boolean;
  currentNftsDescriptionsVisible: boolean;
  currentLayoutType: ProfileLayoutType;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchVisibleNfts: PartialDeep<Nft>[];
  searchNfts: PartialDeep<Nft>[];
}

// initialize with default values
export const ProfileContext = React.createContext<ProfileContextType>({
  publiclyVisibleNfts: [],
  publiclyVisibleNftsNoEdit: [],
  editModeNfts: [],
  publiclyVisibleNftCount: 0,
  allOwnerNfts: [],
  allOwnerNftCount: 0,
  loadMoreNfts: () => null,
  loadMoreNftsEditMode: () => null,
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
  draftDeployedContractsVisible: false,
  setDraftDeployedContractsVisible: () => null,
  draftDisplayType: ProfileDisplayType.Nft,
  setDraftDisplayType: () => null,
  draftLayoutType: ProfileLayoutType.Default,
  setDraftLayoutType: () => null,
  setLayoutType: () => null,
  setDescriptionsVisible: () => null,
  editMode: false,
  setEditMode: () => null,
  clearDrafts: () => null,
  saveProfile: () => null,
  saveProfileImage: () => null,
  saving: false,
  selectedCollection: null,
  setSelectedCollection: () => null,
  draftNftsDescriptionsVisible: true,
  setDraftNftsDescriptionsVisible: () => null,
  loading: false,
  loadingAllOwnerNfts: false,
  hideAllNFTsValue: false,
  showAllNFTsValue: false,
  currentNftsDescriptionsVisible: true,
  currentLayoutType: ProfileLayoutType.Default,
  searchQuery: null,
  setSearchQuery: () => null,
  searchVisibleNfts: [],
  searchNfts: [],
});

export interface ProfileContextProviderProps {
  profileURI: string;
}

const PUBLIC_PROFILE_LOAD_COUNT = 8;

/**
 * This context provides state management and helper functions for viewing and editing Profiles.
 */
export function ProfileContextProvider(
  props: PropsWithChildren<ProfileContextProviderProps>
) {
  const { chain } = useNetwork();
  const { usePrevious } = usePreviousValue();

  /**
   * Queries
   */
  const [searchQuery, setSearchQuery] = useState(null);
  const { profileData, mutate: mutateProfileData } = useProfileQuery(props.profileURI);
  const { profileTokens: ownedProfileTokens } = useMyNftProfileTokens();
  const [paginatedAllOwnerNfts, setPaginatedAllOwnerNfts] = useState([]);
  const [afterCursor, setAfterCursor] = useState('');
  const [afterCursorEditMode, setAfterCursorEditMode] = useState('');
  const {
    nfts: publicProfileNfts,
    totalItems: publicProfileNftsCount,
    mutate: mutatePublicProfileNfts,
    loading,
    pageInfo
  } = useProfileNFTsQuery(
    profileData?.profile?.id,
    String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)),
    PUBLIC_PROFILE_LOAD_COUNT,
    afterCursor
  );
  const {
    data: allOwnerNfts,
    loading: loadingAllOwnerNfts,
    totalItems: allOwnerNftCount,
    mutate: mutateAllOwnerNfts,
    pageInfo: allOwnerNftsPageInfo,
  } = useMyNFTsQuery(PUBLIC_PROFILE_LOAD_COUNT, profileData?.profile?.id, afterCursorEditMode);
  const { nfts: searchVisibleNfts } = useSearchVisibleNFTsForProfile(props.profileURI, searchQuery);
  const { nfts: searchNfts } = useSearchNFTsForProfile(props.profileURI, searchQuery);
  /**
   * Profile v2 instant update state
   */
  const [currentLayoutType, setCurrentLayoutType] = useState<ProfileLayoutType>(profileData?.profile?.layoutType);
  const [currentNftsDescriptionsVisible, setCurrentNftsDescriptionsVisible] = useState<boolean>(profileData?.profile?.nftsDescriptionsVisible);

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
  const [draftLayoutType, setDraftLayoutType] = useState<ProfileLayoutType>(null);
  const [draftDeployedContractsVisible, setDraftDeployedContractsVisible] = useState<boolean>(profileData?.profile?.deployedContractsVisible);

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
    if (draftDeployedContractsVisible == null) {
      setDraftDeployedContractsVisible(profileData?.profile?.deployedContractsVisible);
    }
    if(currentLayoutType == null){
      setCurrentLayoutType(profileData?.profile?.layoutType);
    }
    if(currentNftsDescriptionsVisible == null){
      setCurrentNftsDescriptionsVisible(profileData?.profile?.nftsDescriptionsVisible);
    }
  }, [
    draftBio,
    draftDeployedContractsVisible,
    draftGkIconVisible,
    draftNftsDescriptionsVisible,
    currentLayoutType,
    currentNftsDescriptionsVisible,
    profileData?.profile?.deployedContractsVisible,
    profileData?.profile?.description,
    profileData?.profile?.gkIconVisible,
    profileData?.profile?.nftsDescriptionsVisible,
    profileData?.profile?.layoutType
  ]);

  // make sure this doesn't overwrite local changes, use server-provided value for initial state only.
  const [publiclyVisibleNfts, setPubliclyVisibleNfts] = useState<PartialDeep<Nft>[]>(null);
  const [publiclyVisibleNftsNoEdit, setPubliclyVisibleNftsNoEdit] = useState<PartialDeep<Nft>[]>(null);
  const [editModeNfts, setEditModeNfts] = useState<PartialDeep<DetailedNft>[]>(null);
  const [currentScrolledPosition, setCurrentScrolledPosition] = useState(0);
  const [isToggling, setIsToggling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const prevPublicProfileNfts = usePrevious(publicProfileNfts);
  const prevAllOwnerNfts = usePrevious(allOwnerNfts);
  const prevEditMode = usePrevious(editMode);

  const [showAllNFTsValue, setShowAllNFTsValue] = useState(publicProfileNftsCount === allOwnerNftCount);
  const [hideAllNFTsValue, setHideAllNFTsValue] = useState(publicProfileNftsCount === 0);
  
  // Profile page NO Edit Mode ONLY
  useEffect(() => {
    if(!loading && !editMode) {
      setPubliclyVisibleNfts(null);
      setEditModeNfts(null);
      if (!publiclyVisibleNftsNoEdit|| publiclyVisibleNftsNoEdit.length == 0) {
        setPubliclyVisibleNftsNoEdit(publicProfileNfts);
      }

      if (publicProfileNfts && publiclyVisibleNftsNoEdit && prevPublicProfileNfts !== publicProfileNfts) {
        if (afterCursor === '') {
          setPubliclyVisibleNftsNoEdit([...publicProfileNfts]);
        } else {
          setPubliclyVisibleNftsNoEdit([...publiclyVisibleNftsNoEdit, ...publicProfileNfts]);
        }
      }
    }
  }, [afterCursor, editMode, loading, prevEditMode, prevPublicProfileNfts, publicProfileNfts, publiclyVisibleNftsNoEdit]);

  // Rendering of Edit mode NFTS only - for pagination, toggling and drop/dragging visibility
  useEffect(() => {
    if (!loadingAllOwnerNfts && editMode) {
      setEditModeNfts(null);
      setPubliclyVisibleNftsNoEdit(null);
      const allOwnerNftsWithHiddenValue = allOwnerNfts.map(nft => {
        return { ...nft, hidden: nft.isHide };
      });

      // Edit mode NFTS rendering for the first time
      if (isNullOrEmpty(editModeNfts)) {
        setPubliclyVisibleNfts([...allOwnerNftsWithHiddenValue.filter(nft => !nft.isHide)]);
        const paginatedNotPubliclyVisibleNftsLast = paginatedAllOwnerNfts?.filter(nft => publiclyVisibleNfts?.find(nft2 => nft2.id === nft.id) == null) ?? [];
        setEditModeNfts([
          ...(publiclyVisibleNfts || []),
          ...paginatedNotPubliclyVisibleNftsLast || []
        ]);
      }

      // Edit mode NFTS rendering as user scroll down - pagination
      if (!isToggling && allOwnerNfts && prevAllOwnerNfts !== allOwnerNfts && afterCursorEditMode !== '') {
        console.log('paginate fdo');
        const publicVisiblePaginatedNFTs = allOwnerNftsWithHiddenValue.filter(nft => !nft.isHide);
        setPaginatedAllOwnerNfts([...paginatedAllOwnerNfts || [], ...allOwnerNftsWithHiddenValue]);
        setPubliclyVisibleNfts([...publiclyVisibleNfts || [],...publicVisiblePaginatedNFTs]);
        const paginatedNotPubliclyVisibleNftsLast = paginatedAllOwnerNfts?.filter(nft => publiclyVisibleNfts?.find(nft2 => nft2.id === nft.id) == null) ?? [];
        setEditModeNfts([
          ...(publiclyVisibleNfts || []),
          ...paginatedNotPubliclyVisibleNftsLast || []
        ]);
      }

      if (isDragging) {
        const paginatedNotPubliclyVisibleNftsLast = paginatedAllOwnerNfts?.filter(nft => publiclyVisibleNfts?.find(nft2 => nft2.id === nft.id) == null) ?? [];
        setEditModeNfts([
          ...(publiclyVisibleNfts || []),
          ...paginatedNotPubliclyVisibleNftsLast || []
        ]);
        setIsDragging(false);
      }

      // if (!paginatedAllOwnerNfts || paginatedAllOwnerNfts.length == 0) {
      //   setPaginatedAllOwnerNfts(allOwnerNftsWithHiddenValue);
      // }

      // if (allOwnerNfts && prevAllOwnerNfts !== allOwnerNfts && afterCursorEditMode !== '') {
      //   setPaginatedAllOwnerNfts([...paginatedAllOwnerNfts, ...allOwnerNftsWithHiddenValue]);
      //   console.log('effect 1 paginatedAllOwnerNfts fdo', paginatedAllOwnerNfts);
      //   console.log('effect 1 allOwnerNftsWithHiddenValue fdo', allOwnerNftsWithHiddenValue);
      // }
      
      // if ((!editModeNfts || (editModeNfts && editModeNfts.length === 0)) && paginatedAllOwnerNfts.length > 0 ) {
      //   setEditModeNfts([...allOwnerNftsWithHiddenValue]);
      //   setPubliclyVisibleNfts([...allOwnerNftsWithHiddenValue.filter(nft => !nft.isHide)]);
      //   console.log('effect 2 fdo allOwnerNftsWithHiddenValue', allOwnerNftsWithHiddenValue);
      // } else if (afterCursorEditMode !== '' && editModeNfts.length < paginatedAllOwnerNfts.length ){
      //   const paginatedNotPubliclyVisibleNftsLast = paginatedAllOwnerNfts?.filter(nft => publiclyVisibleNfts?.find(nft2 => nft2.id === nft.id) == null).sort((a,b) => a.hidden - b.hidden) ?? [];
      //   setEditModeNfts([...(publiclyVisibleNfts || []),...paginatedNotPubliclyVisibleNftsLast]);
      //   console.log('effect 3 allOwnerNftsWithHiddenValue fdo', allOwnerNftsWithHiddenValue);
      //   console.log('effect 3 publiclyVisibleNfts fdo', publiclyVisibleNfts);
      //   console.log('effect 3 paginatedNotPubliclyVisibleNftsLast fdo', paginatedNotPubliclyVisibleNftsLast);
      // }

      // if (isToggling && prevAllOwnerNfts === allOwnerNfts && editModeNfts && editModeNfts.length === paginatedAllOwnerNfts.length && prevPublicProfileNfts.length !== publiclyVisibleNfts.length) {
      //   const paginatedNotPubliclyVisibleNfts = paginatedAllOwnerNfts?.filter(nft => publiclyVisibleNfts?.find(nft2 => nft2.id === nft.id) == null).sort((a,b) => a.hidden - b.hidden) ?? [];
      //   setEditModeNfts([...(publiclyVisibleNfts || []),...paginatedNotPubliclyVisibleNfts]);
      //   setIsToggling(false);
      //   console.log('effect 4 allOwnerNftsWithHiddenValue fdo', allOwnerNftsWithHiddenValue);
      //   console.log('effect 4 publiclyVisibleNfts fdo', publiclyVisibleNfts);
      //   console.log('effect 4 paginatedNotPubliclyVisibleNfts fdo', paginatedNotPubliclyVisibleNfts);
      // }
    }
  }, [afterCursorEditMode, allOwnerNfts, editMode, editModeNfts, isToggling, loadingAllOwnerNfts, paginatedAllOwnerNfts, prevAllOwnerNfts, publiclyVisibleNfts]);
 
  useEffect(() => {
    if (!loadingAllOwnerNfts && editMode && isToggling) {
      setPubliclyVisibleNftsNoEdit(null);
      if (showAllNFTsValue && !hideAllNFTsValue) {
        paginatedAllOwnerNfts.forEach(nft => nft.hidden= false);
        setEditModeNfts([
          ...paginatedAllOwnerNfts
        ]);
        setIsToggling(false);
      }
      if (!showAllNFTsValue && hideAllNFTsValue) {
        paginatedAllOwnerNfts.forEach(nft => nft.hidden= true);
        setEditModeNfts([
          ...paginatedAllOwnerNfts
        ]);
        setIsToggling(false);
      }

      currentScrolledPosition !== 0 && window.scrollTo(0, currentScrolledPosition);
    }
  }, [currentScrolledPosition, editMode, hideAllNFTsValue, isToggling, loadingAllOwnerNfts, paginatedAllOwnerNfts, showAllNFTsValue]);

  useEffect(() => {
    setDraftDisplayType(null);
  }, [editMode]);

  const setAllItemsOrder = useCallback((orderedItems: DetailedNft[]) => {
    setIsDragging(true);
    setPubliclyVisibleNfts([...orderedItems.filter((nft: DetailedNft) => !nft.hidden),]);
  }, []);

  /**
   * Mutations
   */
  const { updateProfile } = useUpdateProfileMutation();
  const { fileUpload } = useFileUploadMutation();
  const { uploadProfileImages } = useUpdateProfileImagesMutation();
  const { updateOrder } = useProfileOrderingUpdateMutation();

  const toggleHidden = useCallback(async(
    id: string,
    currentVisibility: boolean
  ) => {
    setShowAllNFTsValue(false);
    setHideAllNFTsValue(false);
    setIsToggling(true);
    const nft = searchQuery && getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ? searchNfts.find(nft => nft.id === id) : paginatedAllOwnerNfts.find(nft => nft.id === id);
    await setCurrentScrolledPosition(window.pageYOffset);
    if (currentVisibility) {
      nft.hidden = true;
      setPubliclyVisibleNfts((publiclyVisibleNfts ?? []).slice().filter(nft => nft.id !== id));
    } else {
      // NFT is currently hidden.
      nft.hidden = false;
      setPubliclyVisibleNfts([...publiclyVisibleNfts, nft]);
      console.log('toggle 2 fdo publiclyVisibleNfts', id, publiclyVisibleNfts);
    }
  }, [paginatedAllOwnerNfts, publiclyVisibleNfts, searchNfts, searchQuery]);

  const clearDrafts = useCallback(() => {
    // reset
    setDraftProfileImg({ preview: '', raw: null });
    setDraftHeaderImg({ preview: '', raw: null });
    setDraftBio(profileData?.profile?.description);
    setDraftGkIconVisible(draftGkIconVisible);
    setDraftNftsDescriptionsVisible(draftNftsDescriptionsVisible);
    setDraftDeployedContractsVisible(profileData?.profile?.deployedContractsVisible);
    setEditMode(false);
    setDraftLayoutType(null);
    setPubliclyVisibleNfts(null);
  }, [
    draftGkIconVisible,
    draftNftsDescriptionsVisible,
    profileData?.profile?.deployedContractsVisible,
    profileData?.profile?.description
  ]);

  useEffect(() => {
    setSelectedCollection(null);
  }, [editMode]);

  const saveProfileImage = useCallback(async (file: {raw: any, preview: string}, type: 'profile' | 'banner') => {
    try {
      if (file?.raw?.size > 2000000) { // 2MB
        alert('Image is too large (> 2MB). Please upload a smaller image.');
      } else {
        setSaving(true);
        const imageUploadResult = await uploadProfileImages({
          profileId: profileData?.profile?.id,
          compositeProfileURL: false,
          avatar: type === 'profile' ? file.raw : null,
          banner: type === 'banner' ? file.raw : null
        });

        let headerUploadImage: string;
        let profileUploadImage: string;
        if (!imageUploadResult) {
          if (!isNullOrEmpty(file.raw) && type === 'banner') {
            headerUploadImage = await fileUpload(
              draftHeaderImg,
              props.profileURI + '-header-img-' + moment.now()
            );
          }
          if (!isNullOrEmpty(file.raw) && type === 'profile') {
            profileUploadImage = await fileUpload(
              draftProfileImg,
              props.profileURI + '-profile-img-' + moment.now()
            );
          }
        }

        const result = await updateProfile({
          id: profileData?.profile?.id,
          ...(imageUploadResult
            ? {}
            : {
              bannerURL: headerUploadImage,
              photoURL: profileUploadImage,
            })
        });

        if (result) {
          window.scrollTo(0, 0);
          mutateProfileData();
          toast.success('Profile changes saved');
        }
        setSaving(false);
      }
    } catch (err) {
      console.log('error while saving profile: ', err);
      toast.error('Error while saving profile.');
      clearDrafts();
      setSaving(false);
    }
  }, [clearDrafts, draftHeaderImg, draftProfileImg, fileUpload, mutateProfileData, profileData?.profile?.id, props.profileURI, updateProfile, uploadProfileImages]);

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
          deployedContractsVisible: draftDeployedContractsVisible,
          hideNFTIds: paginatedAllOwnerNfts?.filter(nft => publiclyVisibleNfts.find(nft2 => nft2.id === nft.id) == null)?.map(nft => nft.id),
          showNFTIds: publiclyVisibleNfts?.map(nft => nft.id),
          layoutType: draftLayoutType,
          showAllNFTs: showAllNFTsValue,
          hideAllNFTs: hideAllNFTsValue,
          ...(imageUploadResult
            ? {}
            : {
              bannerURL: headerUploadImage,
              photoURL: profileUploadImage,
            })
        });

        if (result) {
          window.scrollTo(0, 0);
          setPubliclyVisibleNfts([]);
          setPubliclyVisibleNftsNoEdit(null);
          setEditModeNfts([]);
          setAfterCursorEditMode('');
          setAfterCursor('');
          mutateProfileData();
          mutatePublicProfileNfts();
          mutateAllOwnerNfts();
          clearDrafts();
          toast.success('Profile changes saved');
        }
        setSaving(false);
      }
    } catch (err) {
      console.log('error while saving profile: ', err);
      toast.error('Error while saving profile.');
      clearDrafts();
      setSaving(false);
    }
  }, [clearDrafts, draftBio, draftDeployedContractsVisible, draftGkIconVisible, draftHeaderImg, draftLayoutType, draftNftsDescriptionsVisible, draftProfileImg, editModeNfts, fileUpload, hideAllNFTsValue, mutateAllOwnerNfts, mutateProfileData, mutatePublicProfileNfts, paginatedAllOwnerNfts, profileData?.profile?.description, profileData?.profile?.id, props.profileURI, publiclyVisibleNfts, showAllNFTsValue, updateOrder, updateProfile, uploadProfileImages]);

  const setLayoutType = useCallback(async (type: ProfileLayoutType) => {
    try {
      setCurrentLayoutType(type);
      await updateProfile({
        id: profileData?.profile?.id,
        layoutType: type
      });
    } catch (err) {
      console.log('error while saving profile: ', err);
      toast.error('Error while saving profile.');
    }
  }, [updateProfile, profileData]);

  const setDescriptionsVisible = useCallback(async (isVisible: boolean) => {
    try {
      setCurrentNftsDescriptionsVisible(isVisible);
      await updateProfile({
        id: profileData?.profile?.id,
        nftsDescriptionsVisible: isVisible
      });
    } catch (err) {
      console.log('error while saving profile: ', err);
      toast.error('Error while saving profile.');
    }
  }, [updateProfile, profileData]);

  return <ProfileContext.Provider value={{
    editModeNfts: editModeNfts ?? [],
    allOwnerNfts: paginatedAllOwnerNfts ?? [],
    allOwnerNftCount: allOwnerNftCount ?? 0,
    publiclyVisibleNfts: publiclyVisibleNfts ?? [],
    publiclyVisibleNftCount: publicProfileNftsCount ?? 0,
    publiclyVisibleNftsNoEdit: publiclyVisibleNftsNoEdit ?? [],
    loadMoreNfts: () => {
      pageInfo.lastCursor && setAfterCursor(pageInfo.lastCursor);
    },
    loadMoreNftsEditMode: () => {
      if (publicProfileNftsCount > 0 && publicProfileNftsCount > publiclyVisibleNfts?.length && !loadingAllOwnerNfts) {
        pageInfo.lastCursor && setAfterCursor(pageInfo.lastCursor);
      } else {
        allOwnerNftsPageInfo.lastCursor && setAfterCursorEditMode(allOwnerNftsPageInfo.lastCursor);
      }
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
    draftDeployedContractsVisible,
    setDraftDeployedContractsVisible: (val: boolean) => {
      setDraftDeployedContractsVisible(val);
    },
    draftNftsDescriptionsVisible,
    setDraftNftsDescriptionsVisible: (val: boolean) => {
      setDraftNftsDescriptionsVisible(val);
    },
    draftDisplayType,
    setDraftDisplayType,
    setLayoutType,
    setDescriptionsVisible,
    draftLayoutType,
    setDraftLayoutType,
    toggleHidden,
    hideNftIds: (toHide: string[], hideAll = false) => {
      setShowAllNFTsValue(false);
      setIsToggling(true);
      if (hideAll) {
        setHideAllNFTsValue(true);
        setPubliclyVisibleNfts([]);
        paginatedAllOwnerNfts.forEach(nft => nft.hidden= true);
        setEditModeNfts([
          ...paginatedAllOwnerNfts
        ]);
      } else {
        setPubliclyVisibleNfts((publiclyVisibleNfts ?? []).slice().filter(nft => !toHide.includes(nft.id)));
      }
    },
    showNftIds: (toShow: string[], showAll = false) => {
      setHideAllNFTsValue(false);
      setIsToggling(true);
      if (showAll) {
        setShowAllNFTsValue(true);
        paginatedAllOwnerNfts.forEach(nft => nft.hidden= false);
        setEditModeNfts([
          ...paginatedAllOwnerNfts
        ]);
        setPubliclyVisibleNfts([...paginatedAllOwnerNfts]);
      } else {
        const additions = [];
        paginatedAllOwnerNfts?.filter(nft => toShow?.includes(nft.id))?.forEach((nft) => {
          if (!publiclyVisibleNfts?.includes(nft) && !additions?.includes(nft)) {
            additions.push(nft);
          }
        });
        setPubliclyVisibleNfts([...(paginatedAllOwnerNfts.length === additions.length? [] : publiclyVisibleNfts), ...additions]);
      }
    },
    saveProfile,
    saveProfileImage,
    saving,
    clearDrafts,
    selectedCollection,
    setSelectedCollection,
    loading,
    loadingAllOwnerNfts,
    hideAllNFTsValue,
    showAllNFTsValue,
    currentNftsDescriptionsVisible,
    currentLayoutType,
    searchQuery,
    setSearchQuery,
    searchVisibleNfts,
    searchNfts
  }}>
    {props.children}
  </ProfileContext.Provider>;
}
