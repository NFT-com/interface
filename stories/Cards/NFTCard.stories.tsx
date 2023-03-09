import { NFTCard } from 'components/modules/NFTCard/NFTCard';

// eslint-disable-next-line no-restricted-imports
import { MockWagmiDecorator } from '../../.storybook/decorators';

import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Wallet } from 'ethers';
import React from 'react';

const demoWallet = new Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');

export default {
  title: 'cards/NFTCard',
  component: NFTCard,
  decorators: [MockWagmiDecorator(demoWallet)],
  args: {
    collectionName: 'Cool Cats NFT',
    contractAddr: '0x1A92f7381B9F03921564a437210bB9396471050C',
    images: ['https://ipfs.io/ipfs/Qmc4bpfc7uTqNv9KSW9ehz4SV21dRsxgrfY6CCzWnWdEXh'],
    name: 'Cool Cat #9725',
    tokenId: '#9725'
  }
} as ComponentMeta<typeof NFTCard>;

const Template: ComponentStory<typeof NFTCard> = (args) =>
  <div className='max-w-[250px]'>
    <NFTCard {...args} />
  </div>
;

export const Base = Template.bind({});

export const WithListing = Template.bind({});
WithListing.args = {
  listings: [{ 'id':'EaQg9zFAy_vLHHOlD7rIY','chainId':'1','activityType':'Listing','activityTypeId':'0x63437c51214f71856d260ed2ace05a3441e72418252028149d525d2fc4ed3be9','timestamp':'2022-10-10T17:21:04.440Z','walletAddress':'0xd1D9F52d63e3736908c6e7D868f785d30Af5e3AC','nftContract':'0x98ca78e89Dd1aBE48A53dEe5799F24cC1A462F2D','nftId':['ethereum/0x98ca78e89Dd1aBE48A53dEe5799F24cC1A462F2D/0x2277'],'status':'Valid','order':{ 'chainId':'1','exchange':'OpenSea','orderHash':'0x63437c51214f71856d260ed2ace05a3441e72418252028149d525d2fc4ed3be9','orderType':'Listing','makerAddress':'0xd1D9F52d63e3736908c6e7D868f785d30Af5e3AC','takerAddress':null,'protocol':'Seaport','nonce':0,'protocolData':{ 'signature':'0x0f9ddfc1e6ca7ef425a97fb330025fd36368292f1c5917586fac754e93de2843261b3de881d724d4c4fda0a52ab50030b4a7bb2446d01372e8797160812241651b','parameters':{ 'offerer':'0xd1d9f52d63e3736908c6e7d868f785d30af5e3ac','offer':[{ 'itemType':2,'token':'0x98ca78e89Dd1aBE48A53dEe5799F24cC1A462F2D','identifierOrCriteria':'8823','startAmount':'1','endAmount':'1' }],'consideration':[{ 'itemType':0,'token':'0x0000000000000000000000000000000000000000','identifierOrCriteria':'0','startAmount':'90000000000000000000','endAmount':'90000000000000000000','recipient':'0xd1D9F52d63e3736908c6e7D868f785d30Af5e3AC' },{ 'itemType':0,'token':'0x0000000000000000000000000000000000000000','identifierOrCriteria':'0','startAmount':'2500000000000000000','endAmount':'2500000000000000000','recipient':'0x0000a26b00c1F0DF003000390027140000fAa719' },{ 'itemType':0,'token':'0x0000000000000000000000000000000000000000','identifierOrCriteria':'0','startAmount':'7500000000000000000','endAmount':'7500000000000000000','recipient':'0x6A3FeeD6fAf34c79eB4aa64Ba51D8E5c90f3FC5F' }],'startTime':'1665422453','endTime':'1679937653','orderType':2,'zone':'0x004C00500000aD104D7DBd00e3ae0A5C00560C00','zoneHash':'0x3000000000000000000000000000000000000000000000000000000000000000','salt':'0xd165c60a616bbac7227a351c9d3d5662','conduitKey':'0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000','totalOriginalConsiderationItems':3,'counter':0 } } },'cancel':null,'transaction':null }]
};