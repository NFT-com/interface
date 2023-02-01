import { getBaseUrl } from './helpers';

export async function getPaginatedPosts(
  skip: number,
  pageSize: number,
  preview: boolean
) {
  const url = new URL(getBaseUrl(`${window.location.origin}/`) + 'api/contentful');
  url.searchParams.set('skip', String(skip));
  url.searchParams.set('pageSize', String(pageSize));
  url.searchParams.set('preview', String(preview));

  const result = await fetch(url.toString()).then(res => res.json());
  return result;
}

