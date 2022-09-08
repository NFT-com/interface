import '../plugins/tailwind';

import { NFTCard } from '../../components/elements/NFTCard';
import { getMockAnalytics } from '../util/analytics';
import { setupWagmiClient } from '../util/wagmi';

import { WagmiConfig } from 'wagmi';

describe('NFTCard', () => {
  beforeEach(() => {
    window.analytics = getMockAnalytics();
  });

  it('mounts with valid props', () => {
    const onClick = cy.stub();
    const client = setupWagmiClient();
    cy.mount(
      <WagmiConfig client={client}>
        <NFTCard
          title={'test_nft'}
          images={[]}
          onClick={onClick}
        />
      </WagmiConfig>
    );
    cy.findByText('test_nft').should('exist');
    cy.findByText('test_nft').click().then(() => {
      expect(onClick).to.be.calledOnce;
    });
  });

  it('mounts with more props', () => {
    const onClick = cy.stub();
    const client = setupWagmiClient();
    cy.mount(
      <WagmiConfig client={client}>
        <NFTCard
          title={'test_nft'}
          collectionName="test_collection"
          images={[]}
          onClick={onClick}
          visible={true}
          constrain
        />
      </WagmiConfig>
    );
    cy.findByText('test_collection').should('exist');
    cy.get('#eye').should('exist');
  });
});