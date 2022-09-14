import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw';

import { CollectionsFiltersContent } from './CollectionsFiltersContent';
import { CuratedCollectionsFilter } from './CuratedCollectionsFilter';
import { NFTsFiltersContent } from './NFTsFiltersContent';

import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export interface OptionNavProps {
  title?: string;
  icon: string | any;
  onOptionNav?: () => void
  backgroundColor?: string;
  filtersData?: any;
}

export const SideNav = (props: {onSideNav: (term: string) => void, filtersData?: any}) => {
  const { sideNavOpen, setSearchFilters } = useSearchModal();
  const router = useRouter();

  useEffect(() => {
    setSearchFilters(props.filtersData);
  }, [props.filtersData, setSearchFilters]);

  return(
    <motion.div
      animate={{
        x: sideNavOpen ? 0 : -310 }}
      transition={{ duration: 0.2 }}
      className={tw(
        'w-[19rem]',
        sideNavOpen ? 'pr-4' : '-ml-[19rem]')}
    >
      {!router.pathname.includes('/app/collection/')
        ? (
          <>
            <CuratedCollectionsFilter onClick={props.onSideNav} collapsed={false}/>
            {props.filtersData?.length > 0 && <NFTsFiltersContent />}
          </>
        )
        : (
          <CollectionsFiltersContent />
        )}
    </motion.div>
  );
};