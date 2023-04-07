import { getBaseUrl, processIPFSURL } from 'utils/helpers';

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
  return `${getBaseUrl(
    'https://www.nft.com/'
  )}api/imageFetcher?url=${encodeURIComponent(processIPFSURL(src))}&width=${width || 300}`;
}

/**
 * Generates a srcset for the given image URL using a set of predefined widths.
 * @param {string} url - The URL of the image to generate the srcset for.
 * @returns An object containing the src, srcs, and srcset for the image.
 */
export function generateSrcSet(url: string) {
  const widths = [256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  const encodedUrl = encodeURIComponent(processIPFSURL(url));
  const srcs = widths.map((width) => {
    return `https://www.nft.com/api/imageFetcher?url=${encodedUrl}&width=${width} ${width}w`;
  });
  const srcset = srcs.join(', ');
  return { src: srcs.at(-1), srcs, srcset };
}
