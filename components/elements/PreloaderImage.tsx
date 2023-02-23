/* eslint-disable @next/next/no-img-element */
import { genereteRandomPreloader, getStaticAsset } from 'utils/helpers';

export default function PreloaderImage() {
  const getPreloader = () => {
    const index = genereteRandomPreloader();
    switch (index) {
    case 0:
      return <img src={getStaticAsset('public/preloaderImg-1.svg')} alt='public/preloaderImg-1.svg'/>;
    case 1:
      return <img src={getStaticAsset('public/preloaderImg-2.svg')} alt='public/preloaderImg-2.svg'/>;
    case 2:
      return <img src={getStaticAsset('public/preloaderImg-3.svg')} alt='public/preloaderImg-3.svg'/>;
    case 3:
      return <img src={getStaticAsset('public/preloaderImg-4.svg')} alt='public/preloaderImg-4.svg'/>;
    case 4:
      return <img src={getStaticAsset('public/preloaderImg-5.svg')} alt='public/preloaderImg-5.svg'/>;
    default:
      return 0;
    }
  };

  return (
    <>
      {getPreloader()}
    </>
  );
}
