/// <reference types="cypress" />

import { convertDurationToSec } from '../../../utils/marketplaceUtils';
  
describe('Unit test our marketplace helper functions', () => {
  context('convertDurationToSec', () => {
    it('should return the correct number of seconds', () => {
      expect(convertDurationToSec('1 Hour')).to.equal(60 * 60 * 1);
      expect(convertDurationToSec('1 Day')).to.equal(60 * 60 * 24);
      expect(convertDurationToSec('7 Days')).to.equal(60 * 60 * 24 * 7);
      expect(convertDurationToSec('6 Months')).to.equal(60 * 60 * 24 * 7 * 4 * 6);
    });
  });
});