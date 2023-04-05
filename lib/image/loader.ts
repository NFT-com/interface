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
