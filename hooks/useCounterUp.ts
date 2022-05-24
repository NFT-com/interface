import { useEffect, useState } from 'react';

// modified from https://usehooks.com/usePrevious/
export default function useCounterUp(target: number, start: boolean, customSpeed?: number, customIncrement?: number) {
  const [counter, setCounter] = useState(0);
  const speed = customSpeed ?? 20;
  const increment = customIncrement ?? Math.floor(Number(target) / speed);

  useEffect(() => {
    let interval: any;
    if (start) {
      if (counter < Number(target)) {
        interval = setInterval(() => {
          setCounter(seconds => seconds + increment);
        }, (speed));
      } else if (counter !== 0) {
        setCounter(target);
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }

    return;
  }, [counter, increment, start, target, customSpeed, speed]);

  return counter;
}