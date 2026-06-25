export const BSC_CHAIN_ID = 56;

export const BSC_USDT_ADDRESS =
  '0x55d398326f99059fF775485246999027B3197955' as const;

export const TOTAL_NODES = 100;

export const NODE_PRICE_USDT = 10_000;

/** USDT on BSC uses 18 decimals */
export const USDT_DECIMALS = 18;

export const NODE_PRICE_WEI = BigInt(NODE_PRICE_USDT) * 10n ** BigInt(USDT_DECIMALS);

export const TREASURY_ADDRESS = (import.meta.env.VITE_TREASURY_ADDRESS ||
  '0x0000000000000000000000000000000000000000') as `0x${string}`;

export const BSC_RPC_URL =
  import.meta.env.VITE_BSC_RPC_URL || 'https://bsc-dataseed.binance.org/';

/** Demo mode when treasury is not configured or explicitly enabled */
export const DEMO_MODE =
  import.meta.env.VITE_DEMO_MODE === 'true' ||
  TREASURY_ADDRESS === '0x0000000000000000000000000000000000000000';

export const DEMO_STORAGE_KEY = 'ku-genesis-node-demo-allocations';

export const BSC_CHAIN = {
  id: BSC_CHAIN_ID,
  name: 'BNB Smart Chain',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  rpcUrls: { default: { http: [BSC_RPC_URL] } },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' },
  },
} as const;

export const ERC20_TRANSFER_ABI = [
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'function',
    name: 'transfer',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;
