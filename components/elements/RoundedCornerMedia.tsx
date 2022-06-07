import { tw } from 'utils/tw';

export enum RoundedCornerVariant {
  TopLeft = 'topleft',
  TopRight = 'topright',
  BottomLeft = 'bottomleft',
  BottomRight = 'bottomright',
  Left = 'left',
  Right = 'right',
  All = 'all',
  None = 'none'
}

export interface RoundedCornerMediaProps {
  src: string;
  variant: RoundedCornerVariant;
  extraClasses?: string;
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
    <video
      autoPlay
      muted
      loop
      key={props.src}
      src={props.src}
      poster={props.src}
      className={tw(
        'flex aspect-square object-cover',
        getRoundedClass(props.variant),
        props.extraClasses
      )}
    />
  );
}