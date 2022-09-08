import { tw } from 'utils/tw';

import moment from 'moment';

type NotificationButtonProps = {
  buttonText: string;
  onClick: () => void;
  bgColor: 'grey' | 'white';
  date: any
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
      </button>
    </div>
  );
};