import { isClient } from './ssr';

/**
 * Generates a custom fallback SVG image with the specified width, height, and color.
 * @param {number} [width=600] - The width of the SVG image.
 * @param {number} [height=600] - The height of the SVG image.
 * @param {boolean} [color=true] - Whether or not to include color in the SVG image.
 * @returns A string of SVG code that can be used as a fallback image.
 */
export const customFallbackSvg = (width = 600, height = 600, color = true ) => color
  ?
  `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><linearGradient gradientTransform="rotate(-315 .5 .5)" x1="50%" y1="0%" x2="50%" y2="100%" id="c"><stop stop-color="hsla(45, 96%, 53%, 1)" offset="0%"/><stop stop-color="rgba(255,255,255,0)" stop-opacity="0" offset="100%"/></linearGradient><linearGradient gradientTransform="rotate(315 .5 .5)" x1="50%" y1="0%" x2="50%" y2="100%" id="b"><stop stop-color="hsl(20, 83%, 46%)"/><stop stop-color="rgba(255,255,255,0)" stop-opacity="0" offset="100%"/></linearGradient><filter id="d" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="2" stitchTiles="stitch" x="0%" y="0%" width="100%" height="100%" result="turbulence"/><feColorMatrix type="saturate" values="0" x="0%" y="0%" width="100%" height="100%" in="turbulence" result="colormatrix"/><feComponentTransfer x="0%" y="0%" width="100%" height="100%" in="colormatrix" result="componentTransfer"><feFuncR type="linear" slope="3"/><feFuncG type="linear" slope="3"/><feFuncB type="linear" slope="3"/></feComponentTransfer><feColorMatrix x="0%" y="0%" width="100%" height="100%" in="componentTransfer" result="colormatrix2" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 15 -7"/></filter><filter id="a" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="3" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" result="colormatrix"/></filter></defs><g filter="url(#a)"><rect width="100%" height="100%" fill="hsl(0, 0%, 100%)"/><rect width="100%" height="100%" fill="url(#b)"/><rect width="100%" height="100%" fill="url(#c)"/><rect width="100%" height="100%" fill="transparent" filter="url(#d)" style="mix-blend-mode:soft-light"/></g></svg>
  `
  : `
<svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="#333" />
  <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1s" repeatCount="indefinite"  />
</svg>`;

/**
 * Encodes a string to base64 format.
 * @param {string} str - The string to encode.
 * @returns {string} The base64 encoded string.
 */
export const toBase64 = (str: string) =>
  !isClient
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

/**
 * The default URL for the blurred image placeholder. It is a base64 encoded SVG image
 * generated from the customFallbackSvg function.
 * @returns {string} - The default URL for the blurred image placeholder.
 */
export const defaultBlurPlaceholderUrl = `data:image/svg+xml;base64,${toBase64(
  customFallbackSvg(1200, 600)
)}`;

export function imageUrlToBase64(url) {
  return fetch(url)
    .then(response => response.blob())
    .then(blob => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
        };
        reader.onerror = () => {
          reject(new Error('Failed to convert image to base64'));
        };
      });
    });
}

export const toBase64DataUrl = (src: any) => `data:image/svg+xml;base64,${toBase64(src)}`;
