import { useEffect, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

import { LikeableType } from 'graphql/generated/types';
import { useSetLikeMutation } from 'graphql/hooks/useLikeMutations';
import { tw } from 'utils/tw';

import Heart from 'public/icons/heart.svg?svgr';

type LikeData = {
  type: LikeableType;
  id: string;
  profileName?: string;
};

type LikeCountProps = {
  count: number;
  isLiked: boolean;
  // used if a mutate is necessary, such as if we're trying to keep nft card and profile like count in sync
  mutate?: () => void;
  likeData?: LikeData;
};

export default function LikeCount({ count, isLiked, mutate, likeData }: LikeCountProps) {
  const [clicked, setClicked] = useState(false);
  const [liked, setLiked] = useState(null);
  const [likeCount, setLikeCount] = useState(null);
  const [isDisabled, setDisabled] = useState(false);
  useEffect(() => {
    setLiked(isLiked);
    setLikeCount(count);
  }, [count, isLiked]);

  function timeout(ms) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const { setLike, unsetLike } = useSetLikeMutation(likeData?.id, likeData?.type, likeData?.profileName);

  const handleClick = async () => {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 1000);
    if (!liked) {
      setClicked(true);
      setLikeCount(likeCount + 1);
      // await timeout is used here to allow the animation to fully animate before hiding it again
      await timeout(700);
      setLiked(true);
      setClicked(false);
      mutate && mutate();
    } else {
      setLiked(false);
      setLikeCount(likeCount - 1);
      await timeout(700);
      setClicked(false);
      mutate && mutate();
    }
  };

  return (
    <button
      disabled={isDisabled}
      onClick={async e => {
        e.preventDefault();
        isLiked ? unsetLike() : setLike();
        await handleClick();
      }}
      className={tw(
        liked ? 'bg-alert-red-bg-light hover:bg-alert-red-bg' : 'bg-footer-bg hover:bg-[#ECECEC]',
        ' relative h-10 w-max rounded-[10px] px-3 hover:cursor-pointer'
      )}
    >
      <div className='flex h-full flex-row items-center justify-center space-x-2'>
        {clicked && !liked ? (
          <>
            <div className='flex h-5 w-[18px]'></div>
            <div className='absolute -left-[11px] -top-[0.17rem]'>
              <Player autoplay controls={false} src='/anim/heart.json' style={{ height: '100%', width: '100%' }} />
            </div>
          </>
        ) : (
          <div className='flex h-5 w-[18px]'>
            <Heart fill={liked ? '#E45E47' : '#4D4D4D'} />
          </div>
        )}

        {likeCount > 0 && (
          <p
            className={tw(
              'font-noi-grotesk font-medium tracking-normal',
              liked ? 'text-alert-red-light' : 'text-key-bg'
            )}
          >
            {new Intl.NumberFormat('en-US', {
              notation: 'compact',
              compactDisplay: 'short'
            }).format(likeCount)}
          </p>
        )}
      </div>
    </button>
  );
}
