import { generateRandomPreloader, staticNftComCdnLoader } from 'lib/image/loader';
import dynamic from 'next/dynamic';
const BlurImage = dynamic(import('components/elements/BlurImage'));

export default function PreloaderImage() {
  const getPreloader = () => {
    const index = generateRandomPreloader();
    const imageProps = { alt: 'grey placeholder image', loader: staticNftComCdnLoader };
    const options = {
      0: <BlurImage src={'public/preloaderImg-1.svg'} {...imageProps}/>,
      1: <BlurImage src={'public/preloaderImg-2.svg'} {...imageProps}/>,
      2: <BlurImage src={'public/preloaderImg-3.svg'} {...imageProps}/>,
      3: <BlurImage src={'public/preloaderImg-4.svg'} {...imageProps}/>,
      4: <BlurImage src={'public/preloaderImg-5.svg'} {...imageProps}/>,
    };
    return options[index] || options[0];
  };

  return (
    <>
      {getPreloader()}
    </>
  );
}
