import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

export interface NotificationBadgeProps {
  count: number;
  variant?: 'wallet' | 'cart'
  color?: 'yellow' | 'red'
}

export function NotificationBadge(props: NotificationBadgeProps) {
  if (getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V3_ENABLED)) {
    if(props.variant && props.variant === 'wallet'){
      return (
        <span className="flex h-5 min-w-[20px] minlg:-mb-3 -mb-1 right-2 minlg:right-0 relative z-50 text-black font-semibold">
          <span
            className={tw(
              'relative bg-[#E43D20] rounded-full w-4 h-4',
              'border-white border-[3px] shadow-lg'
            )}>
          </span>
        </span>
      );
    }
    return (
      <span className="flex h-5 min-w-[20px] minlg:-mb-3 -mb-1 right-2 minlg:right-0 relative z-50 text-black font-semibold">
        <span
          className={tw(
            props.color && props.color === 'red' ? 'bg-[#E43D20] text-white' : 'bg-[#F9D54C]',
            'relative rounded-full min-w-[24px] h-6',
            'flex justify-center items-center px-[5px] pt-0.5 leading-[0px] text-[11px] font-noi-grotesk',
            'border-white border-[3px] shadow-lg'
          )}>
          {props.count}
        </span>
      </span>
    );
  } else {
    return (
      <span className="flex h-5 min-w-[20px] minlg:-mb-3 -mb-1 right-2 minlg:right-0 relative z-50 text-white">
        <span className="relative bg-[#D40909] rounded-full min-w-[20px] h-5 flex justify-center items-center px-[5px] leading-[0px] text-sm font-mono">
          {props.count}
          <span className="animate-ping absolute inline-flex h-5 w-full rounded-full bg-[#D40909] opacity-75"></span>
        </span>
      </span>
    );
  }
}