import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw';

export const CuratedCollectionsFilter = (props: { onClick: (term: string) => void; collapsed?: boolean }) => {
  const { setSearchModalOpen, curatedCollections, setSelectedCuratedCollection, selectedCuratedCollection } =
    useSearchModal();
  const router = useRouter();
  return (
    <div className='border-b-[1px] border-[#F2F2F2] pb-[10px]'>
      <div className='flex flex-col items-center pt-2'>
        <motion.div
          animate={{
            height: props.collapsed ? 0 : 'auto'
          }}
          transition={{ duration: 0.2 }}
          className={tw('mx-auto overflow-hidden px-7 minmd:px-44 minlg:px-0')}
        >
          <div className='flex h-fit flex-wrap items-center justify-start minlg:justify-start '>
            {curatedCollections &&
              curatedCollections.map((tab, index) => {
                return (
                  <span
                    key={index}
                    className={tw(
                      'border border-gray-300 font-noi-grotesk text-sm',
                      'mb-2 mr-2 h-fit rounded-3xl px-3.5 py-2 hover:cursor-pointer',
                      !router.pathname.includes('discover/') && selectedCuratedCollection?.tabTitle === tab.tabTitle
                        ? 'bg-[#000] font-black text-white'
                        : 'bg-pagebg font-bold text-blog-text-reskin'
                    )}
                    onClick={() => {
                      setSelectedCuratedCollection(tab);
                      if (router.pathname.includes('discover/')) {
                        router.push('/app/discover');
                      }
                    }}
                  >
                    {tab.tabTitle}
                  </span>
                );
              })}
            <span
              className='mx-auto mb-3 block h-fit rounded-3xl border border-gray-300 bg-pagebg px-3.5 py-2 font-noi-grotesk text-sm font-bold text-blog-text-reskin hover:cursor-pointer minlg:hidden'
              onClick={() => {
                setSearchModalOpen(true);
              }}
            >
              Discover by keyword
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
