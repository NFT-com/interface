import { Button, ButtonType } from 'components/elements/Button';
import PreviewBanner from 'components/elements/PreviewBanner';
import { PageWrapper } from 'components/layouts/PageWrapper';
import BlogSlider from 'components/modules/BlogPage/BlogSlider';
import RelatedPostCard from 'components/modules/BlogPage/RelatedPostsCard';
import NotFoundPage from 'pages/404';
import { getPaginatedPosts } from 'utils/contentful';
import { Doppler, getEnvBool } from 'utils/env';

import { getCollection } from 'lib/contentful/api';
import { BLOG_LIST_HOME_FIELDS } from 'lib/contentful/schemas';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { PostData } from 'types/blogs';

type PostListProps = {
  postData: PostData[];
  preview: boolean;
  totalPosts: number;
  data?: {
    heroTitle: string
    listTitle: string
    blogSlidesCollection: {
      items: PostData[]
    }
  }
};

export default function BlogListPage({ postData, preview, data, totalPosts }: PostListProps) {
  const [posts, setPosts] = useState(postData);
  const router = useRouter();

  if (!router.isFallback && !posts || !getEnvBool(Doppler.NEXT_PUBLIC_BLOG_PAGES_ENABLED)) {
    return <NotFoundPage />;
  }
  return (
    getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V2_ENABLED)
      ? (
        <PageWrapper>
          <div className='bg-white'>
            <div className='px-6 md:px-4 sm:px-2.5 pt-28 max-w-7xl mx-auto'>
              <h2 className='font-bold font-grotesk text-4xl md:text-lg mb-6 md:mb-4 '>{data?.heroTitle}</h2>
              {posts && <BlogSlider posts={data?.blogSlidesCollection.items} />}
      
              <h2 className='font-bold font-grotesk text-4xl md:text-lg mb-6 md:mb-4 mt-10 '>{data?.listTitle}</h2>
              <div className="grid gap-x-4 sm:gap-x-3 gap-y-7 grid-cols-3 md:grid-cols-2 pb-24 lg:pb-12 ">
                {posts && posts.map((post) => (
                  <RelatedPostCard key={post.sys.id} post={post} />
                ))}
              </div>
            </div>
            {posts?.length < totalPosts && (
              <div className="w-full flex justify-center pb-32 bg-white">
                <Button
                  label={'Load More'}
                  type={ButtonType.PRIMARY}
                  onClick={async () => {
                    const nextPosts = await getPaginatedPosts(posts?.length, 12, preview);
                    setPosts([...posts, ...nextPosts.items]);
                  }}
                />
              </div>
            )}
          </div>
          {preview && <PreviewBanner />}
        </PageWrapper>)
      :(
        <PageWrapper>
          <div className='bg-white dark:bg-modal-overlay-dk'>
            <div className='px-6 md:px-4 sm:px-2.5 pt-28 max-w-7xl mx-auto'>
              <h2 className='font-medium text-4xl md:text-lg mb-6 md:mb-4 dark:text-white'>{data?.heroTitle}</h2>
              {posts && <BlogSlider posts={data?.blogSlidesCollection.items} />}
      
              <h2 className='font-medium text-4xl md:text-lg mb-6 md:mb-4 mt-10 dark:text-white'>{data?.listTitle}</h2>
              <div className="grid gap-x-4 sm:gap-x-3 gap-y-7 grid-cols-3 md:grid-cols-2 pb-24 lg:pb-12 ">
                {posts && posts.map((post) => (
                  <RelatedPostCard key={post.sys.id} post={post} />
                ))}
              </div>
            </div>
            {posts?.length < totalPosts && (
              <div className="w-full flex justify-center pb-32 bg-white dark:bg-modal-overlay-dk">
                <Button
                  label={'Load More'}
                  type={ButtonType.PRIMARY}
                  onClick={async () => {
                    const nextPosts = await getPaginatedPosts(posts?.length, 12, preview);
                    setPosts([...posts, ...nextPosts.items]);
                  }}
                />
              </div>
            )}
          </div>
          {preview && <PreviewBanner />}
        </PageWrapper>
      )
  );
}

export async function getServerSideProps({ preview = false }) {
  const homeData = await getCollection(preview, 1, 'blogHomePageCollection', BLOG_LIST_HOME_FIELDS);
  const posts = await getPaginatedPosts(0, 12, preview);
  return {
    props: {
      preview,
      postData: posts.items ?? null,
      totalPosts: posts.total ?? 0,
      data: homeData[0] ?? null
    }
  };
}