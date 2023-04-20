import { tw } from 'utils/tw';

export interface PropertyCardProps {
  type: string;
  value: string;
  variant?: 'gallery' | 'default';
  icon?: React.ReactElement;
  valueClasses?: string;
}

export function PropertyCard(props: PropertyCardProps) {
  return (
    <div
      className={tw(
        'flex h-full w-full',
        'rounded-lg border bg-white dark:bg-modal-overlay-dk',
        props.variant === 'gallery' ? 'border-accent-border-dk' : 'border-toggle-bg',
        'overflow-hidden'
      )}
    >
      {props.icon && <div className='ml-3 mr-2 flex w-1/4 items-center'>{props.icon}</div>}
      <div
        className={tw(
          'font-rubik flex flex-col justify-center p-2',
          props.variant === 'gallery' ? 'w-full text-left' : 'items-center'
        )}
      >
        <span className='text-xs text-gray-500'>{props.type}</span>
        <span className={tw('text-sm dark:text-white', props.valueClasses)}>{props.value}</span>
      </div>
    </div>
  );
}
