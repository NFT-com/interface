import { X2Y2OrderItem } from '@x2y2-io/sdk/dist/types';
import { BigNumberish } from 'ethers';

export const X2Y2_ORDER_TYPE = {
  X2Y2Order: [
    { name: 'salt', type: 'uint256' },
    { name: 'user', type: 'address' },
    { name: 'network', type: 'uint256' },
    { name: 'intent', type: 'uint256' },
    { name: 'delegateType', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
    { name: 'currency', type: 'address' },
    { name: 'dataMask', type: 'bytes' },
    { name: 'itemCount', type: 'uint256' },
    { name: 'items', type: 'X2Y2OrderItem[]' },
  ],
  X2Y2OrderItem: [
    { name: 'price', type: 'uint256' },
    { name: 'data', type: 'bytes' }
  ]
};

export type X2Y2_ORDER_COMPONENTS = {
  salt: BigNumberish;
  user: string;
  network: BigNumberish;
  intent: BigNumberish;
  delegateType: BigNumberish;
  deadline: BigNumberish;
  currency: string;
  dataMask: string;
  items: X2Y2OrderItem[];
};