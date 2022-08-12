import { Button, ButtonType } from 'components/elements/Button';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { NFTListingsContext } from 'components/modules/NFTDetail/NFTListingsContext';
import NotFoundPage from 'pages/404';
import { Doppler, getEnv } from 'utils/env';

import { useContext } from 'react';

/**
 * Renders the entire cart (both listing and buying),
 * with configuration options for the listing side.
 */
export default function CheckoutPage() {
  const { listAll } = useContext(NFTListingsContext);

  if (!getEnv(Doppler.NEXT_PUBLIC_ROUTER_ENABLED)) {
    return <NotFoundPage />;
  }

  return <PageWrapper>
    <div className='max-w-nftcom bg-white dark:bg-black w-full h-full pt-20 flex flex-col items-center'>
      {/* todo: top-level configuration options (like marketplace, duration) */}
      {/* todo: list out the NFTs with individual configuration options (price) */}
      <Button
        label={'Proceed to List'}
        onClick={listAll}
        type={ButtonType.PRIMARY} />
    </div>
  </PageWrapper>;
}