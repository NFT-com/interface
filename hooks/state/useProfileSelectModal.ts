import { GraphQLContext } from 'graphql/client/GraphQLProvider';

import { useCallback, useContext } from 'react';
import useSWR from 'swr';

export function useProfileSelectModal() {
  const { data, mutate } = useSWR('profileSelectModal', { fallbackData: false });
  const { signed } = useContext(GraphQLContext);

  const loading = !data;
  const useToggleProfileSelectModal = useCallback(() => {
    mutate(!data);
  }, [data, mutate]);

  const setProfileSelectModalOpen = useCallback((open: boolean) => {
    if(signed){
      setTimeout(() => {
        mutate(open);
      }, 2000);
    }
  }, [mutate, signed]);

  return {
    loading,
    profileSelectModal: data,
    useToggleProfileSelectModal,
    setProfileSelectModalOpen,
  };
}