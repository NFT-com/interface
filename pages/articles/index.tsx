import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import DefaultLayout from 'components/layouts/DefaultLayout';
import RelatedPostCard from 'components/modules/BlogPage/RelatedPostsCard';
import contentfulBackupData from 'constants/contentful_backup_data.json';
import { getCollection } from 'lib/contentful/api';
import { BLOG_LIST_HOME_FIELDS } from 'lib/contentful/schemas';
import NotFoundPage from 'pages/404';
import { getPaginatedPosts } from 'utils/contentful';

import { PostData } from 'types/blogs';

type PostListProps = {
  postData: PostData[];
  preview: boolean;
  totalPosts: number;
  data?: {
    heroTitle: string;
    listTitle: string;
    blogSlidesCollection: {
      items: PostData[];
    };
  };
};

const DynamicBlogSlider = dynamic(() => import('components/modules/BlogPage/BlogSlider'));
const DynamicPreviewBanner = dynamic(() => import('components/elements/PreviewBanner'));

export default function BlogListPage({ postData, preview, data, totalPosts }: PostListProps) {
  const [posts, setPosts] = useState(postData ?? (contentfulBackupData[2]?.items as PostData[]));
  const totalPostsFallback = totalPosts ?? contentfulBackupData[2]?.total;
  const dataFallback =
    data ??
    (contentfulBackupData[1] as {
      heroTitle: string;
      listTitle: string;
      blogSlidesCollection: {
        items: PostData[];
      };
    });
  const router = useRouter();

  if (!router.isFallback && !posts) {
    return <NotFoundPage />;
  }

  return (
    <>
      <NextSeo
        title='NFT.com Blog | NFT Insights, Updates, and Education'
        description='Learn about latest trends and updates in the NFT and crypto industry'
        openGraph={{
          url: 'https://www.nft.com/articles',
          title: 'NFT.com Blog | NFT Insights, Updates, and Education',
          description: 'Learn about latest trends and updates in the NFT and crypto industry',
          site_name: 'NFT.com'
        }}
        twitter={{
          cardType: 'summary_large_image'
        }}
      />
      <div className='bg-white'>
        <div className='mx-auto max-w-nftcom px-2.5 minlg:pt-28'>
          <h2 className='mb-6 font-noi-grotesk text-4xl font-bold md:mb-4 md:text-lg '>{dataFallback?.heroTitle}</h2>
          {posts && <DynamicBlogSlider posts={dataFallback?.blogSlidesCollection.items} />}

          <h2 className='mb-4 mt-10 font-noi-grotesk text-lg font-bold minlg:mb-6 minlg:text-4xl '>
            {dataFallback?.listTitle}
          </h2>
          <div className='grid grid-cols-2 gap-x-3 gap-y-7 pb-12 minmd:gap-x-4 minlg:grid-cols-3 minxl:pb-24 '>
            {posts && posts.map(post => <RelatedPostCard key={post.sys.id} post={post} />)}
          </div>
        </div>
        {posts?.length < totalPostsFallback && (
          <div className='flex w-full justify-center bg-white pb-32'>
            <Button
              size={ButtonSize.LARGE}
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
      {preview && <DynamicPreviewBanner />}
    </>
  );
}

BlogListPage.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export async function getServerSideProps({ preview = false }) {
  const homeData = await getCollection(preview, 1, 'blogHomePageCollection', BLOG_LIST_HOME_FIELDS);
  const posts = await getPaginatedPosts(0, 12, preview);

  return {
    props: {
      preview,
      postData: posts ? posts.items : contentfulBackupData[2]?.items,
      totalPosts: posts ? posts.total : contentfulBackupData[2]?.total,
      data: homeData[0] ?? contentfulBackupData[1]
    }
  };
}
