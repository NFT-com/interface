import React, { PropsWithChildren, useState } from 'react';

export interface ProfileFactoryModalContextType {
  successModalOpen: boolean,
  setSuccessModalOpen: (open: boolean) => void,
}

export const ProfileFactoryModalContext = React.createContext<ProfileFactoryModalContextType>({
  successModalOpen: false,
  setSuccessModalOpen: () => null,
});

export function ProfileFactoryModalContextProvider(
  props: PropsWithChildren
) {
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  return (
    <ProfileFactoryModalContext.Provider
      value={{
        successModalOpen: successModalOpen,
        setSuccessModalOpen: (open: boolean) => {
          setSuccessModalOpen(open);
        }
      }}>
      {props.children}
    </ProfileFactoryModalContext.Provider>);
}