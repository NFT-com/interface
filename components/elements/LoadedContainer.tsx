
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';

export interface LoadedContainerProps {
  loaded: boolean;
  durationSec?: number;
  showLoader?: boolean;
  // todo: make this the default
  fitToParent?: boolean;
  // todo: support different animation variants
  newLoader?: boolean
}

const DynamicLoader = dynamic(() => import('./Loader'));

export function LoadedContainer(props: PropsWithChildren<LoadedContainerProps>) {
  return (
    <AnimatePresence>
      {props.newLoader ?
        !props.loaded && props.showLoader !== false &&
          <div className='flex justify-center py-10'>
            <DynamicLoader stroke='stroke-[#707070]' size='h-8' />
          </div>
        :
        !props.loaded && props.showLoader !== false && <DynamicLoader />
      }

      {props.loaded && <motion.div
        className={props.fitToParent === true ? 'h-full w-full' : ''}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: 'easeInOut', duration: props.durationSec ?? 0.3 }}
      >
        {props.children}
      </motion.div>}
    </AnimatePresence>
  );
}