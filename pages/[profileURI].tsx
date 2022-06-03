import { ProfilePage } from 'components/modules/Profile/ProfilePage';
import { PROFILE_URI_LENGTH_LIMIT } from 'constants/misc';

import NotFoundPage from './404';

import { useRouter } from 'next/router';

/**
 * Shows a public profile e.g. nft.com/satoshi
 */
export default function ProfileURI() {
  const router = useRouter();
  const { profileURI } = router.query;
  const validReg = /^[a-z0-9_]*$/;
  if(
    profileURI === null ||
    profileURI === undefined ||
    !validReg.test(profileURI as string ?? '-') ||
    profileURI.length > PROFILE_URI_LENGTH_LIMIT
  ) {
    return <NotFoundPage />;
  }
  
  return <ProfilePage uri={profileURI} />;
}
