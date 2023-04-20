import Zoom from 'react-medium-image-zoom';
import Image, { ImageLoaderProps } from 'next/image';

import { contentfulLoader } from 'lib/image/loader';

type ImageWithZoomProps = {
  src: string;
  alt: string;
  loader?: (props: ImageLoaderProps) => string;
};

/**
 * A component that displays an image with zoom functionality.
 * !!NOTE!! Default uses contentful images, otherwise specify an image loader.
 * @param {string} src - The URL of the image to display.
 * @param {string} alt - The alt text for the image.
 * @returns A JSX element that displays the image with zoom functionality.
 */
export default function ImageWithZoom({ src, alt, loader = contentfulLoader }: ImageWithZoomProps) {
  const srcUrl = `https:${src}`;
  return (
    <Zoom
      wrapElement='span'
      zoomImg={{
        src: srcUrl,
        width: 750,
        height: 300
      }}
    >
      <Image
        className='relative mx-auto mb-4 block h-max max-h-96 w-auto items-center justify-center object-contain hover:cursor-pointer'
        src={srcUrl}
        alt={alt}
        loader={loader}
        fill
      />
    </Zoom>
  );
}
