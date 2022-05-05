import MULTICALL_ABI from 'constants/multicall/abi.json';

import { chainId } from 'wagmi';

const MULTICALL_NETWORKS: {[chainId: number]: string} = {
    [chainId.mainnet]:  '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
    [chainId.ropsten]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
    [chainId.kovan]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
    [chainId.rinkeby]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
    [chainId.goerli]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
};

export { MULTICALL_ABI, MULTICALL_NETWORKS };
