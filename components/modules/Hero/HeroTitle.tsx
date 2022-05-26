import { filterNulls } from 'utils/helpers';
import { tw } from 'utils/tw';

import ReactRotatingText from 'react-rotating-text';

export interface HeroTitleProps {
  items: string[]
  color?: 'blue' | 'pink'
}

export function HeroTitle(props: HeroTitleProps) {
  return (
    <div
      className={tw(
        props.color === 'blue' ? 'text-[#00A4FF]' : 'text-hero-pink',
        'text-xl deprecated_minxs:text-2xl deprecated_minxs:2:text-3xl',
        'deprecated_minmd:text-4xl deprecated_minmd:text-5xl deprecated_minxl:text-6xl z-30',
        'text-center font-normal font-hero-heading1',
        'max-w-[20rem] deprecated_minxs:max-w-[21rem] deprecated_minsm:max-w-[30rem] deprecated_minmd:max-w-[43rem]',
        'deprecated_minxl:max-w-[100rem] deprecated_minmd:pb-0 ',
      )}
      style={{
        textShadow: '0px 4px 4px rgba(0,0,0,0.9)',
      }}
    >
      {
        props.items.length === 1 ?
          <>
            {props.items[0]}
          </> :
          <>
            &nbsp;
            <ReactRotatingText
              color={'#FF62EF'}
              cursor={false}
              typingInterval={150}
              pause={3000}
              eraseMode={'overwrite'}
              emptyPause={3000}
              deletingInterval={150}
              items={filterNulls(props.items)}
            />
            &nbsp;
          </>
      }
    </div>
  );
}