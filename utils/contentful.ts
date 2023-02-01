import { Doppler,getEnv } from './env';

export async function getPaginatedPosts(
  skip: number,
  pageSize: number,
  preview: boolean
) {
  const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/contentful');
  url.searchParams.set('skip', String(skip));
  url.searchParams.set('pageSize', String(pageSize));
  url.searchParams.set('preview', String(preview));

  const result = await fetch(url.toString())
    .then(res => {
      return res.statusText == 'OK' ? res.json() : { items: null, total: 0 };
    })
    .catch(() => {
      return { items: null, total: 0 };
    });
  return result;
}

