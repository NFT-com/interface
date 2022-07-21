import '../plugins/tailwind';

import { CustomTooltip } from '../../components/elements/CustomTooltip';

describe('CustomTooltip', () => {
  it('should render', () => {
    cy.mount(
      <CustomTooltip
        mode="click"
        tooltipComponent={<div>Hello</div>}
      >
        <div>Click Me</div>
      </CustomTooltip>
    );
    cy.findByText('Click Me').should('exist');
  });

  it('should work in click mode', () => {
    cy.mount(
      <CustomTooltip
        mode="click"
        tooltipComponent={<div>Hello</div>}
      >
        <div>Click Me</div>
      </CustomTooltip>
    );
    cy.findByText('Click Me').click().then(() => {
      cy.findByText('Hello').should('exist');
    });
  });

  it('should work in hover mode', () => {
    cy.mount(
      <CustomTooltip
        mode="hover"
        tooltipComponent={<div>Hello</div>}
      >
        <div>Hover Me</div>
      </CustomTooltip>
    );
    cy.findByText('Hover Me').trigger('mouseover', 'left').then(() => {
      cy.findByText('Hello').should('exist');
    });
  });
});