/// <reference types="cypress" />

import {
  filterNulls,
  formatID,
  getAPIURL,
  getChainIdString,
  getEtherscanLink,
  getGenesisKeyThumbnail,
  isAddress,
  isNullOrEmpty,
  joinClasses,
  prettify,
  processIPFSURL,
  sameAddress,
  shorten,
  shortenAddress,
  shortenString
} from '../../../utils/helpers';

import { BigNumber } from 'ethers';

describe('Unit test our helper functions', () => {
  context('isAddress', () => {
    it('should return the checksummed address if the address is valid', () => {
      expect(isAddress('0x1234567890123456789012345678901234567890')).to.equal('0x1234567890123456789012345678901234567890');
    });

    it('should return false if the address is invalid', () => {
      expect(isAddress('0x12345678901234567890123456789012345678901')).to.equal(false);
    });
  });

  context('sameAddress', () => {
    it('should return true if the addresses are the same', () => {
      expect(sameAddress('0x1234567890123456789012345678901234567890', '0x1234567890123456789012345678901234567890')).to.equal(true);
    });

    it('should return false if the addresses are not the same', () => {
      expect(sameAddress('0x1234567890123456789012345678901234567890', '0x1234567890123456789012345678901234567891')).to.equal(false);
    });
  });

  context('shortenAddress', () => {
    it('should return the shortened address if the address is valid', () => {
      expect(shortenAddress('0x1234567890123456789012345678901234567890')).to.equal('0x123456...567890');
    });

    it('should return the shortened address with chars input', () => {
      expect(shortenAddress('0x1234567890123456789012345678901234567890', 3)).to.equal('0x123...890');
    });
    
    it('should return empty if the address is invalid', () => {
      expect(shortenAddress('0x12345678901234567890123456789012345678901')).to.equal('');
    });
  });

  context('shorten', () => {
    it('should return null when given null', () => {
      expect(shorten(null, false)).to.equal(null);
    });

    it('should return the shortened string', () => {
      expect(shorten('0x1234567890123456789012345678901234567890', false)).to.equal('0x12345678...1234567890');
    });

    it('should return the shortened string, mobile', () => {
      expect(shorten('0x1234567890123456789012345678901234567890', true)).to.equal('0x12345...4567890');
    });
  });

  context('shortenString', () => {
    it('should return null when given null', () => {
      expect(shortenString(null, 0, 0)).to.equal(null);
    });

    it('should return the input string if limit is longer', () => {
      expect(shortenString('test_long_string', 100, 10)).to.equal('test_long_string');
    });

    it('should return the shortened string', () => {
      expect(shortenString('test_string', 5, 5)).to.equal('test_...');
    });
  });

  context('prettify', () => {
    it('should return 0 for small numbers', () => {
      expect(prettify(0.0009)).to.equal('0');
      expect(prettify(0)).to.equal('0');
    });

    it('should have 3 digits', () => {
      expect(prettify(0.023456789)).to.equal('0.023');
    });

    it('should have a comma', () => {
      expect(prettify(123456789, 6)).to.equal('123,456,789');
    });
  });

  context('joinClasses', () => {
    it('should return the classes', () => {
      expect(joinClasses('class1', 'class2')).to.equal('class1 class2');
    });
  });

  context('isNullOrEmpty', () => {
    it('should return true if the input is null', () => {
      expect(isNullOrEmpty(null)).to.equal(true);
    });

    it('should return true if the input is empty', () => {
      expect(isNullOrEmpty('')).to.equal(true);
      expect(isNullOrEmpty([])).to.equal(true);
    });
  });

  context('filterNulls', () => {
    it('should return the input without nulls', () => {
      expect(JSON.stringify(filterNulls(['test', null]))).to.equal(JSON.stringify(['test']));
    });
  });

  context('processIPFSURL', () => {
    it('should return the correct ipfs urls', () => {
      expect(processIPFSURL(null)).to.equal(null);
      expect(processIPFSURL('ipfs://ipfs/test_url')).to.equal('https://nft-llc.mypinata.cloud/ipfs/test_url');
      expect(processIPFSURL('ipfs://test_url')).to.equal('https://nft-llc.mypinata.cloud/ipfs/test_url');
      expect(processIPFSURL('https://ipfs.io/ipfs/test_url')).to.equal('https://nft-llc.mypinata.cloud/ipfs/test_url');
      expect(processIPFSURL('https://gateway.pinata.cloud/ipfs/test_url')).to.equal('https://nft-llc.mypinata.cloud/ipfs/test_url');
      expect(processIPFSURL('https://infura-ipfs.io/ipfs/QmbyQAnbszAt3o9hCmDngR92st8tUBW9z8mdztMSTvUaKS/preload.gif')).to.equal('https://nft-llc.mypinata.cloud/ipfs/QmbyQAnbszAt3o9hCmDngR92st8tUBW9z8mdztMSTvUaKS/preload.gif');
      expect(processIPFSURL('QmZT1ijWYugocjMDreJYKmUsPQS5Gu6mvmFbWrnUpBQK4L')).to.equal('https://nft-llc.mypinata.cloud/ipfs/QmZT1ijWYugocjMDreJYKmUsPQS5Gu6mvmFbWrnUpBQK4L');
      expect(processIPFSURL('noop')).to.equal('noop');
    });
  });

  context('formatID', () => {
    it('should format GK ids correctly', () => {
      expect(formatID(BigNumber.from(0))).to.equal('00000');
      expect(formatID(BigNumber.from(1))).to.equal('00001');
      expect(formatID(BigNumber.from(10))).to.equal('00010');
      expect(formatID(BigNumber.from(110))).to.equal('00110');
      expect(formatID(BigNumber.from(3000))).to.equal('03000');
      expect(formatID(BigNumber.from(10000))).to.equal('10000');
    });
  });

  context('getGenesisKeyThumbnail', () => {
    it('should return correct GK thumbnail links', () => {
      expect(getGenesisKeyThumbnail(BigNumber.from(10))).to.equal('https://cdn.nft.com/gk-min/10.jpeg');
      expect(getGenesisKeyThumbnail(BigNumber.from(10001))).to.equal('');
    });
  });

  context('getAPIURL', () => {
    it('should return the correct API URL', () => {
      expect(getAPIURL()).to.equal(process.env.NEXT_PUBLIC_GRAPHQL_URL);
    });
  });

  context('getEtherscanLink', () => {
    it('should return the correct etherscan link', () => {
      expect(getEtherscanLink(1, '0x1234567890123456789012345678901234567890', 'address')).to.equal('https://etherscan.io/address/0x1234567890123456789012345678901234567890');
      expect(getEtherscanLink(1, '0x1234567890123456789012345678901234567890', 'transaction')).to.equal('https://etherscan.io/tx/0x1234567890123456789012345678901234567890');
      expect(getEtherscanLink(1, '0x1234567890123456789012345678901234567890', 'token')).to.equal('https://etherscan.io/token/0x1234567890123456789012345678901234567890');
      expect(getEtherscanLink(3, '0x1234567890123456789012345678901234567890', 'address')).to.equal('https://ropsten.etherscan.io/address/0x1234567890123456789012345678901234567890');
      expect(getEtherscanLink(4, '0x1234567890123456789012345678901234567890', 'address')).to.equal('https://rinkeby.etherscan.io/address/0x1234567890123456789012345678901234567890');
      expect(getEtherscanLink(5, '0x1234567890123456789012345678901234567890', 'address')).to.equal('https://goerli.etherscan.io/address/0x1234567890123456789012345678901234567890');
      expect(getEtherscanLink(42, '0x1234567890123456789012345678901234567890', 'address')).to.equal('https://kovan.etherscan.io/address/0x1234567890123456789012345678901234567890');
    });
  });

  context('getChainIdString', () => {
    it('should return the correct chain id string', () => {
      expect(getChainIdString(1)).to.equal('1');
      expect(getChainIdString(3)).to.equal('3');
      expect(getChainIdString(4)).to.equal('4');
      expect(getChainIdString(5)).to.equal('5');
      expect(getChainIdString(42)).to.equal('42');
      expect(getChainIdString(null)).to.equal(null);
    });
  });
});