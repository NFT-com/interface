import BlurImage from 'components/elements/BlurImage';

import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { readingTime } from 'reading-time-estimator';
import { PostData } from 'types/blogs';

type RelatedPostProps = {
  post: PostData;
};

export default function RelatedPostCard({ post }: RelatedPostProps) {
  const result = readingTime(post?.body || '');
  return (
    <Link href={`/articles/${post?.slug}`}>
      <div className="text-left	hover:cursor-pointer">
        {post?.heroImage?.url &&
        <div className="aspect-4/3 w-full relative bg-gray-200 rounded-md">
          <BlurImage
            className='rounded-md'
            objectFit="cover"
            layout="fill"
            src={post?.heroImage?.url}
            alt={post?.heroImage?.description}
          />
        </div>
        }
        <h3 className="font-grotesk font-bold text-xl lg:text-lg md:text-base sm:text-sm mt-2">
          {post?.title}
        </h3>
        {post?.description && (
          <p className="font-grotesk text-base md:text-xs mt-1 leading-5.5 md:leading-4 text-blog-text">
            {post.description.length > 75
              ? post.description.substring(0, 75) + '...'
              : post.description}
          </p>
        )}
        <div className="flex mt-3">
          {post?.author?.image?.url && (
            <div className="h-9 md:h-7 w-9 md:w-7 mr-2 mt-0.5">
              <Image
                src={post?.author?.image?.url}
                alt={post?.author?.image?.description || 'Author Image'}
                className="rounded-full"
                width="100%"
                height="100%"
              />
            </div>)}
          <div>
            <p className="font-grotesk text-base md:text-xs leading-5">
              {post?.author?.name}
            </p>
            <div className="font-grotesk flex text-blog-text">
              <p className="text-sm md:text-xxs3">
                {moment(post?.publishDate).format('MMM Do, YYYY')}
              </p>
              <span className="mx-1 block md:hidden text-sm md:text-xxs3 ">
                .
              </span>
              {post?.body && (
                <p className="block md:hidden text-sm md:text-xxs3">
                  {result.minutes} min read
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
