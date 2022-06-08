import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

export interface NftDetailCardProps {
  type: string;
  value: string;
  subtitle?: string;
  valueClasses?: string;
}

export function NftDetailCard(props: NftDetailCardProps) {
  return (
    <div className={tw(
      'flex w-full h-full',
      'bg-white dark:bg-detail-bg-dk rounded-lg',
      'overflow-hidden'
    )}>
      <div className={tw(
        'flex flex-col p-4 w-full',
        'font-medium font-rubik'
      )}>
        <span className="text-xs text-secondary-txt dark:text-secondary-txt-dk mb-2">
          {props.type}
        </span>
        <span className={tw(
          'text-sm dark:text-white',
          props.valueClasses
        )}>
          {props.value}
        </span>
        {!isNullOrEmpty(props.subtitle) && <span className=''>{props.subtitle}</span>}
      </div>
    </div>
  );
}