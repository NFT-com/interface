import '../../plugins/tailwind';

import { EditListingsModal } from '../../../components/modules/NFTDetail/EditListingsModal';
import { setupWagmiClient } from '../../util/utils';

import { WagmiConfig } from 'wagmi';

describe('EditListingsModal', () => {
  const client = setupWagmiClient();

  it('mounts and renders', () => {
    const nft = {
      tokenId: 'test_token_id',
      contract: 'test_contract'
    };
    cy.mount(
      <WagmiConfig client={client}>
        <EditListingsModal
          listings={[{
            nft,
          }]}
          nft={nft}
          collectionName={'test_collection'}
          visible={true}
          onClose={() => {
            // todo
          }}
        />
      </WagmiConfig>
    );
  });
});