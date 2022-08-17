export type DeployedContract = {
  rinkeby: string;
  goerli: string;
  mainnet: string;
}

export const nftProfileHelper: DeployedContract = {
  rinkeby : '0xb47B53c03DAD5a03a5392283DF8826e798E2Bc29',
  mainnet : '0xB9A5A787153b6C4898cb2A05A596A22E73B1DCc1',
  goerli: '0x3efb23c05DD34035fDb23cC74D85Ec586A2e7068'
};

export const genesisKey: DeployedContract = {
  rinkeby : '0x530E404f51778F38249413264ac7807A16b88603',
  mainnet : '0x8fB5a7894AB461a59ACdfab8918335768e411414',
  goerli: '0xe0060010c2c81A817f4c52A9263d4Ce5c5B66D55',
};

export const genesisKeyDistributor: DeployedContract = {
  rinkeby : '0x36c9cadedC7fff4Ad2e316B6cCcE2CF0343BFdd4',
  mainnet : '0x0eBa8d862AF4E01A0573B663FB3eb3A06D7937dE',
  goerli: '0x36c9cadedC7fff4Ad2e316B6cCcE2CF0343BFdd4' // todo: use goerli address
};

export const genesisKeyTeamClaim: DeployedContract = {
  rinkeby : '0x41E3E44e2Db9fFC7b69CF459441C80F95Cb25fCc',
  mainnet : '0xfc99E6b4447a17EA0C6162854fcb572ddC8FbB37',
  goerli: '0x41E3E44e2Db9fFC7b69CF459441C80F95Cb25fCc' // todo: use goerli address
};

export const genesisKeyTeamDistributor: DeployedContract = {
  rinkeby : '0x7a546F59e04Fff0b5eD3Ee13e30F38917C74741B',
  mainnet : '0x5fb1941b5415b4817d9CC62f8039F7A4B366Ff8F',
  goerli: '0x7a546F59e04Fff0b5eD3Ee13e30F38917C74741B' // todo: use goerli address
};

export const nftToken: DeployedContract = {
  rinkeby : '0xd60054F74c9685e5F9E474F36344494D6a1DB3cF',
  mainnet : '0xd60054F74c9685e5F9E474F36344494D6a1DB3cF',
  goerli: '0x7ffe04f3213d893bb4ebe76fbb49ca2a8f9c4610',
};

export const nftProfile: DeployedContract = {
  rinkeby : '0x7e229a305f26ce5C39AAB1d90271e1Ef03d764D5',
  mainnet : '0x98ca78e89Dd1aBE48A53dEe5799F24cC1A462F2D',
  goerli: '0x9Ef7A34dcCc32065802B1358129a226B228daB4E',
};

export const maxProfiles: DeployedContract = {
  rinkeby : '0x40023d97Ca437B966C8f669C91a9740C639E21C3', //todo: remove this placeholder
  mainnet : '0x40023d97Ca437B966C8f669C91a9740C639E21C3', //todo: remove this placeholder, update to real address
  goerli: '0x40023d97Ca437B966C8f669C91a9740C639E21C3'
};

export const profileAuction: DeployedContract = {
  rinkeby : '0x1338A9ec2Ef9906B57082dB0F67ED9E6E661F4A7',
  mainnet : '0x30f649D418AF7358f9c8CB036219fC7f1B646309',
  goerli: '0x40023d97Ca437B966C8f669C91a9740C639E21C3',
};

export const ethereumRegex: DeployedContract = {
  rinkeby: '0x44Ab7157EA5aa43b538F00FF8E23B7cb9Bcd7C0D', // todo: remove this
  goerli: '0x44Ab7157EA5aa43b538F00FF8E23B7cb9Bcd7C0D',
  mainnet: '0x44Ab7157EA5aa43b538F00FF8E23B7cb9Bcd7C0D' // todo: use mainnet address
};

export const nftResolver: DeployedContract = {
  goerli: '0x3a3539B6727E74fa1c5D4d39B433F0fAB5BC4F4a',
  mainnet: '0xA657C988e8aC39D3268D390eB7c522a535B10453',
  rinkeby: '0x3a3539B6727E74fa1c5D4d39B433F0fAB5BC4F4a', // todo: remove this
};