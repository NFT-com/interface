import { Maybe } from 'graphql/generated/types';

import { Doppler, getEnv } from './env';

import { getAddress } from '@ethersproject/address';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import { base32cid, cid, multihash } from 'is-ipfs';
import { atom } from 'jotai';
import moment, { Moment } from 'moment';

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function isChromeBrowser() {
  let isChromeBrowser = false;
  if (typeof window !== 'undefined') {
    isChromeBrowser = window.navigator.userAgent.toString().toLocaleLowerCase().includes('chrome');
  }
  return isChromeBrowser;
}

export const profileSaveCounter = atom(0);

export function sameAddress(first: Maybe<string>, second: Maybe<string>) {
  if (first == null || second == null) {
    return false;
  }
  try {
    return ethers.utils.getAddress(first) === ethers.utils.getAddress(second);
  } catch (error) {
    return false;
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars?: number): string {
  const charsVal = chars || 6;
  const parsed = isAddress(address);
  if (!parsed) {
    return '';
  }
  return `${parsed.substring(0, charsVal + 2)}...${parsed.substring(42 - charsVal)}`;
}

export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function shorten(address: string | null, mobile: boolean) {
  if (address == null) {
    return null;
  }
  return mobile
    ? address.substring(0, 7) + '...' + address.substring(35, 42)
    : address.substring(0, 10) + '...' + address.substring(32, 42);
}

export function shortenString(value: string | null | number, limit: number, length: number) {
  if (value == null) {
    return null;
  }
  return value.toString().length > limit ? value.toString().substring(0, length) + '...' : value;
}

export function prettify(num: number | string, dec?: number) {
  if (num === 0 || Number(num) < 0.001) {
    return '0';
  }

  if (Number(num) < 0.1) {
    return Number(num).toFixed(3);
  }

  let extra = 0;
  let formatted;

  while (formatted === '0' || formatted == null) {
    formatted = numberWithCommas(parseFloat(Number(num).toFixed(dec + extra)));
    extra++;
    if (extra > 5) {
      return numberWithCommas(parseFloat(Number(num).toFixed(dec)));
    }
  }
  return formatted;
}
export const convertValue = (value: number, first: number, second: number) => {
  const start = value.toString().slice(0,first);
  const end = value.toString().slice(first,second);
  return {
    start,
    end
  };
};
export const joinClasses = (...args: string[]) => filterNulls(args).join(' ');

export const isNullOrEmpty = (val: string | any[] | null | undefined) => val == null || val.length === 0;

export const isNull = (val: string | any[] | null | undefined) => val == null;

export const filterNulls = <T>(items: Maybe<T>[]): T[] => items.filter(item => item != null);

export const filterDuplicates = <T>(items: T[], isSame: (first: T, second: T) => boolean): T[] => {
  return items.filter((item, index) => items.findIndex((element) => isSame(item, element)) === index);
};

export const processIPFSURL = (image: Maybe<string>): Maybe<string> => {
  const prefix = 'https://nft-llc.mypinata.cloud/ipfs/';
  if (image == null) {
    return null;
  } else if (image.indexOf('ipfs://ipfs/') === 0) {
    return prefix + image.slice(12);
  } else if (image.indexOf('ipfs://') === 0) {
    return prefix + image.slice(7);
  } else if (image.indexOf('https://ipfs.io/ipfs/') === 0) {
    return prefix + image.slice(21);
  } else if (image.indexOf('https://ipfs.infura.io/ipfs/') === 0) {
    return prefix + image.slice(28);
  } else if (image.indexOf('https://gateway.pinata.cloud/ipfs/') === 0) {
    return prefix + image.slice(34);
  } else if (image.indexOf('https://infura-ipfs.io/ipfs/') === 0) {
    return prefix + image.slice(28);
  } else if (base32cid(image) || multihash(image) || cid(image)) {
    return prefix + image;
  }
  return image;
};

export const formatID = (id: BigNumber) => {
  if (id.lt(10)) {
    return '0000' + id.toString();
  } else if (id.lt(100)) {
    return '000' + id.toString();
  } else if (id.lt(1000)) {
    return '00' + id.toString();
  } else if (id.lt(10000)) {
    return '0' + id.toString();
  } else {
    return id.toString();
  }
};

export const getGenesisKeyThumbnail: (id: BigNumberish) => string = (id: BigNumberish) => {
  if (BigNumber.from(id).gt(10000)) {
    return '';
  }
  return 'https://cdn.nft.com/gk-min/' + BigNumber.from(id).toString() + '.jpeg';
};

export function getAPIURL() {
  return getEnv(Doppler.NEXT_PUBLIC_GRAPHQL_URL);
}

const ETHERSCAN_PREFIXES = {
  1: '',
  3: 'ropsten.',
  5: 'goerli.',
  42: 'kovan.',
};

export function getEtherscanLink(
  chainId: number,
  data: string,
  type: 'transaction' | 'token' | 'address'
): string {
  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`;

  switch (type) {
  case 'transaction': {
    return `${prefix}/tx/${data}`;
  }
  case 'token': {
    return `${prefix}/token/${data}`;
  }
  case 'address':
  default: {
    return `${prefix}/address/${data}`;
  }
  }
}

export function getChainIdString(chainId: Maybe<number | string>): Maybe<string> {
  return (chainId == null ? null : String(chainId));
}

export function getPerPage(index: string, screenWidth: number, sideNavOpen: boolean): number {
  let perPage;

  if (index === 'collections') {
    if (screenWidth >= 1200) {
      perPage = sideNavOpen ? 9 : 12;
    } else if (screenWidth >= 900 ) {
      perPage = sideNavOpen ? 4 : 6;
    } else if (screenWidth >= 600) {
      perPage = 4;
    } else {
      perPage = 2;
    }
  } else if (index === 'discover') {
    if (screenWidth >= 1200) {
      perPage = sideNavOpen ? 9 : 8;
    } else if (screenWidth >= 900 ) {
      perPage = sideNavOpen ? 6 : 9;
    } else if (screenWidth >= 600) {
      perPage = 4;
    } else {
      perPage = 2;
    }
  } else {
    if (screenWidth >= 1200) {
      perPage = sideNavOpen ? 9 : 12;
    } else if (screenWidth >= 900 ) {
      perPage = sideNavOpen ? 6 : 8;
    } else if (screenWidth >= 600) {
      perPage = 6;
    } else {
      perPage = 4;
    }
  }
  return perPage;
}

export function max(...args: BigNumberish[]) {
  if (isNullOrEmpty(args)) {
    return null;
  }
  return args.reduce((acc, val) => BigNumber.from(acc ?? Number.MIN_VALUE).gt(val) ? acc : val);
}

export function min(...args: BigNumberish[]) {
  if (isNullOrEmpty(args)) {
    return null;
  }
  return args.reduce((acc, val) => BigNumber.from(acc ?? Number.MAX_VALUE).lt(val) ? acc : val);
}

export function fetcher(url: string): Promise<any> {
  return fetch(url).then((res) => res.json());
}

export function getDateFromTimeFrame(timeFrame: string): Moment {
  if(timeFrame === '1D') {
    return moment().subtract(1, 'd');
  }
  if(timeFrame === '7D') {
    return moment().subtract(7, 'd');
  }
  if(timeFrame === '1M') {
    return moment().subtract(1, 'M');
  }
  if(timeFrame === '3M') {
    return moment().subtract(3, 'M');
  }
  if(timeFrame === '1Y') {
    return moment().subtract(1, 'year');
  }
}

export const collectionCardImages = (collection: any) => {
  return [
    collection.nfts[0]?.metadata?.imageURL || collection.nfts[0]?.previewLink || collection.nfts[0]?.metadata?.traits?.find(i => i.type === 'image_url_png')?.value,
    collection.nfts[1]?.metadata?.imageURL || collection.nfts[1]?.previewLink || collection.nfts[1]?.metadata?.traits?.find(i => i.type === 'image_url_png')?.value,
    collection.nfts[2]?.metadata?.imageURL || collection.nfts[2]?.previewLink || collection.nfts[2]?.metadata?.traits?.find(i => i.type === 'image_url_png')?.value,
  ];
};

export const getImageFetcherBaseURL = () => {
  return 'https://www.nft.com/';
};

export const sliceString = (description: string, maxCount: number, isStringCut: boolean) => {
  if(!description) return;
  let newDescription;
  if(description?.length > maxCount){
    const newString = description?.slice(0, !isStringCut ? maxCount : description?.length);
    newDescription = !isStringCut ? `${newString}...` : newString;
  }else {
    newDescription = description;
  }
  return newDescription;
};
export const checkImg = (images) => {
  if(!images) return;
  const convertedImages = images.map(image => {
    if(image){
      return processIPFSURL(image);
    }
  }).filter(Boolean);
  return convertedImages[0];
};

export const genereteRandomPreloader = () => {
  const index = Math.floor(Math.random() * (4));
  return index;
};
