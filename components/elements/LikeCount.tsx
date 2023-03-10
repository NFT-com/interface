import { tw } from 'utils/tw';

import Heart from 'public/heart.svg';

type LikeCountProps = {
  count: number;
  isLiked: boolean;
  onClick: () => void;
}

export default function LikeCount({ count = 0, isLiked = false, onClick }: LikeCountProps) {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick();
      }}
      className={tw(
        isLiked ? 'bg-alert-red-bg-light hover:bg-alert-red-bg' : 'bg-footer-bg hover:bg-[#ECECEC]',
        ' w-max relative h-10 rounded-[10px] hover:cursor-pointer px-3'
      )}
    >
      <div className='h-full flex flex-row items-center justify-center space-x-2'>
        <div className='w-[18px] h-5 flex'>
          <Heart
            fill={isLiked ? '#E45E47' : '#4D4D4D'}
          />
        </div>
        {count > 0 &&
            <p className={tw(
              'font-noi-grotesk font-medium tracking-normal',
              isLiked ? 'text-alert-red-light' : 'text-key-bg'
            )}>
              {
                new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  compactDisplay: 'short'
                }).format(count)
              }
            </p>
        }
      </div>
    </div>
  );
}

