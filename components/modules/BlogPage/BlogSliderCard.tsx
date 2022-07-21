import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { readingTime } from 'reading-time-estimator';
import { PostData } from 'types/blogs';

type BlogSliderPostProps = {
  post: PostData;
};

export default function BlogSliderCard({ post }: BlogSliderPostProps) {
  return (
    getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V2_ENABLED)
      ? (
        <div
          className="relative flex flex-row md:flex-col flex-none flex-nowrap w-full mx-10 p-3 bg-[#5C542A] rounded-2xl"
          key={post.title}
        >
          <div className="relative overflow-hidden cursor-pointer w-2/5 md:w-full aspect-square md:aspect-video sm:aspect-square object-cover object-center bg-white rounded-lg">
            <Link href={`/articles/${post.slug}`}>
              <a>
                <Image
                  src={post?.heroImage.url}
                  className="rounded-lg"
                  alt="cover image"
                  placeholder="blur"
                  layout='fill'
                  objectFit="cover"
                  blurDataURL={post?.heroImage.url}
                />
              </a>
            </Link>
          </div>
          <div className="flex flex-col w-3/5 md:w-full ml-8 md:ml-0 pt-12 lg:pt-2 md:pt-4 px-1">
            <Link href={`/articles/${post.slug}`}>
              <a className="cursor-pointer">
                <h2 className="font-grotesk font-bold text-white text-4xl lg:text-3xl md:text-lg md:w-4/5 sm:w-full">
                  {post.title}
                </h2>
              </a>
            </Link>
            {post?.description && (
              <Link href={`/articles/${post.slug}`}>
                <a className="cursor-pointer">
                  <p className="font-grotesk text-[#E1E1E1] text-justify text-xl lg:text-lg md:text-sm w-11/12 md:w-10/12 sm:w-full leading-8 mt-3 md:mt-2">
                    {post?.description.length > 230
                      ? post.description.substring(0, 230) + '...'
                      : post.description}
                  </p>
                </a>
              </Link>
            )}
            <div className="flex mt-4 md:mt-2">
              {post?.author?.image?.url && (
                <div className="h-12 md:h-7 w-12 md:w-7 mr-2 mt-0.5">
                  <Image
                    src={post?.author?.image?.url}
                    alt={post?.author?.image?.description || 'Author Image'}
                    className="rounded-full"
                    width="100%"
                    height="100%"
                  />
                </div>)
              }
              <div className='pt-0.5'>
                <p className="font-grotesk text-xl lg:text-lg md:text-sm text-white">
                  {post?.author.name}
                </p>
                <div className="flex text-[#B6B6B6]">
                  <p className="font-grotesk text-sm md:text-xs">
                    {moment(post?.publishDate).format('MMM Do, YYYY')}
                  </p>
                  <span className="mx-1 block md:hidden text-sm md:text-xxs3 ">
                .
                  </span>
                  {post?.body && (
                    <p className="font-grotesk block md:hidden text-sm md:text-xxs3">
                      {readingTime(post?.body).minutes} min read
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Link href={`/articles/${post.slug}`}>
              <button
                className={tw(
                  'font-grotesk font-bold bg-[#F9D963] rounded-lg text-[#4D4412] block',
                  'flex flex-row items-center cursor-pointer hover:opacity-80 w-max mt-8 lg:mt-6 md:mt-3 mb-9 md:mb-6 sm:mb-4',
                  'py-2 px-5'
                )}
                type="button">
                View Post
              </button>
            </Link>
          </div>
        </div>)
      :(
        <div
          className="relative flex flex-row md:flex-col flex-none flex-nowrap w-full mx-10 p-3 bg-white dark:bg-modal-overlay-dk rounded-2xl"
          key={post.title}
        >
          <div className="relative overflow-hidden cursor-pointer w-2/5 md:w-full aspect-square md:aspect-video sm:aspect-square object-cover object-center">
            <Link href={`/articles/${post.slug}`}>
              <a>
                <Image
                  src={post?.heroImage.url}
                  className="rounded-lg"
                  alt="cover image"
                  placeholder="blur"
                  layout='fill'
                  objectFit="cover"
                  blurDataURL={post?.heroImage.url}
                />
              </a>
            </Link>
          </div>
          <div className="flex flex-col w-3/5 md:w-full ml-8 md:ml-0 pt-12 lg:pt-2 md:pt-4 px-1">
            <Link href={`/articles/${post.slug}`}>
              <a className="cursor-pointer">
                <h2 className="font-bold text-black dark:text-white text-4xl lg:text-3xl md:text-lg md:w-4/5 sm:w-full">
                  {post.title}
                </h2>
              </a>
            </Link>
            {post?.description && (
              <Link href={`/articles/${post.slug}`}>
                <a className="cursor-pointer">
                  <p className="text-blog-text dark:text-gray-400 text-justify text-xl lg:text-lg md:text-sm w-11/12 md:w-10/12 sm:w-full leading-8 mt-3 md:mt-2">
                    {post?.description.length > 230
                      ? post.description.substring(0, 230) + '...'
                      : post.description}
                  </p>
                </a>
              </Link>
            )}
            <div className="flex mt-4 md:mt-2">
              {post?.author?.image?.url && (
                <div className="h-12 md:h-7 w-12 md:w-7 mr-2 mt-0.5">
                  <Image
                    src={post?.author?.image?.url}
                    alt={post?.author?.image?.description || 'Author Image'}
                    className="rounded-full"
                    width="100%"
                    height="100%"
                  />
                </div>)
              }
              <div className='pt-0.5'>
                <p className="text-xl lg:text-lg md:text-sm dark:text-white">
                  {post?.author.name}
                </p>
                <div className="flex text-blog-text dark:text-gray-400">
                  <p className="text-sm md:text-xs">
                    {moment(post?.publishDate).format('MMM Do, YYYY')}
                  </p>
                  <span className="mx-1 block md:hidden text-sm md:text-xxs3 ">
                .
                  </span>
                  {post?.body && (
                    <p className="block md:hidden text-sm md:text-xxs3">
                      {readingTime(post?.body).minutes} min read
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Link href={`/articles/${post.slug}`}>
              <button
                className={tw(
                  'font-medium bg-primary-button-bckg rounded-xl text-white block',
                  'flex flex-row items-center cursor-pointer hover:opacity-80 font-rubik w-max mt-8 lg:mt-6 md:mt-3 mb-9 md:mb-6 sm:mb-4',
                  'py-2 px-5'
                )}
                type="button">
                View Post
              </button>
            </Link>
          </div>
        </div>
      )
  );
}