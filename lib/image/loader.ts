import { getBaseUrl } from 'utils/helpers';

import { ImageLoaderProps } from 'next/image';

/**
 * A function that takes in an object of ImageLoaderProps and returns a URL string with
 * the specified parameters.
 * @param {ImageLoaderProps} src - The source of the image to be loaded.
 * @param {number} quality - The quality of the image to be loaded.
 * @param {number} width - The width of the image to be loaded.
 * @returns A URL string with the specified parameters.
 */
export function contentfulLoader({ src, quality, width }: ImageLoaderProps) {
  const url = new URL(`${src}`);
  url.searchParams.set('fm', 'webp');
  url.searchParams.set('w', width.toString());
  url.searchParams.set('q', quality ? quality.toString() : '75');
  return url.href;
}

/**
 * A function that returns the URL of an image to be loaded. If the image is an SVG and is hosted on nft.com,
 * the original URL is returned. Otherwise, the URL is passed through an imageFetcher API to resize the image.
 * @param {ImageLoaderProps} - An object containing the source URL and the desired width of the image.
 * @returns {string} - The URL of the image to be loaded.
 */
export function nftComCdnLoader({ src, width }: ImageLoaderProps) {
  return src?.indexOf('.svg') >= 0 && src?.indexOf('nft.com') >= 0
    ? src
    : `${getBaseUrl(
      'https://www.nft.com/'
    )}api/imageFetcher?url=${encodeURIComponent(src)}&width=${width || 300}`;
}
