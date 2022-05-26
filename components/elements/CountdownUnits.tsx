import { useCountdownFormatter } from 'hooks/useCountdownFormatter';

import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { useThemeColors } from 'styles/theme/useThemeColors';

export interface CountdownUnitsProps {
  to: number;
  onEnded?: () => void
}

export function CountdownUnits({ to, onEnded }: CountdownUnitsProps) {
  const { alwaysWhite, heroPink } = useThemeColors();

  const { days, hours, minutes, seconds } = useCountdownFormatter(to);

  useEffect(() => {
    if (
      days <= 0 && hours <= 0 && minutes <= 0 && to <= Date.now()
    ) {
      onEnded && onEnded();
    }
  }, [days, hours, minutes, seconds, onEnded, to]);

  const getUnitComponent = (title: string | number, subtitle: string) => {
    return (
      <div className="flex flex-col deprecated_minmd:w-24 deprecated_minmd:text-5xl text-3xl">
        <div
          className="text-center font-normal font-hero-heading1"
          style={{
            color: heroPink,
          }}
        >
          {title}
        </div>
        <div
          className="text-center font-normal font-rubik"
          style={{
            fontSize: isMobile ? '12px' : '14px',
            lineHeight: isMobile ? '19px' : '17px',
            color: alwaysWhite,
          }}
        >
          {subtitle}
        </div>
      </div>
    );
  };

  const getDividerComponent = () => {
    return (
      <div
        className="text-center font-normal font-hero-heading1"
        style={{
          fontSize: isMobile ? '30px' : '50px',
          lineHeight: isMobile ? '37px' : '60px',
          color: heroPink,
          paddingRight: isMobile ? '10px' : '20px',
          paddingLeft: isMobile ? '10px' : '20px',
        }}
      >
        :
      </div>
    );
  };
  
  return (
    <>
      {getUnitComponent(days < 10 ? '0' + days : days, 'DAYS')}
      {getDividerComponent()}
      {getUnitComponent(hours < 10 ? `0${hours}` : hours, 'HRS')}
      {getDividerComponent()}
      {getUnitComponent(minutes < 10 ? `0${minutes}` : minutes, 'MINS')}
      {getDividerComponent()}
      {getUnitComponent(seconds < 10 ? `0${seconds}` : seconds, 'SECS')}
    </>
  );
}