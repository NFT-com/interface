import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import moment from 'moment';

type NotificationButtonProps = {
  buttonText: string;
  onClick: () => void;
  bgColor: 'grey' | 'white';
  date: string
}

export const NotificationButton = ({ buttonText, onClick, bgColor, date }: NotificationButtonProps) => {
  return (
    <div className='flex flex-row w-full rounded-2xl'>
      <button className={tw(
        'w-full h-full flex flex-col',
        'text-md text-[#B59007] font-bold',
        'leading-6',
        bgColor === 'grey' ? 'bg-[#F8F8F8]' : 'bg-white',
        'p-4'
      )}
      onClick={onClick}
      >
        <p>{buttonText}</p>
        {!isNullOrEmpty(date) && <p className='text-[#6F6F6F] text-[10px] font-bold uppercase -mt-1'>{moment(date).fromNow()}</p>}
      </button>
    </div>
  );
};