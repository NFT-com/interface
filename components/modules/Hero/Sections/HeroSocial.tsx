import { Button, ButtonSize, ButtonType } from 'components/modules/Hero/HeroButton';
import useCounterUp from 'hooks/useCounterUp';
import useOnViewPort from 'hooks/useOnViewPort';
import { tw } from 'utils/tw';

import { useRef } from 'react';
import { ExternalLink } from 'styles/theme/Components';
import { Social } from 'types';

const HeroSocial = (props: Social) => {
  const ref = useRef();
  const [isVisible] = useOnViewPort(ref, 0.5);
  const counter = useCounterUp(Number(props.number), isVisible);
  
  return (
    <div ref={ref}
      className={tw(
        'flex flex-col items-center justify-center',
        'mt-10 deprecated_minmd:mt-0',
        'deprecated_minmd:w-1/3'
      )}
    >
      <props.icon className='h-24 min-w-[73px]' />
      {isVisible &&
        <div className={tw('deprecated_minlg:mt-4 deprecated_minxl:mt-6 w-full',
          'text-2xl deprecated_minlg:text-3xl deprecated_min2xl:text-3xl mt-6 deprecated_minmd:mt-0',
          'font-bold text-center text-always-white font-hero-heading2')}>
          {counter.toLocaleString()}+
        </div>}
      <div className={tw('deprecated_minlg:mt-1 deprecated_minxl:mt-4 deprecated_minmd:text-xs deprecated_minlg:text-base',
        'deprecated_minxl:text-lg font-medium text-grey-txt')}>
        {props.subtitle}
      </div>
      <div className={tw(
        'min-w-1/2 mx-auto block deprecated_minmd:mt-4 deprecated_minxl:mt-7',
        'mt-6 deprecated_minmd:mt-0 font-hero-heading1 deprecated_minmd:font-hero-heading2',
        'deprecated_minxl:font-hero-heading2 tracking-wider deprecated_minmd:font-bold deprecated_minxl:font-normal')}>
        <ExternalLink href={props.destination}>
          <Button
            type={ButtonType.PRIMARY}
            stretch={true}
            textColor="black"
            label={props.action}
            onClick={() => null}
            size={ButtonSize.SMALL} />
        </ExternalLink>
      </div>
    </div>
  );
};

export default HeroSocial;
