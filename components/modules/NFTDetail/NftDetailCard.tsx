import useCopyClipboard from 'hooks/useCopyClipboard';
import { isNullOrEmpty } from 'utils/format';
import { tw } from 'utils/tw';

export interface NftDetailCardProps {
  type: string;
  value: string;
  highlighted?: boolean;
  subtitle?: string;
  valueClasses?: string;
  center?: boolean;
  onClick?: () => void;
  copy?: boolean;
}

export function NftDetailCard(props: NftDetailCardProps) {
  const [isCopied, staticCopy] = useCopyClipboard();

  return (
    <div
      className={tw(
        'NftDetailCard',
        'flex w-full',
        props?.highlighted ? 'border border-[#F9D54C] bg-[#FFF4CA]' : 'bg-white ',
        'rounded-[18px] px-3 py-4 shadow-xl',
        'cursor-pointer overflow-hidden',
        props.onClick && 'transition-spacing cursor-pointer transition duration-100 ease-in-out hover:scale-[0.97]'
      )}
      onClick={
        !props.onClick
          ? () => {
              staticCopy(props.value);
            }
          : () => props.onClick && props.onClick()
      }
    >
      <div className={tw('flex w-full flex-col p-2', props.center ? 'items-center' : null, 'overflow-hidden')}>
        <span
          className={tw(
            'mb-4  font-noi-grotesk text-[16px] font-medium capitalize leading-5 tracking-[10%]',
            props?.highlighted ? 'text-[#E4BA18]' : 'text-[#6A6A6A]'
          )}
        >
          {props?.type?.toLowerCase()}
        </span>
        <span
          className={tw(
            'font-noi-grotesk text-[16px] font-medium leading-5 text-black',
            'text-ellipsis capitalize line-clamp-1',
            props.valueClasses
          )}
        >
          {isCopied ? 'Copied!' : props?.value?.toLowerCase()}
        </span>
        {!isNullOrEmpty(props.subtitle) && (
          <span className='font-noi-grotesk text-xs font-normal leading-5 text-[#6F6F6F]'>{props.subtitle}</span>
        )}
      </div>
    </div>
  );
}
