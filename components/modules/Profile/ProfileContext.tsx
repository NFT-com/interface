import { Maybe, Nft, ProfileDisplayType, ProfileLayoutType } from 'graphql/generated/types';
import { useFileUploadMutation } from 'graphql/hooks/useFileUploadMutation';
import { useMyNFTsQuery } from 'graphql/hooks/useMyNFTsQuery';
import { usePreviousValue } from 'graphql/hooks/usePreviousValue';
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
  hideNftIds: (toHide: string[], hideAll: boolean) => void;
  showNftIds: (toShow: string[], showAll: boolean) => void;
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
  loading: boolean;
  loadingAllOwnerNfts: boolean;
  hideAllNFTsValue: boolean;
  showAllNFTsValue: boolean;
}

// initialize with default values
export const ProfileContext = React.createContext<ProfileContextType>({
  publiclyVisibleNfts: [],
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
  editMode: false,
  setEditMode: () => null,
  clearDrafts: () => null,
  saveProfile: () => null,
  saving: false,
  selectedCollection: null,
  setSelectedCollection: () => null,
  draftNftsDescriptionsVisible: true,
  setDraftNftsDescriptionsVisible: () => null,
  loading: false,
  loadingAllOwnerNfts: false,
  hideAllNFTsValue: false,
  showAllNFTsValue: false,
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
  }, [
    draftBio,
    draftDeployedContractsVisible,
    draftGkIconVisible,
    draftNftsDescriptionsVisible,
    profileData?.profile?.deployedContractsVisible,
    profileData?.profile?.description,
    profileData?.profile?.gkIconVisible,
    profileData?.profile?.nftsDescriptionsVisible
  ]);

  // make sure this doesn't overwrite local changes, use server-provided value for initial state only.
  const [publiclyVisibleNfts, setPubliclyVisibleNfts] = useState<PartialDeep<Nft>[]>(null);
  const [editModeNfts, setEditModeNfts] = useState<PartialDeep<DetailedNft>[]>(null);
  const [currentScrolledPosition, setCurrentScrolledPosition] = useState(0);

  const prevPublicProfileNfts = usePrevious(publicProfileNfts);
  const prevAllOwnerNfts = usePrevious(allOwnerNfts);

  console.log('publicProfileNftsCount fdo', publicProfileNftsCount);
  console.log('allOwnerNftCount fdo', allOwnerNftCount);
  const [showAllNFTsValue, setShowAllNFTsValue] = useState(publicProfileNftsCount === allOwnerNftCount);
  const [hideAllNFTsValue, setHideAllNFTsValue] = useState(publicProfileNftsCount === 0);

  useEffect(() => {
    if (!loadingAllOwnerNfts) {
      if (!paginatedAllOwnerNfts || paginatedAllOwnerNfts.length == 0 || afterCursorEditMode === '') {
        setPaginatedAllOwnerNfts(allOwnerNfts);
      }

      if (allOwnerNfts && prevAllOwnerNfts !== allOwnerNfts && afterCursorEditMode !== '') {
        setPaginatedAllOwnerNfts([...paginatedAllOwnerNfts, ...allOwnerNfts]);
      }
    }
  }, [afterCursorEditMode, allOwnerNfts, loadingAllOwnerNfts, paginatedAllOwnerNfts, prevAllOwnerNfts]);

  useEffect(() => {
    if (!loadingAllOwnerNfts) {
      const paginatedNotPubliclyVisibleNfts = paginatedAllOwnerNfts?.filter(nft => publiclyVisibleNfts?.find(nft2 => nft2.id === nft.id) == null) ?? [];
      if (!showAllNFTsValue && !hideAllNFTsValue) {
        setEditModeNfts([
          ...setHidden(publiclyVisibleNfts ?? [], false),
          ...setHidden(paginatedNotPubliclyVisibleNfts, true)
        ]);
        return;
      } else if (showAllNFTsValue && !hideAllNFTsValue) {
        setEditModeNfts([
          ...setHidden(publiclyVisibleNfts ?? [], false),
          ...setHidden(paginatedNotPubliclyVisibleNfts, false)
        ]);
      } else if (!showAllNFTsValue && hideAllNFTsValue) {
        setEditModeNfts([
          ...setHidden(publiclyVisibleNfts ?? [], true),
          ...setHidden(paginatedNotPubliclyVisibleNfts, true)
        ]);
      }

      currentScrolledPosition !== 0 && window.scrollTo(0, currentScrolledPosition);
    }
  }, [currentScrolledPosition, hideAllNFTsValue, loadingAllOwnerNfts, paginatedAllOwnerNfts, publiclyVisibleNfts, showAllNFTsValue]);

  useEffect(() => {
    setDraftDisplayType(null);
  }, [editMode]);

  useEffect(() => {
    if (saving) {
      setAfterCursor('');
      setAfterCursorEditMode('');
    }
    saving && setAfterCursor('');
  }, [saving]);

  const setAllItemsOrder = useCallback((orderedItems: DetailedNft[]) => {
    setEditModeNfts([
      ...orderedItems.filter((nft: DetailedNft) => !nft.hidden),
      ...orderedItems.filter((nft: DetailedNft) => nft.hidden),
    ]);
  }, []);

  useEffect(() => {
    if(!editMode) {
      if (publiclyVisibleNfts == null || publiclyVisibleNfts.length == 0|| afterCursor === '') {
        setPubliclyVisibleNfts(publicProfileNfts);
      }

      if (publicProfileNfts && prevPublicProfileNfts !== publicProfileNfts && afterCursor !== '') {
        setPubliclyVisibleNfts([...publiclyVisibleNfts, ...publicProfileNfts]);
      }
    }
  }, [afterCursor, editMode, prevPublicProfileNfts, publicProfileNfts, publiclyVisibleNfts]);

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

    await setCurrentScrolledPosition(window.pageYOffset);
    if (currentVisibility) {
      await setPubliclyVisibleNfts((publiclyVisibleNfts ?? []).slice().filter(nft => nft.id !== id));
    } else {
      // NFT is currently hidden.
      const nft = paginatedAllOwnerNfts.find(nft => nft.id === id);
      await setPubliclyVisibleNfts([...publiclyVisibleNfts, nft]);
    }
  }, [paginatedAllOwnerNfts, publiclyVisibleNfts]);

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
          setAfterCursor('');
          setAfterCursorEditMode('');
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
    allOwnerNfts: paginatedAllOwnerNfts ?? [],
    allOwnerNftCount: allOwnerNftCount ?? 0,
    publiclyVisibleNfts: publiclyVisibleNfts ?? [],
    publiclyVisibleNftCount: publicProfileNftsCount ?? 0,
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
    draftLayoutType,
    setDraftLayoutType,
    toggleHidden,
    hideNftIds: (toHide: string[], hideAll = false) => {
      setShowAllNFTsValue(false);
      if (hideAll) {
        setHideAllNFTsValue(true);
        setPubliclyVisibleNfts([]);
      } else {
        setPubliclyVisibleNfts((publiclyVisibleNfts ?? []).slice().filter(nft => !toHide.includes(nft.id)));
      }
    },
    showNftIds: (toShow: string[], showAll = false) => {
      setHideAllNFTsValue(false);
      if (showAll) {
        setShowAllNFTsValue(true);
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
    saving,
    clearDrafts,
    selectedCollection,
    setSelectedCollection,
    loading,
    loadingAllOwnerNfts,
    hideAllNFTsValue,
    showAllNFTsValue
  }}>
    {props.children}
  </ProfileContext.Provider>;
}
