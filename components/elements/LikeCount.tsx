import { tw } from 'utils/tw';

import { Player } from '@lottiefiles/react-lottie-player';
import Heart from 'public/heart.svg?svgr';
import { useState } from 'react';

type LikeCountProps = {
  count?: number;
  isLiked?: boolean;
  onClick: () => void;
}

export default function LikeCount({ count = 0, isLiked = false, onClick }: LikeCountProps) {
  const [clicked, setClicked] = useState(false);
  const [liked, setLiked] = useState(isLiked);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick();
        if(!liked) {
          setClicked(true);
          //mutate
          setTimeout(() => {
            setLiked(true);
            setClicked(false);
          }, 700);
        } else {
          setLiked(false);
          //mutate
        }
      }
      }
      className={tw(
        liked ? 'bg-alert-red-bg-light hover:bg-alert-red-bg' : 'bg-footer-bg hover:bg-[#ECECEC]',
        ' w-max relative h-10 rounded-[10px] hover:cursor-pointer px-3'
      )}
    >
      <div className='h-full flex flex-row items-center justify-center space-x-2'>
        
        {clicked && !liked ?
          <>
            <div className='w-[18px] h-5 flex'></div>
            <div className='absolute -top-[0.17rem] -left-[11px]'>
              <Player
                autoplay
                controls={false}
                src="/anim/heart.json"
                style={{ height: '100%', width: '100%' }}
              />
            </div>
          </>
          :
          <div className='w-[18px] h-5 flex'>
            <Heart
              fill={liked ? '#E45E47' : '#4D4D4D'}
            />
          </div>
        }
        
        {count > 0 &&
            <p className={tw(
              'font-noi-grotesk font-medium tracking-normal',
              liked ? 'text-alert-red-light' : 'text-key-bg',
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

