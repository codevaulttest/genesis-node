import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseAbiItem,
  type PublicClient,
} from 'viem';
import { bsc } from 'viem/chains';
import {
  BSC_RPC_URL,
  BSC_USDT_ADDRESS,
  DEMO_MODE,
  DEMO_STORAGE_KEY,
  ERC20_TRANSFER_ABI,
  NODE_PRICE_WEI,
  TOTAL_NODES,
  TREASURY_ADDRESS,
} from '../config';
import type { GenesisAllocation } from '../types';

let publicClient: PublicClient | null = null;

export function getPublicClient(): PublicClient {
  if (!publicClient) {
    publicClient = createPublicClient({
      chain: bsc,
      transport: http(BSC_RPC_URL),
    });
  }
  return publicClient;
}

export function getWalletClient() {
  if (!window.ethereum) throw new Error('请先安装加密钱包（如 MetaMask）');
  return createWalletClient({
    chain: bsc,
    transport: custom(window.ethereum),
  });
}

export async function switchToBsc(): Promise<void> {
  if (!window.ethereum) throw new Error('未检测到钱包，请先安装加密钱包');
  const chainIdHex = `0x${bsc.id.toString(16)}`;
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (err: unknown) {
    const code = (err as { code?: number })?.code;
    if (code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: chainIdHex,
            chainName: 'BNB Smart Chain',
            nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
            rpcUrls: [BSC_RPC_URL],
            blockExplorerUrls: ['https://bscscan.com'],
          },
        ],
      });
      return;
    }
    throw err;
  }
}

function loadDemoAllocations(): GenesisAllocation[] | null {
  const raw = localStorage.getItem(DEMO_STORAGE_KEY);
  if (raw === null) return null;
  try {
    return JSON.parse(raw, (_k, v) =>
      typeof v === 'string' && /^\d+n$/.test(v) ? BigInt(v.slice(0, -1)) : v,
    ) as GenesisAllocation[];
  } catch {
    return null;
  }
}

function saveDemoAllocations(allocations: GenesisAllocation[]): void {
  localStorage.setItem(
    DEMO_STORAGE_KEY,
    JSON.stringify(allocations, (_k, v) => (typeof v === 'bigint' ? `${v}n` : v)),
  );
}

export function setDemoAllocations(allocations: GenesisAllocation[]): void {
  saveDemoAllocations(allocations);
}

export function resetDemoToSeed(): void {
  saveDemoAllocations(SEED_DEMO);
}

const SEED_DEMO: GenesisAllocation[] = [
  {
    index: 1,
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    txHash: '0x0000000000000000000000000000000000000000000000000000000000000001',
    blockNumber: 1n,
    logIndex: 0,
  },
  {
    index: 2,
    address: '0x8ba1f109551bD432803012645Ac136c22C929E',
    txHash: '0x0000000000000000000000000000000000000000000000000000000000000002',
    blockNumber: 2n,
    logIndex: 0,
  },
  {
    index: 3,
    address: '0x1234567890123456789012345678901234567890',
    txHash: '0x0000000000000000000000000000000000000000000000000000000000000003',
    blockNumber: 3n,
    logIndex: 0,
  },
];

function getDemoAllocations(): GenesisAllocation[] {
  const stored = loadDemoAllocations();
  if (stored === null) {
    saveDemoAllocations(SEED_DEMO);
    return SEED_DEMO;
  }
  return stored.slice(0, TOTAL_NODES);
}

export async function fetchAllocationsFromChain(): Promise<GenesisAllocation[]> {
  if (DEMO_MODE) return getDemoAllocations();

  const client = getPublicClient();
  const currentBlock = await client.getBlockNumber();
  const fromBlock = currentBlock > 5_000_000n ? currentBlock - 5_000_000n : 0n;

  const logs = await client.getLogs({
    address: BSC_USDT_ADDRESS,
    event: parseAbiItem(
      'event Transfer(address indexed from, address indexed to, uint256 value)',
    ),
    args: { to: TREASURY_ADDRESS },
    fromBlock,
    toBlock: 'latest',
  });

  const sorted = [...logs].sort((a, b) => {
    if (a.blockNumber !== b.blockNumber) {
      return a.blockNumber < b.blockNumber ? -1 : 1;
    }
    return (a.logIndex ?? 0) - (b.logIndex ?? 0);
  });

  const seen = new Set<string>();
  const allocations: GenesisAllocation[] = [];

  for (const log of sorted) {
    const from = log.args.from?.toLowerCase();
    const value = log.args.value;
    if (!from || value === undefined || value < NODE_PRICE_WEI) continue;
    if (seen.has(from)) continue;

    seen.add(from);
    allocations.push({
      index: allocations.length + 1,
      address: log.args.from!,
      txHash: log.transactionHash!,
      blockNumber: log.blockNumber,
      logIndex: log.logIndex ?? 0,
    });

    if (allocations.length >= TOTAL_NODES) break;
  }

  return allocations;
}

export async function sendUsdtPayment(
  from: `0x${string}`,
): Promise<`0x${string}`> {
  const walletClient = getWalletClient();
  const [account] = await walletClient.getAddresses();
  if (account.toLowerCase() !== from.toLowerCase()) {
    throw new Error('当前钱包与付款钱包不一致，请重试');
  }

  const hash = await walletClient.writeContract({
    address: BSC_USDT_ADDRESS,
    abi: ERC20_TRANSFER_ABI,
    functionName: 'transfer',
    args: [TREASURY_ADDRESS, NODE_PRICE_WEI],
    account,
    chain: bsc,
  });

  const client = getPublicClient();
  await client.waitForTransactionReceipt({ hash });
  return hash;
}

export function addDemoAllocation(address: `0x${string}`): GenesisAllocation | null {
  const allocations = getDemoAllocations();
  if (allocations.length >= TOTAL_NODES) return null;
  if (allocations.some((a) => a.address.toLowerCase() === address.toLowerCase())) {
    return allocations.find((a) => a.address.toLowerCase() === address.toLowerCase()) ?? null;
  }

  const next: GenesisAllocation = {
    index: allocations.length + 1,
    address,
    txHash: `0xdemo${Date.now().toString(16).padStart(56, '0')}` as `0x${string}`,
    blockNumber: BigInt(allocations.length + 1),
    logIndex: 0,
  };
  saveDemoAllocations([...allocations, next]);
  return next;
}

export async function getUsdtBalance(address: `0x${string}`): Promise<bigint> {
  if (DEMO_MODE) return NODE_PRICE_WEI * 2n;
  const client = getPublicClient();
  return client.readContract({
    address: BSC_USDT_ADDRESS,
    abi: ERC20_TRANSFER_ABI,
    functionName: 'balanceOf',
    args: [address],
  });
}
