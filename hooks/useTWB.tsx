import moment from 'moment';
import { useCallback, useState } from 'react';

type getTWBSignature = (
  stake: number | string,
  time: number | null,
  amount: number | string,
  live?: boolean
) => number;

/**
 * This hook wraps the getTWB helper function which calculates the Time-weighted Bid.
 *
 * This is a hook because we want to cache the time at render to support
 * non-live calculations.
 *
 * If you want the *current* TWB, call the returned function with live=true
 *
 * If you are ok with the TWB at page load, call the returned function with live=false or omit it.
 *
 * If you need to render a constantly-updating current TWB, you should use {@link RealTimeTWB}.
 */
export function useTWB(): getTWBSignature {
  const [time] = useState(moment.utc().unix());

  const getTWB: getTWBSignature = useCallback(
    (
      _stakeWeightedSeconds: number | string,
      _timeUpdated: number | null,
      stakedAmount: number | string,
      live = false
    ) => {
      return (
        (Number(_stakeWeightedSeconds) +
          (_timeUpdated == null
            ? 0
            : ((live ? moment.utc().unix() : time) - _timeUpdated) * Number(stakedAmount))) /
        (1000 * 1000)
      );
      // 1st 1000 is to convert milliseconds => seconds
      // 2nd 1000 is just to make sure the TWB score isn't too big
    },
    [time]
  );
  return getTWB;
}
