import dynamic from 'next/dynamic';

import { generateRandomPreloader } from 'lib/image/loader';

const BlurImage = dynamic(import('components/elements/BlurImage'));

export default function PreloaderImage() {
  const getPreloader = () => {
    const index = generateRandomPreloader();
    const imageProps = {
      alt: 'grey placeholder image',
      className: 'rounded-md object-cover',
      fill: true,
      localImage: true
    };
    const options = {
      0: <BlurImage src='/icons/preloaderImg-1.svg' {...imageProps} />,
      1: <BlurImage src='/icons/preloaderImg-2.svg' {...imageProps} />,
      2: <BlurImage src='/icons/preloaderImg-3.svg' {...imageProps} />,
      3: <BlurImage src='/icons/preloaderImg-4.svg' {...imageProps} />,
      4: <BlurImage src='/icons/preloaderImg-5.svg' {...imageProps} />
    };
    return options[index] || options[0];
  };

  return <div className='relative aspect-4/3 w-full rounded-md'>{getPreloader()}</div>;
}
