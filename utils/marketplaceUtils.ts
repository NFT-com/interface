import { BigNumber } from 'ethers';

export const MAX_UINT_256 = BigNumber.from(2).pow(256).sub(1);
export type SaleDuration = '1 Hour' | '1 Day' | '7 Days' | '6 Months';

export const convertDurationToSec = (d: SaleDuration) => {
  const durationDays: {[s in SaleDuration]: number} = {
    '1 Hour': 1 / 24,
    '1 Day' : 1,
    '7 Days': 7,
    '6 Months': 7 * 4 * 6
  };
  return 60 * 60 * 24 * durationDays[d];
};
