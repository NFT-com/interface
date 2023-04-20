import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { readingTime } from 'reading-time-estimator';

import BlurImage from 'components/elements/BlurImage';
import { contentfulLoader } from 'lib/image/loader';

import { PostData } from 'types/blogs';

type RelatedPostProps = {
  post: PostData;
};

export default function RelatedPostCard({ post }: RelatedPostProps) {
  const result = readingTime(post?.body || '');
  return (
    <Link href={`/articles/${post?.slug}`} passHref legacyBehavior>
      <div data-cy='blogPostCard' className='text-left	hover:cursor-pointer'>
        {post?.heroImage?.url && (
          <div
            style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}
            className='relative aspect-4/3 w-full rounded-md'
          >
            <BlurImage
              className='rounded-md object-cover'
              fill
              src={post?.heroImage?.url}
              alt={post?.heroImage?.description}
              loader={contentfulLoader}
            />
          </div>
        )}
        <h3 className='mt-2 font-noi-grotesk text-sm font-bold minmd:text-base minlg:text-lg minxl:text-xl'>
          {post?.title}
        </h3>
        {post?.description && (
          <p className='mt-1 font-noi-grotesk text-xs leading-4 text-blog-text minlg:text-base minlg:leading-5.5'>
            {post.description.length > 75 ? `${post.description.substring(0, 75)}...` : post.description}
          </p>
        )}
        <div className='mt-3 flex'>
          {post?.author?.image?.url && (
            <span className='relative mr-2 mt-0.5 h-7 w-7 overflow-hidden rounded-full minlg:h-9 minlg:w-9'>
              <Image
                src={post.author.image.url}
                alt={post.author.image.description || 'Author Image'}
                loader={contentfulLoader}
                className='object-cover'
                fill
              />
            </span>
          )}
          <div>
            <p className='font-noi-grotesk text-xs leading-5 minlg:text-base'>{post?.author?.name}</p>
            <div className='flex font-noi-grotesk text-blog-text'>
              <p className='text-xxs3 minlg:text-sm'>{moment(post?.publishDate).format('MMM Do, YYYY')}</p>
              <span className='mx-1 hidden text-xxs3 minlg:block minlg:text-sm '>.</span>
              {post?.body && <p className='hidden text-xxs3 minlg:block minlg:text-sm'>{result.minutes} min read</p>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
