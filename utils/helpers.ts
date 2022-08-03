import { Maybe } from 'graphql/generated/types';

import { Doppler, getEnv } from './env';

import { getAddress } from '@ethersproject/address';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { ethers } from 'ethers';

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

export const joinClasses = (...args: string[]) => filterNulls(args).join(' ');

export const isNullOrEmpty = (val: string | any[] | null | undefined) => val == null || val.length === 0;

export const filterNulls = (items: any[]) => items.filter(item => item != null);

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
  } else if (image.indexOf('https://gateway.pinata.cloud/ipfs/') === 0) {
    return prefix + image.slice(34);
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
  4: 'rinkeby.',
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

export function getChainIdString(chainId: Maybe<number>): Maybe<string> {
  return (chainId == null ? null : String(chainId));
}
