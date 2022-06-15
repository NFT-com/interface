import { PageWrapper } from 'components/layouts/PageWrapper';
import BlogHeader from 'components/modules/BlogPage/BlogHeader';
import BlogHeroImage from 'components/modules/BlogPage/BlogHeroImage';
import Markdown from 'components/modules/BlogPage/Markdown';

import { getPost } from 'lib/contentful/api';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { PostData } from 'types/blogs';

type PostProps = {
  post: PostData;
  preview: boolean;
};

export default function Post({ post }: PostProps) {
  const router = useRouter();

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
        <BlogHeader post={post} />

        <BlogHeroImage
          src={post?.heroImage.url}
          alt={post?.heroImage.description}
        />
        <div
          style={{ borderColor: '#E4E4E4' }}
          className="text-left border-b-2 mt-12 md:mt-8 mb-5"
        >
          <Markdown content={post?.body} />
        </div>
      </div>
    </PageWrapper>
  );
}

export async function getServerSideProps({ params, preview = false }) {
  const data = await getPost(params.slug, preview);
  return {
    props: {
      post: data?.post ?? null,
    },
  };
}
