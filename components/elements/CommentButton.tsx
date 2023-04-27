import { useCommentsQuery } from 'graphql/hooks/useCommentsQuery';
import { useCommentsModal } from 'hooks/state/useCommentsModal';
import { tw } from 'utils/tw';

import { modalTypeEnum, useNonProfileModal } from '../../hooks/state/useNonProfileModal';
import { useProfileSelectModal } from '../../hooks/state/useProfileSelectModal';
import { useUser } from '../../hooks/state/useUser';
import { useMyNftProfileTokens } from '../../hooks/useMyNftProfileTokens';
import AddCommentModal from './CommentsModal/AddCommentModal';

import { useAccount } from 'wagmi';

type commentDataProps = {
  commentsItems?: number,
  commentData: {
    entityId: string;
    name: string;
    isOwnedByMe: boolean
  },
}

export default function CommentsButton({ commentData }: commentDataProps) {
  const { toggleCommentsModal } = useCommentsModal();
  const { setNonProfileData } = useNonProfileModal();
  const { data: comments } = useCommentsQuery(commentData.entityId);
  const { currentProfileId, user } = useUser();
  const { address: currentAddress, isConnected } = useAccount();
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const { setProfileSelectModalOpen } = useProfileSelectModal();

  const handleClick = () => {
    if (!user.currentProfileUrl && !currentProfileId && (!isConnected || !currentAddress)) {
      if(myOwnedProfileTokens && myOwnedProfileTokens.length){
        setProfileSelectModalOpen(true);
      }else{
        setNonProfileData(true, modalTypeEnum.Comment);
      }
    }else {
      toggleCommentsModal(true, commentData.entityId);
    }
  };
  return (
    <>
      <button
        disabled={false}
        onClick={handleClick}
        className={tw(
          'text-base px-6 py-1.5 rounded-full font-medium border-[1.5px] border-black hover:bg-black hover:text-white'
        )}
      >
        View {comments && comments?.totalItems ? comments?.totalItems : ''} comments
      </button>
      <AddCommentModal
        data={{
          name: commentData?.name,
          entityId: commentData?.entityId,
          isOwnedByMe: commentData?.isOwnedByMe
        }}/>
    </>
  );
}
