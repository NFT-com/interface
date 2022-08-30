import useCopyClipboard from 'hooks/useCopyClipboard';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

export interface NftDetailCardProps {
  type: string;
  value: string;
  subtitle?: string;
  valueClasses?: string;
  center?: boolean;
  onClick?: () => void;
  copy?: boolean
}

export function NftDetailCard(props: NftDetailCardProps) {
  const [isCopied, staticCopy] = useCopyClipboard();

  return (
    <div
      className={tw(
        'NftDetailCard',
        'flex w-full h-full',
        'bg-[#F8F8F8] rounded-sm',
        'overflow-hidden cursor-pointer',
        props.onClick &&
       'cursor-pointer transition hover:scale-[0.97] transition-spacing duration-100 ease-in-out'
      )}
      onClick={!props.onClick
        ? () => {
          staticCopy(props.value);
        }
        : () => props.onClick && props.onClick()}
    >

      <div className={tw(
        'flex flex-col p-2 w-full',
        props.center ? 'items-center' : null,
        'overflow-hidden',
        'border border-[#E1E1E1] rounded-sm'
      )}>
        <span className='font-grotesk text-[#6F6F6F] font-bold text-[10px] leading-5 tracking-[10%]'>
          {props.type}
        </span>
        <span className={tw(
          'font-grotesk text-[#1F2127] font-bold text-[14px] leading-5',
          'line-clamp-1 text-ellipsis',
          props.valueClasses
        )}>
          {isCopied ? 'Copied!' : props.value}
        </span>
        {!isNullOrEmpty(props.subtitle) && <span className='font-grotesk font-normal text-xs leading-5 text-[#6F6F6F]'>{props.subtitle}</span>}
      </div>
    </div>
  );
}