import { tw } from 'utils/tw';

import { CheckCircle, Warning, WarningCircle, X } from 'phosphor-react';

export enum AlertType {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  INFO = 'INFO'
}

type AlertProps = {
  type: AlertType;
  heading: string;
  description: string;
  onClick?: () => void;
  onClose?: () => void
  hideX?: boolean;
}

const getAlertStyles = (type: AlertType) => {
  switch (type) {
  case AlertType.ERROR: {
    return 'border-alert-red bg-alert-red-bg-light';
  }
  case AlertType.SUCCESS: {
    return 'border-alert-green bg-alert-green-bg-light';
  }
  case AlertType.WARNING: {
    return 'border-alert-yellow bg-alert-yellow-bg-light';
  }
  case AlertType.INFO: {
    return 'border-alert-grey bg-alert-grey-bg';
  }
  default: {
    return '';
  }
  }
};

const getAlertIcon =(type: AlertType) => {
  switch (type) {
  case AlertType.ERROR: {
    return <WarningCircle size={32} color="#e43d20" weight="fill" className='relative shrink-0 h-7 w-7' />;
  }
  case AlertType.SUCCESS: {
    return <CheckCircle size={32} color="#36aa73" weight="fill" className='relative shrink-0 h-7 w-7' />;
  }
  case AlertType.WARNING: {
    return <Warning size={32} color="#e4b200" weight="fill" className='relative shrink-0 h-7 w-7' />;
  }
  case AlertType.INFO: {
    return <CheckCircle size={32} color="#6A6A6A" weight="fill" className='relative shrink-0 h-7 w-7' />;
  }
  default: {
    return '';
  }
  }
};

export default function Alert({ type, heading, description, onClick, onClose, hideX }: AlertProps) {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick();
      }}
      className={tw(
        'flex w-full p-4 border rounded font-noi-grotesk hover:cursor-pointer',
        getAlertStyles(type)
      )}
    >
      <div className='flex w-full'>
        {getAlertIcon(type)}
        <div className='flex flex-col ml-3'>
          <p
            className={tw(
              'font-medium mb-1',
              type === AlertType.ERROR && 'text-alert-red',
              type === AlertType.SUCCESS && 'text-alert-green',
              type === AlertType.WARNING && 'text-alert-yellow',
              type === AlertType.INFO && 'text-alert-grey'
            )}
          >
            {heading}
          </p>
          <p className='text-[#6A6A6A]'>
            {description}
          </p>
        </div>
      </div>
      {!hideX &&
      <X
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClose && onClose();
        }}
        className='relative shrink-0 h-5 w-5 hover:cursor-pointer'
        weight='fill'
        color="#6A6A6A" />
      }
    </div>
  );
}

