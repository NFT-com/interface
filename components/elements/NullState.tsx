import { Button, ButtonType } from 'components/elements/Button';
import { useUser } from 'hooks/state/useUser';
import { tw } from 'utils/tw';

import Image from 'next/image';

const errorImagesLight = [
  'https://cdn.nft.com/404_1.svg',
  'https://cdn.nft.com/404-2Light.svg',
  'https://cdn.nft.com/404-3Light.svg',
  'https://cdn.nft.com/404-4Light.png',
  'https://cdn.nft.com/404-5Light.png',
];

const errorImagesDark = [
  'https://cdn.nft.com/404_1.svg',
  'https://cdn.nft.com/404_2.svg',
  'https://cdn.nft.com/404_3.svg',
  'https://cdn.nft.com/404_4.svg',
  'https://cdn.nft.com/404_5.svg'
];

export interface NullStateProps {
  showImage?: boolean;
  primaryMessage?: string;
  secondaryMessage?: string;
  buttonLabel?: string;
  onClick?: () => void;
  secondaryBtnLabel?: string;
  secondaryOnClick?: () => void;
}

export function NullState(props: NullStateProps) {
  const { isDarkMode } = useUser();

  const randomErrorImage = isDarkMode ?
    errorImagesDark[Math.floor(Math.random() * errorImagesDark.length)]
    :
    errorImagesLight[Math.floor(Math.random() * errorImagesLight.length)];
  return (
    <div
      className={tw('flex flex-col',
        'text-center w-full my-10 items-center justify-center rounded-xl py-10',
        'bg-transparent',
        'text-secondary-txt')}>
      {props.showImage &&
        <Image src={randomErrorImage} width='500' height='500' alt='404' className='mb-10 drop-shadow-2xl'/>}
      <div className='flex flex-col items-center justify-center space-y-6 mx-2 deprecated_minlg:mx-0'>
        <div
          className={tw(
            'text-primary-txt dark:text-primary-txt-dk',
            'text-sm deprecated_minxs:2:text-base deprecated_minsm:text-2xl deprecated_minlg:text-3xl deprecated_min2xl:text-4xl ...')}>
          {props.primaryMessage}
        </div>
        <div
          className="text-secondary-txt dark:text-secondary-txt-dk ..."
          style={{ fontSize: '20px' }}>
          {props.secondaryMessage}
        </div>
        <div className={`${props.secondaryBtnLabel && props.secondaryOnClick ? 'flex justify-evenly w-full deprecated_minmd:w-1/2 items-center': ''} `}>
          {props.buttonLabel && <div className='drop-shadow-md'>
            <Button type={ButtonType.PRIMARY} onClick={props.onClick} label={props.buttonLabel} />
          </div>}
          {props.secondaryBtnLabel && <div className='drop-shadow-md'>
            <Button
              type={ButtonType.PRIMARY}
              onClick={props.secondaryOnClick}
              label={props.secondaryBtnLabel} />
          </div>}
        </div>
      </div>
    </div>
  );
}
