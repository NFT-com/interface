import '../../plugins/tailwind';

import { PurchaseSummaryModal } from '../../../components/modules/Checkout/PurchaseSummaryModal';
import { setupWagmiClient } from '../../util/utils';

import { WagmiConfig } from 'wagmi';

describe('PurchaseSummaryModal', () => {
  const client = setupWagmiClient();

  it('mounts and renders', () => {
    cy.mount(
      <WagmiConfig client={client}>
        <PurchaseSummaryModal
          visible={true}
          onClose={() => {
            // todo
          }} />
      </WagmiConfig>
    );
  });
});