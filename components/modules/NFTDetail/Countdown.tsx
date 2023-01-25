
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';

export interface CountdownProps {
  eventTime: number;
  interval: number;
}

const calculateDuration = eventTime => moment.duration(Math.max(eventTime - (Math.floor(Date.now() / 1000)), 0), 'seconds');

function Countdown({ eventTime, interval }: CountdownProps) {
  const [duration, setDuration] = useState(calculateDuration(eventTime));
  const timerCallback = useCallback(() => {
    setDuration(calculateDuration(eventTime));
  }, [eventTime]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(calculateDuration(eventTime));
    }, 1000);
  
    return () => clearInterval(timer);
  }, [eventTime, interval, timerCallback]);
  
  return (
    <div>
      <p className='mb-1 text-[#B2B2B2]'>Ends in</p>
      <p className='font-noi-grotesk sm:text-xl text-2xl font-medium leading-6'>
        {duration.days()}<span className='text-[15px] text-[#6A6A6A] mr-[10px]'>d</span>
        {duration.hours()}<span className='text-[15px] text-[#6A6A6A] mr-[10px]'>h</span>
        {duration.minutes()}<span className='text-[15px] text-[#6A6A6A] mr-[10px]'>m</span>
        {duration.seconds()}<span className='text-[15px] text-[#6A6A6A]'>s</span>
      </p>
    </div>
  );
}
  
export default Countdown;