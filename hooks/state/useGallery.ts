import useSWR from 'swr';

export interface GalleryState {
  galleryItemType: 'gk' | 'profile';
  galleryShowMyStuff: boolean;
}

export default function useGallery() {
  const { data, mutate } = useSWR('gallery',
    {
      fallbackData:
      {
        galleryItemType: 'gk',
        galleryShowMyStuff: false
      }
    });

  const loading = !data;
    
  const setGalleryItemType = (galleryItemType: 'gk' | 'profile') => {
    mutate({
      ...data,
      galleryItemType
    });
  };

  const setGalleryShowMyStuff = (galleryShowMyStuff: boolean) => {
    mutate({
      ...data,
      galleryShowMyStuff
    });
  };

  return {
    loading,
    galleryItemType: data.galleryItemType,
    galleryShowMyStuff: data.galleryShowMyStuff,
    setGalleryItemType,
    setGalleryShowMyStuff
  };
}