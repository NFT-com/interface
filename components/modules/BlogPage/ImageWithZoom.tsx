/* eslint-disable @next/next/no-img-element */
import 'react-medium-image-zoom/dist/styles.css';

import Zoom from 'react-medium-image-zoom';

type ImageWithZoomProps = {
  src: string;
  alt: string;
};

export default function ImageWithZoom({ src, alt }: ImageWithZoomProps) {
  return (
    <Zoom wrapElement="span">
      <img className="block h-max max-h-96 w-auto relative justify-center items-center mx-auto mb-4 hover:cursor-pointer" src={`https:${src}`} alt={alt} />
    </Zoom>
  );
}
