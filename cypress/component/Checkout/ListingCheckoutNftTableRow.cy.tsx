import '../../plugins/tailwind';

import { ListingCheckoutNftTableRow } from '../../../components/modules/Checkout/ListingCheckoutNftTableRow';
import { setupWagmiClient } from '../../util/utils';

import { WagmiConfig } from 'wagmi';

describe('ListingCheckoutNftTableRow', () => {
  const client = setupWagmiClient();

  it('mounts and renders', () => {
    cy.mount(
      <WagmiConfig client={client}>
        <ListingCheckoutNftTableRow
          listing={{
            nft: {
                
            }
          }}
          onPriceChange={() => null}/>
      </WagmiConfig>
    );
  });
});