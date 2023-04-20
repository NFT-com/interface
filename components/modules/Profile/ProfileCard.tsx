import Link from 'next/link';
import { PartialDeep } from 'type-fest';

import { RoundedCornerAmount, RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Profile } from 'graphql/generated/types';
import { useProfileVisibleNFTCount } from 'graphql/hooks/useProfileVisibleNFTCount';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { tw } from 'utils/tw';

export interface ProfileCardProps {
  profile: PartialDeep<Profile>;
  priority?: boolean;
}

export function ProfileCard(props: ProfileCardProps) {
  const defaultChainId = useDefaultChainId();
  const { totalItems } = useProfileVisibleNFTCount([props?.profile?.id], defaultChainId);

  return (
    <Link href={`/${props.profile?.url}`} passHref legacyBehavior>
      <a
        className={tw(
          'sn:no-scrollbar mr-4 flex h-full w-72 shrink-0 cursor-pointer snap-center snap-always flex-col rounded-md border border-[#D5D5D5] p-4 text-base text-black'
        )}
      >
        <RoundedCornerMedia
          priority={props?.priority}
          containerClasses='w-full aspect-square'
          variant={RoundedCornerVariant.All}
          amount={RoundedCornerAmount.Medium}
          src={props.profile?.photoURL}
        />
        <div className='my-4 flex w-full font-noi-grotesk'>
          <span className='font-dm-mono text-xl font-medium text-primary-yellow'>/</span>
          <span className='ml-1 overflow-hidden text-ellipsis whitespace-nowrap text-xl font-bold'>
            {props.profile?.url}
          </span>
        </div>
        <div className='flex w-full font-noi-grotesk'>
          <span className='text-secondary-txt'>NFTs Displayed:</span>
          <span className='ml-1 font-bold'>{totalItems}</span>
        </div>
      </a>
    </Link>
  );
}
