import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { readingTime } from 'reading-time-estimator';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { contentfulLoader } from 'lib/image/loader';

import { PostData } from 'types/blogs';

type BlogSliderPostProps = {
  post: PostData;
};

export default function BlogSliderCard({ post }: BlogSliderPostProps) {
  return (
    <div
      className='relative mx-10 flex w-full flex-none flex-row flex-nowrap rounded-2xl bg-[#5C542A] p-3 md:flex-col'
      key={post.title}
    >
      <div className='relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg bg-white object-cover object-center minmd:aspect-video minlg:aspect-square minlg:w-2/5'>
        <Link href={`/articles/${post.slug}`} passHref legacyBehavior>
          <Image
            src={post?.heroImage.url}
            className='rounded-lg'
            alt='cover image'
            fill
            placeholder='blur'
            style={{ objectFit: 'cover' }}
            blurDataURL={post?.heroImage.url}
            loader={contentfulLoader}
          />
        </Link>
      </div>
      <div className='ml-0 flex w-full flex-col px-1 pt-4 minlg:ml-8 minlg:w-3/5 minlg:pt-2 minxl:pt-12'>
        <Link href={`/articles/${post.slug}`} legacyBehavior>
          <a className='cursor-pointer'>
            <h2 className='w-full font-noi-grotesk text-lg font-bold text-white minmd:w-4/5 minlg:text-3xl minxl:text-4xl'>
              {post.title}
            </h2>
          </a>
        </Link>
        {post?.description && (
          <Link href={`/articles/${post.slug}`} legacyBehavior>
            <a className='cursor-pointer'>
              <p className='mt-2 w-full text-justify font-noi-grotesk text-sm leading-8 text-[#E1E1E1] minmd:w-10/12 minlg:mt-3 minlg:w-11/12 minlg:text-lg minxl:text-xl'>
                {post?.description.length > 230 ? `${post.description.substring(0, 230)}...` : post.description}
              </p>
            </a>
          </Link>
        )}
        <div className='mt-2 flex minlg:mt-4'>
          {post?.author?.image?.url && (
            <span className='relative mr-2 mt-0.5 h-7 w-7 overflow-hidden rounded-full minlg:h-12 minlg:w-12'>
              <Image
                src={post?.author?.image?.url}
                alt={post?.author?.image?.description || 'Author Image'}
                className='object-cover'
                loader={contentfulLoader}
                fill
              />
            </span>
          )}
          <div className='pt-0.5'>
            <p className='font-noi-grotesk text-sm text-white minlg:text-lg minxl:text-xl'>{post?.author.name}</p>
            <div className='flex text-[#B6B6B6]'>
              <p className='font-noi-grotesk text-xs minlg:text-sm'>
                {moment(post?.publishDate).format('MMM Do, YYYY')}
              </p>
              <span className='mx-1 hidden text-xxs3 minlg:block minlg:text-sm '>.</span>
              {post?.body && (
                <p className='hidden font-noi-grotesk text-xxs3 minlg:block minlg:text-sm'>
                  {readingTime(post?.body).minutes} min read
                </p>
              )}
            </div>
          </div>
        </div>
        <div className='mt-8 minlg:mt-6'>
          <Link href={`/articles/${post.slug}`}>
            <Button size={ButtonSize.LARGE} type={ButtonType.PRIMARY} label='View Post' onClick={() => null} />
          </Link>
        </div>
      </div>
    </div>
  );
}
