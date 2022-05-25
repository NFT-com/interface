import { Maybe } from 'graphql/generated/types';

import { getAddress } from '@ethersproject/address';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
// import { AddressZero } from '@ethersproject/constants';
// import { Contract } from '@ethersproject/contracts';
// import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
// import { ethers } from 'ethers';
// import { chain, chainId } from 'wagmi';

// returns the checksummed address if the address is valid, otherwise returns false

export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function sameAddress(first: Maybe<string>, second: Maybe<string>) {
  if (first == null || second == null) {
    return false;
  }
  try {
    return ethers.utils.getAddress(first) === ethers.utils.getAddress(second);
  } catch (error) {
    console.log('Invalid addresses');
    return false;
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 6): string {
  const parsed = isAddress(address);
  if (!parsed) {
    return '';
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
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
  if (num === 0) {
    return '0';
  }
  let extra = 0;
  let formatted;
  while (formatted === '0' || formatted == null) {
    formatted = numberWithCommas(parseFloat(Number(num).toFixed(dec + extra)));
    extra++;
    if (extra > 6) {
      return numberWithCommas(parseFloat(Number(num).toFixed(dec)));
    }
  }
  return formatted;
}

export function prettifyBigNum(num: BigNumber) {
  return Number(num) >= 1.0e9
    ? (Number(num) / 1.0e9).toFixed(2) + 'B'
    : Number(num) >= 1.0e6
      ? (Number(num) / 1.0e6).toFixed(2) + 'M'
      : Number(num) >= 1.0e3
        ? (Number(num) / 1.0e3).toFixed(2) + 'K'
        : Number(num).toFixed(2);
}

export function convertRegular(num: number | string) {
  return Number(BigNumber.from(num).div(BigNumber.from(10).pow(18)));
}

export function parseIpfs(uri: string) {
  if (uri?.includes('ipfs://')) {
    return `https://nft-llc.mypinata.cloud/ipfs/${uri?.replace('ipfs://', '')}`;
  } else if (uri?.includes('https://')) {
    return uri;
  } else if (uri?.length === 59) {
    return `https://nft-llc.mypinata.cloud/ipfs/${uri}`;
  }
  return uri;
}

export function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

export const joinClasses = (...args: string[]) => args.join(' ');

export const isNullOrEmpty = (val: string | any[] | null | undefined) => val == null || val.length === 0;

export const filterNulls = (items: any[]) => items.filter(item => item != null);

export const processIPFSURL = (image: Maybe<string>): Maybe<string> => {
  if (image == null) {
    return null;
  } else if (image.indexOf('ipfs://ipfs/') === 0) {
    return 'https://nft-llc.mypinata.cloud/ipfs/' + image.slice(12);
  } else if (image.indexOf('ipfs://') === 0) {
    return 'https://nft-llc.mypinata.cloud/ipfs/' + image.slice(7);
  } else if (image.indexOf('https://ipfs.io/ipfs/') === 0) {
    return 'https://nft-llc.mypinata.cloud/ipfs/' + image.slice(21);
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

export const getCurrentTimestamp = () => new Date().getTime();

export function getAPIURL() {
  switch(process.env.NEXT_PUBLIC_ENV) {
  case 'DEBUG':
    return process.env.NEXT_PUBLIC_DEBUG_URL;
  case 'SANDBOX':
    return process.env.NEXT_PUBLIC_SANDBOX_URL;
  case 'STAGING':
    return process.env.NEXT_PUBLIC_STAGING_URL;
  case 'PRODUCTION':
  default:
    return process.env.NEXT_PUBLIC_PRODUCTION_URL;
  }
}
