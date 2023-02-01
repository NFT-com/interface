import { Doppler, getEnv } from './env';

const baseUrl = `${window.location.origin}/` ?? getEnv(Doppler.NEXT_PUBLIC_BASE_URL);

export async function getPaginatedPosts(
  skip: number,
  pageSize: number,
  preview: boolean
) {
  const url = new URL(baseUrl + 'api/contentful');
  url.searchParams.set('skip', String(skip));
  url.searchParams.set('pageSize', String(pageSize));
  url.searchParams.set('preview', String(preview));

  const result = await fetch(url.toString()).then(res => res.json());
  return result;
}

