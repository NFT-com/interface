import DefaultLayout from 'components/layouts/DefaultLayout';
import { Doppler, getEnv } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';

import fetch from 'isomorphic-unfetch';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const { email, token } = router.query;

  const success = useSWRImmutable(`${email}_${token}`, async () => {
    if (isNullOrEmpty(email) || isNullOrEmpty(token)) {
      return false;
    }
    
    try {
      await fetch(`${getEnv(Doppler.NEXT_PUBLIC_GRAPHQL_URL)}/verify/${email?.toString()?.toLowerCase()}/${token}`);
      return true;
    } catch (err) {
      return false;
    }
  });

  return <div className="flex flex-col h-full w-full items-center justify-center">
    {success ? <div>Success! You are now subscribed to NFT.com</div> : <div>Loading...</div>}
  </div>;
}

ConfirmEmailPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      { page }
    </DefaultLayout>
  );
};

