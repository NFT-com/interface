/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export type AssetTypeStruct = { assetClass: BytesLike; data: BytesLike };

export type AssetTypeStructOutput = [string, string] & {
  assetClass: string;
  data: string;
};

export type AssetStruct = { assetType: AssetTypeStruct; data: BytesLike };

export type AssetStructOutput = [AssetTypeStructOutput, string] & {
  assetType: AssetTypeStructOutput;
  data: string;
};

export type OrderStruct = {
  maker: string;
  makeAssets: AssetStruct[];
  taker: string;
  takeAssets: AssetStruct[];
  salt: BigNumberish;
  start: BigNumberish;
  end: BigNumberish;
  nonce: BigNumberish;
  auctionType: BigNumberish;
};

export type OrderStructOutput = [
  string,
  AssetStructOutput[],
  string,
  AssetStructOutput[],
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  number
] & {
  maker: string;
  makeAssets: AssetStructOutput[];
  taker: string;
  takeAssets: AssetStructOutput[];
  salt: BigNumber;
  start: BigNumber;
  end: BigNumber;
  nonce: BigNumber;
  auctionType: number;
};

export interface MarketplaceInterface extends utils.Interface {
  functions: {
    "approveOrder_((address,((bytes4,bytes),bytes)[],address,((bytes4,bytes),bytes)[],uint256,uint256,uint256,uint256,uint8))": FunctionFragment;
    "buyNow((address,((bytes4,bytes),bytes)[],address,((bytes4,bytes),bytes)[],uint256,uint256,uint256,uint256,uint8),uint8,bytes32,bytes32)": FunctionFragment;
    "cancel((address,((bytes4,bytes),bytes)[],address,((bytes4,bytes),bytes)[],uint256,uint256,uint256,uint256,uint8))": FunctionFragment;
    "cancelledOrFinalized(bytes32)": FunctionFragment;
    "changeProtocolFee(uint256)": FunctionFragment;
    "executeSwap((address,((bytes4,bytes),bytes)[],address,((bytes4,bytes),bytes)[],uint256,uint256,uint256,uint256,uint8),(address,((bytes4,bytes),bytes)[],address,((bytes4,bytes),bytes)[],uint256,uint256,uint256,uint256,uint8),uint8[2],bytes32[2],bytes32[2])": FunctionFragment;
    "incrementNonce()": FunctionFragment;
    "initialize(address,address,address,address,address,address,address)": FunctionFragment;
    "marketplaceEvent()": FunctionFragment;
    "modifyWhitelist(address,bool)": FunctionFragment;
    "nftBuyContract()": FunctionFragment;
    "nftToken()": FunctionFragment;
    "nonces(address)": FunctionFragment;
    "orderApproved(bytes32)": FunctionFragment;
    "owner()": FunctionFragment;
    "protocolFee()": FunctionFragment;
    "proxies(bytes4)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "royaltyInfo(address)": FunctionFragment;
    "setRoyalty(address,address,uint256)": FunctionFragment;
    "setTransferProxy(bytes4,address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "upgradeTo(address)": FunctionFragment;
    "upgradeToAndCall(address,bytes)": FunctionFragment;
    "validateOrder_((address,((bytes4,bytes),bytes)[],address,((bytes4,bytes),bytes)[],uint256,uint256,uint256,uint256,uint8),uint8,bytes32,bytes32)": FunctionFragment;
    "validationLogic()": FunctionFragment;
    "whitelistERC20(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "approveOrder_",
    values: [OrderStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "buyNow",
    values: [OrderStruct, BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "cancel", values: [OrderStruct]): string;
  encodeFunctionData(
    functionFragment: "cancelledOrFinalized",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "changeProtocolFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "executeSwap",
    values: [
      OrderStruct,
      OrderStruct,
      [BigNumberish, BigNumberish],
      [BytesLike, BytesLike],
      [BytesLike, BytesLike]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "incrementNonce",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, string, string, string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "marketplaceEvent",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "modifyWhitelist",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "nftBuyContract",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "nftToken", values?: undefined): string;
  encodeFunctionData(functionFragment: "nonces", values: [string]): string;
  encodeFunctionData(
    functionFragment: "orderApproved",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "protocolFee",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "proxies", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "royaltyInfo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setRoyalty",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setTransferProxy",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "upgradeTo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "validateOrder_",
    values: [OrderStruct, BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "validationLogic",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "whitelistERC20",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "approveOrder_",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "buyNow", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "cancel", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "cancelledOrFinalized",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeProtocolFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeSwap",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "incrementNonce",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "marketplaceEvent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "modifyWhitelist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nftBuyContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "nftToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "nonces", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "orderApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "protocolFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "proxies", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "royaltyInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setRoyalty", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setTransferProxy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradeToAndCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validateOrder_",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validationLogic",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "whitelistERC20",
    data: BytesLike
  ): Result;

  events: {
    "AdminChanged(address,address)": EventFragment;
    "Approval(bytes32,address)": EventFragment;
    "BeaconUpgraded(address)": EventFragment;
    "Cancel(bytes32,address)": EventFragment;
    "NonceIncremented(address,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "ProtocolFeeChange(uint256)": EventFragment;
    "ProxyChange(bytes4,address)": EventFragment;
    "RoyaltyInfoChange(address,address,uint256)": EventFragment;
    "Transfer(tuple,address,address)": EventFragment;
    "Upgraded(address)": EventFragment;
    "WhitelistChange(address,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "BeaconUpgraded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Cancel"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NonceIncremented"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProtocolFeeChange"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProxyChange"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoyaltyInfoChange"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Upgraded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WhitelistChange"): EventFragment;
}

export type AdminChangedEvent = TypedEvent<
  [string, string],
  { previousAdmin: string; newAdmin: string }
>;

export type AdminChangedEventFilter = TypedEventFilter<AdminChangedEvent>;

export type ApprovalEvent = TypedEvent<
  [string, string],
  { structHash: string; maker: string }
>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export type BeaconUpgradedEvent = TypedEvent<[string], { beacon: string }>;

export type BeaconUpgradedEventFilter = TypedEventFilter<BeaconUpgradedEvent>;

export type CancelEvent = TypedEvent<
  [string, string],
  { structHash: string; maker: string }
>;

export type CancelEventFilter = TypedEventFilter<CancelEvent>;

export type NonceIncrementedEvent = TypedEvent<
  [string, BigNumber],
  { maker: string; newNonce: BigNumber }
>;

export type NonceIncrementedEventFilter =
  TypedEventFilter<NonceIncrementedEvent>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export type ProtocolFeeChangeEvent = TypedEvent<
  [BigNumber],
  { fee: BigNumber }
>;

export type ProtocolFeeChangeEventFilter =
  TypedEventFilter<ProtocolFeeChangeEvent>;

export type ProxyChangeEvent = TypedEvent<
  [string, string],
  { assetType: string; proxy: string }
>;

export type ProxyChangeEventFilter = TypedEventFilter<ProxyChangeEvent>;

export type RoyaltyInfoChangeEvent = TypedEvent<
  [string, string, BigNumber],
  { token: string; owner: string; percent: BigNumber }
>;

export type RoyaltyInfoChangeEventFilter =
  TypedEventFilter<RoyaltyInfoChangeEvent>;

export type TransferEvent = TypedEvent<
  [AssetStructOutput, string, string],
  { asset: AssetStructOutput; from: string; to: string }
>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export type UpgradedEvent = TypedEvent<[string], { implementation: string }>;

export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;

export type WhitelistChangeEvent = TypedEvent<
  [string, boolean],
  { token: string; value: boolean }
>;

export type WhitelistChangeEventFilter = TypedEventFilter<WhitelistChangeEvent>;

export interface Marketplace extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MarketplaceInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    approveOrder_(
      order: OrderStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    buyNow(
      sellOrder: OrderStruct,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    cancel(
      order: OrderStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    cancelledOrFinalized(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    changeProtocolFee(
      _fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    executeSwap(
      sellOrder: OrderStruct,
      buyOrder: OrderStruct,
      v: [BigNumberish, BigNumberish],
      r: [BytesLike, BytesLike],
      s: [BytesLike, BytesLike],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    incrementNonce(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initialize(
      _transferProxy: string,
      _erc20TransferProxy: string,
      _cryptoKittyProxy: string,
      _stakingContract: string,
      _nftToken: string,
      _validationLogic: string,
      _marketplaceEvent: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    marketplaceEvent(overrides?: CallOverrides): Promise<[string]>;

    modifyWhitelist(
      _token: string,
      _val: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    nftBuyContract(overrides?: CallOverrides): Promise<[string]>;

    nftToken(overrides?: CallOverrides): Promise<[string]>;

    nonces(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    orderApproved(
      hash: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean] & { approved: boolean }>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    protocolFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    proxies(arg0: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    royaltyInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { owner: string; percent: BigNumber }>;

    setRoyalty(
      nftContract: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTransferProxy(
      assetType: BytesLike,
      proxy: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    upgradeTo(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    validateOrder_(
      order: OrderStruct,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean, string]>;

    validationLogic(overrides?: CallOverrides): Promise<[string]>;

    whitelistERC20(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;
  };

  approveOrder_(
    order: OrderStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  buyNow(
    sellOrder: OrderStruct,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  cancel(
    order: OrderStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  cancelledOrFinalized(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  changeProtocolFee(
    _fee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  executeSwap(
    sellOrder: OrderStruct,
    buyOrder: OrderStruct,
    v: [BigNumberish, BigNumberish],
    r: [BytesLike, BytesLike],
    s: [BytesLike, BytesLike],
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  incrementNonce(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initialize(
    _transferProxy: string,
    _erc20TransferProxy: string,
    _cryptoKittyProxy: string,
    _stakingContract: string,
    _nftToken: string,
    _validationLogic: string,
    _marketplaceEvent: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  marketplaceEvent(overrides?: CallOverrides): Promise<string>;

  modifyWhitelist(
    _token: string,
    _val: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  nftBuyContract(overrides?: CallOverrides): Promise<string>;

  nftToken(overrides?: CallOverrides): Promise<string>;

  nonces(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  orderApproved(hash: BytesLike, overrides?: CallOverrides): Promise<boolean>;

  owner(overrides?: CallOverrides): Promise<string>;

  protocolFee(overrides?: CallOverrides): Promise<BigNumber>;

  proxies(arg0: BytesLike, overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  royaltyInfo(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<[string, BigNumber] & { owner: string; percent: BigNumber }>;

  setRoyalty(
    nftContract: string,
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTransferProxy(
    assetType: BytesLike,
    proxy: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  upgradeTo(
    newImplementation: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  upgradeToAndCall(
    newImplementation: string,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  validateOrder_(
    order: OrderStruct,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: CallOverrides
  ): Promise<[boolean, string]>;

  validationLogic(overrides?: CallOverrides): Promise<string>;

  whitelistERC20(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  callStatic: {
    approveOrder_(order: OrderStruct, overrides?: CallOverrides): Promise<void>;

    buyNow(
      sellOrder: OrderStruct,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    cancel(order: OrderStruct, overrides?: CallOverrides): Promise<void>;

    cancelledOrFinalized(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    changeProtocolFee(
      _fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    executeSwap(
      sellOrder: OrderStruct,
      buyOrder: OrderStruct,
      v: [BigNumberish, BigNumberish],
      r: [BytesLike, BytesLike],
      s: [BytesLike, BytesLike],
      overrides?: CallOverrides
    ): Promise<void>;

    incrementNonce(overrides?: CallOverrides): Promise<void>;

    initialize(
      _transferProxy: string,
      _erc20TransferProxy: string,
      _cryptoKittyProxy: string,
      _stakingContract: string,
      _nftToken: string,
      _validationLogic: string,
      _marketplaceEvent: string,
      overrides?: CallOverrides
    ): Promise<void>;

    marketplaceEvent(overrides?: CallOverrides): Promise<string>;

    modifyWhitelist(
      _token: string,
      _val: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    nftBuyContract(overrides?: CallOverrides): Promise<string>;

    nftToken(overrides?: CallOverrides): Promise<string>;

    nonces(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    orderApproved(hash: BytesLike, overrides?: CallOverrides): Promise<boolean>;

    owner(overrides?: CallOverrides): Promise<string>;

    protocolFee(overrides?: CallOverrides): Promise<BigNumber>;

    proxies(arg0: BytesLike, overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    royaltyInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { owner: string; percent: BigNumber }>;

    setRoyalty(
      nftContract: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setTransferProxy(
      assetType: BytesLike,
      proxy: string,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    upgradeTo(
      newImplementation: string,
      overrides?: CallOverrides
    ): Promise<void>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    validateOrder_(
      order: OrderStruct,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean, string]>;

    validationLogic(overrides?: CallOverrides): Promise<string>;

    whitelistERC20(arg0: string, overrides?: CallOverrides): Promise<boolean>;
  };

  filters: {
    "AdminChanged(address,address)"(
      previousAdmin?: null,
      newAdmin?: null
    ): AdminChangedEventFilter;
    AdminChanged(
      previousAdmin?: null,
      newAdmin?: null
    ): AdminChangedEventFilter;

    "Approval(bytes32,address)"(
      structHash?: null,
      maker?: string | null
    ): ApprovalEventFilter;
    Approval(structHash?: null, maker?: string | null): ApprovalEventFilter;

    "BeaconUpgraded(address)"(
      beacon?: string | null
    ): BeaconUpgradedEventFilter;
    BeaconUpgraded(beacon?: string | null): BeaconUpgradedEventFilter;

    "Cancel(bytes32,address)"(
      structHash?: null,
      maker?: string | null
    ): CancelEventFilter;
    Cancel(structHash?: null, maker?: string | null): CancelEventFilter;

    "NonceIncremented(address,uint256)"(
      maker?: string | null,
      newNonce?: null
    ): NonceIncrementedEventFilter;
    NonceIncremented(
      maker?: string | null,
      newNonce?: null
    ): NonceIncrementedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "ProtocolFeeChange(uint256)"(fee?: null): ProtocolFeeChangeEventFilter;
    ProtocolFeeChange(fee?: null): ProtocolFeeChangeEventFilter;

    "ProxyChange(bytes4,address)"(
      assetType?: BytesLike | null,
      proxy?: null
    ): ProxyChangeEventFilter;
    ProxyChange(
      assetType?: BytesLike | null,
      proxy?: null
    ): ProxyChangeEventFilter;

    "RoyaltyInfoChange(address,address,uint256)"(
      token?: null,
      owner?: null,
      percent?: null
    ): RoyaltyInfoChangeEventFilter;
    RoyaltyInfoChange(
      token?: null,
      owner?: null,
      percent?: null
    ): RoyaltyInfoChangeEventFilter;

    "Transfer(tuple,address,address)"(
      asset?: null,
      from?: null,
      to?: null
    ): TransferEventFilter;
    Transfer(asset?: null, from?: null, to?: null): TransferEventFilter;

    "Upgraded(address)"(implementation?: string | null): UpgradedEventFilter;
    Upgraded(implementation?: string | null): UpgradedEventFilter;

    "WhitelistChange(address,bool)"(
      token?: null,
      value?: null
    ): WhitelistChangeEventFilter;
    WhitelistChange(token?: null, value?: null): WhitelistChangeEventFilter;
  };

  estimateGas: {
    approveOrder_(
      order: OrderStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    buyNow(
      sellOrder: OrderStruct,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    cancel(
      order: OrderStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    cancelledOrFinalized(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    changeProtocolFee(
      _fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    executeSwap(
      sellOrder: OrderStruct,
      buyOrder: OrderStruct,
      v: [BigNumberish, BigNumberish],
      r: [BytesLike, BytesLike],
      s: [BytesLike, BytesLike],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    incrementNonce(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initialize(
      _transferProxy: string,
      _erc20TransferProxy: string,
      _cryptoKittyProxy: string,
      _stakingContract: string,
      _nftToken: string,
      _validationLogic: string,
      _marketplaceEvent: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    marketplaceEvent(overrides?: CallOverrides): Promise<BigNumber>;

    modifyWhitelist(
      _token: string,
      _val: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    nftBuyContract(overrides?: CallOverrides): Promise<BigNumber>;

    nftToken(overrides?: CallOverrides): Promise<BigNumber>;

    nonces(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    orderApproved(
      hash: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    protocolFee(overrides?: CallOverrides): Promise<BigNumber>;

    proxies(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    royaltyInfo(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    setRoyalty(
      nftContract: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTransferProxy(
      assetType: BytesLike,
      proxy: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    upgradeTo(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    validateOrder_(
      order: OrderStruct,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    validationLogic(overrides?: CallOverrides): Promise<BigNumber>;

    whitelistERC20(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    approveOrder_(
      order: OrderStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    buyNow(
      sellOrder: OrderStruct,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    cancel(
      order: OrderStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    cancelledOrFinalized(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    changeProtocolFee(
      _fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    executeSwap(
      sellOrder: OrderStruct,
      buyOrder: OrderStruct,
      v: [BigNumberish, BigNumberish],
      r: [BytesLike, BytesLike],
      s: [BytesLike, BytesLike],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    incrementNonce(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      _transferProxy: string,
      _erc20TransferProxy: string,
      _cryptoKittyProxy: string,
      _stakingContract: string,
      _nftToken: string,
      _validationLogic: string,
      _marketplaceEvent: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    marketplaceEvent(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    modifyWhitelist(
      _token: string,
      _val: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    nftBuyContract(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nftToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nonces(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    orderApproved(
      hash: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    protocolFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proxies(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    royaltyInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setRoyalty(
      nftContract: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTransferProxy(
      assetType: BytesLike,
      proxy: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    upgradeTo(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    validateOrder_(
      order: OrderStruct,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    validationLogic(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    whitelistERC20(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
