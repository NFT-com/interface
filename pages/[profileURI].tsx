import Loader from 'components/elements/Loader';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { ProfilePage } from 'components/modules/Profile/ProfilePage';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Shows a public profile e.g. nft.com/satoshi
 */
export default function ProfileURI() {
  const router = useRouter();
  const { profileURI } = router.query;

  useEffect(() => {
    const URI = profileURI?.toString();
    if (profileURI !== URI?.toLowerCase()) {
      router.push(URI?.toLowerCase());
    }
  },[router, profileURI]);

  if (profileURI?.toString()?.toLowerCase() == 'you') router.push('/app/mint-profiles');

  if (profileURI === null || profileURI === undefined || profileURI?.toString()?.toLowerCase() == 'you') {
    return <div className={tw(
      'text-primary-txt dark:text-primary-txt-dk flex flex-col',
      'items-center justify-center h-screen'
    )}>
      <div className="mb-2">Loading...</div>
      <Loader />
    </div>;
  } else {
    return (
      <ProfilePage uri={profileURI} />
    );
  }
}

ProfileURI.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      { page }
    </DefaultLayout>
  );
};
