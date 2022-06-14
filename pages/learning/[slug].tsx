import Markdown from 'components/elements/Markdown';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { tw } from 'utils/tw';

import { getAllPostsWithSlug, getPost } from 'lib/contentful/api';
import moment from 'moment';
import ErrorPage from 'next/error';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { readingTime } from 'reading-time-estimator';
import { PostData } from 'types/blogs';

type PostProps = {
  post: PostData;
  preview: boolean;
};

export default function Post({ post, preview }: PostProps) {
  const router = useRouter();
  const result = readingTime(post?.body);

  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <PageWrapper
      headerOptions={{
        walletOnly: true,
        removeBackground: true,
        walletPopupMenu: true,
        removeSummaryBanner: true,
        sidebar: 'hero',
        heroHeader: true,
      }}
    >
      <div className="bg-white absolute top-20 text-center px-4 w-full">
        <p className="mt-14 sm:mt-6 md:mt-10 mx-auto text-4xl sm:text-lg md:text-2xl sm:mb-3 max-w-2xl font-medium leading-normal md:leading-6 tracking-wider px-0 md:px-10">
          {post?.title}
        </p>
        {post?.author && (
          <div className="mb-4 mt-4 md:mt-3 mx-auto h-12 md:h-9 w-12 md:w-9">
            <Image
              src={post?.author?.image.url}
              alt="author image"
              className="rounded-full"
              width="100%"
              height="100%"
            />
          </div>
        )}
        <p className="mt-2 text-xl md:text-base leading-4 tracking-wider">
          {post?.author?.name}
        </p>

        {post && (
          <div className="flex justify-center mt-2 md:mt-0.5 mb-10 text-xs md:text-sm text-slate-600 leading-3 tracking-wider">
            <p>{moment(post?.publishDate).format('MMM Do, YYYY')}</p>
            <span className="mx-1">.</span>
            {post?.body && <p>{result.minutes} min read</p>}
          </div>
        )}

        <div className="border-t-2 border-slate-300 pt-5 md:pt-2.5 ">
          <div
            className="bg-cover bg-center rounded-md min-w-full h-96 mb-7"
            style={{ backgroundImage: `url(${post?.heroImage.url})` }}
          ></div>
        </div>

        <div className="text-left border-b-2 border-slate-300 mt-12 md:mt-8 mb-5">
          <Markdown content={post?.body} />
        </div>
      </div>
    </PageWrapper>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getPost(params.slug, preview);

  return {
    props: {
      preview,
      post: data?.post ?? null,
    },
  };
}

export async function getStaticPaths() {
  const allPosts = await getAllPostsWithSlug();
  return {
    paths: allPosts?.map(({ slug }) => `/posts/${slug}`) ?? [],
    fallback: true,
  };
}
