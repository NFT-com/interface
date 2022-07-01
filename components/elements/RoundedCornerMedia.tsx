/* eslint-disable @next/next/no-img-element */
import { tw } from 'utils/tw';

export enum RoundedCornerVariant {
  TopLeft = 'topleft',
  TopRight = 'topright',
  BottomLeft = 'bottomleft',
  BottomRight = 'bottomright',
  Left = 'left',
  Right = 'right',
  All = 'all',
  None = 'none',
}

export interface RoundedCornerMediaProps {
  src: string;
  variant: RoundedCornerVariant;
  extraClasses?: string;
  containerClasses?: string;
  overlayOptions?: {
    profileOwner: string;
    gkId: number;
    pfp: string;
  }
  loading?: boolean;
}

const getRoundedClass = (variant: RoundedCornerVariant): string => {
  switch (variant) {
  case RoundedCornerVariant.TopLeft:
    return 'rounded-tl-3xl';
  case RoundedCornerVariant.TopRight:
    return 'rounded-tr-3xl';
  case RoundedCornerVariant.BottomLeft:
    return 'rounded-bl-3xl';
  case RoundedCornerVariant.BottomRight:
    return 'rounded-br-3xl';
  case RoundedCornerVariant.Right:
    return 'rounded-r-3xl';
  case RoundedCornerVariant.Left:
    return 'rounded-l-3xl';
  case RoundedCornerVariant.All:
    return 'rounded-3xl object-cover';
  case RoundedCornerVariant.None:
  default:
    return '';
  }
};

export function RoundedCornerMedia(props: RoundedCornerMediaProps) {
  return (
    <div className={tw(
      'flex object-cover w-full aspect-square',
      getRoundedClass(props.variant),
      props.containerClasses
    )}>
      { props?.loading ?
        <div className={tw(`w-full h-full bg-gray-300 animate-pulse ${getRoundedClass(props.variant)}  backdrop-blur-sm`)}></div>
      :
      <div>
        <video
          autoPlay
          muted
          loop
          key={props.src}
          src={props.src}
          poster={props.src}
          className={tw(
            'flex object-cover w-full h-full aspect-square',
            getRoundedClass(props.variant),
            props.extraClasses
          )}
        />
        {props?.overlayOptions &&
          <div className='relative h-[5%] w-full'>
            <div className={tw('absolute inset-x-0 bottom-0 h-12',
              'bg-always-white/30 rounded-b-3xl backdrop-blur-sm',
              'flex items-center'
            )}>
              <div className='flex p-4 w-full items-center'>
                <img
                  className='flex rounded-full h-10 w-10 object-cover aspect-square'
                  src={props?.overlayOptions?.pfp}
                  alt='featuredProfilePfp'
                />
                <span className='flex pl-2 items-center'>
                  {props?.overlayOptions?.profileOwner}
                </span>
              </div>
              <div className='justify-end pr-4'>
                {props?.overlayOptions?.gkId}
              </div>
            </div>
          </div>
        }
        </div>
    }
    </div>
  );
}