/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PINATA_JWT_KEY: string;
  readonly VITE_IPFS_GATEWAY: string;
  readonly VITE_ATOM_CONTRACT_ADDRESS: string;
  readonly VITE_VALUE_PER_ATOM: string;
  readonly VITE_ATOM_CONTRACT_CHAIN_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 