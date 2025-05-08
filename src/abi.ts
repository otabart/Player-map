export const ATOM_CONTRACT_ADDRESS = import.meta.env.VITE_ATOM_CONTRACT_ADDRESS;
export const VALUE_PER_ATOM = BigInt(import.meta.env.VITE_VALUE_PER_ATOM);
export const ATOM_CONTRACT_CHAIN_ID = Number(import.meta.env.VITE_ATOM_CONTRACT_CHAIN_ID);

export const atomABI = [
  {
    type: 'function',
    name: 'getAtomByOwner',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'atomsByHash',
    inputs: [
      {
        name: 'atomHash',
        type: 'bytes32',
        internalType: 'bytes32'
      }
    ],
    outputs: [
      {
        name: 'atomId',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'createAtom',
    inputs: [
      {
        name: 'atomUri',
        type: 'bytes',
        internalType: 'bytes'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'payable'
  },
  {
    type: 'fallback',
    stateMutability: 'payable'
  },
  {
    type: 'receive',
    stateMutability: 'payable'
  }
]; 