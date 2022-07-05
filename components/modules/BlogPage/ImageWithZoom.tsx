/* eslint-disable @next/next/no-img-element */
import 'react-medium-image-zoom/dist/styles.css';

import { useUser } from 'hooks/state/useUser';

import Zoom from 'react-medium-image-zoom';

type ImageWithZoomProps = {
  src: string;
  alt: string;
};

export default function ImageWithZoom({ src, alt }: ImageWithZoomProps) {
  const { isDarkMode } = useUser();
  return (
    <Zoom wrapElement="span" wrapStyle={{ display: 'flex', justifyContent: 'center' }} overlayBgColorStart={isDarkMode ? 'rgb(23 27 39)' : 'white'} overlayBgColorEnd={isDarkMode ? 'rgb(23 27 39)' : 'white'}>
      <img className="block h-max max-h-96 w-auto relative justify-center items-center mx-auto mb-4 hover:cursor-pointer" src={`https:${src}`} alt={alt} />
    </Zoom>
  );
}
