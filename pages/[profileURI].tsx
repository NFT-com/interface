import { NullState } from 'components/elements/NullState';
import { ProfilePage } from 'components/modules/Profile/ProfilePage';

import { useRouter } from 'next/router';

/**
 * Shows a public profile e.g. nft.com/satoshi
 */
export default function ProfileURI() {
  const router = useRouter();
  const { profileURI } = router.query;
  if( profileURI === null || profileURI === undefined ) {
    return <NullState />;
  }
  
  return <ProfilePage uri={profileURI} />;
}
