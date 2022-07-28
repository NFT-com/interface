import { createContext, PropsWithChildren, useCallback, useRef } from 'react';

export type ScrollDirection = 'up' | 'down';

type ProfileScrollContextType = {
  scroll: (direction: ScrollDirection) => void;
  current: HTMLDivElement | null;
};

export const ProfileScrollContext = createContext<ProfileScrollContextType>({
  scroll: () => null,
  current: null,
});

export function ProfileScrollContextProvider(props: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);
  
  const scroll = useCallback((direction: ScrollDirection) => {
    if (direction === 'down') {
      ref.current.scrollTop += 15;
    } else {
      ref.current.scrollTop -= 15;
    }
  }, [ref]);

  return <ProfileScrollContext.Provider value={{
    scroll,
    current: ref.current,
  }}>
    <div ref={ref} className="h-full w-full flex flex-col mt-20 overflow-scroll">
      {props.children}
    </div>
  </ProfileScrollContext.Provider>;
}