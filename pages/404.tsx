import { NullState } from 'components/elements/NullState';
import DefaultLayout from 'components/layouts/DefaultLayout';

import { useRouter } from 'next/router';

export default function NotFoundPage() {
  const router = useRouter();

  return <div className="flex flex-col h-full w-full items-center justify-center">
    <NullState
      showImage={true}
      primaryMessage='Looking for a NFT.com profile?'
      secondaryMessage={'Return to NFT.com'}
      buttonLabel={'Go to NFT.com'}
      onClick={() => {
        router.replace('/');
      }}/>
  </div>;
}

NotFoundPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      { page }
    </DefaultLayout>
  );
};

