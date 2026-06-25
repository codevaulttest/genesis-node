/// <reference types="vite/client" />

interface Window {
  ethereum?: import('viem').EIP1193Provider;
}

interface ImportMetaEnv {
  readonly VITE_TREASURY_ADDRESS?: string;
  readonly VITE_BSC_RPC_URL?: string;
  readonly VITE_DEMO_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
