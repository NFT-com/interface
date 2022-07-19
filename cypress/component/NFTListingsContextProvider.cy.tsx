/// <reference types="cypress" />
import { NFTListingsContext, NFTListingsContextProvider } from '../../components/modules/NFTDetail/NFTListingsContext';
import { NULL_ADDRESS } from '../../constants/addresses';
import { setupWagmiClient } from '../util/wagmi';

import { ethers } from 'ethers';
import { useContext } from 'react';
import { WagmiConfig } from 'wagmi';

const TestComponent = () => {
  const { toList, stageListing, clear } = useContext(NFTListingsContext);
  return <div>
    <div id="toList">{JSON.stringify(toList.map((listing) => listing.nft.id))}</div>
    <button onClick={() => stageListing({
      type: 'looksrare',
      nft: {
        id: 'test_nft_id',
        tokenId: '0'
      },
      price: ethers.utils.parseEther('1'),
      currency: NULL_ADDRESS
    })}>Stage Listing</button>
    <button onClick={clear}>Clear</button>
  </div>;
};

describe('NFTListingsContextProvider', () => {
  beforeEach(() => {
    const client = setupWagmiClient();
    cy.mount(
      <WagmiConfig client={client}>
        <NFTListingsContextProvider >
          <TestComponent />
        </NFTListingsContextProvider>
      </WagmiConfig>
    );
  });

  it('stages a listing', () => {
    cy.get('#toList').should('contain', '[]');
    cy.get('button').contains('Stage Listing').click();
    cy.get('#toList').should('contain', '["test_nft_id"]');
  });

  it('clears the staged listings', () => {
    cy.get('#toList').should('contain', '[]');
    cy.get('button').contains('Stage Listing').click();
    cy.get('#toList').should('contain', '["test_nft_id"]');
    cy.get('button').contains('Clear').click();
    cy.get('#toList').should('contain', '[]');
  });
});