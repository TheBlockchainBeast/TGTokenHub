/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { TGToken, TGTokenInterface } from "../../contracts/TGToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "address",
        name: "_creator",
        type: "address",
      },
      {
        internalType: "address",
        name: "_bondingCurve",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newScore",
        type: "uint256",
      },
    ],
    name: "SocialScoreUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bondingCurve",
    outputs: [
      {
        internalType: "contract BondingCurve",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "ethAmount",
        type: "uint256",
      },
    ],
    name: "calculateTokensForEth",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "creator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "lastUpdate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "socialScore",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "telegramUsername",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newScore",
        type: "uint256",
      },
    ],
    name: "updateSocialScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620012f9380380620012f9833981016040819052620000349162000209565b8383600362000044838262000329565b50600462000053828262000329565b505050620000706200006a620000ce60201b60201c565b620000d2565b600680546001600160a01b0319166001600160a01b038416179055600762000099858262000329565b50600a80546001600160a01b0319166001600160a01b03831617905542600955620000c482620000d2565b50505050620003f5565b3390565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200014c57600080fd5b81516001600160401b038082111562000169576200016962000124565b604051601f8301601f19908116603f0116810190828211818310171562000194576200019462000124565b8160405283815260209250866020858801011115620001b257600080fd5b600091505b83821015620001d65785820183015181830184015290820190620001b7565b6000602085830101528094505050505092915050565b80516001600160a01b03811681146200020457600080fd5b919050565b600080600080608085870312156200022057600080fd5b84516001600160401b03808211156200023857600080fd5b62000246888389016200013a565b955060208701519150808211156200025d57600080fd5b506200026c878288016200013a565b9350506200027d60408601620001ec565b91506200028d60608601620001ec565b905092959194509250565b600181811c90821680620002ad57607f821691505b602082108103620002ce57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111562000324576000816000526020600020601f850160051c81016020861015620002ff5750805b601f850160051c820191505b8181101562000320578281556001016200030b565b5050505b505050565b81516001600160401b0381111562000345576200034562000124565b6200035d8162000356845462000298565b84620002d4565b602080601f8311600181146200039557600084156200037c5750858301515b600019600386901b1c1916600185901b17855562000320565b600085815260208120601f198616915b82811015620003c657888601518255948401946001909101908401620003a5565b5085821015620003e55787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b610ef480620004056000396000f3fe60806040526004361061014b5760003560e01c806395d89b41116100b6578063dbc62c641161006f578063dbc62c64146103a7578063dd62ed3e146103bd578063eb91d37e146103dd578063eff1d50e146103f2578063f2fde38b14610412578063f3bfebb11461043257600080fd5b806395d89b41146103095780639e413d051461031e578063a0712d681461033e578063a457c2d714610351578063a9059cbb14610371578063c04637111461039157600080fd5b8063313ce56711610108578063313ce56714610242578063395093511461025e57806342966c681461027e57806370a08231146102a0578063715018a6146102d65780638da5cb5b146102eb57600080fd5b806302d05d3f1461015057806306fd9bf61461018d57806306fdde03146101bb578063095ea7b3146101dd57806318160ddd1461020d57806323b872dd14610222575b600080fd5b34801561015c57600080fd5b50600654610170906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b34801561019957600080fd5b506101ad6101a8366004610d0b565b610447565b604051908152602001610184565b3480156101c757600080fd5b506101d06104c1565b6040516101849190610d24565b3480156101e957600080fd5b506101fd6101f8366004610d8f565b610553565b6040519015158152602001610184565b34801561021957600080fd5b506002546101ad565b34801561022e57600080fd5b506101fd61023d366004610db9565b61056b565b34801561024e57600080fd5b5060405160128152602001610184565b34801561026a57600080fd5b506101fd610279366004610d8f565b61058f565b34801561028a57600080fd5b5061029e610299366004610d0b565b6105b1565b005b3480156102ac57600080fd5b506101ad6102bb366004610df5565b6001600160a01b031660009081526020819052604090205490565b3480156102e257600080fd5b5061029e610618565b3480156102f757600080fd5b506005546001600160a01b0316610170565b34801561031557600080fd5b506101d061062c565b34801561032a57600080fd5b5061029e610339366004610d0b565b61063b565b61029e61034c366004610d0b565b610682565b34801561035d57600080fd5b506101fd61036c366004610d8f565b6106eb565b34801561037d57600080fd5b506101fd61038c366004610d8f565b61076b565b34801561039d57600080fd5b506101ad60095481565b3480156103b357600080fd5b506101ad60085481565b3480156103c957600080fd5b506101ad6103d8366004610e17565b610779565b3480156103e957600080fd5b506101ad6107a4565b3480156103fe57600080fd5b50600a54610170906001600160a01b031681565b34801561041e57600080fd5b5061029e61042d366004610df5565b610816565b34801561043e57600080fd5b506101d061088f565b600a54604051636c563f1f60e01b8152306004820152602481018390526000916001600160a01b031690636c563f1f90604401602060405180830381865afa158015610497573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104bb9190610e4a565b92915050565b6060600380546104d090610e63565b80601f01602080910402602001604051908101604052809291908181526020018280546104fc90610e63565b80156105495780601f1061051e57610100808354040283529160200191610549565b820191906000526020600020905b81548152906001019060200180831161052c57829003601f168201915b5050505050905090565b60003361056181858561091d565b5060019392505050565b600033610579858285610a41565b610584858585610abb565b506001949350505050565b6000336105618185856105a28383610779565b6105ac9190610e9d565b61091d565b600a54604051632770a7eb60e21b8152306004820152602481018390526001600160a01b0390911690639dc29fac90604401600060405180830381600087803b1580156105fd57600080fd5b505af1158015610611573d6000803e3d6000fd5b5050505050565b610620610c5f565b61062a6000610cb9565b565b6060600480546104d090610e63565b610643610c5f565b6008819055426009556040518181527fd56fe91ac48015bb2d30cbc48a70f63306d786545448e314348c44db5dd7e43b9060200160405180910390a150565b600a546040516340c10f1960e01b8152306004820152602481018390526001600160a01b03909116906340c10f199034906044016000604051808303818588803b1580156106cf57600080fd5b505af11580156106e3573d6000803e3d6000fd5b505050505050565b600033816106f98286610779565b90508381101561075e5760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b610584828686840361091d565b600033610561818585610abb565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b600a546040516384cc315b60e01b81523060048201526000916001600160a01b0316906384cc315b90602401602060405180830381865afa1580156107ed573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108119190610e4a565b905090565b61081e610c5f565b6001600160a01b0381166108835760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610755565b61088c81610cb9565b50565b6007805461089c90610e63565b80601f01602080910402602001604051908101604052809291908181526020018280546108c890610e63565b80156109155780601f106108ea57610100808354040283529160200191610915565b820191906000526020600020905b8154815290600101906020018083116108f857829003601f168201915b505050505081565b6001600160a01b03831661097f5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610755565b6001600160a01b0382166109e05760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610755565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6000610a4d8484610779565b90506000198114610ab55781811015610aa85760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610755565b610ab5848484840361091d565b50505050565b6001600160a01b038316610b1f5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610755565b6001600160a01b038216610b815760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610755565b6001600160a01b03831660009081526020819052604090205481811015610bf95760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610755565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610ab5565b6005546001600160a01b0316331461062a5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610755565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600060208284031215610d1d57600080fd5b5035919050565b60006020808352835180602085015260005b81811015610d5257858101830151858201604001528201610d36565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b0381168114610d8a57600080fd5b919050565b60008060408385031215610da257600080fd5b610dab83610d73565b946020939093013593505050565b600080600060608486031215610dce57600080fd5b610dd784610d73565b9250610de560208501610d73565b9150604084013590509250925092565b600060208284031215610e0757600080fd5b610e1082610d73565b9392505050565b60008060408385031215610e2a57600080fd5b610e3383610d73565b9150610e4160208401610d73565b90509250929050565b600060208284031215610e5c57600080fd5b5051919050565b600181811c90821680610e7757607f821691505b602082108103610e9757634e487b7160e01b600052602260045260246000fd5b50919050565b808201808211156104bb57634e487b7160e01b600052601160045260246000fdfea26469706673582212203e5eb825a095abce561f4bab82270f52a657ae1ff541d6ef6c38afe652aa57b164736f6c63430008180033";

type TGTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TGTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TGToken__factory extends ContractFactory {
  constructor(...args: TGTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    name: string,
    symbol: string,
    _creator: AddressLike,
    _bondingCurve: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      name,
      symbol,
      _creator,
      _bondingCurve,
      overrides || {}
    );
  }
  override deploy(
    name: string,
    symbol: string,
    _creator: AddressLike,
    _bondingCurve: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      name,
      symbol,
      _creator,
      _bondingCurve,
      overrides || {}
    ) as Promise<
      TGToken & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): TGToken__factory {
    return super.connect(runner) as TGToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TGTokenInterface {
    return new Interface(_abi) as TGTokenInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): TGToken {
    return new Contract(address, _abi, runner) as unknown as TGToken;
  }
}
