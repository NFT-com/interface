import { getEnv, Secret } from 'utils/getEnv';

import { isSandbox } from './httpHooks';

import { ethers } from 'ethers';

// const getZmokURL = (chainId: number): string => {
//   if (isSandbox(chainId)) {
//     return 'https://api.zmok.io/testnet/' + getEnv(Secret.REACT_APP_ZMOK_KEY_RINKEBY);
//   } else {
//     return 'https://api.zmok.io/mainnet/' + getEnv(Secret.REACT_APP_ZMOK_KEY);
//   }
// };

type APIRecord = Record<number, string>;

const etherscanAPIs: APIRecord = {
  1: 'BTRSUQC5NP494HS3IRYC1DQVRI89TS46MD',
  2: '25E9BG3FRGXFBFK6VRNEQ37W2A8784B475',
  3: 'B4S1U64KIS797JQS596IM8XXZIXXCEF423',
  4: 'H62N2X9BEFVZEC87A6N71A95PH1BY1ZTXB',
  5: '21ZYG37YB5U8UXBVFFDH9UTKDRS8H25MCT',
  6: '17WD2JR7T9P8KC7GJJ1FQ4JX17W5MRD3ZI',
  7: 'V23YA18YZA6GAY1R324JMSG6X353B8X4GS',
  8: 'MUW248RRZ8UQI7XTJGA5JYYJRRKBSQI4P5',
  9: '7BRHBUUHU5ZXRZ6HADYRTGZSBIIQCP58PY',
  10: 'M3B3JU452TJ2M5DGQC1P664IR1ADTCPBDN',
  11: 'BFYDP336HCFX3H5YGGQYBYJNBC1NTNMPI2',
  12: 'A481IQ4Y6WYF961CQ2Y32BJJP7QG6I89V7',
  13: '1RY1ICMGQRXYKMJ7E7T75P7DCBN6A7IP2D',
  14: '2GRUT78X9V3M91ZSMS45C251AS32JTYSQW',
  15: 'E1WKTW9QC6V3SGM8F6QERBCX4KF75XJBBG',
  16: 'HW3Q42R4J4WY5HHINNDAI515V59XT5QCU5',
  17: 'QC8VP7UHXTFJSGSUMJBQ1MX7RJT5UFAGVV',
  18: 'ZWXR8F9I8G92WF42NAX2RTMHHE9ZDXHGYZ',
  19: 'PFGWRD38DM8BB6TYHZ45ZVNNPI84BM13WT',
  20: 'XHSKP3E7E312CY67D7KSJDB8ZMPGTKKGUM',
  21: 'NBD9XB7AEMGKGV2HHXR22915ABNRHU21SU',
  22: '1DRNAZ39TR2VSYXS9BCYMS48GIIMMC4WXP',
  23: 'RR4BJU4GKPK53DDYN4H8KY3U2BG3BWKYMQ',
  24: 'S2Y8649IS2BMFWVW51NETTNAA9C16Q4MHD'
};

const etherscanArray = (Object.values(etherscanAPIs) as Array<string>);

const getRandomAPI = () => {
  const length = etherscanArray.length;

  const maxIndex = length - 1;
  const minIndex = 0;

  const randomIndex = (Math.random() * (maxIndex - minIndex + 1)) << 0;
  return etherscanArray[randomIndex];
};

export const provider = (chainId: number) => {
  // return new ethers.providers.JsonRpcProvider(
  //   getZmokURL(chainId),
  //   chainId
  // );
  return ethers.getDefaultProvider(chainId, {
    etherscan: getRandomAPI(),
    infura: getEnv(Secret.REACT_APP_INFURA_PROJECT_ID),
    alchemy: isSandbox(chainId) ?
      getEnv(Secret.REACT_APP_ALCHEMY_RINKEBY_KEY) :
      getEnv(Secret.REACT_APP_ALCHEMY_MAINNET_KEY),
  });
};
