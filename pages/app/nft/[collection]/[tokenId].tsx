import { NFTDetailPage } from 'components/modules/NFTDetail/NFTDetailPage';
import NotFoundPage from 'pages/404';
import { isNullOrEmpty } from 'utils/helpers';

import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';

/**
 * Shows a public profile e.g. nft.com/satoshi
 */
export default function ProfileURI() {
  const router = useRouter();
  const { collection, tokenId } = router.query;
  const validCollectionReg = /^0x[a-fA-F0-9]{40}$/;
  if(
    isNullOrEmpty(collection) ||
    isNullOrEmpty(tokenId) ||
    !validCollectionReg.test(collection as string)
  ) {
    return <NotFoundPage />;
  }
  
  return <NFTDetailPage collection={collection as string} tokenId={BigNumber.from(tokenId).toHexString()} />;
}
