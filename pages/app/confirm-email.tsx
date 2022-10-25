import DefaultLayout from 'components/layouts/DefaultLayout';
import { Doppler, getEnv } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';

import fetch from 'isomorphic-unfetch';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import { decode } from 'url-encode-decode';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const { email, token } = router.query;
  console.log('email: ', email);
  const [loading, setLoading] = useState<boolean>(true);

  const { data } = useSWRImmutable(`${email}_${token}`, async () => {
    if (isNullOrEmpty(email) || isNullOrEmpty(token)) {
      return false;
    }
    
    try {
      const result = await fetch(`${getEnv(Doppler.NEXT_PUBLIC_GRAPHQL_URL).replace('/graphql', '')}/verify/${decode(email)}/${decode(token)}`);
      if (Number(result.status) == 200) return true;
      setLoading(false);
      return false;
    } catch (err) {
      setLoading(false);
      return false;
    }
  });

  const success = data;

  return <div className="flex flex-col h-full w-full items-center md:justify-start justify-center">
    {success ?
      <div>Success! You are now subscribed to NFT.com</div> :
      loading ?
        <div>Loading...</div> :
        <div>Error while verifying email</div>
    }
  </div>;
}

ConfirmEmailPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      { page }
    </DefaultLayout>
  );
};

