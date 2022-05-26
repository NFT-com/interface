import { useCountdownFormatter } from 'hooks/useCountdownFormatter';

export interface SimpleCountdownProps {
  to: number
}

export function SimpleCountdown(props: SimpleCountdownProps) {
  const { days, hours, minutes, seconds } = useCountdownFormatter(props.to);

  return <>{days}:{hours}:{minutes}:{seconds}</>;
}