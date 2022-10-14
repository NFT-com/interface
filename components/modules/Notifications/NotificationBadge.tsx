export interface NotificationBadgeProps {
  count: number;
}

export function NotificationBadge(props: NotificationBadgeProps) {
  return (
    <span className="flex h-5 min-w-[20px] minlg:-mb-3 -mb-1 right-2 minlg:right-0 relative z-50 text-black font-semibold">
      <span className="relative bg-[#F9D54C] rounded-full min-w-[20px] h-5 flex justify-center items-center px-[5px] leading-[0px] text-sm font-mono">
        {props.count}
        <span className="animate-ping absolute inline-flex h-5 w-full rounded-full bg-[#F9D54C]"></span>
      </span>
    </span>
  );
}