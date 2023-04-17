import { HomePageV3SectionDynamicLinks } from 'types/HomePage';
import { tw } from 'utils/tw';

import Marquee from 'react-fast-marquee';

export interface HomePageData {
  data?: HomePageV3SectionDynamicLinks;
  isVisible?: boolean;
}

export function DynamicLinks({ data, isVisible }: HomePageData) {
  return(
    <div id='anim-ticker-trigger' className='overflow-x-hidden pt-[4.625rem] pb-[6.825rem]'>
      <div id='anim-ticker-first' className={tw(
        'text-4xl minlg:text-7xl minxxl:text-9xl -ml-7'
      )}>
        <Marquee gradient={false} speed={60} loop={0} direction='right' play={isVisible} className="flex flex-row">
          {data?.sectionDynamicLinks?.map((tag, index) =>
            <div key={tag} className={tw(
              'px-2 minlg:px-10 minxxl:px-14 flex items-baseline group', index === 0 ? 'mr-2 minlg:mr-10 minxxl:mr-14': ''
            )}
            ><div role='presentation' className={tw(
                'mr-2 minxxl:mr-3 skew-x-[-20deg]',
                'group-hover:bg-gradient-to-b from-[#FECB02] to-[#FF9E39]',
                'h-[2.5rem] w-[.3125rem] basis-[.3125rem] minxl:h-[.556em] minxl:w-[.0833em] minxl:basis-[.0833em]',
                'bg-[#B2B2B2] rounded-[3px]'
              )}></div>

              <i className={tw(
                'animate-text-gadient bg-[length:200%_200%]',
                'pb-4 pr-1 bg-clip-text text-[#B2B2B2] bg-gradient-to-r from-[#FF9E39] to-[#FECB02]',
                'transition-colors group-hover:text-transparent'
              )}>{tag}</i>
            </div>)}
        </Marquee>
      </div>
    </div>

  );
}
