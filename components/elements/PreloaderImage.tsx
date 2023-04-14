import { generateRandomPreloader } from 'lib/image/loader';
import dynamic from 'next/dynamic';
const BlurImage = dynamic(import('components/elements/BlurImage'));

export default function PreloaderImage() {
  const getPreloader = () => {
    const index = generateRandomPreloader();
    const imageProps = { alt: 'grey placeholder image', className: 'rounded-md object-cover', fill: true };
    const options = {
      0: <BlurImage src="/preloaderImg-1.svg" {...imageProps}/>,
      1: <BlurImage src="/preloaderImg-2.svg" {...imageProps}/>,
      2: <BlurImage src="/preloaderImg-3.svg" {...imageProps}/>,
      3: <BlurImage src="/preloaderImg-4.svg" {...imageProps}/>,
      4: <BlurImage src="/preloaderImg-5.svg" {...imageProps}/>,
    };
    return options[index] || options[0];
  };

  return (
    <div className="aspect-4/3 w-full relative rounded-md">
      {getPreloader()}
    </div>
  );
}
