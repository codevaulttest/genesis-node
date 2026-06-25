export type GenesisAllocation = {
  index: number;
  address: `0x${string}`;
  txHash: `0x${string}`;
  blockNumber: bigint;
  logIndex: number;
  timestamp?: number;
};

export type WalletState = {
  address: `0x${string}` | null;
  chainId: number | null;
  connecting: boolean;
};

export type ClaimStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'error';
