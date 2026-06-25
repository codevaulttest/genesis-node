import { TOTAL_NODES } from '../config';
import type { GenesisAllocation } from '../types';

/** 演示用钱包地址（DevPanel「我已加入」场景） */
export const DEMO_USER_ADDRESS =
  '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as `0x${string}`;

export type DemoScenarioId =
  | 'live'
  | 'empty'
  | 'sold-out'
  | 'owned'
  | 'loading'
  | 'claim-modal'
  | 'claim-success'
  | 'wrong-chain';

export type DemoUiState = {
  scenario: DemoScenarioId;
  loading: boolean;
  claimModal: boolean;
  claimStatus: 'idle' | 'pending' | 'confirming' | 'success' | 'error' | null;
  mockWallet: `0x${string}` | null;
  wrongChain: boolean;
};

export const DEMO_UI_IDLE: DemoUiState = {
  scenario: 'live',
  loading: false,
  claimModal: false,
  claimStatus: null,
  mockWallet: null,
  wrongChain: false,
};

export const DEMO_OPTIONS: { id: DemoScenarioId; label: string }[] = [
  { id: 'live', label: '↺ 默认 3/100' },
  { id: 'empty', label: '○ 空态 0/100' },
  { id: 'sold-out', label: '● 已满 100/100' },
  { id: 'owned', label: '★ 我已加入 #12' },
  { id: 'loading', label: '… 加载中' },
  { id: 'claim-modal', label: '▢ 付款弹窗' },
  { id: 'claim-success', label: '✓ 付款成功' },
  { id: 'wrong-chain', label: '⚠ 未切 BNB 链' },
];

function demoAddress(index: number): `0x${string}` {
  return `0x${index.toString(16).padStart(40, '0')}` as `0x${string}`;
}

function demoTxHash(index: number): `0x${string}` {
  return `0x${(index + 0xdeadbeef).toString(16).padStart(64, '0')}` as `0x${string}`;
}

export function buildDemoAllocations(
  count: number,
  owner?: { index: number; address: `0x${string}` },
): GenesisAllocation[] {
  const n = Math.min(Math.max(0, count), TOTAL_NODES);
  return Array.from({ length: n }, (_, i) => {
    const index = i + 1;
    const isOwner = owner?.index === index;
    return {
      index,
      address: isOwner ? owner!.address : demoAddress(index),
      txHash: demoTxHash(index),
      blockNumber: BigInt(index),
      logIndex: 0,
    };
  });
}
