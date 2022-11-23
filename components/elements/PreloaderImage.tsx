import { genereteRandomPreloader } from 'utils/helpers';

import Preloader_1 from 'public/preloaderImg-1.svg';
import Preloader_2 from 'public/preloaderImg-2.svg';
import Preloader_3 from 'public/preloaderImg-3.svg';
import Preloader_4 from 'public/preloaderImg-4.svg';
import Preloader_5 from 'public/preloaderImg-5.svg';

export default function PreloaderImage() {
  const getPreloader = () => {
    const index = genereteRandomPreloader();
    switch (index) {
    case 0:
      return <Preloader_1/>;
    case 1:
      return <Preloader_2/>;
    case 2:
      return <Preloader_3/>;
    case 3:
      return <Preloader_4/>;
    case 4:
      return <Preloader_5/>;
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
