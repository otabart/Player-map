import React, { useState } from "react";

// Définir des constantes pour le contrat
export const ATOM_CONTRACT_ADDRESS = import.meta.env.VITE_ATOM_CONTRACT_ADDRESS;
export const ATOM_CONTRACT_CHAIN_ID = Number(import.meta.env.VITE_ATOM_CONTRACT_CHAIN_ID); // Base Sepolia chain ID
export const VALUE_PER_ATOM = BigInt(import.meta.env.VITE_VALUE_PER_ATOM); // Valeur pour un atome, à ajuster selon votre contrat
export const VALUE_PER_TRIPLE = BigInt(import.meta.env.VITE_VALUE_PER_TRIPLE); 

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
  // Ajout des fonctions pour les triples
  {
    type: 'function',
    name: 'createTriple',
    inputs: [
      {
        name: 'subjectId',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'predicateId',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'objectId',
        type: 'uint256',
        internalType: 'uint256'
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
    type: 'function',
    name: 'batchCreateTriple',
    inputs: [
      {
        name: 'subjectIds',
        type: 'uint256[]',
        internalType: 'uint256[]'
      },
      {
        name: 'predicateIds',
        type: 'uint256[]',
        internalType: 'uint256[]'
      },
      {
        name: 'objectIds',
        type: 'uint256[]',
        internalType: 'uint256[]'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256[]',
        internalType: 'uint256[]'
      }
    ],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'isTriple',
    inputs: [
      {
        name: 'subjectId',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'predicateId',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'objectId',
        type: 'uint256',
        internalType: 'uint256'
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
    type: 'fallback',
    stateMutability: 'payable'
  },
  {
    type: 'receive',
    stateMutability: 'payable'
  }
]; 