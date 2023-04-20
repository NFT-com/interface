import moment from 'moment';
import Image from 'next/image';
import { readingTime } from 'reading-time-estimator';

import ClientOnly from 'components/elements/ClientOnly';
import { contentfulLoader } from 'lib/image/loader';

import { PostData } from 'types/blogs';

import SharingIcons from './SharingIcons';

type HeaderProps = {
  post: PostData;
};

export default function BlogHeader({ post }: HeaderProps) {
  const result = readingTime(post?.body);
  return (
    <>
      <h2 className='mx-auto mb-3 max-w-2xl px-10 font-noi-grotesk text-lg font-bold leading-6 tracking-wider minmd:mb-0 minmd:text-2xl minlg:px-0 minlg:text-4xl minlg:leading-5.5'>
        {post?.title}
      </h2>
      {post?.author?.image?.url && (
        <div className='relative mx-auto mb-4 mt-3 h-9 w-9 overflow-hidden rounded-full minlg:mt-4 minlg:h-12 minlg:w-12'>
          <Image
            src={post.author.image.url}
            alt={post.author.image.description || 'Author Image'}
            className='object-contain'
            loader={contentfulLoader}
            fill
          />
        </div>
      )}
      <p data-cy='author' className='mt-2 font-noi-grotesk text-base leading-4 tracking-wider minlg:text-xl'>
        {post?.author?.name}
      </p>

      {post && (
        <div className='relative mb-2.5 mt-0.5 flex justify-center pb-8 font-noi-grotesk text-sm leading-3 tracking-wider text-blog-text-reskin minlg:mb-5 minlg:mt-2 minlg:pb-7'>
          <p data-cy='date'>{moment(post?.publishDate).format('MMM Do, YYYY')}</p>
          <span className='mx-1'>.</span>
          {post?.body && <p data-cy='time'>{result.minutes} min read</p>}
          <ClientOnly>
            <SharingIcons title={post?.title} />
          </ClientOnly>
        </div>
      )}
    </>
  );
}
