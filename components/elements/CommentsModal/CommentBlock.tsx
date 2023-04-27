import BlurImage from 'components/elements/BlurImage';
import { DropdownPickerModal } from 'components/elements/DropdownPickerModal';
import { SocialEntityType } from 'graphql/generated/types';
import { useUser } from 'hooks/state/useUser';
import { filterNulls } from 'utils/format';
import { tw } from 'utils/tw';
import DotsIcon from 'public/icons/dots-icon.svg?svgr';

import TrashIcon from 'public/icons/trash-icon.svg?svgr';
import React from 'react';
export interface CommentProps {
  data: {
    authorId?: string,
    content?: string,
    entityId?: string,
    entityType?: SocialEntityType,
    id?: string,
    author?: {
      photoURL?: string,
      url: string
    }
  },
  loading?: boolean;
  isOwnedByMe?: boolean;
  commentId?: string;
  deleteComment?: () => void;
  cancelDelete?: () => void;
}
export default function CommentBlock(props: CommentProps){
  const { currentProfileId } = useUser();

  const checkIsCanBeDeleted = () => {
    if((currentProfileId === props.data.authorId) || props.isOwnedByMe){
      return true;
    }
    return false;
  };
  return (
    <div className='w-full flex flex-row mt-7 pb-7 border-[#ECECEC] border-b-[1px] relative'>
      <div>
        <BlurImage
          width={36}
          height={36}
          alt='Avatar'
          src={props?.data?.author?.photoURL}
          className={'rounded-full bg-black mr-4'}
        />
      </div>
      <div className='flex items-start justify-start flex-col mt-[5px] relative w-full] w-full'>
        <div className='flex justify-between flex-row w-full items-center'>
          <div className='text-lg	font-medium'>
            <span className='bg-gradient-to-r from-[#FCC315] to-[#FF9C38] bg-clip-text text-transparent'>/</span> {props?.data?.author.url}
          </div>
          <div className={tw()}>
            {
              checkIsCanBeDeleted() && (
                <TrashIcon
                  className={tw('cursor-pointer')}
                  onClick={props.deleteComment}/>
              )
            }
            {/*<DropdownPickerModal*/}
            {/*  closeModalOnClick*/}
            {/*  pointer*/}
            {/*  align='center'*/}
            {/*  constrain*/}
            {/*  selectedIndex={0}*/}
            {/*  options={filterNulls([*/}
            {/*    {*/}
            {/*      label: 'Delete',*/}
            {/*      onSelect: () => {console.log('1');},*/}
            {/*      icon: null,*/}
            {/*    },*/}
            {/*    {*/}
            {/*      label: 'Report',*/}
            {/*      onSelect: () => {console.log('1');},*/}
            {/*      icon: null,*/}
            {/*    }*/}
            {/*  ])*/}
            {/*  }>*/}
            {/*  <DotsIcon*/}
            {/*    alt="dots menu"*/}
            {/*  />*/}
            {/*</DropdownPickerModal>*/}
          </div>
        </div>
        <div className='max-w-md text-base text-[#4D4D4D] mt-4 text-left'>
          {props?.data?.content}
        </div>
      </div>
      {/*{*/}
      {/*  props.commentId === props.data.id && (*/}
      {/*    <div className={tw('absolute h-full w-full flex items-center justify-center bg-white/60 text-lg font-normal pb-7')}>*/}
      {/*      This comment has been deleted. <span onClick={props.cancelDelete} className='underline font-medium ml-1 cursor-pointer'>Undo</span>*/}
      {/*    </div>*/}
      {/*  )*/}
      {/*}*/}
    </div>
  );
}
