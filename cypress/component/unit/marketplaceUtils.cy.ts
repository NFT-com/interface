/// <reference types="cypress" />

import { convertDurationToSec } from '../../../utils/marketplaceUtils';
  
describe('Unit test our marketplace helper functions', () => {
  context('convertDurationToSec', () => {
    it('should return the correct number of seconds', () => {
      expect(convertDurationToSec('1 Day')).to.equal(60 * 60 * 24);
      expect(convertDurationToSec('3 Days')).to.equal(60 * 60 * 24 * 3);
      expect(convertDurationToSec('1 Week')).to.equal(60 * 60 * 24 * 7);
      expect(convertDurationToSec('Forever')).to.equal(60 * 60 * 24 * 365 * 10);
    });
  });
});