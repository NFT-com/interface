import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

export interface NftDetailCardProps {
  type: string;
  value: string;
  subtitle?: string;
  valueClasses?: string;
  center?: boolean;
  onClick?: () => void;
}

export function NftDetailCard(props: NftDetailCardProps) {
  return (
    <div
      className={tw(
        'NftDetailCard',
        'flex w-full h-full',
        'bg-white dark:bg-secondary-bg-dk rounded-lg',
        'overflow-hidden',
        props.onClick &&
        'transition hover:scale-[0.97] transition-spacing duration-100 ease-in-out cursor-pointer'
      )}
      onClick={() => props.onClick && props.onClick()}>
      <div className={tw(
        'flex flex-col p-4 w-full',
        'font-medium font-rubik',
        props.center ? 'items-center' : null,
      )}>
        <span className="text-xs text-secondary-txt dark:text-secondary-txt-dk mb-2">
          {props.type}
        </span>
        <span className={tw(
          'text-base dark:text-white',
          props.valueClasses
        )}>
          {props.value}
        </span>
        {!isNullOrEmpty(props.subtitle) && <span className=''>{props.subtitle}</span>}
      </div>
    </div>
  );
}