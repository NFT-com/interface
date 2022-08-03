import { BigNumber } from 'ethers';

export const MAX_UINT_256 = BigNumber.from(2).pow(256).sub(1);
export type SaleDuration = '1 Day' | '3 Days' | '1 Week' | 'Forever';

export const convertDurationToSec = (d: SaleDuration) => {
  const durationDays: {[s in SaleDuration]: number} = {
    '1 Day' : 1,
    '3 Days': 3,
    '1 Week': 7,
    'Forever': 365 * 10
  };
  return 60 * 60 * 24 * durationDays[d];
};
