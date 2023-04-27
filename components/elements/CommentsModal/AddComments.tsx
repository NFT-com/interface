import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { useCommentsMutation } from 'graphql/hooks/useCommentsMutation';
import { useCommentsModal } from 'hooks/state/useCommentsModal';
import { tw } from 'utils/tw';

import React, { useState } from 'react';

export default function AddComments(props: any){
  const [comment, setCommentValue] = useState('');
  const [error, setError] = useState('');
  const { commentsData } = useCommentsModal();

  const { setComment, loading } = useCommentsMutation(
    commentsData.entityId,
    comment
  );

  const handleChange = (event) => {
    const value = event.target.value;
    setError('');
    setCommentValue(value);
  };
  const publishComment = () => {
    // const RegExp = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;
    // console.log('sajkasjksajkasjk comment',comment)
    // const matches = comment.match(RegExp);
    // if (matches && matches.length > 0) {
    //   setError('Please remove links from your comment.');
    // }else {
    //   console.log('sajkasjksajkasjk')
    // }
    setComment();
    setTimeout(() => {
      props.click();
      setCommentValue('');
    }, 300);
  };
  return (
    <div className='w-full flex items-center flex-col mt-6'>
      <textarea
        className="h-32 p-6 border-none resize-none rounded-xl bg-[#F8F8F8] text-[#000000] text-left w-full"
        maxLength={300}
        onChange={e => {
          handleChange(e);
        }}
        value={comment}
        placeholder="Write comment..." />
      <div className={tw(
        'text-base text-red-500 mt-4'
      )}>
        {error}
      </div>
      <div className={tw(
        'w-[264px] mt-8'
      )}>
        <Button
          type={ButtonType.PRIMARY}
          size={ButtonSize.XLARGE}
          label={'Add comment'}
          loading={loading}
          stretch
          onClick={() => publishComment()}
        />
      </div>
    </div>
  );
}
