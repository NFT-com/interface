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

export interface GenesisKeyTeamClaimInterface extends utils.Interface {
  functions: {
    "GK()": FunctionFragment;
    "addOwedTokenIds(uint256)": FunctionFragment;
    "addTokenId(uint256)": FunctionFragment;
    "genesisKeyMerkle()": FunctionFragment;
    "initialize(address)": FunctionFragment;
    "ownedTokenIds(uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "setGenesisKeyMerkle(address)": FunctionFragment;
    "setOwner(address)": FunctionFragment;
    "teamClaim(address)": FunctionFragment;
    "upgradeTo(address)": FunctionFragment;
    "upgradeToAndCall(address,bytes)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "GK", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "addOwedTokenIds",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "addTokenId",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "genesisKeyMerkle",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "initialize", values: [string]): string;
  encodeFunctionData(
    functionFragment: "ownedTokenIds",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setGenesisKeyMerkle",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "setOwner", values: [string]): string;
  encodeFunctionData(functionFragment: "teamClaim", values: [string]): string;
  encodeFunctionData(functionFragment: "upgradeTo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [string, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "GK", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addOwedTokenIds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addTokenId", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "genesisKeyMerkle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ownedTokenIds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setGenesisKeyMerkle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setOwner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "teamClaim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradeToAndCall",
    data: BytesLike
  ): Result;

  events: {
    "AdminChanged(address,address)": EventFragment;
    "BeaconUpgraded(address)": EventFragment;
    "ClaimedGenesisKey(address,uint256,uint256,bool)": EventFragment;
    "TeamGK(uint256)": EventFragment;
    "Upgraded(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "BeaconUpgraded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ClaimedGenesisKey"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TeamGK"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Upgraded"): EventFragment;
}

export type AdminChangedEvent = TypedEvent<
  [string, string],
  { previousAdmin: string; newAdmin: string }
>;

export type AdminChangedEventFilter = TypedEventFilter<AdminChangedEvent>;

export type BeaconUpgradedEvent = TypedEvent<[string], { beacon: string }>;

export type BeaconUpgradedEventFilter = TypedEventFilter<BeaconUpgradedEvent>;

export type ClaimedGenesisKeyEvent = TypedEvent<
  [string, BigNumber, BigNumber, boolean],
  {
    _user: string;
    _amount: BigNumber;
    _blockNum: BigNumber;
    _whitelist: boolean;
  }
>;

export type ClaimedGenesisKeyEventFilter =
  TypedEventFilter<ClaimedGenesisKeyEvent>;

export type TeamGKEvent = TypedEvent<[BigNumber], { tokenId: BigNumber }>;

export type TeamGKEventFilter = TypedEventFilter<TeamGKEvent>;

export type UpgradedEvent = TypedEvent<[string], { implementation: string }>;

export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;

export interface GenesisKeyTeamClaim extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: GenesisKeyTeamClaimInterface;

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
    GK(overrides?: CallOverrides): Promise<[string]>;

    addOwedTokenIds(
      newTokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addTokenId(
      newTokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    genesisKeyMerkle(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      _GK: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    ownedTokenIds(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    setGenesisKeyMerkle(
      _newMK: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setOwner(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    teamClaim(
      recipient: string,
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
  };

  GK(overrides?: CallOverrides): Promise<string>;

  addOwedTokenIds(
    newTokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addTokenId(
    newTokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  genesisKeyMerkle(overrides?: CallOverrides): Promise<string>;

  initialize(
    _GK: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  ownedTokenIds(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  setGenesisKeyMerkle(
    _newMK: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setOwner(
    _owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  teamClaim(
    recipient: string,
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

  callStatic: {
    GK(overrides?: CallOverrides): Promise<string>;

    addOwedTokenIds(
      newTokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    addTokenId(
      newTokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    genesisKeyMerkle(overrides?: CallOverrides): Promise<string>;

    initialize(_GK: string, overrides?: CallOverrides): Promise<void>;

    ownedTokenIds(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    setGenesisKeyMerkle(
      _newMK: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setOwner(_owner: string, overrides?: CallOverrides): Promise<void>;

    teamClaim(recipient: string, overrides?: CallOverrides): Promise<boolean>;

    upgradeTo(
      newImplementation: string,
      overrides?: CallOverrides
    ): Promise<void>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
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

    "BeaconUpgraded(address)"(
      beacon?: string | null
    ): BeaconUpgradedEventFilter;
    BeaconUpgraded(beacon?: string | null): BeaconUpgradedEventFilter;

    "ClaimedGenesisKey(address,uint256,uint256,bool)"(
      _user?: string | null,
      _amount?: null,
      _blockNum?: null,
      _whitelist?: null
    ): ClaimedGenesisKeyEventFilter;
    ClaimedGenesisKey(
      _user?: string | null,
      _amount?: null,
      _blockNum?: null,
      _whitelist?: null
    ): ClaimedGenesisKeyEventFilter;

    "TeamGK(uint256)"(tokenId?: null): TeamGKEventFilter;
    TeamGK(tokenId?: null): TeamGKEventFilter;

    "Upgraded(address)"(implementation?: string | null): UpgradedEventFilter;
    Upgraded(implementation?: string | null): UpgradedEventFilter;
  };

  estimateGas: {
    GK(overrides?: CallOverrides): Promise<BigNumber>;

    addOwedTokenIds(
      newTokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addTokenId(
      newTokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    genesisKeyMerkle(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _GK: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    ownedTokenIds(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    setGenesisKeyMerkle(
      _newMK: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setOwner(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    teamClaim(
      recipient: string,
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
  };

  populateTransaction: {
    GK(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addOwedTokenIds(
      newTokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addTokenId(
      newTokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    genesisKeyMerkle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      _GK: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    ownedTokenIds(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setGenesisKeyMerkle(
      _newMK: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setOwner(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    teamClaim(
      recipient: string,
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
  };
}
