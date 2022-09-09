import Loader from 'components/elements/Loader';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { ProfilePage } from 'components/modules/Profile/ProfilePage';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';

/**
 * Shows a public profile e.g. nft.com/satoshi
 */
export default function ProfileURI() {
  const router = useRouter();
  const { profileURI } = router.query;

  if (profileURI === null || profileURI === undefined) {
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
