import { tw } from 'utils/tw';

export interface NotificationBadgeProps {
  count: number;
  variant?: 'wallet' | 'cart';
  color?: 'yellow' | 'red';
}

export function NotificationBadge(props: NotificationBadgeProps) {
  if (props.variant && props.variant === 'wallet') {
    return (
      <span className='relative right-2 z-50 -mb-1 flex h-5 min-w-[20px] font-semibold text-black minlg:right-0 minlg:-mb-3'>
        <span
          className={tw('relative h-4 w-4 rounded-full bg-[#E43D20]', 'border-[3px] border-white shadow-lg')}
        ></span>
      </span>
    );
  }
  return (
    <span className='relative right-2 z-50 -mb-1 flex h-5 min-w-[20px] font-semibold text-black minlg:right-0 minlg:-mb-3'>
      <span
        className={tw(
          props.color && props.color === 'red' ? 'bg-[#E43D20] text-white' : 'bg-[#F9D54C]',
          'relative h-6 min-w-[24px] rounded-full',
          'flex items-center justify-center px-[5px] pt-0.5 font-noi-grotesk text-[11px] leading-[0px]',
          'border-[3px] border-white shadow-lg'
        )}
      >
        {props.count}
      </span>
    </span>
  );
}
