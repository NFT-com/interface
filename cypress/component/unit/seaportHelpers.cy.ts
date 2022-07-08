/// <reference types="cypress" />

import { NULL_ADDRESS } from '../../../constants/addresses';
import { Fee,ItemType,OPENSEA_CONDUIT_KEY,OrderType,SEAPORT_FEE_COLLLECTION_ADDRESS,SEAPORT_ZONE,SEAPORT_ZONE_HASH, SeaportOrderComponents } from '../../../types/seaport';
import { deductFees, feeToConsiderationItem, getMessageToSign, getTypedDataDomain, isCurrencyItem, multiplyBasisPoints } from '../../../utils/seaportHelpers';

import { BigNumber } from 'ethers';

describe('Unit test our seaport functions', () => {
  context('getTypedDataDomain', () => {
    it('returns the expected value', () => {
      expect(getTypedDataDomain(1)).to.deep.eq({
        name: 'Seaport',
        version: '1.1',
        chainId: 1,
        verifyingContract: '0x00000000006c3852cbef3e08e8df289169ede581',
      });
    });
  });

  context('getMessageToSign', () => {
    it('should generate the correct display message per the signTypedDataV4 spec', () => {
      const testParams: SeaportOrderComponents = {
        offerer: '0x0000000000000000000000000000000000000000',
        zone: SEAPORT_ZONE,
        orderType: OrderType.FULL_RESTRICTED,
        startTime: '0',
        endTime: '0',
        zoneHash: SEAPORT_ZONE_HASH,
        salt: '0',
        offer: [],
        consideration: [],
        totalOriginalConsiderationItems: '0',
        conduitKey: OPENSEA_CONDUIT_KEY,
        counter: '1'
      };
      const message = getMessageToSign(testParams, 1);
      expect(message).to.eq(JSON.stringify({
        'types': {
          'OrderComponents':[
            { 'name':'offerer','type':'address' },
            { 'name':'zone','type':'address' },
            { 'name':'offer','type':'OfferItem[]' },
            { 'name':'consideration','type':'ConsiderationItem[]' },
            { 'name':'orderType','type':'uint8' },
            { 'name':'startTime','type':'uint256' },
            { 'name':'endTime','type':'uint256' },
            { 'name':'zoneHash','type':'bytes32' },
            { 'name':'salt','type':'uint256' },
            { 'name':'conduitKey','type':'bytes32' },
            { 'name':'counter','type':'uint256' }
          ],
          'OfferItem':[
            { 'name':'itemType','type':'uint8' },
            { 'name':'token','type':'address' },
            { 'name':'identifierOrCriteria','type':'uint256' },
            { 'name':'startAmount','type':'uint256' },
            { 'name':'endAmount','type':'uint256' }
          ],
          'ConsiderationItem': [
            { 'name':'itemType','type':'uint8' },
            { 'name':'token','type':'address' },
            { 'name':'identifierOrCriteria','type':'uint256' },
            { 'name':'startAmount','type':'uint256' },
            { 'name':'endAmount','type':'uint256' },
            { 'name':'recipient','type':'address' }
          ],
          'EIP712Domain': [
            { 'name':'name','type':'string' },
            { 'name':'version','type':'string' },
            { 'name':'chainId','type':'uint256' },
            { 'name':'verifyingContract','type':'address' }
          ]
        },
        'domain': {
          'name':'Seaport',
          'version':'1.1',
          'chainId':'1',
          'verifyingContract':'0x00000000006c3852cbef3e08e8df289169ede581'
        },
        'primaryType':'OrderComponents',
        'message':{
          'offerer':'0x0000000000000000000000000000000000000000',
          'zone':'0x004c00500000ad104d7dbd00e3ae0a5c00560c00',
          'offer':[],
          'consideration':[],
          'orderType':'2',
          'startTime':'0',
          'endTime':'0',
          'zoneHash':'0x3000000000000000000000000000000000000000000000000000000000000000',
          'salt':'0',
          'conduitKey':'0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000',
          'counter':'1'
        }
      }));
    });
  });

  context('multiplyBasisPoints', () => {
    it('should give the correct result for a non-zero bps', () => {
      const total = BigNumber.from(100);
      const basisPoints = BigNumber.from(100);
      expect(multiplyBasisPoints(total, basisPoints)).to.deep.eq(BigNumber.from(1));
    });

    it('should give the correct result for a zero bps', () => {
      const total = BigNumber.from(100);
      const basisPoints = BigNumber.from(0);
      expect(multiplyBasisPoints(total, basisPoints)).to.deep.eq(BigNumber.from(0));
    });
  });

  context('isCurrencyItem', () => {
    it('should return true for an erc20', () => {
      const considerationItem = {
        itemType: ItemType.ERC20,
        token: 'test_dai',
        identifierOrCriteria: '0',
        startAmount: '100000',
        endAmount: '100000',
        recipient: 'test_address'
      };
      expect(isCurrencyItem(considerationItem)).to.eq(true);
    });

    it('should return true for ETH', () => {
      const considerationItem = {
        itemType: ItemType.NATIVE,
        token: NULL_ADDRESS,
        identifierOrCriteria: '0',
        startAmount: '100000',
        endAmount: '100000',
        recipient: 'test_address'
      };
      expect(isCurrencyItem(considerationItem)).to.eq(true);
    });

    it('should return false for erc721', () => {
      const considerationItem = {
        itemType: ItemType.ERC721,
        token: NULL_ADDRESS,
        identifierOrCriteria: '0',
        startAmount: '100000',
        endAmount: '100000',
        recipient: 'test_address'
      };
      expect(isCurrencyItem(considerationItem)).to.eq(false);
    });

    it('should return false for erc1155', () => {
      const considerationItem = {
        itemType: ItemType.ERC1155,
        token: NULL_ADDRESS,
        identifierOrCriteria: '0',
        startAmount: '100000',
        endAmount: '100000',
        recipient: 'test_address'
      };
      expect(isCurrencyItem(considerationItem)).to.eq(false);
    });
  });

  context('deductFees', () => {
    it('should not affect the considerations with no fees', () => {
      const considerations = [{
        itemType: ItemType.ERC20,
        token: 'test_dai',
        identifierOrCriteria: '0',
        startAmount: '100000',
        endAmount: '100000',
        recipient: 'test_address'
      }];
      const fees = [];
      expect(deductFees(considerations, fees)).to.deep.eq(considerations);
    });

    it('should correctly deduct a single fee', () => {
      const considerations = [{
        itemType: ItemType.ERC20,
        token: 'test_dai',
        identifierOrCriteria: '0',
        startAmount: '100000',
        endAmount: '100000',
        recipient: 'test_address'
      }];
      const fees: Fee[] = [{
        basisPoints: 10,
        recipient: SEAPORT_FEE_COLLLECTION_ADDRESS
      }];
      expect(deductFees(considerations, fees)).to.deep.eq([{
        itemType: ItemType.ERC20,
        token: 'test_dai',
        identifierOrCriteria: '0',
        startAmount: '99900',
        endAmount: '99900',
        recipient: 'test_address'
      }]);
    });

    it('should correctly deduct multiple fees', () => {
      const considerations = [{
        itemType: ItemType.ERC20,
        token: 'test_dai',
        identifierOrCriteria: '0',
        startAmount: '100000',
        endAmount: '100000',
        recipient: 'test_address'
      }];
      const fees: Fee[] = [
        {
          basisPoints: 10,
          recipient: SEAPORT_FEE_COLLLECTION_ADDRESS
        },
        {
          basisPoints: 15,
          recipient: SEAPORT_FEE_COLLLECTION_ADDRESS
        }
      ];
      expect(deductFees(considerations, fees)).to.deep.eq([{
        itemType: ItemType.ERC20,
        token: 'test_dai',
        identifierOrCriteria: '0',
        startAmount: '99750',
        endAmount: '99750',
        recipient: 'test_address'
      }]);
    });
  });

  context('feeToConsiderationItem', () => {
    it('should correctly convert a fee to a consideration item without endAmount', () => {
      const fee = {
        basisPoints: 10,
        recipient: SEAPORT_FEE_COLLLECTION_ADDRESS
      };
      expect(feeToConsiderationItem({
        fee,
        token: NULL_ADDRESS,
        baseAmount: 1000
      })).to.deep.eq({
        itemType: ItemType.NATIVE,
        token: NULL_ADDRESS,
        identifierOrCriteria: '0',
        startAmount: '1',
        endAmount: '1',
        recipient: SEAPORT_FEE_COLLLECTION_ADDRESS
      });
    });

    it('should correctly convert a fee to a consideration item with endAmount', () => {
      const fee = {
        basisPoints: 10,
        recipient: SEAPORT_FEE_COLLLECTION_ADDRESS
      };
      expect(feeToConsiderationItem({
        fee,
        token: NULL_ADDRESS,
        baseAmount: 1000,
        baseEndAmount: 1000
      })).to.deep.eq({
        itemType: ItemType.NATIVE,
        token: NULL_ADDRESS,
        identifierOrCriteria: '0',
        startAmount: '1',
        endAmount: '1',
        recipient: SEAPORT_FEE_COLLLECTION_ADDRESS
      });
    });
  });
});