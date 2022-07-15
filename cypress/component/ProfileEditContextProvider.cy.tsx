/// <reference types="cypress" />

import { ProfileEditContext, ProfileEditContextProvider, ProfileEditContextType } from '../../components/modules/Profile/ProfileEditContext';
import { ProfileDisplayType, ProfileLayoutType } from '../../graphql/generated/types';
import { setupWagmiClient } from '../util/wagmi';

import { useContext } from 'react';
import { WagmiConfig } from 'wagmi';

const TestComponent = () => {
  const {
    draftToHide,
    draftToShow,
    toggleHidden,
    hideNftIds,
    showNftIds,
    // onHideAll, // todo: stub gql mutation to test
    // onShowAll, // todo: stub gql mutation to test
    draftHeaderImg,
    setDraftHeaderImg,
    draftProfileImg,
    setDraftProfileImg,
    draftBio,
    setDraftBio,
    draftGkIconVisible,
    setDraftGkIconVisible,
    draftDisplayType,
    setDraftDisplayType,
    draftLayoutType,
    setDraftLayoutType,
    editMode,
    setEditMode,
    clearDrafts,
    // saveProfile, // todo: stub gql mutation to test
    saving,
    selectedCollection,
    setSelectedCollection,
    draftNftsDescriptionsVisible,
    setDraftNftsDescriptionsVisible,
  }: ProfileEditContextType = useContext(ProfileEditContext);
  
  return <div>
    <div id="draftToHide">{JSON.stringify(Array.from(draftToHide.values()))}</div>
    <div id="draftToShow">{JSON.stringify(Array.from(draftToShow.values()))}</div>
    <div id="editMode" onClick={() => {
      setEditMode(!editMode);
    }}>
      {editMode + ''}
    </div>
    <div id="saving">{saving + ''}</div>
    <div id="draftHeaderImg">{JSON.stringify(draftHeaderImg)}</div>
    <div id="draftProfileImg">{JSON.stringify(draftProfileImg)}</div>
    <div id="draftBio">{draftBio}</div>
    <div id="draftGkIconVisible">{draftGkIconVisible + ''}</div>
    <div id="draftDisplayType">{draftDisplayType + ''}</div>
    <div id="draftLayoutType">{draftLayoutType + ''}</div>
    <div id="selectedCollection">{selectedCollection + ''}</div>
    <div id="draftNftsDescriptionsVisible">{draftNftsDescriptionsVisible + ''}</div>
    <button onClick={() => {
      toggleHidden('test_id', false);
    }}>toggleHidden</button>
    <button onClick={() => {
      toggleHidden('test_id', true);
    }}>toggleShown</button>
    <button onClick={() => {
      hideNftIds(['test_id']);
    }}>hideNftIds</button>
    <button onClick={() => {
      showNftIds(['test_id']);
    }}>showNftIds</button>
    <button onClick={() => {
      setDraftHeaderImg({ preview: 'test_preview', raw: null });
    }}>setDraftHeaderImg</button>
    <button onClick={() => {
      setDraftProfileImg({ preview: 'test_preview', raw: null });
    }}>setDraftProfileImg</button>
    <button onClick={() => {
      setDraftBio('test_bio');
    }}>setDraftBio</button>
    <button onClick={() => {
      setDraftGkIconVisible(!draftGkIconVisible);
    }}>setDraftGkIconVisible</button>
    <button onClick={() => {
      setDraftDisplayType(ProfileDisplayType.Nft);
    }}>setDraftDisplayType</button>
    <button onClick={() => {
      setDraftLayoutType(ProfileLayoutType.Mosaic);
    }}>setDraftLayoutType</button>
    <button onClick={() => {
      setSelectedCollection('test_collection');
    }}>setSelectedCollection</button>
    <button onClick={() => {
      setDraftNftsDescriptionsVisible(!draftNftsDescriptionsVisible);
    }}>setDraftNftsDescriptionsVisible</button>
    <button onClick={() => {
      clearDrafts();
    }}>clearDrafts</button>
  </div>;
};

describe('ProfileEditContextProvider', () => {
  beforeEach(() => {
    const client = setupWagmiClient();
    cy.mount(
      <WagmiConfig client={client}>
        <ProfileEditContextProvider profileURI='test'>
          <TestComponent />
        </ProfileEditContextProvider>
      </WagmiConfig>
    );
  });

  it('returns the expected default values', () => {
    cy.get('#draftToHide').should('have.text', '[]');
    cy.get('#draftToShow').should('have.text', '[]');
    cy.get('#editMode').should('have.text', 'false');
    cy.get('#saving').should('have.text', 'false');
    cy.get('#draftHeaderImg').should('have.text', JSON.stringify({ preview: '', raw: null }));
    cy.get('#draftProfileImg').should('have.text', JSON.stringify({ preview: '', raw: null }));
    cy.get('#draftBio').should('have.text', '');
    cy.get('#draftGkIconVisible').should('have.text', 'undefined');
    cy.get('#draftDisplayType').should('have.text', 'null');
    cy.get('#draftLayoutType').should('have.text', 'null');
    cy.get('#selectedCollection').should('have.text', 'null');
    cy.get('#draftNftsDescriptionsVisible').should('have.text', 'undefined');
  });

  it('toggles edit mode correctly', () => {
    cy.get('#editMode').should('have.text', 'false');
    cy.get('#editMode').click('left');
    cy.get('#editMode').should('have.text', 'true');
  });

  it('toggles hidden correctly', () => {
    cy.findByText('toggleHidden').click();
    cy.get('#draftToShow').should('have.text', '["test_id"]');
    cy.findByText('toggleHidden').click();
    cy.get('#draftToHide').should('have.text', '[]');
  });

  it('toggles shown correctly', () => {
    cy.findByText('toggleShown').click();
    cy.get('#draftToHide').should('have.text', '["test_id"]');
    cy.findByText('toggleShown').click();
    cy.get('#draftToShow').should('have.text', '[]');
  });

  it('hideNftIds and showNftIds toggle correctly', () => {
    cy.findByText('hideNftIds').click();
    cy.get('#draftToHide').should('have.text', '["test_id"]');
    cy.findByText('showNftIds').click();
    cy.get('#draftToHide').should('have.text', '[]');
    cy.get('#draftToShow').should('have.text', '["test_id"]');
  });

  it('sets draftHeaderImg correctly', () => {
    cy.findByText('setDraftHeaderImg').click();
    cy.get('#draftHeaderImg').should('have.text', JSON.stringify({ preview: 'test_preview', raw: null }));
  });

  it('sets draftProfileImg correctly', () => {
    cy.findByText('setDraftProfileImg').click();
    cy.get('#draftProfileImg').should('have.text', JSON.stringify({ preview: 'test_preview', raw: null }));
  });

  it('sets draftBio correctly', () => {
    cy.findByText('setDraftBio').click();
    cy.get('#draftBio').should('have.text', 'test_bio');
  });

  it('sets draftGkIconVisible correctly', () => {
    cy.findByText('setDraftGkIconVisible').click();
    cy.get('#draftGkIconVisible').should('have.text', 'true');
  });

  it('sets draftDisplayType correctly', () => {
    cy.findByText('setDraftDisplayType').click();
    cy.get('#draftDisplayType').should('have.text', 'NFT');
  });

  it('sets draftLayoutType correctly', () => {
    cy.findByText('setDraftLayoutType').click();
    cy.get('#draftLayoutType').should('have.text', 'Mosaic');
  });

  it('sets selectedCollection correctly', () => {
    cy.findByText('setSelectedCollection').click();
    cy.get('#selectedCollection').should('have.text', 'test_collection');
  });

  it('sets draftNftsDescriptionsVisible correctly', () => {
    cy.findByText('setDraftNftsDescriptionsVisible').click();
    cy.get('#draftNftsDescriptionsVisible').should('have.text', 'true');
  });

  it('clears drafts correctly', () => {
    cy.findByText('setDraftNftsDescriptionsVisible').click();
    cy.findByText('setSelectedCollection').click();
    cy.findByText('setDraftLayoutType').click();
    cy.findByText('setDraftDisplayType').click();
    cy.findByText('setDraftGkIconVisible').click();
    cy.findByText('setDraftBio').click();
    cy.findByText('setDraftHeaderImg').click();
    cy.findByText('setDraftProfileImg').click();
    cy.findByText('hideNftIds').click();
    cy.findByText('showNftIds').click();
    cy.findByText('toggleHidden').click();

    cy.findByText('clearDrafts').click();
    cy.get('#draftHeaderImg').should('have.text', JSON.stringify({ preview: '', raw: null }));
    cy.get('#draftProfileImg').should('have.text', JSON.stringify({ preview: '', raw: null }));
    cy.get('#draftBio').should('have.text', '');
    cy.get('#draftDisplayType').should('have.text', 'null');
    cy.get('#draftLayoutType').should('have.text', 'null');
    cy.get('#draftToShow').should('have.text', '[]');
    cy.get('#draftToHide').should('have.text', '[]');
  });
});