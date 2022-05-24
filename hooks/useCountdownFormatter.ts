import { useEffect, useState } from 'react';

export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * State manager for breaking down elapsed time into constituent units
 * returns days, hours, minutes, seconds. updates every second.
 */
export function useCountdownFormatter(to: number): CountdownValues {
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    const timer = window.setInterval(function () {
      // Wed Oct 20 2021 12:00:00 GMT-0400 (Atlantic Standard Time)
      let delta = Math.abs(to - new Date().getTime()) / 1000;

      // calculate (and subtract) whole days
      const _days = Math.floor(delta / 86400);
      delta -= _days * 86400;

      // calculate (and subtract) whole hours
      const _hours = Math.floor(delta / 3600) % 24;
      delta -= _hours * 3600;

      // calculate (and subtract) whole minutes
      const _minutes = Math.floor(delta / 60) % 60;
      delta -= _minutes * 60;

      // what's left is seconds
      const _seconds = (delta % 60).toFixed(0); // in theory the modulus is not required

      setDays(_days);
      setHours(_hours);
      setMinutes(_minutes);
      setSeconds(Number(_seconds));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [to]);

  return { days, hours, minutes, seconds };
}