import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw';

import { CollectionsFiltersContent } from './CollectionsFiltersContent';
import { CuratedCollectionsFilter } from './CuratedCollectionsFilter';
import { NFTsFiltersContent } from './NFTsFiltersContent';

import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { FunnelSimple } from 'phosphor-react';
import CaretCircle from 'public/caret_circle.svg';
import Flask from 'public/flask.svg';
import { PropsWithChildren, useEffect, useState } from 'react';

export interface OptionNavProps {
  title?: string;
  icon: string | any;
  onOptionNav?: () => void
  backgroundColor?: string;
  filtersData?: any;
}

export function OptionNav(props: PropsWithChildren<OptionNavProps>) {
  const router = useRouter();
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(!router.pathname.includes('discover/') ? false : true);
  const { sideNavOpen, setSideNavOpen } = useSearchModal();

  return(
    <>
      <div className={tw(
        'flex justify-around items-center minmd:justify-start minlg:justify-between minmd:space-x-2 w-full',
        `${props.backgroundColor} py-3`)}>
        <div
          className="flex grow items-center pl-1 cursor-pointer"
          onClick={() => {
            setIsFilterCollapsed(!isFilterCollapsed);
            props.onOptionNav && props.onOptionNav();
          }}>
          {props.icon}
          <span className="text-black text-lg minmd:text-xl font-medium ml-2">{props.title}</span>
        </div>
        <div className="cursor-pointer">
          {sideNavOpen
            ? <CaretCircle
              onClick={() => {
                setSideNavOpen(false);
                setIsFilterCollapsed(true);
              }}
              className={tw('transition-transform -rotate-90 mr-4')}
            />
            : <div
              className="w-6 h-6 mr-5" color={'grey'} onClick={() => {
                setSideNavOpen(true);
              }}>{props.icon}
            </div>}
        </div>
      </div>
      <motion.div
        animate={{
          height: !sideNavOpen || isFilterCollapsed ? 0 : 'auto' }}
        transition={{ duration: 0.2 }}
        className={tw('overflow-hidden')}
      >
        {props.children}
      </motion.div>
    </>
  );
}

export const SideNav = (props: {onSideNav: (term: string) => void, filtersData?: any}) => {
  const { sideNavOpen, setSearchFilters, modalType } = useSearchModal();

  const setFilters = () => {
    setSearchFilters(props.filtersData);
  };

  useEffect(() => {
    setSearchFilters(props.filtersData);
  }, [props.filtersData, setSearchFilters]);

  return(
    <div
      className={tw(
        'flex-shrink-0 w-80 flex flex-col transition-all duration-300',
        modalType !== 'collectionFilters' ? 'border-r':'',
        sideNavOpen ? '' : modalType !== 'collectionFilters' ? '-ml-64' : '-ml-[20rem]')}>
      {modalType !== 'collectionFilters'
        ? (
          <>
            <OptionNav
              title={'Curations'}
              icon={<Flask />}
              backgroundColor={'bg-[#E1E1E1]'}>
              <CuratedCollectionsFilter onClick={props.onSideNav} collapsed={false}/>
            </OptionNav>
            {props.filtersData?.length > 0 && <OptionNav
              title={'NFT Filters'}
              icon={<FunnelSimple
                className="w-6 h-6"
                color={'grey'} />}
              backgroundColor={'bg-[#C2C2C2]'}
              onOptionNav={setFilters}>
              <NFTsFiltersContent />
            </OptionNav>}
          </>
        )
        : (
          <CollectionsFiltersContent />
        )}

    </div>
  );
};