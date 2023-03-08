import { tw } from 'utils/tw';

import { Heart } from 'phosphor-react';

type LikeCountProps = {
  count: number;
  isLiked: boolean;
  onClick: () => void;
}

export default function Alert({ count, isLiked, onClick }: LikeCountProps) {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick();
      }}
      className={tw(
        isLiked ? 'bg-alert-red-bg-light hover:bg-alert-red-bg' : 'bg-footer-bg hover:bg-[#ECECEC]',
        ' w-max relative h-10 px-3 rounded-[10px] hover:cursor-pointer'
      )}
    >
      <div className='h-full flex flex-row items-center justify-center'>
        <Heart
          className={tw(
            count > 0 && 'mr-1.5'
          )}
          size={21}
          color={isLiked ? '#E45E47' : '#4D4D4D'}
          weight="fill"
        />
        {count > 0 &&
            <p className={tw(
              'font-noi-grotesk font-medium mt-0.5',
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

