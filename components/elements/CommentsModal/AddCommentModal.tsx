import CommentBlock from 'components/elements/CommentsModal/CommentBlock';
import { Modal } from 'components/elements/Modal';
import { useCommentsMutation } from 'graphql/hooks/useCommentsMutation';
import { useCommentsQuery } from 'graphql/hooks/useCommentsQuery';
import { useCommentsModal } from 'hooks/state/useCommentsModal';
import { tw } from 'utils/tw';

import AddComments from './AddComments';
import NoComments from './NoComments';

import React, { useEffect, useState } from 'react';

export interface AddCommentModalProps {
  data: {
    name: string;
    entityId: string;
    isOwnedByMe: boolean;
  }
}

export default function AddCommentModal(props: AddCommentModalProps) {
  const [commentId, setCommentId] = useState(null);
  const { toggleCommentsModal, isOpen } = useCommentsModal();
  const { data: comments, mutate: mutateCommentData } = useCommentsQuery(props.data.entityId);
  console.log('commentscomments',comments)
  const { deleteCommentFn, loading } = useCommentsMutation(
    null,
    null,
    commentId
  );
  useEffect(() => {
    if(commentId){
      deleteCommentFn();
      setTimeout(() => {
        mutateCommentData();
      }, 500);
    }
  }, [commentId, deleteCommentFn, mutateCommentData]);

  const handleDelete = (id) => {
    setCommentId(id);
  };
  const handleCancelDelete = () => {
    setCommentId(null);
  };

  return (
    <Modal
      dark={false}
      pure
      closeBtnNoPaddings={true}
      visible={isOpen}
      loading={false}
      title={''}
      onClose={() => toggleCommentsModal(false)}>
      <div className="p-12 text-4xl flex flex-col items-start flex-col font-noi-grotesk">
        <h2 className={tw(
          'text-3xl font-semibold text-left'
        )}>{props?.data?.name}</h2>
        <div className='text-base mt-4'>Comments ({comments?.totalItems})</div>
        {/*max-h-72 overflow-y-auto*/}
        <div className='w-full flex flex-col items-start flex-col '>
          {
            comments?.items?.length
              ? comments?.items?.map((item, i) => {
                return (
                  <CommentBlock
                    commentId={commentId}
                    isOwnedByMe={props.data.isOwnedByMe}
                    data={item}
                    deleteComment={() => handleDelete(item.id)}
                    cancelDelete={() => handleCancelDelete()}
                    key={i}/>
                );
              })
              : <NoComments/>
          }
        </div>
        <AddComments click={mutateCommentData}/>
      </div>
    </Modal>
  );
}
