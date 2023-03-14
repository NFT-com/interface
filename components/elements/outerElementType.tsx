import { Footer as StaticFooter } from 'components/elements/Footer';

import { useScroll } from '@use-gesture/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { forwardRef, useRef } from 'react';

const emptyFunction = (): void => {
  return;
};

const DynamicFooter = dynamic<React.ComponentProps<typeof StaticFooter>>(() => import('components/elements/Footer').then(mod => mod.Footer));

type DocumentPropsType = React.HTMLProps<HTMLElement>;

// eslint-disable-next-line react/display-name
export const outerElementType = forwardRef<HTMLElement, DocumentPropsType>(
  ({ onScroll, children }, forwardedRef) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const location = router.pathname;
    let windowObject;
    if (typeof window !== 'undefined') {
      windowObject = window;
    }
    useScroll(
      () => {
        if (!(onScroll instanceof Function)) {
          return;
        }

        const { clientWidth, clientHeight, scrollLeft, scrollTop, scrollHeight, scrollWidth } =
          document.documentElement;

        if (onScroll != null) {
          onScroll({
            currentTarget: {
              clientHeight,
              clientWidth,
              scrollLeft,
              addEventListener: emptyFunction,
              removeEventListener: emptyFunction,
              dispatchEvent: () => false,
              scrollTop:
                scrollTop -
                (containerRef.current
                  ? containerRef.current.getBoundingClientRect().top + scrollTop
                  : 0),
              scrollHeight,
              scrollWidth,
            },
          } as unknown as React.UIEvent<HTMLElement>);
        }
      },
      { target: windowObject },
    );

    if (forwardedRef != null && !(forwardedRef instanceof Function)) {
      forwardedRef.current = document.documentElement;
    }

    return (
      <>
        <div ref={containerRef} style={{ position: 'relative' }}>
          {children}
        </div>
        {location.includes('collections') ? <DynamicFooter /> : null}
      </>
    );
  },
);