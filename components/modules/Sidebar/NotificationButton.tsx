import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import moment from 'moment';

type NotificationButtonProps = {
  buttonText: string;
  onClick: () => void;
  date: string
}

export const NotificationButton = ({ buttonText, onClick, date }: NotificationButtonProps) => {
  return (
    <div className='flex flex-row w-full'>
      <button className={tw(
        'w-full h-full flex flex-col',
        'text-md text-black border-b-1 border-[#EFEFEF]',
        'leading-6',
        'bg-white font-semibold',
        'py-3'
      )}
      onClick={onClick}
      >
        <p>{buttonText}</p>
        {!isNullOrEmpty(date) && <p className='text-[#6F6F6F] text-[10px] font-bold uppercase -mt-1'>{moment(date).fromNow()}</p>}
      </button>
    </div>
  );
};